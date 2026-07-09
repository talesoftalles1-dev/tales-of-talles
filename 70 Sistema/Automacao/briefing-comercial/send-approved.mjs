#!/usr/bin/env node
/**
 * Envia os e-mails da fila que o Operador marcou `aprovacao: aprovado`.
 *
 * ÚNICO ponto de envio do pipeline. Regra dura do Contrato de Autoridade:
 *   - `pendente`/`rejeitado`/qualquer outro valor → NUNCA envia.
 *   - Após envio, o bloco vira `aprovacao: enviado` + `enviado_em` (idempotente:
 *     rodar duas vezes não reenvia).
 *
 * Envio via API nativa do Yalt CRM (POST /v1/api/emails/send) — o e-mail fica
 * registrado na thread do lead automaticamente.
 *
 * Uso: node send-approved.mjs [--date YYYY-MM-DD] [--dry-run]
 * Requer: YALT_API_KEY no ambiente.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { todayISO } from "../morning-brief/lib/priority.mjs";
import { crmConfigFromEnv, crmPost } from "./lib/crm.mjs";
import { corpoParaHtml } from "./lib/emails.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const dateIdx = argv.indexOf("--date");
  return {
    date: dateIdx >= 0 ? argv[dateIdx + 1] : todayISO(),
    dryRun: argv.includes("--dry-run"),
  };
}

function vaultRoot() {
  return process.env.JARVIS_VAULT_ROOT || path.resolve(__dirname, "..", "..", "..");
}

/** Divide a fila em blocos `## E<n> · …` preservando o texto original. */
function parseFila(raw) {
  const partes = raw.split(/^(?=## E\d+ · )/m);
  const cabecalho = partes[0];
  const blocos = partes.slice(1).map((texto) => {
    const campo = (nome) => {
      const m = texto.match(new RegExp(`^- ${nome}: (.*)$`, "m"));
      return m ? m[1].trim() : null;
    };
    const corpoM = texto.match(/```text\n([\s\S]*?)\n```/);
    return {
      texto,
      leadId: (campo("lead_id") || "").replace(/`/g, ""),
      para: campo("para"),
      aprovacao: campo("aprovacao"),
      assunto: campo("assunto"),
      corpo: corpoM ? corpoM[1] : null,
    };
  });
  return { cabecalho, blocos };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const filaPath = path.join(vaultRoot(), "output", `fila_emails_${args.date}.md`);

  if (!fs.existsSync(filaPath)) {
    console.error(`Fila não encontrada: ${filaPath}`);
    process.exitCode = 1;
    return;
  }

  const crm = crmConfigFromEnv();
  const raw = fs.readFileSync(filaPath, "utf8").replace(/\r\n?/g, "\n");
  const { cabecalho, blocos } = parseFila(raw);

  const aprovados = blocos.filter((b) => b.aprovacao === "aprovado");
  const pendentes = blocos.filter((b) => b.aprovacao === "pendente").length;

  if (!aprovados.length) {
    console.log(`Nada a enviar — 0 aprovados (${pendentes} ainda pendentes em ${path.basename(filaPath)}).`);
    return;
  }

  let enviados = 0;
  let falhas = 0;
  const agora = new Date().toISOString().slice(0, 16).replace("T", " ");

  for (const b of aprovados) {
    if (!b.para || !b.assunto || !b.corpo || !b.leadId) {
      console.error(`Bloco malformado (lead_id=${b.leadId || "?"}) — pulado.`);
      falhas++;
      continue;
    }
    if (args.dryRun) {
      console.log(`[dry-run] enviaria → ${b.para} · "${b.assunto}"`);
      continue;
    }
    try {
      await crmPost(crm, "/v1/api/emails/send", {
        leadId: b.leadId,
        to: b.para,
        subject: b.assunto,
        bodyHtml: corpoParaHtml(b.corpo),
        bodyText: b.corpo,
        trackingEnabled: true,
      });
      b.texto = b.texto
        .replace(/^- aprovacao: aprovado$/m, "- aprovacao: enviado")
        .replace(/^(- origem_texto: .*)$/m, `$1\n- enviado_em: ${agora}`);
      enviados++;
      console.log(`Enviado → ${b.para} · "${b.assunto}"`);
    } catch (err) {
      falhas++;
      console.error(`Falha ao enviar para ${b.para}: ${err.message}`);
    }
  }

  if (!args.dryRun && enviados) {
    fs.writeFileSync(filaPath, cabecalho + blocos.map((b) => b.texto).join(""), "utf8");
  }

  console.log(
    `Resumo: ${enviados} enviado(s) · ${falhas} falha(s) · ${pendentes} pendente(s) não tocados.`,
  );
  // 0 = tudo ok · 2 = houve falha de envio (fila preservada; reexecutar é seguro)
  process.exitCode = falhas ? 2 : 0;
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exitCode = 1;
});
