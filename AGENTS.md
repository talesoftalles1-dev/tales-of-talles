# AGENTS.md — Fonte da Verdade (Canonicidade)

Este documento define a **fonte da verdade** do repositório `tales-of-talles` para
qualquer agente (humano ou IA) que trabalhe aqui. O objetivo é eliminar
ambiguidade e impedir que variantes duplicadas ou specs paralelas sejam
recriadas.

> Resumo de uma linha: **o app canônico é `index.html` (raiz); a spec canônica do
> Morning Brief vive no Vault/Obsidian, não no repo.**

---

## C1 — App canônico

- **Artefato único e canônico:** [`index.html`](./index.html) na raiz.
- É um PWA single-file (HTML + CSS + JS vanilla, sem build). Toda a aplicação
  TALES OF TALLES · IDENTITY OS vive nesse arquivo.
- **Não existem** — e não devem ser criadas — variantes como
  `tales-of-talles_2.html`, `*_2.html` ou `*_FINAL.html`. Se precisar iterar,
  altere `index.html` diretamente (event-sourcing, reducer determinístico,
  compatibilidade retroativa — ver `README.md`).

## C2 — Morning Brief (e specs do JARVIS OS)

- **SSOT (Single Source of Truth):** o Vault/Obsidian
  (`OneDrive/Documents/Jarvis`). A especificação canônica de implementação do
  Morning Brief vive em `Automacao/_Morning Brief — Spec` **dentro do Vault**.
- Detalhes e fluxo de sincronização: ver
  [`70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`](./70%20Sistema/Morning%20Brief%20%E2%80%94%20Canonicidade%20e%20Sincronizacao.md).
- **Papel do repositório GitHub:** referência/arquitetura + entregáveis
  **regeneráveis** (`output/`). Não é o ambiente primário de edição do conteúdo do
  Brief.

## Papel do repositório

| Conteúdo | Fonte de verdade | Onde editar |
|---|---|---|
| App (`index.html`) | o próprio repo | aqui, via PR |
| Morning Brief / specs JARVIS | Vault/Obsidian | no Vault; repo recebe só `output/` |
| Docs de arquitetura (`00`/`70 Sistema`) | repo (referência) | aqui, via PR do Operador |
| Segredos / credenciais | secret manager | **nunca** no repo |

## Regras para agentes

1. **Não recriar variantes** do app (`_2.html`, `_FINAL.html`, etc.). Edite
   `index.html`.
2. **Não bifurcar specs.** Regras do Morning Brief só na spec canônica do Vault.
   Docs no repo referenciam — não introduzem regras próprias nem divergentes.
3. **Sem segredos no repo.** Use o secret manager (ver
   `70 Sistema/Chapter 28 — Security & Secrets Runbook.md`).
4. **Mudanças de contrato/spec** entram só via PR do Operador, com justificativa.
5. **Antes de “depreciar” ou “corrigir referências”**, confirme que o alvo existe
   de fato no repo — não fabrique trabalho sobre arquivos fantasma.

## Documentos-chave

- `README.md` — visão e arquitetura do app.
- `00 Sistema/` — capítulos de fundação (Executive Assistant, Prioritization,
  Agenda, Orchestration, Decision Surface, Contracts & Taxonomy).
- `70 Sistema/` — runbooks operacionais (Automations & n8n, Security & Secrets,
  Agent Roster, Monitoring, Bootstrap) e a Canonicidade do Morning Brief.
