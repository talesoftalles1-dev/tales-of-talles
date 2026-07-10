#!/usr/bin/env node
/**
 * JARVIS Commercial CRM — Agente "Gerente" (Frente 1)
 * Lê métricas do CRM Yalt, avalia pipeline e propõe contatos do dia + oportunidades.
 * Cérebro: Gemma 4 local (Ollama). Entrega: output/comercial/daily_pipeline.md (sem frontmatter).
 *
 * Princípios (canon JARVIS):
 * - Sem envio externo automático (cláusula BOBBY/E9). Apenas briefing/rascunho.
 * - Segredos via env YALT_API_KEY (nunca hardcoded/commitado).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  yaltHealth,
  getLeadStats,
  getTeamStats,
  getActivities,
  getAllMyLeads,
} from "./lib/yalt.mjs";
import { brainAvailable, synthesizeManagerBrief } from "./lib/yalt_brain.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadConfig() {
  const cfgPath = path.join(__dirname, "config.json");
  const defaults = {
    apiKey: process.env.YALT_API_KEY || "",
    scope: "mine",
    outputDir: path.resolve(__dirname, "..", "..", "..", "output", "comercial"),
    logDir: path.join(__dirname, "logs"),
    useBrain: (process.env.JARVIS_AGENT_BRAIN || "ollama") === "ollama",
  };
  if (!fs.existsSync(cfgPath)) return defaults;
  const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  return {
    apiKey: raw.apiKey || defaults.apiKey,
    scope: raw.scope || defaults.scope,
    outputDir: raw.outputDir || defaults.outputDir,
    logDir: raw.logDir || defaults.logDir,
    useBrain: raw.useBrain !== false,
  };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function appendRunLog(logDir, entry) {
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(
    path.join(logDir, `${todayISO()}.log`),
    `${JSON.stringify(entry)}\n`,
    "utf8",
  );
}

function fallbackBrief({ stats, team, leads, activities }) {
  const leadArr = Array.isArray(leads) ? leads : leads?.leads ?? [];
  const actArr = Array.isArray(activities) ? activities : [];
  const uncontacted = leadArr.filter((l) => l._isUncontacted);
  const top = uncontacted
    .sort((a, b) => (b.priority === "high") - (a.priority === "high"))
    .slice(0, 10)
    .map((l, i) => `${i + 1}. ${l.businessName} [${l.status ?? "new"} · ${l.priority ?? "?"} · ${l._locationCount} loc]`)
    .join("\n");
  return (
    `# Pipeline Comercial (fallback — sem Gemma)\n\n` +
    `Data: ${todayISO()}\nLeads nunca contactados: ${uncontacted.length}/${leads.total}\n\n` +
    `## Contatos de hoje\n${top || "(nenhum lead não contactado)"}\n\n` +
    `## Stats\n${JSON.stringify(stats)}\n${JSON.stringify(team)}\n\n## Atividades (${actArr.length})\n${JSON.stringify(actArr.slice(0, 15))}`
  );
}

async function main() {
  const config = loadConfig();
  const today = todayISO();
  fs.mkdirSync(config.outputDir, { recursive: true });

  const health = await yaltHealth();
  if (!health.ok) {
    console.error(`CRM indisponível: ${health.error || health.statusCode}`);
    appendRunLog(config.logDir, { ts: new Date().toISOString(), status: "crm_down", health });
    process.exitCode = 1;
    return;
  }

  let stats = {}, team = {}, leads = { leads: [], total: 0 }, activities = [];
  try {
    const [s, t, l, a] = await Promise.all([
      getLeadStats(config.apiKey),
      getTeamStats(config.apiKey),
      getAllMyLeads(config.apiKey, { scope: config.scope }),
      getActivities(config.apiKey),
    ]);
    stats = s?.error ? {} : s;
    team = t?.error ? {} : t;
    leads = l?.error ? { leads: [], total: 0 } : l;
    activities = Array.isArray(a) ? a : [];
  } catch (err) {
    console.error(`Falha ao consultar CRM: ${err.message}`);
    appendRunLog(config.logDir, { ts: new Date().toISOString(), status: "crm_error", error: err.message });
    process.exitCode = 1;
    return;
  }

  let text;
  if (config.useBrain && (await brainAvailable())) {
    try {
      const out = await synthesizeManagerBrief({ stats, team, leads, activities }, { today });
      text = `# Pipeline Comercial — Gerente (Gemma 4)\n\nData: ${today}\n\n${out.text}`;
    } catch (err) {
      console.error(`Gemma falhou, usando fallback: ${err.message}`);
      text = fallbackBrief({ stats, team, leads, activities });
    }
  } else {
    text = fallbackBrief({ stats, team, leads, activities });
  }

  const outPath = path.join(config.outputDir, `daily_pipeline_${today}.md`);
  fs.writeFileSync(outPath, text, "utf8");
  console.log(`Pipeline salvo: ${outPath}`);
  appendRunLog(config.logDir, {
    ts: new Date().toISOString(),
    status: "ok",
    uncontacted: leads.leads.filter((l) => l._isUncontacted).length,
    total: leads.total,
    path: outPath,
  });
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
