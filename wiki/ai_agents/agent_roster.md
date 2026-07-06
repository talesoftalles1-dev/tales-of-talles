---
dominio: jarvis
tipo: sistema
status: ativo
titulo: Agent Roster — Status Operacional
area: sistema
criado: 2026-07-02
atualizado: 2026-07-06
tags:
  - status
  - monitoramento
---

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

| Estagiário | Codinome | Status | Autoridade |
|---|---|---|---|
| E1 · Organização | ORGANIZER | ⚪ Standby | vinculado (EA) |
| E2 · Documentação | WRITING | ⚪ Standby | vinculado |
| E3 · Pesquisa | RESEARCH | ⚪ Standby | vinculado |
| E4 · Programação | TOR | ⚪ Standby | vinculado |
| E5 · Revisão | REVIEWER | ⚪ Standby | ✅ ratificado (PR #20, 2026-07-03) |
| E6 · Automações | AUTOMATOR | ⚪ Standby | ✅ ratificado (PR #20, 2026-07-03) |
| E7 · Conhecimento | KNOWLEDGE | ⚪ Standby | vinculado |
| E8 · Planejamento | PLANNER | ⚪ Standby | ✅ ratificado (PR #20, 2026-07-03) |
| E9 · Comercial | BOBBY | ⚪ Standby | vinculado (linha BOBBY, já ratificada) |

---

## Contratos de Autoridade

Ver [[_Contrato de Autoridade dos Agentes]] para permissões. Camada de execução: [[estagiarios]].
