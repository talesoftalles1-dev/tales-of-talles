---
dominio: jarvis
tipo: index
status: canonico
categoria: sistema
area: sistema
titulo: 70 Sistema — Índice
criado: 2026-06-27
atualizado: 2026-07-06
aliases:
  - 70 Sistema — Índice
  - Sistema Index
  - MOC Sistema
tags:
  - moc
<<<<<<< HEAD
=======
  - tema/sistema
>>>>>>> reconcile/vault-merge-20260628
  - vault
---

# 70 Sistema — Índice (MOC)

Mapa de conteúdo da "engenharia" do JARVIS: canon, templates, runbooks e automação. Navegação geral do vault: [[🤖 JARVIS]] (dashboard) · [[wiki/_master_index|🧭 Master Index]].

## Canon (fonte da verdade — PT-BR)

- [[_Spec JARVIS]] — **canon estrutural**: pastas, propriedades, prioridade (§8), nomenclatura, governança.
- [[_Contrato de Autoridade dos Agentes]] — quem pode Criar/Editar/Priorizar/Executar/Arquivar.
- [[🪐 Constituição JARVIS]] — valores do Operador (vive em `00 JARVIS/`).
- [[_Arquitetura JARVIS]] — 4 camadas + Event Bus.
- [[_Taxonomia de Eventos]] — vocabulário de eventos.

## Operação e contratos derivados

<<<<<<< HEAD
- [[_Daily Brief (Canônico)]] — estrutura única do brief (Obsidian + Slack).
- [[_Canal Daily (Contrato)]] — contrato do canal Slack `#daily`.
- [[_Morning Brief — Spec]] — spec de implementação do Morning Brief (em `Automacao/`).
- [[_UX Decision Log]] — decisões de UX do dashboard/brief.
- [[_Stack de Ferramentas (Arsenal)]] — quais ferramentas externas são canônicas por camada.
- [[adr_ruflo_vs_subagentes_nativos]] — ADR: subagentes nativos; Ruflo diferido.
- [[Claude Obsidian — Prompt de Organização]] — prompt de organização proativa do vault.

## Guias de referência

- [[🔌 Plugins]] — plugins, configuração e racional.
- [[🎨 Tema e Visual]] — tema Minimal, snippets CSS, cores da marca (§7 do Spec).
- [[📊 Biblioteca Dataview]] — queries prontas (inclui a expressão de prioridade §8).
- [[✅ Central de Tarefas]] — buckets de tarefas (Tasks).
- [[⌨️ Atalhos e Hotkeys]] — produtividade.
=======
## CRM / Integração

- [[Chapter 18 — Sync & MCP Contracts]] **(40 CRM, `status: ativo`)** — contrato real do conector: skill `yalt-crm`, endpoints, auth, caveats de dado, achado do bloqueio de rede (2026-07-03). **Fonte da verdade atual** — supera o scaffold abaixo.
- [[CRM Unification — Plan]] — plano geral de unificação Vault ↔ CRM Yalt (escopo, sprints, riscos, critérios de sucesso).
- [[CRM — Mapeamento de Entidades]] — mapeamento de frontmatter do Vault para campos do CRM + chave de deduplicação (`external_id`).
- [[CRM MCP — Contract & Scaffold]] — rascunho especulativo pré-skill; **superado por** [[Chapter 18 — Sync & MCP Contracts]].
- [[CRM n8n Workflows — README]] — workflows PoC do n8n para sincronizar notas do Vault com o CRM.

## Agentes

- [[estagiarios]] **(wiki/ai_agents, `status: ativo`)** — cartas de autoridade dos 9 Estagiários (E1–E9), incluindo E9/BOBBY (comercial, consome [[Chapter 18 — Sync & MCP Contracts]]).
- [[protocolo_orquestracao_jarvis]] — como o Jarvis decompõe, prioriza e delega aos Estagiários.
- [[adr_ruflo_vs_subagentes_nativos]] — por que subagentes nativos do Claude Code, não Ruflo.

## Runbooks
>>>>>>> reconcile/vault-merge-20260628

## Subpastas

<<<<<<< HEAD
- `Templates/` — um template Templater por `tipo` do contrato.
- `SOPs/` — procedimentos operacionais (tipo: sop).
- `Runbooks/` — [[Rotate_CRM_Key]] (rotação de chave CRM Yalt).
- `Automacao/` — [[🔁 Automacoes]] (catálogo) · `executive-assistant/` (dashboard 07:00) · `morning-brief/` (brief 09:00) · `vault-lint/` (lint de frontmatter e links) · `n8n-selfhost/` (kit de migração — **não tocar sem o Operador**).

## Arquivo

- [[90 Arquivo/00 Sistema/_Index (stub da raiz)|00 Sistema]] — arquivado (Chapters 01–06 em `90 Arquivo/00 Sistema/`; scaffold EN em [[90 Arquivo/scaffold_en/_Index|scaffold_en]]).
- `90 Arquivo/relatorios_historicos/` — relatórios de auditoria/decisão históricos (ex-`output/archived/`).
- `90 Arquivo/scripts/` — scripts de bootstrap consumidos (uso único, preservados por governança §11).
=======
## Capítulos de operação

- [[Chapter 27 — Automations & n8n Bridge]] — `status: backlog`
- [[Chapter 28 — Security & Secrets Runbook]] — `status: backlog`
- [[Chapter 29 — Agent Roster & Authority]] — `status: ativo` (ponteiro para o canon em `wiki/ai_agents/`)
- [[Chapter 30 — Monitoring & Alerts]] — `status: backlog`
- [[Chapter 31 — Bootstrap & Maintenance]] — `status: backlog`

## SSOT no Vault (não está neste repo — por design)

- `Automacao/_Morning Brief — Spec` **(Vault-side)** — especificação canônica de implementação do Morning Brief. Vive no Obsidian Vault, não no repo (ver `AGENTS.md` C2). Referências `[[Automacao/_Morning Brief — Spec]]` em outros docs são intencionais e apontam para o Vault.

## Artefatos regeneráveis / pendentes de publicação

- `[[TALES OF TALLES OS — Master Evolution Report]]` **(regenerável — ausente no repo)** — referenciado por 4 docs de CRM/Brief e pelo arquivo de auditoria arquivado, mas **ainda não publicado** em `output/`. Não foi fabricado aqui (ver `AGENTS.md` regra 5). Ver §Red flags no PR. Quando publicado, deve viver em `output/`.
- `output/archived/Auditoria_TALLES_OS_2026-06-27-ARCHIVED.md` — auditoria anterior, já arquivada (absorvida pelo Master Evolution Report).

## Relacionados no repo

- `index.html` — app canônico (C1).
- `00 Sistema/` — **arquivado 2026-07-03** (`90 Arquivo/2026-07-03_limpeza/`): eram capítulos `status: backlog` nunca redigidos, superados por `_Spec JARVIS.md` + [[_Contrato de Autoridade dos Agentes]] + [[protocolo_orquestracao_jarvis]].
- `output/` — entregáveis regeneráveis do Brief.
>>>>>>> reconcile/vault-merge-20260628
