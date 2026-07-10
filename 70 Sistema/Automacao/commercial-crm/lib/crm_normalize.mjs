// Normalização de campos com known data-quality issues no CRM Yalt (ver SKILL yalt-crm).

// chainInfo é armazenado como objeto indexado por char ("0":"{","1":"\"",...)
// e precisa ser reconstruído ( join em ordem de chave ) antes de JSON.parse.
export function extractTrueLocationCount(chainInfo) {
  if (!chainInfo || typeof chainInfo !== "object") return 0;
  if ("0" in chainInfo) {
    const s = Object.keys(chainInfo)
      .map((k) => chainInfo[k])
      .join("");
    try {
      const parsed = JSON.parse(s);
      return Number(parsed.locationCount ?? parsed.locationsCount ?? 0);
    } catch {
      return 0;
    }
  }
  return Number(chainInfo.locationCount ?? chainInfo.locationsCount ?? 0);
}

// status null == new (nunca contactado)
export function isUncontacted(lead) {
  return lead.status === null || lead.status === "new";
}
