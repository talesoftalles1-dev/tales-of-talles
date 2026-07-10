// Cérebro do "Gerente" — usa Gemma 4 local (Ollama) para síntese comercial.
// Reaproveita a lib Ollama do morning-brief (mesmo modelo/host/port padrão).
import { checkOllama, generateWithOllama } from "../../morning-brief/lib/ollama.mjs";

const MODEL = process.env.JARVIS_BRAIN_MODEL || "gemma4";
const HOST = process.env.OLLAMA_HOST || "localhost";
const PORT = Number(process.env.OLLAMA_PORT || "11434");

export async function brainAvailable() {
  const a = await checkOllama({ host: HOST, port: PORT });
  return a.ok;
}

function compactLeads(leads, max) {
  return leads.slice(0, max).map((l) => ({
    nome: l.businessName,
    status: l.status ?? "new",
    prio: l.priority,
    city: l.city ?? "",
    loc: l._locationCount,
  }));
}

// Achata o stats do CRM (que traz por-user) para só números úteis ao Gerente.
function slimStats(stats) {
  if (!stats || typeof stats !== "object") return {};
  if (stats.stats) return stats.stats; // formato /stats/leads
  if (stats.counts) return stats;
  // stats/team é por-user; extrai só totais se houver
  return { raw_users: Object.keys(stats).length };
}

export async function synthesizeManagerBrief({ stats, team, leads, activities }, { today }) {
  // Aceita leads como array OU {leads, total} (getMyLeads).
  const leadArr = Array.isArray(leads) ? leads : leads?.leads ?? [];
  const uncontacted = leadArr.filter((l) => l._isUncontacted);
  // Só top-10 para o Gemma (latência): prioriza high + chains.
  const topUncontacted = uncontacted
    .sort((a, b) => (b.priority === "high") - (a.priority === "high") || b._locationCount - a._locationCount)
    .slice(0, 10);
  const actArr = Array.isArray(activities) ? activities.slice(0, 10) : [];

  const prompt =
    `Você é o "Gerente" comercial do JARVIS. Briefing diário em PT-BR, máx 200 palavras, tom executivo.\\n\\n` +
    `REGRAS: não invente dados; use só os fornecidos.\\n` +
    `- "Contatos de hoje": 5-10 leads nunca contactados (status new/null), priorizando prioridade alta e chains (mais loc).\\n` +
    `- "Oportunidades": 2-3 com follow-up agendado ou pipeline quente.\\n` +
    `- "Métricas": resumo numérico.\\n\\n` +
    `DATA: ${today}\\n` +
    `MÉTRICAS: ${JSON.stringify(slimStats(stats))}\\n` +
    `NUNCA CONTACTADOS (${uncontacted.length} de ${leadArr.length}): ${JSON.stringify(compactLeads(topUncontacted, 10))}\\n` +
    `ATIVIDADES: ${JSON.stringify(actArr)}`;

  const { response: text } = await generateWithOllama(prompt, {
    model: MODEL,
    host: HOST,
    port: PORT,
    stream: false,
  });
  return { text: String(text || "").trim(), model: MODEL };
}
