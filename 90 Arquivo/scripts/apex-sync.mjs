/**
 * JARVIS OS — APEX SYNC ENGINE (HEALTH BRIDGE)
 * Versão: 1.0
 * 
 * Sincroniza dados do PWA TALES OF TALLES para o Vault Obsidian.
 * Segue o contrato §9 do _Spec JARVIS.
 */

import fs from 'fs';
import path from 'path';

const SAUDE_ROOT = "20 Pessoal/Saude";

/**
 * Simula a recepção de um evento do PWA
 */
function processApexEvent(event) {
    const date = new Date().toISOString().slice(0, 10);
    let folder = "";
    let filename = "";
    let content = "";

    switch (event.type) {
        case 'treino':
            folder = "Treinos";
            filename = `${date} ${event.modalidade}.md`;
            content = `---
tipo: treino
status: feito
data: ${date}
modalidade: ${event.modalidade}
coach: ${event.modalidade === 'boxe' ? 'ilia' : 'cariani'}
duracao_min: ${event.duracao_min}
volume_kg: ${event.volume_kg || 0}
rpe: ${event.rpe}
area: pessoal
fonte: apex
criado: ${date}
atualizado: ${date}
tags: [tema/saude]
---

# 🥋 ${date} ${event.modalidade}
Sessão sincronizada do APEX.
`;
            break;
            
        case 'corporal':
            folder = "Corporal";
            filename = `${date} Corporal.md`;
            content = `---
tipo: corporal
data: ${date}
peso_kg: ${event.peso_kg}
readiness: ${event.readiness}
sono_h: ${event.sono_h}
fadiga: ${event.fadiga}
area: pessoal
fonte: apex
criado: ${date}
atualizado: ${date}
tags: [tema/saude]
---

# 🩺 ${date} Corporal
`;
            break;
    }

    const fullPath = path.join(process.cwd(), SAUDE_ROOT, folder, filename);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Sincronizado: ${filename}`);
}

// Mock de evento para teste
const mockEvent = {
    type: 'treino',
    modalidade: 'Boxe',
    duracao_min: 45,
    rpe: 9
};

// processApexEvent(mockEvent);
