#!/usr/bin/env node
/**
 * vault-lint — lint determinístico do vault JARVIS.
 *
 * Valida três coisas, sem LLM e sem rede:
 *   1. Frontmatter conforme o contrato (_Spec JARVIS §2/§8/§9 + extensões ratificadas);
 *   2. Wikilinks quebrados (alvo inexistente, considerando aliases);
 *   3. Drift do espelho CLAUDE.md ↔ AGENTS.md.
 *
 * Saída: output/vault_lint.md (camada regenerável) + exit code 1 se houver erro.
 * Uso:   node lint.mjs [--vault "C:\\caminho\\do\\vault"] [--quiet]
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Contrato (_Spec JARVIS §2 + §9 + extensões de 2026-07-06)
// ---------------------------------------------------------------------------

const STATUS_POR_TIPO = {
  projeto: ["ideia", "ativo", "pausado", "concluido", "arquivado"],
  reuniao: ["agendada", "realizada", "cancelada"],
  cliente: ["lead", "ativo", "inativo", "perdido"],
  contato: ["ativo", "inativo"],
  doc: ["rascunho", "revisao", "publicado"],
  objetivo: ["ativo", "concluido", "abandonado"],
  habito: ["ativo", "pausado"],
  estudo: ["backlog", "estudando", "concluido"],
  ideia: ["nova", "desenvolvendo", "convertida", "descartada"],
  sop: ["rascunho", "ativo", "revisao"],
  checklist: ["ativo", "arquivado"],
  lancamento: ["pago", "pendente"],
  prompt: ["ativo", "rascunho"],
  treino: ["planejado", "feito", "falhou"],
  nutricao: ["parcial", "fechado"],
  // extensões ratificadas em 2026-07-06 (_Spec §2):
  index: ["ativo", "canonico", "arquivado"],
  output: ["ativo", "gerado", "arquivado"],
  agent: ["ativo", "canonico", "rascunho"],
  runbook: ["rascunho", "ativo", "revisao"],
  // sem enum de status no contrato (aceita qualquer um):
  sistema: null,
  nota: null,
  diario: null,
  semanal: null,
  corporal: null,
  chapter: null, // legado arquivado
};

const AREAS = ["pessoal", "empresa", "sistema"];
const DOMINIOS = ["jarvis", "yalt", "talles"];
const STATUS_TERMINAL = "arquivado"; // aceito para QUALQUER tipo (estado terminal, 90 Arquivo/)
const CHAVES_PROIBIDAS = {
  contexto: "proibida fora de tipo:checklist — modelo de dados usa area+dominio (_Spec §13)",
  uso: "não existe no contrato — em checklist a chave é `contexto`",
  title: "use `titulo` (chaves em PT/snake_case)",
  created: "use `criado` (YYYY-MM-DD)",
};
const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

const SKIP_FOLDERS = ["90 Arquivo", "70 Sistema/Templates", "70 Sistema/Automacao/n8n-selfhost", ".obsidian", ".claude", ".git", "node_modules", "raw", "logs"];
const SEM_FRONTMATTER_OK = ["AGENTS.md", "CLAUDE.md", "README.md", "60 Conhecimento/Wiki/index.md", "60 Conhecimento/Wiki/log.md", "output/daily_dashboard.md", "output/2026-07-08-morning-brief.txt"];
// Fora do lint por design: histórico superseded + o próprio relatório (auto-referência):
const EXEMPT = ["CONSTITUTION.md", "output/vault_lint.md"];

// ---------------------------------------------------------------------------
// Parser mínimo (mesmo padrão de morning-brief/lib/vault.mjs — CRLF → LF)
// ---------------------------------------------------------------------------

function walkMd(dir, vaultRoot, out, skip = SKIP_FOLDERS, extensoes = [".md"]) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(vaultRoot, full).replace(/\\/g, "/");
    if (ent.isDirectory()) {
      if (skip.some((s) => rel === s || rel.startsWith(`${s}/`))) continue;
      walkMd(full, vaultRoot, out, skip, extensoes);
      continue;
    }
    if (!extensoes.some((e) => ent.name.endsWith(e))) continue;
    if (!ent.name.endsWith(".md")) {
      // Obsidian resolve [[Nome]] sem extensão também para canvas/anexos:
      out.push({ rel, name: ent.name, basename: ent.name.replace(/\.[^.]+$/, ""), raw: "" });
      continue;
    }
    const raw = fs.readFileSync(full, "utf8").replace(/\r\n?/g, "\n");
    out.push({ rel, name: ent.name, basename: ent.name.replace(/\.md$/, ""), raw });
  }
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const data = {};
  const keys = [];
  let currentKey = null;
  let listMode = false;
  for (const line of raw.slice(4, end).split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMode && listMatch) {
      data[currentKey].push(unquote(listMatch[1].trim()));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    currentKey = kv[1];
    keys.push(currentKey);
    const val = kv[2].trim();
    listMode = false;
    if (val === "") {
      data[currentKey] = [];
      listMode = true;
    } else if (val.startsWith("[") && val.endsWith("]")) {
      data[currentKey] = val.slice(1, -1).split(",").map((s) => unquote(s.trim())).filter(Boolean);
    } else {
      data[currentKey] = unquote(val);
    }
  }
  return { data, keys, end: end + 5 };
}

function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function lintFrontmatter(note, erros, avisos) {
  const fm = parseFrontmatter(note.raw);
  if (!fm) {
    if (!SEM_FRONTMATTER_OK.some((p) => note.rel === p || note.rel.endsWith(`/${p}`))) {
      avisos.push(`${note.rel} — sem frontmatter (nota de conteúdo deveria ter o bloco do contrato §2)`);
    }
    return;
  }
  const { data, keys } = fm;

  for (const k of keys) {
    if (CHAVES_PROIBIDAS[k]) {
      // `uso` e `contexto` têm nuance por tipo:
      if (k === "contexto" && data.tipo === "checklist") continue; // chave legítima do tipo checklist
      erros.push(`${note.rel} — chave proibida \`${k}\` (${CHAVES_PROIBIDAS[k]})`);
    }
    if (!/^[a-z_][a-z0-9_]*$/.test(k)) avisos.push(`${note.rel} — chave \`${k}\` fora do snake_case (_Spec §10)`);
  }

  const tipo = typeof data.tipo === "string" ? data.tipo : null;
  if (tipo && !(tipo in STATUS_POR_TIPO)) {
    erros.push(`${note.rel} — tipo \`${tipo}\` fora do contrato §2`);
  }
  const status = typeof data.status === "string" ? data.status : null;
  if (tipo && status && tipo in STATUS_POR_TIPO) {
    const enumStatus = STATUS_POR_TIPO[tipo];
    if (enumStatus && !enumStatus.includes(status) && status !== STATUS_TERMINAL) {
      erros.push(`${note.rel} — status \`${status}\` inválido para tipo \`${tipo}\` (aceitos: ${enumStatus.join("|")}|${STATUS_TERMINAL})`);
    }
  }
  if (typeof data.area === "string" && !AREAS.includes(data.area)) {
    erros.push(`${note.rel} — area \`${data.area}\` fora do enum (${AREAS.join("|")})`);
  }
  if (typeof data.dominio === "string" && !DOMINIOS.includes(data.dominio)) {
    erros.push(`${note.rel} — dominio \`${data.dominio}\` fora do enum (${DOMINIOS.join("|")})`);
  }
  for (const dk of ["criado", "atualizado", "data", "prazo", "inicio", "proximo_contato"]) {
    if (typeof data[dk] === "string" && data[dk] && !DATA_RE.test(data[dk])) {
      erros.push(`${note.rel} — \`${dk}: ${data[dk]}\` fora do formato YYYY-MM-DD`);
    }
  }
  if (Array.isArray(data.tags)) {
    const valoresProp = [tipo, status, data.area, data.dominio].filter(Boolean);
    for (const t of data.tags) {
      const tag = String(t).replace(/^#/, "");
      if (valoresProp.includes(tag) || tag === "index" || tag === "agent" || tag === "runbook" || tag === "output") {
        if (valoresProp.includes(tag)) erros.push(`${note.rel} — tag \`${tag}\` duplica propriedade (taxonomia §3)`);
      }
    }
  }
}

function coletarAlvos(notes) {
  const alvos = new Set();
  for (const n of notes) {
    alvos.add(n.basename.toLowerCase());
    alvos.add(n.rel.replace(/\.md$/, "").toLowerCase());
    const fm = parseFrontmatter(n.raw);
    if (fm && Array.isArray(fm.data.aliases)) {
      for (const a of fm.data.aliases) alvos.add(String(a).toLowerCase());
    }
  }
  return alvos;
}

const WIKILINK_RE = /(!?)\[\[([^\]|#^]+?)\\?(?:[#^][^\]|]*)?(?:\\?\|[^\]]*)?\]\]/g;
const PLACEHOLDERS = new Set(["alvo", "...", "nota", "novo local", "nome do cliente", "projeto", "objetivo", "cliente", "contato", "verificar"]);

function lintLinks(notes, alvosExtras, vaultRoot, erros) {
  const alvos = coletarAlvos(notes);
  for (const extra of alvosExtras) alvos.add(extra.toLowerCase());
  const resolve = (alvo) => {
    const key = alvo.toLowerCase().replace(/\\$/, "");
    const keyFile = key.replace(/\.md$/, "");
    if (alvos.has(key) || alvos.has(keyFile) || alvos.has(keyFile.split("/").pop())) return true;
    // Alvo pode ser uma PASTA existente (padrão usado nos docs canônicos):
    try {
      if (fs.existsSync(path.join(vaultRoot, alvo.replace(/\\$/, "")))) return true;
    } catch { /* caminho inválido → segue como quebrado */ }
    return false;
  };
  const checar = (texto, origem, rel) => {
    // Ignora spans de código inline (`...`) — exemplos de sintaxe, não links reais:
    const semInline = texto.replace(/`[^`]*`/g, "");
    for (const m of semInline.matchAll(WIKILINK_RE)) {
      const alvo = m[2].trim().replace(/\\$/, "");
      if (!alvo || PLACEHOLDERS.has(alvo.toLowerCase())) continue;
      if (!resolve(alvo)) erros.push(`${rel} — wikilink quebrado ${origem}: [[${alvo}]]`);
    }
  };
  for (const n of notes) {
    const fmParsed = parseFrontmatter(n.raw);
    const corpo = fmParsed ? n.raw.slice(fmParsed.end) : n.raw;
    const fmTexto = fmParsed ? n.raw.slice(0, fmParsed.end) : "";
    let inCode = false;
    for (const linha of corpo.split("\n")) {
      if (linha.trim().startsWith("```")) { inCode = !inCode; continue; }
      if (inCode) continue;
      checar(linha, "", n.rel);
    }
    checar(fmTexto, "(frontmatter)", n.rel);
  }
}

