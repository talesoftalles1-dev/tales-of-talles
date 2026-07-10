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

## Subpastas

- `Templates/` — um template Templater por `tipo` do contrato.
- `SOPs/` — procedimentos operacionais (tipo: sop).
- `Runbooks/` — [[Rotate_CRM_Key]] (rotação de chave CRM Yalt).
- `Automacao/` — [[🔁 Automacoes]] (catálogo) · `executive-assistant/` (dashboard 07:00) · `morning-brief/` (brief 09:00) · `vault-lint/` (lint de frontmatter e links) · `n8n-selfhost/` (kit de migração — **não tocar sem o Operador**).

## Arquivo

- [[90 Arquivo/00 Sistema/_Index (stub da raiz)|00 Sistema]] — arquivado (Chapters 01–06 em `90 Arquivo/00 Sistema/`; scaffold EN em [[90 Arquivo/scaffold_en/_Index|scaffold_en]]).
- `90 Arquivo/relatorios_historicos/` — relatórios de auditoria/decisão históricos (ex-`output/archived/`).
- `90 Arquivo/scripts/` — scripts de bootstrap consumidos (uso único, preservados por governança §11).
