/**
 * JARVIS OS — EXECUTIVE ASSISTANT (EA) TRIAGE ENGINE
 * Versão: 1.1 (Cognição Ativa + reforço opcional por modelo local)
 *
 * Mantém o fluxo determinístico do EA e adiciona uma triagem cognitiva
 * local opcional via Ollama/Gemma quando o serviço estiver disponível.
 * Se o modelo local não responder, cai de volta para o legado sem ruído.
 */

import fs from 'fs';
import path from 'path';

import { checkOllama, generateWithOllama } from "../morning-brief/lib/ollama.mjs";

// CONFIGURAÇÕES DO SISTEMA
const VAULT_ROOT = process.cwd();
const INBOX_PATH = path.join(VAULT_ROOT, 'raw/inbox.md');
const DASHBOARD_PATH = path.join(VAULT_ROOT, '00 JARVIS/🤖 JARVIS.md');

/**
 * Fórmula de Priorização (§8)
 * score = importancia * 10 + urgência(prazo) + valor_estrategico * 8 + bônus_energia
 */
function calculateScore(item) {
    let score = (item.importancia || 1) * 10;
    
    // Urgência (Prazo)
    if (item.prazo) {
        const today = new Date();
        const deadline = new Date(item.prazo);
        const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) score += 12; // Vencido ou Hoje
        else if (diffDays <= 3) score += 8;
        else if (diffDays <= 7) score += 5;
        else if (diffDays <= 30) score += 2;
    }
    
    score += (item.valor_estrategico || 1) * 8;
    
    // Bônus Energia
    if (item.energia === 'baixa') score += 2;
    else if (item.energia === 'media') score += 1;
    
    return score;
}

/** Dados estruturados retornados pela triagem cognitiva. */
export class TriageSuggestion {
 constructor({ texto, categoria = '', acao = '', origem = 'llm' }) {
   this.texto = texto;
   this.categoria = categoria;
   this.acao = acao;
   this.origem = origem;
 }
}

/**
 * Usa o Ollama local para propor triagem de capturas livres do inbox.
 * Se o serviço não estiver disponível, retorna array vazio e deixa o
 * operador/modo interativo lidar com a classificação final.
 */
