---
dominio: jarvis
tipo: sistema
status: ativo
<<<<<<< HEAD
titulo: Agent Roster — Status Operacional
area: sistema
criado: 2026-07-02
atualizado: 2026-07-06
tags:
=======
titulo: Agent Roster — Status em Tempo Real
area: sistema
criado: 2026-07-02
atualizado: 2026-07-03
relacionado:
  - "[[estagiarios]]"
tags:
  - agent
>>>>>>> reconcile/vault-merge-20260628
  - status
  - monitoramento
---

<<<<<<< HEAD
# Agent Roster

Status operacional dos agentes do JARVIS OS. **Regra de honestidade:** este arquivo só registra estado real e verificável — nada de telemetria decorativa. O Dashboard aponta para cá.

## 🏛️ Agentes de domínio

| Agente | Estado real | Fonte do estado |
|---|---|---|
| **EA / Jarvis** | 🟢 Ativo — gera `output/daily_dashboard.md` diariamente às 07:00 | Tarefa Windows "JARVIS Executive Assistant" |
| **TOR** (dev) | 🔵 Sob demanda — via sessões Claude Code / E4 | Invocação manual |
| **BOBBY** (comercial) | 🟡 Degradado — workflows n8n congelados (trial Cloud expirado 2026-06-29); consultas CRM via skill `yalt-crm` seguem disponíveis | [[Ponte n8n ↔ JARVIS]] · kit self-host pronto |
| **RESEARCH · WRITING · FINANCE · CALENDAR · KNOWLEDGE · HEALTH** | ⚪ Sob demanda — sem agendamento próprio | Invocação via Jarvis |

## 👥 Estagiários (camada de execução)

Subagentes spawnáveis sob orquestração do Jarvis. Contrato: [[estagiarios]] · Protocolo: [[protocolo_orquestracao_jarvis]] · Arquivos funcionais: `.claude/agents/estagiario-*.md` (9 arquivos, confirmados em 2026-07-06).
=======
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
>>>>>>> reconcile/vault-merge-20260628

| Estagiário | Codinome | Status | Autoridade |
|---|---|---|---|
| E1 · Organização | ORGANIZER | ⚪ Standby | vinculado (EA) |
| E2 · Documentação | WRITING | ⚪ Standby | vinculado |
| E3 · Pesquisa | RESEARCH | ⚪ Standby | vinculado |
| E4 · Programação | TOR | ⚪ Standby | vinculado |
<<<<<<< HEAD
| E5 · Revisão | REVIEWER | ⚪ Standby | ✅ ratificado (PR #20, 2026-07-03) |
| E6 · Automações | AUTOMATOR | ⚪ Standby | ✅ ratificado (PR #20, 2026-07-03) |
| E7 · Conhecimento | KNOWLEDGE | ⚪ Standby | vinculado |
| E8 · Planejamento | PLANNER | ⚪ Standby | ✅ ratificado (PR #20, 2026-07-03) |
| E9 · Comercial | BOBBY | ⚪ Standby | vinculado (linha BOBBY, já ratificada) |
=======
| E5 · Revisão | REVIEWER | ⚪ Standby | 🆕 ratificar |
| E6 · Automações | AUTOMATOR | ⚪ Standby | 🆕 ratificar |
| E7 · Conhecimento | KNOWLEDGE | ⚪ Standby | vinculado |
| E8 · Planejamento | PLANNER | ⚪ Standby | 🆕 ratificar |
| E9 · Comercial | BOBBY | ⚪ Standby | vinculado |
>>>>>>> reconcile/vault-merge-20260628

---

## Contratos de Autoridade
<<<<<<< HEAD

=======
>>>>>>> reconcile/vault-merge-20260628
Ver [[_Contrato de Autoridade dos Agentes]] para permissões. Camada de execução: [[estagiarios]].
