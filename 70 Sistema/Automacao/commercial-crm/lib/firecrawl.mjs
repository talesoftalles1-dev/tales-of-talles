/**
 * JARVIS Commercial CRM — Firecrawl web-enrich client (REST, mínimo).
 * Preenche lacunas de enriquecimento (decisor / linkedin / email) via web.
 * Chave SÓ em env FIRECRAWL_API_KEY — nunca hardcoded/commitado.
 * Uso parcimonioso: só para leads com lacuna real e atrás de flag.
 */
const BASE = "https://api.firecrawl.dev/v2";

async function fcSearch(apiKey, query, limit = 3) {
  const r = await fetch(`${BASE}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok || !json.success) return { ok: false, error: json.error || `HTTP ${r.status}` };
  return { ok: true, results: (json.data?.web || []).map((x) => ({ url: x.url, title: x.title, description: x.description })) };
}

/**
 * Tenta encontrar decisor (nome/cargo) + linkedin + email para um lead, via busca web.
 * Retorna campos encontrados ou {}. Não inventa: só extrai do que a web devolve.
 */
export async function enrichWebDecisor(apiKey, lead) {
  const name = lead.businessName || "";
  const loc = lead.city ? ` ${lead.city}` : "";
  const q = `${name}${loc} founder OR owner OR director linkedin`;
  const s = await fcSearch(apiKey, q, 3);
  if (!s.ok) return { ok: false, error: s.error };
  let decisionName = null, decisionTitle = null, linkedin = null;
  for (const r of s.results) {
    const blob = `${r.title} ${r.description} ${r.url}`;
    const li = blob.match(/https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[^\s)"']+/i);
    if (li && !linkedin) linkedin = li[0];
    const m = blob.match(/(CEO|founder|owner|director|gerente|diretor|head of)[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/i);
    if (m && !decisionName) { decisionName = m[2].trim(); decisionTitle = m[1].trim(); }
  }
  return { ok: true, decisionName, decisionTitle, linkedin, sources: s.results.map((r) => r.url) };
}

export { fcSearch };
