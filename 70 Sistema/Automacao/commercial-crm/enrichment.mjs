#!/usr/bin/env node
/**
 * JARVIS Commercial CRM — Frente 2: Enriquecimento contínuo
 * Consolida decisores/contatos dos dados do CRM Yalt, detecta lacunas
 * (sem email / linkedin / decisor) e tenta enrich:
 *   - via CRM (Lusha/Kaspr) quando YALT_ENRICH=1;
 *   - via web (Firecrawl) quando YALT_ENRICH_FIRECRAWL=1, para lacunas de decisor/linkedin.
 * Sem desperdício: só chama enrich em contatos/leads com lacuna real.
 *
 * Princípios:
 * - Sem credenciais hardcoded (env YALT_API_KEY / FIRECRAWL_API_KEY).
 * - Enrich externo pode custar/estar inativo → tratado, nunca quebra o pipeline.
 * - Apenas LÊ e ESCREVE no CRM (lead_contacts já existentes); não envia externo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getAllMyLeads,
  getLeadContacts,
  enrichContact,
} from "./lib/yalt.mjs";
import { enrichWebDecisor } from "./lib/firecrawl.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadConfig() {
  const cfgPath = path.join(__dirname, "config.json");
  const defaults = {
    apiKey: process.env.YALT_API_KEY || "",
    firecrawlKey: process.env.FIRECRAWL_API_KEY || "",
    scope: "mine",
    limit: 200,
    tryEnrich: process.env.YALT_ENRICH === "1", // opcional, custa e pode estar inativo
    tryEnrichWeb: process.env.YALT_ENRICH_FIRECRAWL === "1", // web (Firecrawl) p/ lacunas
    webEnrichLimit: Number(process.env.YALT_ENRICH_FIRECRAWL_LIMIT || "20"), // teto de web-enrichs por run
    outputDir: path.resolve(__dirname, "..", "..", "..", "output", "comercial"),
    logDir: path.join(__dirname, "logs"),
  };
  if (!fs.existsSync(cfgPath)) return defaults;
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  return {
    apiKey: raw.apiKey || process.env.YALT_API_KEY || defaults.apiKey,
    firecrawlKey: raw.firecrawlKey || process.env.FIRECRAWL_API_KEY || defaults.firecrawlKey,
    scope: raw.scope || defaults.scope,
    limit: raw.limit || defaults.limit,
    tryEnrich: raw.tryEnrich === true || defaults.tryEnrich,
    tryEnrichWeb: raw.tryEnrichWeb === true || defaults.tryEnrichWeb,
    webEnrichLimit: raw.webEnrichLimit || defaults.webEnrichLimit,
    outputDir: raw.outputDir || defaults.outputDir,
    logDir: raw.logDir || defaults.logDir,
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function appendRunLog(logDir, entry) {
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(path.join(logDir, `${todayISO()}.log`), `${JSON.stringify(entry)}\n`, "utf8");
}

function hasEmail(c) {
  return !!(c.email && String(c.email).includes("@"));
}
function hasLinkedin(c) {
  return !!(c.linkedin && String(c.linkedin).includes("linkedin"));
}
function isDecisionRole(c) {
  const p = String(c.position || "").toLowerCase();
  return /(manager|director|head|ceo|cfo|coo|owner|founder|gerente|diretor|responsável|marketing)/i.test(p);
}
function withEmailContact(contacts) {
  return contacts.some((c) => hasEmail(c));
}
function withLinkedinContact(contacts) {
  return contacts.some((c) => hasLinkedin(c));
}
function firstEmail(contacts) {
  return contacts.find((c) => hasEmail(c))?.email || null;
}
function firstLinkedin(contacts) {
  return contacts.find((c) => hasLinkedin(c))?.linkedin || null;
}

async function main() {
  const config = loadConfig();
  const today = todayISO();
  fs.mkdirSync(config.outputDir, { recursive: true });

  const { leads, total } = await getAllMyLeads(config.apiKey, {
    scope: config.scope,
    pageSize: config.limit,
  });
  console.log(`Leads (${config.scope}): ${total}; processando ${leads.length}`);

  const rows = [];
  let withContacts = 0;
  let withDecision = 0;
  let withEmail = 0;
  let withLinkedin = 0;
  let gaps = 0;
  let enrichAttempts = 0;
  let enrichOk = 0;
  let webEnrichedCount = 0;
  let webBudget = config.webEnrichLimit;

  for (const lead of leads) {
    const contacts = await getLeadContacts(config.apiKey, lead.id);
    if (contacts.length) withContacts++;
    let bestDecision = null;
    for (const c of contacts) {
      if (hasEmail(c)) withEmail++;
      if (hasLinkedin(c)) withLinkedin++;
      if (isDecisionRole(c)) {
        withDecision++;
        if (!bestDecision) bestDecision = c;
      }
      // Lacuna: contacto sem email E sem linkedin -> tenta enrich (se ativado)
      if (config.tryEnrich && !hasEmail(c) && !hasLinkedin(c)) {
        enrichAttempts++;
        const r = await enrichContact(config.apiKey, c.id, "lusha");
        if (r.ok) enrichOk++;
      }
    }

    // Decisor também pode vir do salesData do próprio lead
    const sd = lead.salesData || {};
    const sdDecision = sd.decisionMaker ? { name: sd.decisionMaker, title: sd.decisionMakerTitle } : null;

    const leadHasEmail = contacts.length ? withEmailContact(contacts) : false;
    const leadHasLinkedin = contacts.length ? withLinkedinContact(contacts) : false;
    const hasAnyDecision = !!(bestDecision || sdDecision);
    const hasAnyEmail = leadHasEmail || hasEmail(lead);
    const hasAnyLinkedin = leadHasLinkedin || !!firstLinkedin(contacts);

    // Lacuna de decisor (nem contacto decisor, nem salesData decisor)
    const gapDecision = !hasAnyDecision;
    // Lacuna de contacto (sem contactos E sem email próprio do lead)
    const gapContacts = contacts.length === 0 && !hasEmail(lead);
    const gap = gapContacts || gapDecision || (!hasAnyEmail && !hasAnyLinkedin);
    if (gap) gaps++;

    // Web-enrich (Firecrawl) para lacunas de decisor/linkedin, dentro do orçamento.
    // Só preenche o que FALTA — não sobrescreve dados já existentes.
    let webDecision = null;
    let webLinkedin = null;
    const needDecision = !hasAnyDecision;
    const needLinkedin = !hasAnyLinkedin;
    if (config.tryEnrichWeb && config.firecrawlKey && webBudget > 0 && (needDecision || needLinkedin)) {
      try {
        const w = await enrichWebDecisor(config.firecrawlKey, lead);
        if (w.ok) {
          if (needDecision && w.decisionName) {
            webDecision = { name: w.decisionName, title: w.decisionTitle };
            withDecision++;
          }
          if (needLinkedin && w.linkedin) {
            webLinkedin = w.linkedin;
            withLinkedin++;
          }
          if (webDecision || webLinkedin) {
            webEnrichedCount++;
            webBudget--;
          }
        } else {
          console.warn(`Firecrawl falhou p/ ${lead.businessName}: ${w.error}`);
        }
      } catch (err) {
        console.warn(`Firecrawl erro p/ ${lead.businessName}: ${err.message}`);
      }
    }

    rows.push({
      id: lead.id,
      businessName: lead.businessName,
      status: lead.status ?? "new",
      priority: lead.priority,
      city: lead.city,
      locations: lead._locationCount,
      contacts: contacts.length,
      hasDecision: hasAnyDecision || !!webDecision,
      hasEmail: hasAnyEmail,
      hasLinkedin: hasAnyLinkedin || !!webLinkedin,
      decisionName: bestDecision
        ? `${bestDecision.first_name} ${bestDecision.last_name}`.trim()
        : (sdDecision?.name || webDecision?.name || null),
      decisionTitle: bestDecision?.position || sdDecision?.title || webDecision?.title || null,
      email: firstEmail(contacts) || (hasEmail(lead) ? lead.email : null),
      linkedin: firstLinkedin(contacts) || webLinkedin || null,
    });
  }

  const report = {
    data: today,
    totalLeads: total,
    processados: leads.length,
    comContactos: withContacts,
    comDecisor: withDecision,
    comEmail: withEmail,
    comLinkedin: withLinkedin,
    lacunas: gaps,
    enrichAttempts,
    enrichOk,
    webEnrichAtivo: config.tryEnrichWeb,
    webEnrichEncontrados: webEnrichedCount,
    enriquecimentoAtivo: config.tryEnrich,
    detalhe: rows,
  };

  const outPath = path.join(config.outputDir, `enriquecimento_${today}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Enriquecimento salvo: ${outPath}`);
  console.log(
    `Resumo: ${withContacts} com contactos | ${withDecision} com decisor | ${withEmail} c/email | ${withLinkedin} c/linkedin | ${gaps} lacunas | ${webEnrichedCount} web-enriched`,
  );
  appendRunLog(config.logDir, {
    ts: new Date().toISOString(),
    status: "ok",
    total,
    gaps,
    enrichAttempts,
    enrichOk,
    webEnrichedCount,
  });
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
