---
dominio: jarvis
tipo: sistema
status: ativo
titulo: Agent Roster — Status Operacional
area: sistema
criado: 2026-07-02
atualizado: 2026-07-09
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

Status operacional dos agentes do JARVIS OS. **Regra de honestidade:** este arquivo só registra estado real e verificável — nada de telemetria decorativa. O Dashboard aponta para cá.

## 🏛️ Agentes de domínio

| Agente | Estado real | Fonte do estado |
|---|---|---|
| **EA / Jarvis** | 🟢 Ativo — gera `output/daily_dashboard.md` diariamente às 07:00 | Tarefa Windows "JARVIS Executive Assistant" |
| **TOR** (dev) | 🔵 Sob demanda — via sessões Claude Code / E4 | Invocação manual |
| **BOBBY** (comercial) | 🟢 Ativo — pipeline `commercial-crm` (Frentes 1·2·3) roda no branch `fix/workflows-replacement-n8n`; Gerente/enriquecimento/cold-email via Gemma 4 + CRM Yalt | `.github/workflows/commercial-crm-agents.yml` + `70 Sistema/Automacao/commercial-crm/` |
| **RESEARCH** | 🟢 Ativo — agente de domínio, `model: gemma4-jarvis` | `.claude/agents/research.md` · carta em `_Contrato de Autoridade` |
| **WRITING** | 🟢 Ativo — agente de domínio, `model: gemma4-jarvis` | `.claude/agents/writing.md` · carta em `_Contrato de Autoridade` |
| **FINANCE** | 🟢 Ativo — agente de domínio, `model: gemma4-jarvis` (nunca move dinheiro) | `.claude/agents/finance.md` · carta em `_Contrato de Autoridade` |
| **CALENDAR** | 🟢 Ativo — agente de domínio, `model: gemma4-jarvis` | `.claude/agents/calendar.md` · carta em `_Contrato de Autoridade` |
| **KNOWLEDGE** | 🟢 Ativo — agente de domínio, `model: gemma4-jarvis` (mantém a Wiki) | `.claude/agents/knowledge.md` · carta em `_Contrato de Autoridade` |
| **HEALTH** | 🟢 Ativo — agente de domínio, `model: gemma4-jarvis` | `.claude/agents/health.md` · carta em `_Contrato de Autoridade` |

## 👥 Estagiários (camada de execução)

| Estagiário | Codinome | Status | Autoridade |
|---|---|---|---|
| E1 · Organização | ORGANIZER | ⚪ Standby | vinculado (EA) |
| E2 · Documentação | WRITING | ⚪ Standby | vinculado |
| E3 · Pesquisa | RESEARCH | ⚪ Standby | vinculado |
| E4 · Programação | TOR | ⚪ Standby | vinculado |
| E5 · Revisão | REVIEWER | ⚪ Standby | ratificado (PR #20, 2026-07-03) |
| E6 · Automações | AUTOMATOR | 🟢 Em desenvolvimento | ratificado (PR #20, 2026-07-03) |
| E7 · Conhecimento | KNOWLEDGE | ⚪ Standby | vinculado |
| E8 · Planejamento | PLANNER | ⚪ Standby | ratificado (PR #20, 2026-07-03) |
| E9 · Comercial | BOBBY | ⚪ Standby | vinculado (linha BOBBY, já ratificada) |

## Contratos de Autoridade

Ver [[_Contrato de Autoridade dos Agentes]] para permissões. Camada de execução: [[estagiarios]]. Operacionalização no painel Pixel Agents: [[pixel-agents-agent-mapping]].
