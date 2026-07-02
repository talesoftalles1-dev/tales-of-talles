---
dominio: jarvis
tipo: sistema
status: ativo
titulo: Agent Roster — Status em Tempo Real
area: sistema
criado: 2026-07-02
atualizado: 2026-07-02
tags:
  - agent
  - status
  - monitoramento
---

# Agent Roster

Este arquivo centraliza o status operacional de todos os agentes do JARVIS OS. O Dashboard consome estes dados para exibir o HUD.

| Agente | Status | Última Atividade | Carga |
|---|---|---|---|
| **EA** | 🟢 Online | `= dateformat(this.atualizado, "HH:mm")` | 15% |
| **TOR** | 🔵 Idle | 2026-06-30 | 0% |
| **BOBBY** | 🟡 Monitoring | 2026-07-01 | 5% |
| **RESEARCH** | ⚪ Offline | - | 0% |
| **HEALTH** | 🟢 Online | `= dateformat(this.atualizado, "HH:mm")` | 10% |

---

## Contratos de Autoridade
Ver [[_Contrato de Autoridade dos Agentes]] para permissões.
