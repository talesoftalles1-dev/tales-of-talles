// Cliente do Yalt Sales CRM — camada fina sobre a API Supabase Edge.
// Sem segredos hardcoded: a chave vem de env (YALT_API_KEY) ou config.json (gitignored).
import { extractTrueLocationCount } from "./crm_normalize.mjs";

const BASE = "https://portal.sales-crm.yalt.co/functions/v1";

export async function yaltHealth() {
  try {
    const res = await fetch(`${BASE}/v1/health`, { method: "GET" });
    return { ok: res.ok, statusCode: res.status, body: await res.text() };
  } catch (err) {
    return { ok: false, statusCode: null, error: err?.code || err?.message || String(err) };
  }
}

export async function yaltRequest(method, apiPath, apiKey, body) {
  if (!apiKey) throw new Error("YALT_API_KEY ausente — defina a env var ou config.json");
  const url = `${BASE}${apiPath}`;
  const headers = { "x-api-key": apiKey, "Content-Type": "application/json" };
  const init = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* mantém texto */ }
  return { ok: res.ok, statusCode: res.status, json, text };
}

export async function getLeadStats(apiKey) {
  const r = await yaltRequest("GET", "/v1/api/stats/leads", apiKey);
  return r.ok ? r.json : { error: r.text };
}

export async function getTeamStats(apiKey) {
  const r = await yaltRequest("GET", "/v1/api/stats/team", apiKey);
  return r.ok ? r.json : { error: r.text };
}

export async function getActivities(apiKey, limit = 50) {
  const r = await yaltRequest("GET", `/v1/api/activities?limit=${limit}`, apiKey);
  return r.ok ? (r.json?.data || r.json || []) : { error: r.text };
}

// Leads do escopo (mine|all). Sem filtro de status no servidor porque
// status=null deve ser tratado como 'new' (ver SKILL yalt-crm). Filtramos client-side.
export async function getMyLeads(apiKey, { scope = "mine", limit = 200 } = {}) {
  const r = await yaltRequest("GET", `/v1/api/leads?scope=${scope}&limit=${limit}`, apiKey);
  // Formato real: { leads:[...], total, limit, offset, hasMore }
  const raw = r.ok ? (r.json?.leads || r.json?.data || []) : [];
  if (!Array.isArray(raw)) return { error: r.text, leads: [], total: 0 };
  const leads = raw.map((l) => ({
    ...l,
    _isUncontacted: l.status === null || l.status === "new",
    _locationCount: extractTrueLocationCount(l.chainInfo),
  }));
  return { leads, total: r.json?.total ?? leads.length };
}

// Busca TODOS os leads do scope (pagina até acabar hasMore). Útil para volumes >200.
export async function getAllMyLeads(apiKey, { scope = "mine", pageSize = 200 } = {}) {
  let all = [];
  let offset = 0;
  let total = 0;
  for (;;) {
    const r = await yaltRequest("GET", `/v1/api/leads?scope=${scope}&limit=${pageSize}&offset=${offset}`, apiKey);
    if (!r.ok) return { error: r.text, leads: all, total };
    const arr = r.json?.leads || [];
    total = r.json?.total ?? total;
    const mapped = arr.map((l) => ({
      ...l,
      _isUncontacted: l.status === null || l.status === "new",
      _locationCount: extractTrueLocationCount(l.chainInfo),
    }));
    all = all.concat(mapped);
    if (!r.json?.hasMore || arr.length < pageSize) break;
    offset += pageSize;
  }
  return { leads: all, total };
}

// Lista contatos de um lead (esquema real: lead_id, first_name, last_name,
// position, phone1, phone2, email, linkedin, kaspr_data, lusha_data).
export async function getLeadContacts(apiKey, leadId, { limit = 50 } = {}) {
  const r = await yaltRequest("GET", `/v1/api/lead_contacts?lead_id=${leadId}&limit=${limit}`, apiKey);
  const arr = r.ok ? (r.json?.lead_contacts || r.json?.data || []) : [];
  return Array.isArray(arr) ? arr : [];
}

// Enriquecimento de um contato de lead via Lusha/Kaspr (endpoints do CRM).
// Nota: pode retornar 500 se o provedor (Lusha/Kaspr) não estiver contratado/ativado.
export async function enrichContact(apiKey, contactId, provider = "lusha") {
  const path = `/v1/api/lead_contacts/${contactId}/enrich-${provider}`;
  return yaltRequest("POST", path, apiKey);
}

/**
 * Cria um RASCUNHO de email no CRM (NÃO envia). O Operador revisa e dispara.
 * Endpoint: POST /v1/api/emails/send  (com body vazio = rascunho/erro esperado se enviar;
 * usamos /emails/send com send=deferred quando suportado, senão geramos localmente).
 * Aqui geramos o corpo via Gemma e devolvemos; o envio real fica atrás de flag aprovada.
 */
export async function createEmailDraft(apiKey, payload) {
  // Tenta criar rascunho no CRM. Se o endpoint exigir envio imediato, este passo
  // deve ser desligado (ENVIAR_REAL=false) e o rascunho vive só localmente.
  return yaltRequest("POST", "/v1/api/emails/send", apiKey, payload);
}
