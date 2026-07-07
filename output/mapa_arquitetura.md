---
dominio: jarvis
tipo: output
status: gerado
titulo: Mapa de Arquitetura — JARVIS OS
criado: 2026-07-07
atualizado: 2026-07-07
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[_Arquitetura JARVIS]]"
  - "[[_master_index]]"
tags:
  - tema/ia
---

# 🗺️ Mapa de Arquitetura — JARVIS OS (2026-07-07)

> Compilação regenerável (auditoria de 2026-07-07, base `origin/main` @ `f78b2aa`). Fonte de verdade: [[_Spec JARVIS]] e [[_Arquitetura JARVIS]] — este mapa só descreve o estado.

## As 4 camadas (estado real)

| Camada | Sistema | Ferramenta oficial | Estado |
|---|---|---|---|
| 1 · Memória | Obsidian (vault) | Obsidian Skills | 🟢 Vivo — 77 notas ativas, lint 0/0 |
| 2 · Operação | n8n | n8n MCP | 🟡 Degradado — Cloud pessoal expirado; kit self-host pronto; instância enyo.cc (Yalt) intocada |
| 3 · Cognição | Claude Code | GSD Core · subagentes nativos (Ruflo diferido, ver [[adr_ruflo_vs_subagentes_nativos]]) | 🟢 Jarvis + 9 Estagiários (`.claude/agents/estagiario-*.md`) |
| 4 · Interface | Dashboard + Slack `#daily` | UI/UX Pro Max | 🟡 Dashboard vivo (07:00); entrega Slack depende do n8n |

## Fluxo canônico

```
raw/ (Operador despeja) → wiki/ (IA estrutura) → output/ (sistema entrega, regenerável)
```

Estrutura numerada `00 JARVIS/ … 90 Arquivo/` segue como **armazenamento**; toda query filtra por propriedade (`tipo`/`status`/`area`/`dominio`), nunca por pasta.

## Hierarquia do canon (tudo PT-BR)

1. [[_Spec JARVIS]] — canon estrutural (§10–§13 absorveram a antiga `CONSTITUTION.md`, superseded 2026-06-30)
2. [[_Contrato de Autoridade dos Agentes]] — quem pode Criar/Editar/Priorizar/Executar/Arquivar
3. [[🪐 Constituição JARVIS]] — valores do Operador (ainda `status: rascunho` — não preenchida)
4. [[_Arquitetura JARVIS]] + [[_Taxonomia de Eventos]] — Event Bus e classes de evento
5. [[_master_index]] — navegação da camada `wiki/`

## Os 2 contratos unificadores

- **Score de prioridade** (§8): `importancia×10 + urgência(prazo) + valor_estrategico×8 + bônus_energia`; `dependencia`/`pausado` = bloqueado (porteiro, não fator).
- **Event Bus** (v1, contrato de nomes): 🟢 Informacional registra · 🟡 Operacional agrega no Daily Brief · 🔴 Crítico interrompe via `#daily`.

## Topologia física do repositório (achado da auditoria)

| Cópia | Papel | Estado em 2026-07-07 |
|---|---|---|
| `origin/main` (GitHub) | Linha canônica | `f78b2aa` (PR #23) |
| `OneDrive/Documents/Jarvis` | **Vault vivo** (Obsidian + automações apontam para cá) | branch `reconcile/vault-merge-20260628`: 7 à frente / 22 atrás do origin, ~86 arquivos não commitados |
| `Desktop/Jarvis` | Checkout de engenharia (este) | **Sincronizado com origin/main em 2026-07-07**; estado antigo preservado em `backup/desktop-vault-20260707` |

> ⚠️ Enquanto o vault vivo não reconciliar com `origin/main`, existe drift estrutural entre o que o Operador vê no Obsidian e o canon do git. Ver [[divida_tecnica]] item D1.

## Repositório híbrido

O repo contém **dois produtos**: o vault JARVIS (raiz) e o app **TALES OF TALLES · IDENTITY OS** (`index.html`, PWA) — integração por **dados** via coaches APEX ([[🔌 Ponte APEX ↔ JARVIS]]), nunca por fusão de codebase.
