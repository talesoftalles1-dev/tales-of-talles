import fs from "node:fs";
import path from "node:path";

const SKIP_FOLDERS = ["70 Sistema/Templates", "90 Arquivo", ".obsidian", ".claude"];

export function loadVault(vaultRoot) {
  const notes = [];
  const tasks = [];
  walkMd(vaultRoot, vaultRoot, notes);

  for (const note of notes) {
    const body = note.body;
    const extracted = extractTasks(body, note);
    tasks.push(...extracted);
  }

  return { notes, tasks };
}

function walkMd(dir, vaultRoot, out) {
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
      if (SKIP_FOLDERS.some((s) => rel === s || rel.startsWith(`${s}/`))) continue;
      walkMd(full, vaultRoot, out);
      continue;
    }

    if (!ent.name.endsWith(".md")) continue;
    // Normaliza CRLF/CR → LF: o vault no Windows grava CRLF e o parser de
    // frontmatter/tarefas abaixo assume LF (`---\n`, split por "\n"). Sem isto,
    // toda nota CRLF era lida como "sem tipo" e o cockpit/brief saíam vazios.
    const raw = fs.readFileSync(full, "utf8").replace(/\r\n?/g, "\n");
    const parsed = parseNote(raw, rel, ent.name);
    out.push(parsed);
  }
}

function parseNote(raw, relPath, fileName) {
  const fm = parseFrontmatter(raw);
  const body = fm ? raw.slice(fm.end) : raw;
  return {
    path: relPath,
    fileName,
    basename: fileName.replace(/\.md$/, ""),
    ...fm?.data,
    body,
  };
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return null;
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const block = raw.slice(4, end);
  const data = parseSimpleYaml(block);
  return { data, end: end + 5 };
}

/** Parser YAML mínimo — cobre frontmatter do _Spec JARVIS (sem dependências externas). */
function parseSimpleYaml(text) {
  const data = {};
  let currentKey = null;
  let listMode = false;

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMode && listMatch) {
      data[currentKey].push(unquote(listMatch[1]));
      continue;
    }

    const kv = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
    if (!kv) continue;

    currentKey = kv[1];
    const val = kv[2].trim();
    listMode = false;

    if (val === "") {
      data[currentKey] = [];
      listMode = true;
    } else if (val.startsWith("[") && val.endsWith("]")) {
      data[currentKey] = val
        .slice(1, -1)
        .split(",")
        .map((s) => unquote(s.trim()))
        .filter(Boolean);
    } else {
      data[currentKey] = coerce(unquote(val));
    }
  }
  return data;
}

function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function coerce(s) {
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^\d+$/.test(s)) return Number(s);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s;
}

const TASK_RE = /^-\s+\[([ xX])\]\s+(.+)$/;

export function extractTasks(body, note) {
  const tasks = [];
  const lines = body.split("\n");
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const m = line.match(TASK_RE);
    if (!m) continue;

    const done = m[1].toLowerCase() === "x";
    const text = m[2].trim();
    const due = matchDate(text, "📅");
    const scheduled = matchDate(text, "⏳");
    const completed = matchDate(text, "✅");

    tasks.push({
      done,
      text: cleanTaskText(text),
      due,
      scheduled,
      completed,
      rawLine: line,
      sourcePath: note.path,
      sourceBasename: note.basename,
      sourceTipo: note.tipo,
    });
  }
  return tasks;
}

function matchDate(text, emoji) {
  const re = new RegExp(`${emoji}\\s*(\\d{4}-\\d{2}-\\d{2})`);
  const m = text.match(re);
  return m ? m[1] : null;
}

function cleanTaskText(text) {
  return text
    .replace(/[🔺⏫🔼🔽]\s*/gu, "")
    .replace(/\s*🔁\s*.+$/u, "")
    .replace(/📅\s*\d{4}-\d{2}-\d{2}/gu, "")
    .replace(/⏳\s*\d{4}-\d{2}-\d{2}/gu, "")
    .replace(/🛫\s*\d{4}-\d{2}-\d{2}/gu, "")
    .replace(/✅\s*\d{4}-\d{2}-\d{2}/gu, "")
    .replace(/\d{4}-\d{2}-\d{2}/g, "")
    .replace(/\[\[[^\]]+\]\]/g, (m) => m.slice(2, -2))
    .replace(/#\S+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function isRecurringStale(task, today) {
  if (!task.rawLine.includes("🔁")) return false;
  if (!task.due) return true;
  return task.due < today;
}
