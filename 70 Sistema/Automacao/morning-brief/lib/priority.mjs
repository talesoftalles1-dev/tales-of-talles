/**
 * Contrato de prioridade — _Spec JARVIS §8
 * Reutilizado por dashboard Dataview e Morning Brief (sem duplicar lógica de scoring).
 */

export function urgencyScore(prazo, today) {
  if (!prazo) return 0;
  const p = toDate(prazo);
  const t = toDate(today);
  if (p <= t) return 12;
  const in3 = addDays(t, 3);
  const in7 = addDays(t, 7);
  const in30 = addDays(t, 30);
  if (p <= in3) return 8;
  if (p <= in7) return 5;
  if (p <= in30) return 2;
  return 0;
}

export function energyBonus(energia) {
  if (energia === "baixa") return 2;
  if (energia === "media") return 1;
  return 0;
}

export function projectScore(note, today) {
  const importancia = note.importancia ?? 1;
  const valorEstrategico = note.valor_estrategico ?? 1;
  return (
    importancia * 10 +
    urgencyScore(note.prazo, today) +
    valorEstrategico * 8 +
    energyBonus(note.energia)
  );
}

export function isBlocked(note) {
  if (note.status === "pausado") return true;
  const dep = note.dependencia;
  if (!dep) return false;
  if (Array.isArray(dep)) return dep.length > 0;
  return Boolean(dep);
}

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return startOfDay(value);
  const s = String(value).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d, n) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function formatDateBR(d) {
  const dt = toDate(d);
  if (!dt) return "";
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

export function todayISO() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, "0");
  const d = String(n.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Prioridade numérica para tarefas (plugin Tasks) — maior = mais urgente */
const TASK_PRIORITY = { "🔺": 4, "⏫": 3, "🔼": 2, "🔽": 1 };

export function taskPriorityValue(task) {
  let max = 0;
  for (const ch of task.rawLine || "") {
    if (TASK_PRIORITY[ch]) max = Math.max(max, TASK_PRIORITY[ch]);
  }
  return max;
}

export function compareTasks(a, b) {
  const pd = taskPriorityValue(b) - taskPriorityValue(a);
  if (pd !== 0) return pd;
  const ad = a.due || "9999";
  const bd = b.due || "9999";
  return ad.localeCompare(bd);
}
