#!/usr/bin/env node
/**
 * JARVIS Commercial CRM — Frente 3: Cold Email qualificado (pré-call)
 * Gera rascunho 1:1 personalizado via Gemma 4, a partir do lead + decisor + enriquecimento.
 * ANTES do cold call, o cliente já recebeu um email nosso.
 *
 * SEGURANÇA (cláusula BOBBY/E9):
 * - Por padrão SÓ gera rascunho local (output/comercial/cold_emails_*.md / .json).
 * - Envio real DESLIGADO. Ativar só com YALT_SEND_REAL=1 E após Gmail/ESP configurado.
 * - Sem tracking/can-spam automático ainda — Operador valida antes de escala.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkOllama, generateWithOllama } from "../morning-brief/lib/ollama.mjs";
import { getAllMyLeads, getLeadContacts, createEmailDraft } from "./lib/yalt.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL = process.env.JARVIS_BRAIN_MODEL || "gemma4";
const HOST = process.env.OLLAMA_HOST || "localhost";
const PORT = Number(process.env.OLLAMA_PORT || "11434");

function loadConfig() {
  const cfgPath = path.join(__dirname, "config.json");
  const argLimit = (() => {
    const i = process.argv.indexOf("--limit");
    return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : null;
  })();
  const defaults = {
    apiKey: process.env.YALT_API_KEY || "",
    scope: "mine",
    limit: argLimit ?? 50, // cold email é 1:1 de alto valor — começa com poucos
    sendReal: process.env.YALT_SEND_REAL === "1",
    outputDir: path.resolve(__dirname, "..", "..", "..", "output", "comercial"),
  };
  if (!fs.existsSync(cfgPath)) return defaults;
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  return {
    apiKey: raw.apiKey || defaults.apiKey,
    scope: raw.scope || defaults.scope,
    limit: raw.limit || defaults.limit,
    sendReal: raw.sendReal === true || defaults.sendReal,
    outputDir: raw.outputDir || defaults.outputDir,
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function emailOf(lead, contacts) {
  if (lead.email && String(lead.email).includes("@")) return lead.email;
  return contacts.find((c) => c.email && String(c.email).includes("@"))?.email || null;
}
function decisionOf(lead, contacts) {
  const sd = lead.salesData || {};
  if (sd.decisionMaker) return { name: sd.decisionMaker, title: sd.decisionMakerTitle };
  const c = contacts.find((x) => /(manager|director|head|ceo|owner|founder|gerente|diretor)/i.test(x.position || ""));
  if (c) return { name: `${c.first_name} ${c.last_name}`.trim(), title: c.position };
  return null;
}

async function genDraft(lead, decision, contactEmail) {
  const prompt =
    `Escreva um email de cold outreach 1:1, em PT-BR, curto (máx 120 palavras), tom executivo e humano (nada de robótico).` +
    ` Destinatário: ${decision?.name || lead.contactPerson || "Equipa"}${decision?.title ? " (" + decision.title + ")" : ""}.` +
    ` Empresa: ${lead.businessName}${lead.city ? " (" + lead.city + ")" : ""}.` +
    ` Contexto: somos a Yalt (portal comercial B2B que liga fornecedores e compradores). Objetivo: abrir porta para uma chamada de 15 min esta semana.` +
    ` Regras obrigatórias: SEM placeholders {{}} ou colchetes []; NUNCA "Olá [Nome]"; se não souber um dado, omita-o;` +
    ` mencione 1 facto real da empresa se houver (localização/setor); CTA claro de agendamento;` +
    ` assinatura "Talles"; uma linha curta de opt-out no fim (ex.: "Se não é o momento, basta ignorar"). Sem HTML, só texto.`;
  const { response: text } = await generateWithOllama(prompt, { model: MODEL, host: HOST, port: PORT, stream: false });
  return String(text || "").trim();
}

async function main() {
  const config = loadConfig();
  const today = todayISO();
  fs.mkdirSync(config.outputDir, { recursive: true });

  if (config.sendReal) {
    console.warn("⚠️  YALT_SEND_REAL=1 — envio real ATIVO. Confirme Gmail/ESP antes de produção.");
  } else {
    console.log("Modo rascunho (seguro): nenhum email será enviado.");
  }

  const { leads } = await getAllMyLeads(config.apiKey, { scope: config.scope, pageSize: 200 });
  const brain = await checkOllama({ host: HOST, port: PORT });

  const drafts = [];
  for (const lead of leads) {
    if (drafts.length >= config.limit) break; // early stop: só geramos o lote pedido
    // Atalho: se o lead já tem email próprio, não precisamos da API de contactos.
    let contacts = [];
    let email = lead.email && String(lead.email).includes("@") ? lead.email : null;
    if (!email) {
      contacts = await getLeadContacts(config.apiKey, lead.id);
      email = emailOf(lead, contacts);
    }
    if (!email) continue; // só gera se houver destinatário real
    const decision = decisionOf(lead, contacts);
    let body = "";
    if (brain.ok) {
      try {
        body = await genDraft(lead, decision, email);
      } catch {
        body = "";
      }
    }
    drafts.push({
      leadId: lead.id,
      businessName: lead.businessName,
      to: email,
      decision: decision?.name || null,
      decisionTitle: decision?.title || null,
      subject: `Parceria Yalt · ${lead.businessName}`,
      body,
      sendReal: config.sendReal,
    });
    // Envio real (opcional, atrás de YALT_SEND_REAL=1): agenda no CRM com
    // scheduledAt no futuro (fila, não disparo imediato). Requer Gmail/ESP ligado.
    if (config.sendReal) {
      const when = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // +1h
      const r = await createEmailDraft(config.apiKey, {
        leadId: lead.id,
        to: email,
        subject: `Parceria Yalt · ${lead.businessName}`,
        bodyHtml: body.replace(/\n/g, "<br>"),
        scheduledAt: when,
        trackingEnabled: true,
      });
      console.log(`  → enviado(agendado) ${email}: HTTP ${r.statusCode}`);
    }
  }

  const md = drafts
    .map((d, i) => `### ${i + 1}. ${d.businessName}\n**Para:** ${d.to}\n**Decisor:** ${d.decision || "—"} (${d.decisionTitle || "—"})\n**Assunto:** ${d.subject}\n\n${d.body || "(sem corpo — Gemma indisponível)"}\n`)
    .join("\n---\n\n");
  const mdPath = path.join(config.outputDir, `cold_emails_${today}.md`);
  const jsonPath = path.join(config.outputDir, `cold_emails_${today}.json`);
  fs.writeFileSync(mdPath, `# Cold Emails (rascunho) — ${today}\n\n${md}`, "utf8");
  fs.writeFileSync(jsonPath, JSON.stringify(drafts, null, 2), "utf8");
  console.log(`Rascunhos: ${drafts.length} | MD: ${mdPath} | JSON: ${jsonPath}`);
  console.log(config.sendReal ? "Envio real AGENDADO via CRM (scheduledAt +1h). Confirme Gmail/ESP no CRM." : "Nenhum envio real efetuado (modo rascunho).");
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
