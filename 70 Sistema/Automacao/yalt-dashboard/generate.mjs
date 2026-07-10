#!/usr/bin/env node
/**
 * yalt-dashboard/generate.mjs
 *
 * Gera um snapshot estático do pipeline comercial da Yalt para o site interno
 * (deploy via GitHub Pages em /yalt/). Reaproveita a lib de cliente do CRM
 * em ../commercial-crm/lib/yalt.mjs — não reimplementa HTTP.
 *
 * Sem API key no browser: o snapshot é gerado em build-time (CI ou local)
 * e embutido como HTML estático. O repositório é público, então NUNCA
 * embutir a chave no cliente.
 *
 * Dependências:
 *   yaltHealth()        — dura (sai 1 se falhar)
 *   getLeadStats(api)   — dura (sem isso não há funil; sai 1 se falhar)
 *   getTeamStats(api)   — mole (se falhar, omite seção, loga aviso)
 *   5x yaltRequest status filter — mole por estágio (funil parcial se algum falhar)
 *
 * Flags: --dry-run (não escreve), --print (mostra no stdout), --out <path>
 * Exit: 0 ok · 1 falha dura (health ou leadStats) · 2 args/escrita.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  yaltHealth,
  yaltRequest,
  getLeadStats,
  getTeamStats,
} from "../commercial-crm/lib/yalt.mjs";
import { renderDashboard } from "./lib/render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DEFAULT = path.resolve(__dirname, "..", "..", "..", "_dist", "yalt", "index.html");
const LOG_DIR = path.join(__dirname, "logs");
const STATUSES = ["to-prospect", "approaching", "send-proposal", "negociation", "later"];

const REQ_TIMEOUT_MS = 15_000;

function parseArgs(argv) {
  const out = argv.find((a) => a.startsWith("--out="))?.slice(6);
  return {
    dryRun: argv.includes("--dry-run"),
    print: argv.includes("--print") || argv.includes("--dry-run"),
    out: out ? path.resolve(out) : OUT_DEFAULT,
  };
}

/** Timeout wrapper em torno de uma promise (AbortController não é usado pelo yalt.mjs). */
function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${ms}ms em ${label}`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function appendRunLog(entry) {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const file = path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.log`);
    fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    /* best-effort */
  }
}

async function fetchFunnel(apiKey) {
  const funnel = {};
  for (const status of STATUSES) {
    try {
      const r = await withTimeout(
        yaltRequest("GET", `/v1/api/leads?status=${status}&limit=500`, apiKey),
        REQ_TIMEOUT_MS,
        `leads?status=${status}`
      );
      if (r.ok) {
        funnel[status] = r.json?.total ?? r.json?.leads?.length ?? 0;
      } else {
        funnel[status] = 0;
        console.error(`[YALT-DASH] aviso: status ${status} falhou (${r.statusCode})`);
      }
    } catch (err) {
      funnel[status] = 0;
      console.error(`[YALT-DASH] aviso: status ${status} erro: ${err.message}`);
    }
  }
  return funnel;
}

/** Contagens agregadas de follow-up por faixa (sem dado nominal). */
async function fetchFollowup(apiKey) {
  const bands = { b0_7: 0, b8_30: 0, b31_90: 0, b90plus: 0 };
  try {
    const r = await withTimeout(
      yaltRequest("GET", "/v1/api/activities?limit=500", apiKey),
      REQ_TIMEOUT_MS,
      "activities"
    );
    if (!r.ok) return bands;
    const acts = r.json?.data || r.json?.activities || [];
    if (!Array.isArray(acts)) return bands;
    const now = Date.now();
    for (const a of acts) {
      const due = a.due_date || a.scheduled_for || a.follow_up_at;
      if (!due) continue;
      const days = (now - new Date(due).getTime()) / 86_400_000;
      if (days < 0) continue;
      if (days <= 7) bands.b0_7++;
      else if (days <= 30) bands.b8_30++;
      else if (days <= 90) bands.b31_90++;
      else bands.b90plus++;
    }
  } catch (err) {
    console.error(`[YALT-DASH] aviso: follow-up erro: ${err.message}`);
  }
  return bands;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.YALT_API_KEY;
  const ranAt = new Date().toISOString();

  if (!apiKey) {
    console.error("[YALT-DASH] YALT_API_KEY ausente — defina a env var.");
    process.exitCode = 1;
    return;
  }

  // 1) health (dura)
  let health;
  try {
    health = await withTimeout(yaltHealth(), REQ_TIMEOUT_MS, "health");
  } catch (err) {
    health = { ok: false, error: err.message };
  }
  if (!health.ok) {
    console.error(`[YALT-DASH] CRM indisponível (health): ${health.error || health.statusCode}`);
    appendRunLog({ ts: ranAt, status: "health_fail", detail: health.error || health.statusCode });
    process.exitCode = 1;
    return;
  }

  // 2) leadStats (dura)
  let leadStats;
  try {
    leadStats = await withTimeout(getLeadStats(apiKey), REQ_TIMEOUT_MS, "leadStats");
  } catch (err) {
    leadStats = { error: err.message };
  }
  if (leadStats.error) {
    console.error(`[YALT-DASH] leadStats falhou: ${leadStats.error}`);
    appendRunLog({ ts: ranAt, status: "leadstats_fail", detail: leadStats.error });
    process.exitCode = 1;
    return;
  }

  // 3) teamStats (mole)
  let teamStats = null;
  try {
    const ts = await withTimeout(getTeamStats(apiKey), REQ_TIMEOUT_MS, "teamStats");
    if (!ts.error) teamStats = Array.isArray(ts) ? ts : ts.data || ts.team || null;
  } catch (err) {
    console.error(`[YALT-DASH] aviso: teamStats erro: ${err.message}`);
  }

  // 4) funnel + followup (moles por estágio)
  const [funnel, followup] = await Promise.all([
    fetchFunnel(apiKey),
    fetchFollowup(apiKey),
  ]);

  const data = {
    generatedAt: ranAt,
    leadStats: {
      new: leadStats.new ?? leadStats.total_new ?? 0,
      inadequate: leadStats.inadequate ?? leadStats.total_inadequate ?? 0,
      closed: leadStats.closed ?? leadStats.total_closed ?? 0,
      lost: leadStats.lost ?? leadStats.total_lost ?? 0,
      total: leadStats.total ?? leadStats.total_leads ?? 0,
    },
    teamStats,
    funnel,
    followup,
  };

  const html = renderDashboard(data);

  if (args.print) console.log("\n" + html + "\n");

  if (args.dryRun) {
    console.error("[YALT-DASH] Dry-run: HTML NÃO escrito.");
    appendRunLog({ ts: ranAt, status: "dry_run_ok", leadStats: data.leadStats, funnel, followup });
    return;
  }

  // Só escreve se os dados obrigatórios completos (funil com pelo menos 1 estágio resolvido)
  const funnelResolved = STATUSES.some((s) => (data.funnel[s] ?? 0) > 0 || data.funnel[s] === 0);
  if (!funnelResolved) {
    console.error("[YALT-DASH] dados incompletos — HTML não escrito (evita página pela metade).");
    process.exitCode = 1;
    return;
  }

  try {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, html, "utf8");
    console.error(`[YALT-DASH] Dashboard escrito: ${args.out}`);
    appendRunLog({ ts: ranAt, status: "written", out: args.out, leadStats: data.leadStats });
  } catch (err) {
    console.error(`[YALT-DASH] falha ao escrever: ${err.message}`);
    process.exitCode = 2;
  }
}

main();
