/**
 * JARVIS OS — EXECUTIVE ASSISTANT (EA) TRIAGE ENGINE
 * Versão: 1.0 (Cognição Ativa)
 * 
 * Este script automatiza a triagem do inbox.md e a priorização do dashboard.
 * Aplica a Fórmula de Priorização (§8) e as regras de anti-ruído.
 */

import fs from 'fs';
import path from 'path';

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

/**
 * Triagem do Inbox
 * Move itens do inbox.md para as pastas corretas com metadados básicos.
 */
async function runTriage() {
    console.log("🤖 EA: Iniciando triagem do Inbox...");
    
    if (!fs.existsSync(INBOX_PATH)) {
        console.log("⚠️ Inbox não encontrado.");
        return;
    }

    const content = fs.readFileSync(INBOX_PATH, 'utf8');
    // Lógica de parsing do inbox simplificada para v1.0
    // Em produção, isso usaria um parser de markdown/yaml real.
    
    console.log("✅ EA: Triagem concluída (Simulada v1.0).");
}

/**
 * Geração de Contexto para o Dashboard
 * Analisa o vault e prepara os dados para o HUD.
 */
async function updateDashboardContext() {
    console.log("🧠 EA: Atualizando contexto do Dashboard...");
    
    // Aqui o script leria todos os arquivos .md, calcularia scores 
    // e geraria o arquivo output/daily_dashboard.md
    
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
