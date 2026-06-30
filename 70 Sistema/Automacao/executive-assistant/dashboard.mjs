#!/usr/bin/env node
/**
 * JARVIS Executive Assistant — gerador do Daily Dashboard (cockpit)
 *
 * Regenera `output/daily_dashboard.md` de forma DETERMINÍSTICA a partir das
 * propriedades das notas do vault (fonte da verdade) e do `raw/inbox.md`.
 *
 * Reutiliza a lógica de prioridade §8 do `_Spec JARVIS` via a lib do Morning
 * Brief (sem duplicar scoring): `../morning-brief/lib/`.
 *
 * NÃO faz triagem LLM de capturas livres — isso exige uma sessão interativa do
 * Executive Assistant. Quando há capturas pendentes no inbox, o dashboard
 * sinaliza "N itens aguardando triagem" para o operador rodar essa passada.
 *
 * Saída: output/daily_dashboard.md (sobrescrito — território `output/`).
 * Exit codes: 0 ok · 1 vault inacessível.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadVault, isRecurringStale } from "../morning-brief/lib/vault.mjs";
import { buildMorningBrief } from "../morning-brief/lib/brief.mjs";
import { todayISO, toDate, compareTasks, formatDateBR } from "../morning-brief/lib/priority.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// executive-assistant → Automacao → 70 Sistema → <vault root>
const VAULT_ROOT = process.env.JARVIS_VAULT_ROOT || path.resolve(__dirname, "..", "..", "..");
const OUTPUT_FILE = path.join(VAULT_ROOT, "output", "daily_dashboard.md");
const INBOX_FILE = path.join(VAULT_ROOT, "raw", "inbox.md");
const LOG_DIR = path.join(__dirname, "logs");

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    print: argv.includes("--print") || argv.includes("--dry-run"),
  };
}

/** Conta capturas pendentes na seção "## Capturas pendentes" do inbox bruto. */
function countInboxPending(inboxPath) {
  if (!fs.existsSync(inboxPath)) return 0;
  const raw = fs.readFileSync(inboxPath, "utf8");
  const lines = raw.split("\n");
  let inSection = false;
  let count = 0;
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      inSection = /capturas pendentes/i.test(heading[1]);
      continue;
    }
    if (!inSection) continue;
    // Conta como captura qualquer linha com conteúdo (bullet "- texto" ou texto livre),
    // ignorando o placeholder vazio "- " e linhas em branco.
    const content = line.replace(/^\s*-\s?/, "").trim();
    if (content.length > 0) count++;
  }
  return count;
}

/** Preserva a data `criado:` do dashboard existente; senão usa hoje. */
function preserveCriado(outputPath, today) {
  if (!fs.existsSync(outputPath)) return today;
  const raw = fs.readFileSync(outputPath, "utf8");
  const m = raw.match(/^criado:\s*(\d{4}-\d{2}-\d{2})/m);
  return m ? m[1] : today;
}

function tasksDueToday(tasks, today) {
  return tasks.filter((t) => !t.done && t.due === today).length;
}

function tasksOverdue(tasks, today) {
  return tasks.filter(
    (t) =>
      !t.done &&
      t.due &&
      toDate(t.due) < toDate(today) &&
      !isRecurringStale(t, today)
  ).length;
}

function countActiveProjects(notes) {
  return notes.filter((n) => n.tipo === "projeto" && n.status === "ativo").length;
}

