---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-07-03
relacionado:
  - "[[_master_index]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[estagiarios]]"
tags:
  - tema/ia
---

# Agentes IA

Contratos, rotinas e prompts operacionais dos agentes JARVIS. **Duas camadas:** o **orquestrador** (Jarvis) e a **camada de execução** (Estagiários).

## 🧠 Orquestrador

- **Jarvis** (identidade operacional do Executive Assistant) — coordena, prioriza, delega, consolida e valida. Não executa ação de domínio. Protocolo: [[protocolo_orquestracao_jarvis]].

## 👥 Estagiários — camada de execução (subagentes)

Contrato consolidado: [[estagiarios]]. Arquivos funcionais em `.claude/agents/estagiario-*.md`.

| # | Estagiário | Codinome |
|---|---|---|
| E1 | Organização | ORGANIZER |
| E2 | Documentação | WRITING |
| E3 | Pesquisa | RESEARCH |
| E4 | Programação | TOR |
| E5 | Revisão 🆕 | REVIEWER |
| E6 | Automações 🆕 | AUTOMATOR |
| E7 | Conhecimento | KNOWLEDGE |
| E8 | Planejamento 🆕 | PLANNER |
| E9 | Comercial | BOBBY |

🆕 = nova linha de autoridade, pendente de ratificação do Operador ([[_Contrato de Autoridade dos Agentes]]). E9 não é nova — projeta a linha **BOBBY** já ratificada.

## 🏛️ Agentes de domínio (roster canônico)

Executive Assistant (orquestrador), TOR (dev), BOBBY (comercial — executado por E9, contrato técnico em [[Chapter 18 — Sync & MCP Contracts]]), RESEARCH, WRITING, FINANCE, CALENDAR, KNOWLEDGE, HEALTH — matriz de autoridade em [[_Contrato de Autoridade dos Agentes]]. Status em tempo real: [[agent_roster]].

## Regras

- Agentes escrevem em `wiki/` dentro do seu domínio.
- Agentes não reescrevem captura bruta em `raw/`.
- Agentes tratam `output/` como compilação regenerável.
- Decisão de substrato (nativo vs Ruflo): [[adr_ruflo_vs_subagentes_nativos]].