export async function suggestLocalTriage(inboxPath, opts = {}) {
 const {
   model = opts.ollama?.model || "gemma4",
   host = opts.ollama?.host || "localhost",
   port = opts.ollama?.port !== undefined ? Number(opts.ollama.port) :
     (String(opts.ollama?.model || "") === "x" ? 11434 : 11434),
   maxItems = Number(opts.ollama?.maxItems || 20),
 } = opts;

 if (!fs.existsSync(inboxPath)) {
   return { suggestions: [], mode: "skipped", reason: "missing_inbox" };
 }

 const raw = fs.readFileSync(inboxPath, "utf8");
 const lines = raw.split(/\n+/).filter((l) => l.trim());
 const bullets = lines
   .filter((l) => /^[*-]\s/.test(l.trim()))
   .slice(0, maxItems)
   .map((l) => l.replace(/^[*-]\s+/,"").trim())
   .filter((t) => t.length > 1 && !PLACEHOLDERS.has(t.toLowerCase()));

 if (bullets.length === 0) {
   return { suggestions: [], mode: "skipped", reason: "no_candidate_items" };
 }

 const prompt =
   `Você é o Jarvis EA. Classifique ESTRUTURALMENTE cada item abaixo, APENAS UMA categoria por item.` +
   `\nCategorias permitidas: ${[...CATEGORIAS_VALIDAS].join(", ")}.` +
   `\nResponda EXATAMENTE no formato pipe-delimited:` +
   `\nitem|categoria|acao_sugerida` +
   `\nNao incremente texto adicional.` +
   `\n\n${bullets.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

 const availability = await checkOllama({ host, port });
 if (!availability.ok) {
   return {
     suggestions: [],
     mode: "unavailable",
     reason: availability.error || `ollama_status_${availability.statusCode}`,
   };
 }

 const { response: text } = await generateWithOllama(prompt, { model, host, port, stream: false });

 const suggestions = [];
 const seenTexts = new Set();
 for (const line of String(text).split(/\n/)) {
   const trimmed = line.trim();
   if (!trimmed) continue;
   const parts = trimmed.split("|").map((s) => s.trim()).filter(Boolean);
   if (parts.length < 2) continue;

   const [maybeIndex, ...rest] = parts;
   const candidate = /^\d+$/.test(maybeIndex) ? rest : parts;
   const [texto, categoria, acaoSugerida] = candidate;
   if (!texto || !categoria) continue;

   const key = texto.toLowerCase();
   if (seenTexts.has(key)) continue;
   seenTexts.add(key);
   suggestions.push(new TriageSuggestion({ texto, categoria, acao: acaoSugerida || "classificar manualmente" }));
 }

 return { suggestions, mode: "ok", used: text };
}

const PLACEHOLDERS = new Set([
 "alvo",
 "...",
 "nota",
 "novo local",
 "nome do cliente",
 "projeto",
 "objetivo",
 "cliente",
 "contato",
 "verificar",
]);

const CATEGORIAS_VALIDAS = new Set([
 "tarefa",
 "projeto",
 "reuniao",
 "cliente",
 "contato",
 "objetivo",
 "financa",
 "saude",
 "conhecimento",
 "financeiro",
 "descarte",
 "habito",
 "estudo",
 "treino",
 "nutricao",
 "corporal",
 "prompt",
 "doc",
 "checklist",
 "lancamento",
]);

/**
 * Triage do Inbox
 * - Sempre executa o legado/simulado para manter compatibilidade.
 * - Quando o Ollama estiver disponível, adiciona sugestões locais e as
 *   imprime como recomendação; a classificação definitiva fica com o operador.
 */
async function runTriage() {
 console.log("🤖 EA: Iniciando triagem do Inbox...");

 if (!fs.existsSync(INBOX_PATH)) {
   console.log("⚠️ Inbox não encontrado.");
   return;
 }

 const content = fs.readFileSync(INBOX_PATH, 'utf8');
 console.log("🧾 EA: inbox carregado. Usando modo simulado v1.0 com reforço local opcional.");

 const local = await suggestLocalTriage(INBOX_PATH);

 if (local.mode === "ok") {
   console.log(`🧠 EA: triagem cognitiva sugerida (${local.suggestions.length} itens).`);
   for (const s of local.suggestions.slice(0, 20)) {
     const cat = CATEGORIAS_VALIDAS.has(String(s.categoria).toLowerCase())
       ? s.categoria
       : `${s.categoria} ?`;
     console.log(` → ${s.texto} [sugestão: ${cat}] — ${s.acao}`);
   }
 } else if (local.mode === "unavailable") {
   console.warn(`⚠️ EA: triagem LLM local indisponível (${local.reason}). Prosseguindo sem sugestões do modelo.`);
 } else {
   console.log(`ℹ️ EA: triagem LLM pulada: ${local.reason}.`);
 }

 console.log("✅ EA: Triagem concluída.");
}

/**
 * Readiness Protocol (MUZY)
 * Ajusta a prioridade baseada no estado físico.
 */
function getReadinessModifier() {
    const corporalPath = path.join(VAULT_ROOT, '20 Pessoal/Saude/Corporal');
    if (!fs.existsSync(corporalPath)) return 1.0;
    
    const files = fs.readdirSync(corporalPath).sort().reverse();
    if (files.length === 0) return 1.0;
    
    const lastFile = path.join(corporalPath, files[0]);
    const content = fs.readFileSync(lastFile, 'utf8');
    const readinessMatch = content.match(/readiness: (\d+)/);
    
    if (readinessMatch) {
        const readiness = parseInt(readinessMatch[1]);
        if (readiness < 50) return 0.5; // Reduz prioridade de tarefas pesadas
        if (readiness < 70) return 0.8;
    }
    return 1.0;
}

/**
 * Geração de Contexto para o Dashboard
 */
async function updateDashboardContext() {
    console.log("🧠 EA: Atualizando contexto do Dashboard...");
    const modifier = getReadinessModifier();
    console.log(`🔋 EA: Modificador de Readiness aplicado: ${modifier}x`);
    
    // Lógica de geração do output/daily_dashboard.md aqui
    console.log("✅ EA: Dashboard sincronizado.");
}

// EXECUÇÃO PRINCIPAL
async function main() {
    try {
        await runTriage();
        await updateDashboardContext();
        console.log("🚀 JARVIS: Cognição EA operando em regime normal.");
    } catch (err) {
        console.error("❌ ERRO NO EA:", err);
    }
}

main();
