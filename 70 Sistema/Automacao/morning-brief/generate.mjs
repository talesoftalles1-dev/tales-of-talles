#!/usr/bin/env node
/**
 * JARVIS Morning Brief — gerador local-first (Path 2)
 * Lê o vault, aplica contratos de prioridade, publica no Slack #daily.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildMorningBrief } from "./lib/brief.mjs";
import { initDebugLog, logDebug, logInfo } from "./lib/logger.mjs";
import {
  alreadyPostedToday,
  loadPostState,
  publishToSlack,
  saveBriefLocally,
  savePostState,
} from "./lib/slack.mjs";
import { todayISO } from "./lib/priority.mjs";
import { loadVault } from "./lib/vault.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    noSlack: argv.includes("--no-slack"),
    print: argv.includes("--print") || argv.includes("--dry-run"),
  };
}

function loadConfig() {
  const configPath = path.join(__dirname, "config.json");
  const defaults = {
    vaultRoot: path.resolve(__dirname, "..", "..", ".."),
    outputDir: path.join(__dirname, "output"),
    stateFile: path.join(__dirname, "state", "last-post.json"),
    logDir: path.join(__dirname, "logs"),
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || "",
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || "",
    slackBotToken: process.env.SLACK_BOT_TOKEN || "",
    slackChannel: process.env.SLACK_CHANNEL || "#daily",
  };

  if (!fs.existsSync(configPath)) return defaults;

  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return {
    vaultRoot: raw.vaultRoot || defaults.vaultRoot,
    outputDir: raw.outputDir || defaults.outputDir,
    stateFile: raw.stateFile || defaults.stateFile,
    logDir: raw.logDir || defaults.logDir,
    n8nWebhookUrl: raw.n8nWebhookUrl || defaults.n8nWebhookUrl,
    slackWebhookUrl: raw.slackWebhookUrl || defaults.slackWebhookUrl,
    slackBotToken: raw.slackBotToken || defaults.slackBotToken,
    slackChannel: raw.slackChannel || defaults.slackChannel,
  };
}

function appendRunLog(logDir, entry) {
  fs.mkdirSync(logDir, { recursive: true });
  const file = path.join(logDir, `${todayISO()}.log`);
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, "utf8");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig();
  initDebugLog(config.vaultRoot);
  const today = todayISO();
  const runId = args.dryRun ? "dry-run" : "post-fix";

  // #region agent log
  logDebug({
    hypothesisId: "H1",
    location: "generate.mjs:main",
    message: "pipeline start",
    data: { today, vaultRoot: config.vaultRoot, args },
  });
  // #endregion

  logInfo(`JARVIS Morning Brief — ${today}`);

  const state = loadPostState(config.stateFile);
  if (alreadyPostedToday(state, today, args.force)) {
    logInfo("Brief já publicado hoje — use --force para republicar");
    appendRunLog(config.logDir, { ts: new Date().toISOString(), status: "skipped_duplicate", date: today });
    process.exitCode = 0;
    return;
  }

  let vault;
  try {
    vault = loadVault(config.vaultRoot);
    // #region agent log
    logDebug({
      hypothesisId: "H1",
      location: "generate.mjs:loadVault",
      message: "vault loaded",
      data: { notes: vault.notes.length, tasks: vault.tasks.length },
    });
    // #endregion
  } catch (err) {
    // #region agent log
    logDebug({
      hypothesisId: "H2",
      location: "generate.mjs:loadVault",
      message: "vault load failed",
      data: { error: String(err.message) },
    });
    // #endregion
    logInfo(`Falha ao ler vault: ${err.message}`);
    appendRunLog(config.logDir, { ts: new Date().toISOString(), status: "vault_error", error: err.message });
    process.exitCode = 1;
    return;
  }

  const brief = buildMorningBrief(vault, { today });

  // #region agent log
  logDebug({
    hypothesisId: "H4",
    location: "generate.mjs:buildBrief",
    message: "brief built",
    data: {
      top3: brief.top3.length,
      risks: brief.risks.length,
      commercial: brief.commercial.length,
      projects: brief.projects.length,
      todayItems: brief.today.length,
    },
  });
  // #endregion

  const savedPath = saveBriefLocally(brief.text, config.outputDir, today);
  logInfo(`Brief salvo localmente: ${savedPath}`);

  if (args.print) {
    console.log("\n" + brief.text + "\n");
  }

  if (args.noSlack || args.dryRun) {
    logInfo(args.dryRun ? "Dry-run: publicação Slack ignorada" : "Modo --no-slack: publicação ignorada");
    appendRunLog(config.logDir, {
      ts: new Date().toISOString(),
      status: args.dryRun ? "dry_run_ok" : "saved_only",
      path: savedPath,
    });
    return;
  }

  try {
    const result = await publishToSlack(brief.text, config, {
      dryRun: args.dryRun,
      date: today,
      runId,
    });
    if (!args.dryRun) {
      savePostState(config.stateFile, {
        date: today,
        posted: true,
        ts: new Date().toISOString(),
        slack: result.method || "unknown",
      });
    }
    logInfo(args.dryRun ? "Dry-run concluído" : "Publicado no Slack #daily");
    appendRunLog(config.logDir, {
      ts: new Date().toISOString(),
      status: args.dryRun ? "dry_run_ok" : "posted",
      path: savedPath,
      slack: result,
    });
  } catch (err) {
    // #region agent log
    logDebug({
      hypothesisId: "H3",
      location: "generate.mjs:slack",
      message: "slack publish failed",
      data: { error: String(err.message), savedPath },
    });
    // #endregion
    logInfo(`Slack indisponível: ${err.message}`);
    logInfo(`Brief preservado em ${savedPath}`);
    appendRunLog(config.logDir, {
      ts: new Date().toISOString(),
      status: "slack_failed",
      error: err.message,
      path: savedPath,
    });
    // Entrega falhou, mas o brief foi salvo localmente (falha segura).
    // Exit 2 = "gerado mas não entregue" (contrato documentado no Spec/Runbook);
    // distinto de exit 0 (ok) e exit 1 (vault inacessível). NÃO é crash.
    process.exitCode = 2;
  }
}

main().catch((err) => {
  logInfo(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
