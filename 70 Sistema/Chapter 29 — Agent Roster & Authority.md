---
dominio: jarvis
aliases:
  - "Agent Roster & Authority"
tipo: chapter
status: ativo
area: 70 Sistema
title: Agent Roster & Authority
created: 2026-06-27T18:24:00Z
updated: 2026-07-03T00:00:00Z
relacionado:
  - "[[estagiarios]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[agent_roster]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
# Agent Roster & Authority

> Este capítulo é um **ponteiro** — a fonte da verdade do roster e da autoridade vive no Vault (`wiki/ai_agents/`), não duplicada aqui, para não bifurcar o canon ([[_Spec JARVIS]] §12).

## Onde está cada coisa

| Pergunta | Resposta canônica |
|---|---|
| Quem pode Criar/Editar/Priorizar/Executar/Arquivar o quê? | [[_Contrato de Autoridade dos Agentes]] (Operador-only para editar) |
| Quais subagentes existem e o que cada um faz? | [[estagiarios]] — cartas de autoridade E1–E9 |
| Como o Jarvis decide, decompõe e delega entre eles? | [[protocolo_orquestracao_jarvis]] |
| Status operacional em tempo real (online/idle/carga)? | [[agent_roster]] |
| Por que subagentes nativos e não um framework externo (Ruflo)? | [[adr_ruflo_vs_subagentes_nativos]] |

## Roster resumido (9 Estagiários, 2026-07-03)

E1 Organização (ORGANIZER) · E2 Documentação (WRITING) · E3 Pesquisa (RESEARCH) · E4 Programação (TOR) · E5 Revisão (REVIEWER) 🆕 · E6 Automações (AUTOMATOR) 🆕 · E7 Conhecimento (KNOWLEDGE) · E8 Planejamento (PLANNER) 🆕 · E9 Comercial (BOBBY) — mais recente, consome a skill `yalt-crm` ([[Chapter 18 — Sync & MCP Contracts]]).

🆕 = autoridade nova, pendente de ratificação do Operador — ver [[estagiarios]] para a tabela de reconciliação completa.