function renderDashboard({ brief, inboxPending, vitals, today, criado, ranAt }) {
  const L = [];

  L.push("---");
  L.push("tipo: sistema");
  L.push("status: ativo");
  L.push(`criado: ${criado}`);
  L.push(`atualizado: ${today}`);
  L.push("relacionado:");
  L.push('  - "[[_Daily Brief (Canônico)]]"');
  L.push('  - "[[_master_index]]"');
  L.push("tags:");
  L.push("  - tema/ia");
  L.push("---");
  L.push("");
  L.push("# Daily Dashboard");
  L.push("");
  L.push("> Arquivo de entrega gerada. Pode ser sobrescrito pelo Executive Assistant.");
  L.push("> Fonte de verdade: propriedades nas notas do vault + `wiki/_master_index.md`. Este arquivo é visão, não memória.");
  L.push(`> Última compilação: ${ranAt} · gerado por \`70 Sistema/Automacao/executive-assistant/dashboard.mjs\``);
  L.push("");

  // 🎯 Hoje — no máximo 3 ações críticas (Filtro de Ruído, §8)
  L.push("## 🎯 Hoje");
  L.push("");
  if (brief.top3.length === 0) {
    L.push("_Sem ações críticas com prazo para hoje. Veja **Próximo** para foco estratégico._");
  } else {
    brief.top3.forEach((t) => {
      const due = t.due ? `  📅 ${formatDateBR(t.due)}` : "";
      L.push(`${t.rank}. ${t.text}${due}`);
    });
  }
  L.push("");

  // ⏭ Próximo — projetos por score + sinais comerciais
  L.push("## ⏭ Próximo");
  L.push("");
  if (brief.projects.length === 0 && brief.commercial.length === 0) {
    L.push("_— nada secundário em destaque —_");
  } else {
    brief.projects.forEach((p) => {
      const prog = p.progresso != null ? ` · ${p.progresso}%` : "";
      const prazo = p.prazo ? ` · prazo ${formatDateBR(p.prazo)}` : "";
      L.push(`- 🏗 ${p.name}${prog}${prazo} _(score ${p.score})_`);
    });
    brief.commercial.forEach((c) => L.push(`- 💼 ${c.text}`));
  }
  L.push("");

  // ⚠ Bloqueios — riscos / dependências (porteiro, §8)
  L.push("## ⚠ Bloqueios");
  L.push("");
  if (brief.risks.length === 0) {
    L.push("_— nada travado —_");
  } else {
    brief.risks.forEach((r) => L.push(`- ${r.text}`));
  }
  L.push("");

  // 📥 Inbox — sinaliza triagem pendente
  L.push("## 📥 Inbox");
  L.push("");
  if (inboxPending === 0) {
    L.push("_Inbox limpo — nada aguardando triagem._");
  } else {
    L.push(`**${inboxPending}** ${inboxPending === 1 ? "captura aguarda" : "capturas aguardam"} triagem em \`raw/inbox.md\`.`);
    L.push("");
    L.push("> Rode uma sessão interativa do **Executive Assistant** para materializar em `wiki/` e atualizar `wiki/_master_index.md`. A triagem de capturas livres exige raciocínio (LLM) e não roda no agendamento.");
  }
  L.push("");

  // 📊 Vitais
  L.push("## 📊 Vitais");
  L.push("");
  L.push("| Métrica | Valor |");
  L.push("|---|---|");
  L.push(`| Capturas no inbox | ${vitals.inboxPending} |`);
  L.push(`| Tarefas para hoje | ${vitals.dueToday} |`);
  L.push(`| Tarefas atrasadas | ${vitals.overdue} |`);
  L.push(`| Projetos ativos | ${vitals.activeProjects} |`);
  L.push(`| Notas no vault | ${vitals.noteCount} |`);
  L.push(`| Última execução EA | ${ranAt} |`);
  L.push("");

  return L.join("\n");
}

function appendRunLog(entry) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const file = path.join(LOG_DIR, `${todayISO()}.log`);
    fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    /* log é best-effort */
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const today = todayISO();
  const ranAt = new Date().toISOString();

  let vault;
  try {
    vault = loadVault(VAULT_ROOT);
  } catch (err) {
    console.error(`[EA] Falha ao ler vault: ${err.message}`);
    appendRunLog({ ts: ranAt, status: "vault_error", error: err.message });
    process.exitCode = 1;
    return;
  }

  const brief = buildMorningBrief(vault, { today });
  const inboxPending = countInboxPending(INBOX_FILE);
  const criado = preserveCriado(OUTPUT_FILE, today);

  const vitals = {
    inboxPending,
    dueToday: tasksDueToday(vault.tasks, today),
    overdue: tasksOverdue(vault.tasks, today),
    activeProjects: countActiveProjects(vault.notes),
    noteCount: vault.notes.length,
  };

  const md = renderDashboard({ brief, inboxPending, vitals, today, criado, ranAt });

  if (args.print) console.log("\n" + md + "\n");

  if (args.dryRun) {
    console.error("[EA] Dry-run: dashboard NÃO escrito.");
    appendRunLog({ ts: ranAt, status: "dry_run_ok", inboxPending, ...vitals });
    return;
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, md, "utf8");
  console.error(`[EA] Dashboard atualizado: ${OUTPUT_FILE}`);
  appendRunLog({ ts: ranAt, status: "written", path: OUTPUT_FILE, inboxPending, ...vitals });
}

main();
