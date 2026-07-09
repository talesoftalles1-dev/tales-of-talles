/**
 * Geração de e-mails pré-cold-call.
 * Determinístico primeiro (template canônico); Gemma/Ollama personaliza o
 * parágrafo de contexto QUANDO disponível — degradação graciosa (mesmo padrão
 * do Morning Brief: Ollama offline → segue sem ruído).
 *
 * REGRA DURA (Contrato de Autoridade): este módulo só GERA rascunhos com
 * `aprovacao: pendente`. Envio acontece exclusivamente em send-approved.mjs,
 * e só para blocos que o Operador marcou `aprovacao: aprovado`.
 */
import { checkOllama, generateWithOllama } from "../../morning-brief/lib/ollama.mjs";

const TEMPLATE_PADRAO = {
  assunto: "{{empresa}} — ideia rápida de {{remetente_empresa}}",
  corpo: [
    "Olá{{saudacao_contato}},",
    "",
    "Me chamo {{remetente_nome}}, da {{remetente_empresa}}. {{paragrafo_contexto}}",
    "",
    "Vou te ligar nos próximos dias para uma conversa rápida — se preferir, é só responder este e-mail com o melhor horário.",
    "",
    "Abraço,",
    "{{remetente_nome}}",
    "{{remetente_empresa}}{{remetente_telefone}}",
  ].join("\n"),
  paragrafo_contexto_padrao:
    "Trabalhamos com empresas como a {{empresa}} e acredito que vale uma conversa curta sobre como podemos ajudar no comercial de vocês.",
};

function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

function varsFor(lead, remetente) {
  return {
    empresa: lead.businessName || "sua empresa",
    saudacao_contato: lead.contactPerson ? ` ${String(lead.contactPerson).split(" ")[0]}` : "",
    cidade: lead.city || "",
    remetente_nome: remetente.nome || "",
    remetente_empresa: remetente.empresa || "Yalt",
    remetente_telefone: remetente.telefone ? `\n${remetente.telefone}` : "",
  };
}

async function personalizarContexto(lead, remetente, ollama) {
  const prompt = [
    "Você escreve UM parágrafo curto (máx. 2 frases, PT-BR) para um e-mail comercial B2B enviado antes de uma cold call.",
    "Tom: direto, humano, sem hype, sem promessas vazias, sem emoji. Não invente fatos sobre a empresa.",
    `Empresa do destinatário: ${lead.businessName || "?"}. Cidade: ${lead.city || "?"}. Segmento/descrição: ${lead.description || "desconhecido"}.`,
    `Quem envia: ${remetente.nome || "vendedor"} da ${remetente.empresa || "Yalt"} (${remetente.proposta || "soluções comerciais"}).`,
    "Responda SÓ com o parágrafo, sem aspas e sem preâmbulo.",
  ].join("\n");
  const res = await generateWithOllama(prompt, ollama);
  const texto = String(res?.response || "").trim().replace(/\s+/g, " ");
  // Sanidade: parágrafo curto e sem restos de chain-of-thought → senão, template.
  if (!texto || texto.length < 30 || texto.length > 400 || /^(ok|claro|segue)/i.test(texto)) return null;
  return texto;
}

/**
 * Gera os rascunhos da fila do dia.
 * @returns {Array<{lead, para, assunto, corpo, personalizado}>}
 */
export async function gerarRascunhos(leads, { remetente = {}, template = {}, ollama = {} } = {}) {
  const tpl = { ...TEMPLATE_PADRAO, ...template };
  const alvo = leads.filter((l) => l.email);

  let ollamaOk = false;
  if (ollama.enabled !== false) {
    const check = await checkOllama(ollama);
    ollamaOk = check.ok;
  }

  const rascunhos = [];
  for (const lead of alvo) {
    const vars = varsFor(lead, remetente);
    let contexto = null;
    if (ollamaOk) {
      try {
        contexto = await personalizarContexto(lead, remetente, ollama);
      } catch {
        ollamaOk = false; // falhou uma vez → não insiste nos próximos (fail-fast silencioso)
      }
    }
    vars.paragrafo_contexto = contexto || fill(tpl.paragrafo_contexto_padrao, vars);
    rascunhos.push({
      lead,
      para: lead.email,
      assunto: fill(tpl.assunto, vars),
      corpo: fill(tpl.corpo, vars),
      personalizado: Boolean(contexto),
    });
  }
  return rascunhos;
}

/** Corpo texto → HTML simples para o /emails/send do CRM. */
export function corpoParaHtml(corpo) {
  const esc = corpo.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}