function lintEspelho(vaultRoot, erros) {
  const a = path.join(vaultRoot, "AGENTS.md");
  const c = path.join(vaultRoot, "CLAUDE.md");
  if (!fs.existsSync(a) || !fs.existsSync(c)) return;
  const conteudoA = fs.readFileSync(a, "utf8").replace(/\r\n?/g, "\n");
  const conteudoC = fs.readFileSync(c, "utf8").replace(/\r\n?/g, "\n");
  // AGENTS.md = cabeçalho de espelho (comentário HTML) + conteúdo idêntico ao CLAUDE.md
  const semCabecalho = conteudoA.replace(/^<!--[\s\S]*?-->\n*/, "");
  if (semCabecalho.trim() !== conteudoC.trim()) {
    erros.push("AGENTS.md — drift do espelho: conteúdo divergiu de CLAUDE.md (edite CLAUDE.md e re-copie; ver cabeçalho do AGENTS.md)");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const vaultIdx = args.indexOf("--vault");
  const vaultRoot = vaultIdx >= 0 ? args[vaultIdx + 1] : path.resolve(SCRIPT_DIR, "..", "..", "..");
  const quiet = args.includes("--quiet");

  const notes = [];
  walkMd(vaultRoot, vaultRoot, notes);
  const notesAtivas = notes.filter((n) => !EXEMPT.includes(n.rel));

  const erros = [];
  const avisos = [];
  for (const n of notesAtivas) lintFrontmatter(n, erros, avisos);

  // Alvos de link fora do escopo linado: 90 Arquivo/ (md), anexos e templates
  const extras = [];
  walkMd(path.join(vaultRoot, "90 Arquivo"), vaultRoot, extras, [".git"], [".md"]);
  walkMd(path.join(vaultRoot, "70 Sistema", "Templates"), vaultRoot, extras, [".git"], [".md"]);
  walkMd(vaultRoot, vaultRoot, extras, [".git", "node_modules", ".obsidian", ".claude"], [".canvas", ".m4a", ".png", ".jpg", ".pdf", ".base"]);
  const alvosExtras = extras.flatMap((n) => {
    const fm = n.raw ? parseFrontmatter(n.raw) : null;
    const aliases = fm && Array.isArray(fm.data.aliases) ? fm.data.aliases.map(String) : [];
    return [n.basename, n.rel.replace(/\.md$/, ""), n.name, n.rel, ...aliases];
  });
  lintLinks(notesAtivas, alvosExtras, vaultRoot, erros);
  lintEspelho(vaultRoot, erros);

  const agora = new Date().toISOString().slice(0, 16).replace("T", " ");
  const linhas = [
    "---",
    "dominio: jarvis",
    "tipo: output",
    "status: gerado",
    "titulo: Vault Lint — Relatório de Conformidade",
    `criado: ${agora.slice(0, 10)}`,
    `atualizado: ${agora.slice(0, 10)}`,
    "tags:",
    "  - dataview",
    "---",
    "",
    "# 🧹 Vault Lint — Relatório de Conformidade",
    "",
    `> Gerado em ${agora} por \`70 Sistema/Automacao/vault-lint/lint.mjs\`. Arquivo regenerável — não é fonte de verdade. Contrato: [[_Spec JARVIS]] §2/§3/§10.`,
    "",
    `**Notas varridas:** ${notes.length} · **Erros:** ${erros.length} · **Avisos:** ${avisos.length}`,
    "",
  ];
  if (erros.length) {
    linhas.push("## ❌ Erros (violam o contrato)", "");
    for (const e of erros) linhas.push(`- ${e}`);
    linhas.push("");
  }
  if (avisos.length) {
    linhas.push("## ⚠️ Avisos", "");
    for (const a of avisos) linhas.push(`- ${a}`);
    linhas.push("");
  }
  if (!erros.length && !avisos.length) linhas.push("## ✅ Vault 100% conforme o contrato", "");
  linhas.push("---", "", "> Rotina: E5 (Revisão) é dono do critério; E1 (Organização) executa correções; tarefa agendada opcional às 06:50 (ver RUNBOOK).");

  const outPath = path.join(vaultRoot, "output", "vault_lint.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, linhas.join("\n") + "\n", "utf8");

  if (!quiet) {
    console.log(`vault-lint: ${notes.length} notas · ${erros.length} erro(s) · ${avisos.length} aviso(s)`);
    console.log(`relatório: ${outPath}`);
    for (const e of erros.slice(0, 20)) console.log(`  ERRO  ${e}`);
  }
  process.exit(erros.length ? 1 : 0);
}

main();
