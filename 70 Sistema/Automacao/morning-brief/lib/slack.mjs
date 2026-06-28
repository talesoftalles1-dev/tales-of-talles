import fs from "node:fs";
import path from "node:path";
import { logDebug, logInfo } from "./logger.mjs";

export async function publishToSlack(text, config, meta = {}) {
  const { n8nWebhookUrl, slackWebhookUrl, slackBotToken, slackChannel } = config;

  // n8n = mecanismo de entrega aprovado (credencial Slack fica na cloud)
  if (n8nWebhookUrl) {
    return postN8nWebhook(n8nWebhookUrl, text, config, meta);
  }

  if (slackWebhookUrl) {
    return postSlackIncomingWebhook(slackWebhookUrl, text, meta);
  }

  if (slackBotToken && slackChannel) {
    return postBotMessage(slackBotToken, slackChannel, text, meta);
  }

  throw new Error(
    "Entrega não configurada: defina n8nWebhookUrl (recomendado) OU slackWebhookUrl OU (slackBotToken + slackChannel) em config.json"
  );
}

async function postN8nWebhook(url, text, config, meta) {
  // #region agent log
  logDebug({
    hypothesisId: "H3",
    location: "slack.mjs:postN8nWebhook",
    message: "posting via n8n delivery webhook",
    data: { chars: text.length, dryRun: meta.dryRun ?? false, runId: meta.runId ?? "pre-fix" },
  });
  // #endregion

  if (meta.dryRun) {
    logInfo("DRY RUN — n8n webhook não chamado");
    return { ok: true, dryRun: true, method: "n8n" };
  }

  const payload = {
    text,
    date: meta.date,
    source: "jarvis-morning-brief",
    channel: config.slackChannel || "#daily",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`n8n webhook falhou (${res.status}): ${body}`);
  }

  let responseBody = null;
  try {
    responseBody = await res.json();
  } catch {
    responseBody = { raw: await res.text().catch(() => "") };
  }

  // #region agent log
  logDebug({
    hypothesisId: "H3",
    location: "slack.mjs:postN8nWebhook",
    message: "n8n delivery success",
    data: { status: res.status, responseBody, runId: meta.runId ?? "post-fix" },
  });
  // #endregion

  return { ok: true, method: "n8n", response: responseBody };
}

async function postSlackIncomingWebhook(url, text, meta) {
  // #region agent log
  logDebug({
    hypothesisId: "H3",
    location: "slack.mjs:postSlackIncomingWebhook",
    message: "posting via slack incoming webhook",
    data: { chars: text.length, dryRun: meta.dryRun ?? false, runId: meta.runId ?? "pre-fix" },
  });
  // #endregion

  if (meta.dryRun) {
    logInfo("DRY RUN — Slack webhook não chamado");
    return { ok: true, dryRun: true };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Slack webhook falhou (${res.status}): ${body}`);
  }

  return { ok: true, method: "slack-webhook" };
}

async function postBotMessage(token, channel, text, meta) {
  // #region agent log
  logDebug({
    hypothesisId: "H3",
    location: "slack.mjs:postBotMessage",
    message: "posting via bot token",
    data: { channel, chars: text.length, dryRun: meta.dryRun ?? false },
  });
  // #endregion

  if (meta.dryRun) {
    logInfo("DRY RUN — Slack bot API não chamada");
    return { ok: true, dryRun: true };
  }

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text, mrkdwn: false }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack API falhou: ${data.error || "unknown"}`);
  }

  return { ok: true, method: "bot", ts: data.ts };
}

export function saveBriefLocally(text, outputDir, date) {
  fs.mkdirSync(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${date}-morning-brief.txt`);
  fs.writeFileSync(filePath, text, "utf8");
  return filePath;
}

export function loadPostState(stateFile) {
  if (!fs.existsSync(stateFile)) return null;
  try {
    return JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch {
    return null;
  }
}

export function savePostState(stateFile, payload) {
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(payload, null, 2), "utf8");
}

export function alreadyPostedToday(state, date, force) {
  if (force) return false;
  return state?.date === date && state?.posted === true;
}
