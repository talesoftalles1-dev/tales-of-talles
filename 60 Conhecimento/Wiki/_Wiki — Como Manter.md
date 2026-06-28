---
tipo: doc
status: ativo
area: pessoal
criado: 2026-06-27
tags:
  - tema/ia
---

# 🧠 Wiki — Como Manter (LLM-wiki)

Sub-sistema de conhecimento incremental dentro do JARVIS. Em vez de re-derivar conhecimento a cada pergunta (RAG), o LLM **compila uma vez** e mantém atualizado um conjunto de páginas interligadas.

## Camadas
- `raw/` — fontes curadas (artigos, papers, transcrições). **Imutável.** Só leitura.
- Esta pasta (`Wiki/`) — páginas geradas pelo LLM: `sources/`, `entities/`, `concepts/`, `index.md`, `log.md`.

## Operações
- **Ingest** — solte uma fonte em `raw/`, peça para processar: o LLM lê, discute, escreve resumo em `sources/`, atualiza páginas de entidades/conceitos, atualiza `index.md`, registra em `log.md`. Sinaliza contradições em vez de sobrescrever.
- **Query** — pergunte; o LLM lê `index.md`, depois as páginas relevantes, responde com citações. Boas respostas podem virar páginas novas.
- **Lint** — health-check: contradições, alegações obsoletas, páginas órfãs, conceitos sem página, links faltando.

`index.md` é o catálogo (por categoria). `log.md` é cronológico — entradas `## [YYYY-MM-DD] tipo | título`.
