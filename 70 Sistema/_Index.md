---
dominio: jarvis
tipo: index
status: canonico
categoria: sistema
area: sistema
titulo: 70 Sistema — Índice
criado: 2026-06-27
atualizado: 2026-06-27
aliases:
  - 70 Sistema — Índice
  - Sistema Index
  - MOC Sistema
tags:
  - moc
  - tema/sistema
  - vault
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# 70 Sistema — Índice (MOC)

Mapa de conteúdo da seção operacional do sistema. Esta seção reúne canonicidade,
runbooks, contratos de integração (CRM/MCP/n8n) e os capítulos de operação.

> **Como ler este índice:** os documentos abaixo estão separados por *onde vive a
> fonte da verdade*. Itens marcados **(Vault-side)** são canônicos no Obsidian Vault
> (`OneDrive/Documents/Jarvis`) e **não** existem neste repositório por design — o
> repo é um espelho de referência (ver [`AGENTS.md`](/AGENTS.md), C2). Itens marcados
> **(regenerável)** são saídas que vivem em `output/` quando publicadas.

## Canonicidade & governança

- [[Morning Brief — Canonicidade e Sincronizacao]] — nota canônica que aponta para a SSOT do Brief no Vault e descreve o fluxo de sincronização Vault ↔ Repo.
- [`AGENTS.md`](/AGENTS.md) — fonte da verdade do repositório (C1 app, C2 Morning Brief, regras para agentes).

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

- [[Rotate_CRM_Key]] — rotação segura da chave do CRM Yalt e atualização das credenciais n8n.

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
