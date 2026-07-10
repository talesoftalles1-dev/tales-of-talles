#!/usr/bin/env node
/**
 * JARVIS Commercial CRM — Frente 2: Enriquecimento contínuo
 * Consolida decisores/contatos dos dados do CRM Yalt, detecta lacunas
 * (sem email / linkedin / decisor) e tenta enrich via Lusha/Kaspr quando o
 * provedor estiver ativo. Sem desperdício: só chama enrich em contatos com lacuna.
 *
 * Princípios:
 * - Sem credenciais hardcoded (env YALT_API_KEY).
 * - Enrich externo (Lusha/Kaspr) pode custar/estar inativo → tratado, nunca quebra o pipeline.
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
    apiKey: process.env.YALT_API_KEY || defaults.apiKey,
    scope: raw.scope || defaults.scope,
    limit: raw.limit || defaults.limit,
    tryEnrich: raw.tryEnrich === true || defaults.tryEnrich,
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

  for (const lead of leads) {
    const contacts = await getLeadContacts(config.apiKey, lead.id);
    // bandeiras por-lead (não cumulativas de contactos)
    const leadHasContacts = contacts.length > 0;
    const leadHasEmail = leadHasContacts ? withEmailContact(contacts) : false;
    const leadHasLinkedin = leadHasContacts ? withLinkedinContact(contacts) : false;
    let bestDecision = null;
    for (const c of contacts) {
      if (isDecisionRole(c)) {
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
    const hasDecision = !!(bestDecision || sdDecision);

    // Web-enrich (Firecrawl) p/ lacunas: só se não tem decisor E não tem linkedin, e a flag está on.
    let webDecision = null, webLinkedin = null, webEnriched = false;
    if (config.tryEnrichWeb && !hasDecision && !leadHasLinkedin && process.env.FIRECRAWL_API_KEY && webEnrichedCount < config.webEnrichLimit) {
      try {
        const w = await enrichWebDecisor(process.env.FIRECRAWL_API_KEY, lead);
        if (w.ok) {
          webDecision = w.decisionName ? { name: w.decisionName, title: w.decisionTitle } : null;
          webLinkedin = w.linkedin || null;
          webEnriched = !!(webDecision || webLinkedin);
        }
      } catch { /* web falhou — ignora, pipeline não quebra */ }
    }

    // contadores por-lead
    if (leadHasContacts) withContacts++;
    if (hasDecision || webDecision) withDecision++;
    if (leadHasEmail || hasEmail(lead)) withEmail++;
    if (leadHasLinkedin) withLinkedin++;

    // lacuna: sem contactos, OU sem decisor conhecido, OU sem nenhum email
    const gap = !leadHasContacts || !(hasDecision || webDecision) || (!leadHasEmail && !hasEmail(lead));
    if (gap) gaps++;

    rows.push({
      id: lead.id,
      businessName: lead.businessName,
      status: lead.status ?? "new",
      priority: lead.priority,
      city: lead.city,
      locations: lead._locationCount,
      contacts: contacts.length,
      hasDecision: hasDecision || !!webDecision,
      hasEmail: leadHasEmail || hasEmail(lead),
      hasLinkedin: leadHasLinkedin || !!webLinkedin,
      decisionName: bestDecision ? `${bestDecision.first_name} ${bestDecision.last_name}`.trim() : (sdDecision?.name || webDecision?.name || null),
      decisionTitle: bestDecision?.position || sdDecision?.title || webDecision?.title || null,
      email: firstEmail(contacts) || (hasEmail(lead) ? lead.email : null),
      linkedin: firstLinkedin(contacts) || webLinkedin || null,
    });
    if (webEnriched) webEnrichedCount++;
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
    `Resumo: ${withContacts} com contactos | ${withDecision} com decisor | ${withEmail} c/email | ${withLinkedin} c/linkedin | ${gaps} lacunas`,
  );
  appendRunLog(config.logDir, {
    ts: new Date().toISOString(),
    status: "ok",
    total,
    gaps,
    enrichAttempts,
    enrichOk,
  });
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

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
