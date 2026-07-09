#!/usr/bin/env node
/**
 * Enriquecimento de contatos do Yalt CRM via Lusha (endpoint nativo do CRM).
 *
 * O que faz:
 *   1. Varre leads acionáveis e seus lead_contacts;
 *   2. Contatos sem e-mail/telefone → POST /v1/api/lead_contacts/{id}/enrich-lusha
 *      (a integração Lusha vive NO CRM — nenhuma chave Lusha passa por aqui);
 *   3. Leads sem NENHUM contato cadastrado → listados para pesquisa manual/RESEARCH
 *      (identificar decisor é trabalho de pesquisa, não de API);
 *   4. Relatório em output/enriquecimento_YYYY-MM-DD.md — tudo que a Lusha
 *      devolver é SUGESTÃO pendente de validação do Operador.
 *
 * Créditos Lusha custam dinheiro: --max limita chamadas por execução (default 5).
 * Sem scraping de LinkedIn — deliberado (viola ToS; ver Spec do Briefing).
 *
 * Uso: node enrich.mjs [--dry-run] [--max 5] [--lead <uuid>]
 * Requer: YALT_API_KEY no ambiente.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { todayISO } from "../morning-brief/lib/priority.mjs";
import { crmConfigFromEnv, crmGet, crmPost, listLeads } from "../briefing-comercial/lib/crm.mjs";
import { isBlockedLead } from "../briefing-comercial/lib/score.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const maxIdx = argv.indexOf("--max");
  const leadIdx = argv.indexOf("--lead");
  return {
    dryRun: argv.includes("--dry-run"),
    max: maxIdx >= 0 ? Number(argv[maxIdx + 1]) || 5 : 5,
    lead: leadIdx >= 0 ? argv[leadIdx + 1] : null,
  };
}

function vaultRoot() {
  return process.env.JARVIS_VAULT_ROOT || path.resolve(__dirname, "..", "..", "..");
}

async function listContacts(crm) {
  const res = await crmGet(crm, "/v1/api/lead_contacts?limit=5000");
  const items = Array.isArray(res) ? res : res?.data || [];
  const porLead = new Map();
  for (const c of items) {
    const leadId = c.leadId || c.lead_id;
    if (!leadId) continue;
    if (!porLead.has(leadId)) porLead.set(leadId, []);
    porLead.get(leadId).push(c);
  }
  return porLead;
}

const incompleto = (c) => !c.email || !c.phone;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const hoje = todayISO();
  const crm = crmConfigFromEnv();

  let leads;
  try {
    leads = await listLeads(crm);
  } catch (err) {
    console.error(`CRM inacessível: ${err.message}`);
    process.exitCode = 1;
    return;
  }
  if (args.lead) leads = leads.filter((l) => l.id === args.lead);
  const ativos = leads.filter((l) => !isBlockedLead(l, hoje));

  const contatosPorLead = await listContacts(crm);

  // Candidatos a enriquecer: contatos existentes porém incompletos.
  const candidatos = [];
  const semContato = [];
  for (const lead of ativos) {
    const contatos = contatosPorLead.get(lead.id) || [];
    if (!contatos.length) {
      if (!lead.email && !lead.contactPerson) semContato.push(lead);
      continue;
    }
    for (const c of contatos.filter(incompleto)) candidatos.push({ lead, contato: c });
  }

  const fila = candidatos.slice(0, args.max);
  console.log(
    `Leads ativos: ${ativos.length} · contatos incompletos: ${candidatos.length} · nesta execução: ${fila.length} (--max ${args.max}) · leads sem contato: ${semContato.length}`,
  );

  const resultados = [];
  for (const { lead, contato } of fila) {
    const rotulo = `${lead.businessName} / ${contato.name || contato.id}`;
    if (args.dryRun) {
      console.log(`[dry-run] enriqueceria: ${rotulo}`);
      resultados.push({ lead, contato, status: "dry-run", dados: null });
      continue;
    }
    try {
      const dados = await crmPost(crm, `/v1/api/lead_contacts/${contato.id}/enrich-lusha`, {});
      resultados.push({ lead, contato, status: "ok", dados });
      console.log(`Enriquecido: ${rotulo}`);
    } catch (err) {
      resultados.push({ lead, contato, status: "falha", dados: String(err.message) });
      console.error(`Falha: ${rotulo} → ${err.message}`);
    }
  }

  // --- Relatório (camada output/, regenerável) ---
  const l = [];
  l.push("---");
  l.push("dominio: yalt");
  l.push("tipo: output");
  l.push("status: gerado");
  l.push(`titulo: Enriquecimento CRM — ${hoje}`);
  l.push(`criado: ${hoje}`);
  l.push(`atualizado: ${hoje}`);
  l.push("tags:");
  l.push("  - tema/vendas");
  l.push("---");
  l.push("");
  l.push(`# 🔎 Enriquecimento CRM — ${hoje}`);
  l.push("");
  l.push(
    "> Gerado por `70 Sistema/Automacao/enriquecimento-crm/enrich.mjs`. Dados retornados pela Lusha são **sugestões pendentes de validação** — o Operador confere no CRM antes de usar em outreach.",
  );
  l.push("");
  l.push("## Contatos enriquecidos nesta execução");
  l.push("");
  if (!resultados.length) l.push("- Nenhum contato incompleto encontrado — CRM saudável.");
  for (const r of resultados) {
    l.push(
      `- **${r.lead.businessName}** · ${r.contato.name || r.contato.id} → ${r.status}${r.status === "falha" ? ` (${r.dados})` : ""}`,
    );
  }
  l.push("");
  l.push("## Leads ativos sem nenhum contato (precisam de pesquisa)");
  l.push("");
  if (!semContato.length) l.push("- Nenhum.");
  for (const lead of semContato.slice(0, 30)) {
    l.push(`- **${lead.businessName}**${lead.city ? ` (${lead.city})` : ""} — identificar decisor de marketing (RESEARCH / manual; sem scraping de LinkedIn)`);
  }
  if (semContato.length > 30) l.push(`- … e mais ${semContato.length - 30} (ver CRM)`);
  l.push("");

  if (!args.dryRun) {
    const outPath = path.join(vaultRoot(), "output", `enriquecimento_${hoje}.md`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, l.join("\n") + "\n", "utf8");
    console.log(`Relatório salvo: ${outPath}`);
  }

  process.exitCode = resultados.some((r) => r.status === "falha") ? 2 : 0;
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
