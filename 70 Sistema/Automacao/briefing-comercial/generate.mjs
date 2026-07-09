#!/usr/bin/env node
/**
 * JARVIS Briefing Comercial — o "gerente" diário do Yalt CRM.
 *
 * Lê o CRM (leads, atividades, estatísticas), ranqueia os contatos do dia pelo
 * contrato de prioridade (_Spec JARVIS §8 adaptado — ver lib/score.mjs), aponta
 * oportunidades e gera a fila de e-mails pré-cold-call (aprovação humana).
 *
 * Saídas (camada output/, regenerável):
 *   output/briefing_comercial_YYYY-MM-DD.md
 *   output/fila_emails_YYYY-MM-DD.md   (rascunhos `aprovacao: pendente`)
 *
 * Exit codes (mesmo contrato do Morning Brief):
 *   0 ok · 1 CRM inacessível · 2 gerado parcialmente (alguma fonte falhou)
 *
 * Uso: node generate.mjs [--dry-run] [--print] [--max 10] [--no-emails]
 * Requer: YALT_API_KEY no ambiente (nunca no repo).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { todayISO, formatDateBR } from "../morning-brief/lib/priority.mjs";
import { crmConfigFromEnv, crmGet, listLeads, lastActivityByLead, normalizeStatus } from "./lib/crm.mjs";
import { leadScore, isBlockedLead, daysSince } from "./lib/score.mjs";
import { gerarRascunhos } from "./lib/emails.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const maxIdx = argv.indexOf("--max");
  return {
    dryRun: argv.includes("--dry-run"),
    print: argv.includes("--print") || argv.includes("--dry-run"),
    noEmails: argv.includes("--no-emails"),
    max: maxIdx >= 0 ? Number(argv[maxIdx + 1]) || 10 : 10,
  };
}

function loadConfig() {
  // Raiz do vault resolvida pelo caminho do script (lição da auditoria 2026-07-09:
  // nunca process.cwd()); override por JARVIS_VAULT_ROOT.
  const defaults = {
    vaultRoot: process.env.JARVIS_VAULT_ROOT || path.resolve(__dirname, "..", "..", ".."),
    diasEsfriando: 14,
    remetente: { nome: "", empresa: "Yalt", telefone: "", proposta: "" },
    template: {},
    ollama: { enabled: true, model: "gemma4" },
  };
  const configPath = path.join(__dirname, "config.json");
  if (!fs.existsSync(configPath)) return defaults;
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return {
    ...defaults,
    ...raw,
    remetente: { ...defaults.remetente, ...raw.remetente },
    ollama: { ...defaults.ollama, ...raw.ollama },
  };
}

const fmHeader = (titulo, hoje) =>
  [
    "---",
    "dominio: yalt",
    "tipo: output",
    "status: gerado",
    `titulo: ${titulo}`,
    `criado: ${hoje}`,
    `atualizado: ${hoje}`,
    "tags:",
    "  - tema/vendas",
    "---",
    "",
  ].join("\n");

function buildBriefing({ hoje, contatos, oportunidades, stats, statsTeam, filaInfo, avisos }) {
  const l = [];
  l.push(fmHeader(`Briefing Comercial — ${hoje}`, hoje));
  l.push(`# 📞 Briefing Comercial — ${hoje}`);
  l.push("");
  l.push(
    `> Gerado por \`70 Sistema/Automacao/briefing-comercial/generate.mjs\` (BOBBY). Compilação regenerável — a fonte de verdade é o Yalt CRM. Score: contrato §8 adaptado (ver [[_Briefing Comercial — Spec]]).`,
  );
  l.push("");

  l.push("## 📊 Pipeline");
  l.push("");
  if (stats) {
    const linhas = Object.entries(stats)
      .filter(([, v]) => typeof v === "number" || typeof v === "string")
      .map(([k, v]) => `- **${k}**: ${v}`);
    l.push(...(linhas.length ? linhas : ["- (estatísticas sem campos planos — ver CRM)"]));
  } else {
    l.push("- ⚠️ estatísticas indisponíveis nesta execução");
  }
  if (statsTeam?.length) {
    l.push("");
    l.push("| Vendedor | Leads | Fechados |");
    l.push("|---|---:|---:|");
    for (const m of statsTeam) {
      l.push(`| ${m.nome} | ${m.leads ?? "—"} | ${m.fechados ?? "—"} |`);
    }
  }
  l.push("");

  l.push(`## 🎯 Contatos do dia (top ${contatos.length})`);
  l.push("");
  if (!contatos.length) {
    l.push("- Nenhum lead acionável hoje — pipeline limpo ou tudo bloqueado (ver CRM).");
  } else {
    l.push("| # | Empresa | Contato | Telefone | Estágio | Score | Por quê |");
    l.push("|---:|---|---|---|---|---:|---|");
    contatos.forEach((c, i) => {
      l.push(
        `| ${i + 1} | ${c.lead.businessName || "?"} | ${c.lead.contactPerson || "—"} | ${c.lead.phone || "—"} | ${c.status} | ${c.score} | ${c.motivos.join("; ") || "—"} |`,
      );
    });
  }
  l.push("");

  l.push("## 💡 Oportunidades");
  l.push("");
  if (!oportunidades.length) l.push("- Nenhum padrão de alerta detectado hoje.");
  for (const o of oportunidades) l.push(`- ${o}`);
  l.push("");

  l.push("## ✉️ Fila de e-mails pré-cold-call");
  l.push("");
  if (filaInfo) {
    l.push(
      `- **${filaInfo.total} rascunho(s)** gerados (${filaInfo.personalizados} personalizados via Ollama) → \`output/${filaInfo.arquivo}\``,
    );
    l.push(
      "- Revise, troque `aprovacao: pendente` → `aprovacao: aprovado` e rode `node send-approved.mjs`. **Nada é enviado sem essa marcação.**",
    );
  } else {
    l.push("- Fila não gerada nesta execução (`--no-emails` ou nenhum lead com e-mail).");
  }
  l.push("");

  if (avisos.length) {
    l.push("## ⚠️ Avisos da execução");
    l.push("");
    for (const a of avisos) l.push(`- ${a}`);
    l.push("");
  }
  return l.join("\n") + "\n";
}

function buildFila({ hoje, rascunhos }) {
  const l = [];
  l.push(fmHeader(`Fila de E-mails Pré-Cold-Call — ${hoje}`, hoje));
  l.push(`# ✉️ Fila de E-mails — ${hoje}`);
  l.push("");
  l.push(
    "> Rascunhos gerados pelo BOBBY. **Nenhum e-mail sai sem `aprovacao: aprovado`** (Contrato de Autoridade — outreach externo exige aprovação humana). Depois de revisar, rode `node send-approved.mjs` nesta pasta.",
  );
  l.push("");
  rascunhos.forEach((r, i) => {
    l.push(`## E${i + 1} · ${r.lead.businessName || "Sem nome"}`);
    l.push("");
    l.push(`- lead_id: \`${r.lead.id}\``);
    l.push(`- para: ${r.para}`);
    l.push(`- aprovacao: pendente`);
    l.push(`- assunto: ${r.assunto}`);
    l.push(`- origem_texto: ${r.personalizado ? "ollama" : "template"}`);
    l.push("");
    l.push("```text");
    l.push(r.corpo);
    l.push("```");
    l.push("");
  });
  return l.join("\n") + "\n";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig();
  const hoje = todayISO();
  const avisos = [];

  let crm;
  try {
    crm = crmConfigFromEnv(config);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
    return;
  }

  // --- Coleta (leads é obrigatório; o resto degrada graciosamente) ---
  let leads;
  try {
    leads = await listLeads(crm);
  } catch (err) {
    console.error(`CRM inacessível: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  let ultimaAtividade = new Map();
  try {
    ultimaAtividade = await lastActivityByLead(crm);
  } catch (err) {
    avisos.push(`atividades indisponíveis (${err.message}) — esfriamento não calculado`);
  }

  let stats = null;
  try {
    stats = await crmGet(crm, "/v1/api/stats/leads");
  } catch (err) {
    avisos.push(`stats/leads indisponível (${err.message})`);
  }

  let statsTeam = null;
  try {
    const t = await crmGet(crm, "/v1/api/stats/team");
    const items = Array.isArray(t) ? t : t?.data || t?.team || [];
    statsTeam = items
      .map((m) => ({
        nome: m.name || m.fullName || m.email || "?",
        leads: m.leads ?? m.leadCount ?? m.totalLeads,
        fechados: m.closed ?? m.closedCount ?? m.won,
      }))
      .slice(0, 10);
  } catch (err) {
    avisos.push(`stats/team indisponível (${err.message})`);
  }

  // --- Ranking (§8 adaptado) ---
  const acionaveis = [];
  for (const lead of leads) {
    if (isBlockedLead(lead, hoje)) continue;
    const lastActivity = ultimaAtividade.get(lead.id) || null;
    const s = leadScore(lead, { today: hoje, lastActivity, diasEsfriando: config.diasEsfriando });
    acionaveis.push({ lead, lastActivity, ...s });
  }
  acionaveis.sort((a, b) => b.score - a.score);
  const contatos = acionaveis.slice(0, args.max);

  // --- Oportunidades (padrões determinísticos) ---
  const oportunidades = [];
  const vencidos = acionaveis.filter(
    (c) => c.lead.nextFollowUp && String(c.lead.nextFollowUp).slice(0, 10) <= hoje,
  );
  if (vencidos.length) {
    oportunidades.push(
      `**${vencidos.length} follow-up(s) vencido(s)** — os primeiros: ${vencidos
        .slice(0, 5)
        .map((c) => `${c.lead.businessName} (${formatDateBR(c.lead.nextFollowUp)})`)
        .join(", ")}`,
    );
  }
  const quentesEsfriando = acionaveis.filter((c) => {
    const idle = daysSince(c.lastActivity, hoje);
    return (
      ["negociation", "send-proposal"].includes(c.status) &&
      idle !== null &&
      idle >= config.diasEsfriando
    );
  });
  for (const c of quentesEsfriando.slice(0, 5)) {
    oportunidades.push(
      `**${c.lead.businessName}** está em \`${c.status}\` sem atividade há ${daysSince(c.lastActivity, hoje)}d — negócio quente esfriando.`,
    );
  }
  const altaNuncaContatada = acionaveis.filter(
    (c) => c.lead.priority === "high" && normalizeStatus(c.lead) === "new" && !c.lastActivity,
  );
  if (altaNuncaContatada.length) {
    oportunidades.push(
      `**${altaNuncaContatada.length} lead(s) de prioridade alta nunca contatados** — ex.: ${altaNuncaContatada
        .slice(0, 3)
        .map((c) => c.lead.businessName)
        .join(", ")}`,
    );
  }

  // --- Fila de e-mails ---
  let filaInfo = null;
  let filaTexto = null;
  if (!args.noEmails) {
    const rascunhos = await gerarRascunhos(
      contatos.map((c) => c.lead),
      { remetente: config.remetente, template: config.template, ollama: config.ollama },
    );
    if (rascunhos.length) {
      filaTexto = buildFila({ hoje, rascunhos });
      filaInfo = {
        total: rascunhos.length,
        personalizados: rascunhos.filter((r) => r.personalizado).length,
        arquivo: `fila_emails_${hoje}.md`,
      };
    }
  }

  const briefing = buildBriefing({ hoje, contatos, oportunidades, stats, statsTeam, filaInfo, avisos });

  if (args.print) console.log("\n" + briefing);

  if (!args.dryRun) {
    const outDir = path.join(config.vaultRoot, "output");
    fs.mkdirSync(outDir, { recursive: true });
    const briefingPath = path.join(outDir, `briefing_comercial_${hoje}.md`);
    fs.writeFileSync(briefingPath, briefing, "utf8");
    console.log(`Briefing salvo: ${briefingPath}`);
    if (filaTexto) {
      const filaPath = path.join(outDir, filaInfo.arquivo);
      fs.writeFileSync(filaPath, filaTexto, "utf8");
      console.log(`Fila de e-mails salva: ${filaPath} (${filaInfo.total} rascunhos, pendentes de aprovação)`);
    }
  } else {
    console.log("Dry-run: nada gravado.");
  }

  process.exitCode = avisos.length ? 2 : 0;
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
