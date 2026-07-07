---
dominio: jarvis
tipo: sistema
status: ativo
titulo: Agent Roster — Status em Tempo Real
area: sistema
criado: 2026-07-02
atualizado: 2026-07-03
relacionado:
  - "[[estagiarios]]"
tags:
  - agent
  - status
  - monitoramento
---

> [!info] Documento **derivado** — não é canon de autoridade
> Este arquivo mostra **status operacional** (online/idle/carga), não define autoridade. A fonte da verdade de quem-pode-o-quê é [[estagiarios]] (Estagiários) e [[_Contrato de Autoridade dos Agentes]] (agentes de domínio). Se este arquivo e aqueles divergirem sobre **o que um agente pode fazer**, os outros vencem — este é só o "painel de luzes".

# Agent Roster

Este arquivo centraliza o status operacional de todos os agentes do JARVIS OS. O Dashboard consome estes dados para exibir o HUD.

| Agente | Status | Última Atividade | Carga |
|---|---|---|---|
| **EA** | 🟢 Online | `= dateformat(this.atualizado, "HH:mm")` | 15% |
| **TOR** | 🔵 Idle | 2026-06-30 | 0% |
| **BOBBY** | 🟡 Monitoring | 2026-07-03 | 5% |
| **RESEARCH** | ⚪ Offline | - | 0% |
| **HEALTH** | 🟢 Online | `= dateformat(this.atualizado, "HH:mm")` | 10% |

---

## 👥 Estagiários (camada de execução)

Subagentes spawnáveis sob orquestração do Jarvis. Contrato: [[estagiarios]] · Protocolo: [[protocolo_orquestracao_jarvis]].

| Estagiário | Codinome | Status | Autoridade |
|---|---|---|---|
| E1 · Organização | ORGANIZER | ⚪ Standby | vinculado (EA) |
| E2 · Documentação | WRITING | ⚪ Standby | vinculado |
| E3 · Pesquisa | RESEARCH | ⚪ Standby | vinculado |
| E4 · Programação | TOR | ⚪ Standby | vinculado |
| E5 · Revisão | REVIEWER | ⚪ Standby | 🆕 ratificar |
| E6 · Automações | AUTOMATOR | ⚪ Standby | 🆕 ratificar |
| E7 · Conhecimento | KNOWLEDGE | ⚪ Standby | vinculado |
| E8 · Planejamento | PLANNER | ⚪ Standby | 🆕 ratificar |
| E9 · Comercial | BOBBY | ⚪ Standby | vinculado |

---

## Contratos de Autoridade
Ver [[_Contrato de Autoridade dos Agentes]] para permissões. Camada de execução: [[estagiarios]].
