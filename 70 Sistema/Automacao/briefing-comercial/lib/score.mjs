/**
 * Score comercial — adaptação do contrato de prioridade (_Spec JARVIS §8)
 * para leads do Yalt CRM. A fórmula §8 vive em morning-brief/lib/priority.mjs
 * (contrato único); aqui só se mapeiam campos do CRM para os fatores dela.
 *
 * score = importancia×10 + urgência(nextFollowUp) + valor_estrategico×8 + bônus
 * Porteiro (§8): lead em estado terminal não entra no ranking — desbloqueia-se,
 * não se prioriza o inexecutável.
 */
import { urgencyScore, toDate } from "../../morning-brief/lib/priority.mjs";
import { normalizeStatus } from "./crm.mjs";

/** priority do CRM → importancia (1–3) */
const IMPORTANCIA = { high: 3, medium: 2, low: 1 };

/** estágio do funil → valor_estrategico (1–3): quanto mais perto do fechamento, maior o "porquê" */
const VALOR_ESTRATEGICO = {
  negociation: 3,
  "send-proposal": 3,
  approaching: 2,
  "to-prospect": 1,
  new: 1,
  later: 1,
};

const TERMINAIS = new Set(["closed", "lost", "inadequate"]);

export function isBlockedLead(lead, today) {
  const status = normalizeStatus(lead);
  if (TERMINAIS.has(status)) return true;
  // `later` = adiado deliberadamente: só volta ao ranking quando o follow-up vence.
  if (status === "later") {
    const fu = toDate(lead.nextFollowUp);
    if (!fu) return true;
    return fu > toDate(today);
  }
  return false;
}

export function daysSince(iso, today) {
  const d = toDate(iso);
  const t = toDate(today);
  if (!d || !t) return null;
  return Math.floor((t - d) / 86400000);
}

/**
 * @param lead lead do CRM
 * @param opts.today YYYY-MM-DD
 * @param opts.lastActivity ISO da última atividade do lead (ou null)
 * @param opts.diasEsfriando limiar de esfriamento (default 14)
 */
export function leadScore(lead, { today, lastActivity = null, diasEsfriando = 14 }) {
  const status = normalizeStatus(lead);
  const importancia = IMPORTANCIA[lead.priority] ?? 1;
  const urgencia = urgencyScore(lead.nextFollowUp, today);
  const valorEstrategico = VALOR_ESTRATEGICO[status] ?? 1;

  // Bônus (teto 2, espelha o bônus_energia da §8):
  // lead esfriando (sem atividade há >= limiar) ou nunca contatado sobe na fila.
  let bonus = 0;
  const idle = daysSince(lastActivity, today);
  const nuncaContatado = status === "new" && !lastActivity;
  if (nuncaContatado) bonus = 2;
  else if (idle !== null && idle >= diasEsfriando) bonus = 2;

  const score = importancia * 10 + urgencia + valorEstrategico * 8 + bonus;

  const motivos = [];
  if (urgencia >= 12) motivos.push("follow-up vencido/hoje");
  else if (urgencia >= 8) motivos.push("follow-up ≤3 dias");
  if (valorEstrategico === 3) motivos.push(`funil quente (${status})`);
  if (nuncaContatado) motivos.push("nunca contatado");
  else if (bonus === 2) motivos.push(`esfriando (${idle}d sem atividade)`);
  if (lead.priority === "high") motivos.push("prioridade alta no CRM");

  return { score, status, motivos };
}
