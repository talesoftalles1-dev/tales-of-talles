/**
 * Cliente mínimo da API do Yalt Sales CRM (zero dependências, Node 18+).
 * Contrato de endpoints: skill `yalt-crm` (.claude/skills/yalt-crm/SKILL.md).
 * Autenticação: header `x-api-key` — a chave NUNCA vive no repo (env YALT_API_KEY).
 */

const DEFAULT_BASE = "https://portal.sales-crm.yalt.co/functions/v1";

export function crmConfigFromEnv(config = {}) {
  const apiKey = process.env.YALT_API_KEY || config.yaltApiKey || "";
  const base = process.env.YALT_API_BASE || config.yaltApiBase || DEFAULT_BASE;
  if (!apiKey) {
    throw new Error(
      "YALT_API_KEY ausente — exporte a variável de ambiente (nunca gravar a chave no repo; ver Chapter 28 — Security & Secrets Runbook)",
    );
  }
  return { apiKey, base };
}

async function request(crm, method, apiPath, body) {
  const url = `${crm.base}${apiPath}`;
  const res = await fetch(url, {
    method,
    headers: {
      "x-api-key": crm.apiKey,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* corpo não-JSON — mantém texto cru no erro */
  }
  if (!res.ok) {
    const detail = json?.error || json?.details || text.slice(0, 300);
    throw new Error(`CRM ${method} ${apiPath} → ${res.status}: ${detail}`);
  }
  return json;
}

export const crmGet = (crm, apiPath) => request(crm, "GET", apiPath);
export const crmPost = (crm, apiPath, body) => request(crm, "POST", apiPath, body);
export const crmPut = (crm, apiPath, body) => request(crm, "PUT", apiPath, body);

/** Lista leads paginando até `max` (a API usa limit/offset). */
export async function listLeads(crm, { max = 2000, pageSize = 200, extraQuery = "" } = {}) {
  const leads = [];
  for (let offset = 0; offset < max; offset += pageSize) {
    const page = await crmGet(
      crm,
      `/v1/api/leads?limit=${pageSize}&offset=${offset}${extraQuery}`,
    );
    const items = Array.isArray(page) ? page : page?.data || page?.leads || [];
    leads.push(...items);
    if (items.length < pageSize) break;
  }
  return leads;
}

/** Atividades da organização, indexadas pela última ocorrência por lead. */
export async function lastActivityByLead(crm) {
  const res = await crmGet(crm, "/v1/api/activities");
  const items = Array.isArray(res) ? res : res?.data || res?.activities || [];
  const map = new Map();
  for (const a of items) {
    const leadId = a.leadId || a.lead_id;
    const ts = a.createdAt || a.created_at || a.date;
    if (!leadId || !ts) continue;
    const prev = map.get(leadId);
    if (!prev || String(ts) > String(prev)) map.set(leadId, String(ts));
  }
  return map;
}

/**
 * Status nulo = `new` (caveat documentado na skill: leads importados do
 * scrapper chegam sem status e NÃO podem ser excluídos dos não-contatados).
 */
export function normalizeStatus(lead) {
  return lead?.status || "new";
}
