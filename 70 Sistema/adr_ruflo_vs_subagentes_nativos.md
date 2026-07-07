---
dominio: jarvis
tipo: doc
status: publicado
categoria: arquitetura
area: sistema
criado: 2026-07-03
atualizado: 2026-07-03
relacionado:
  - "[[_Arquitetura JARVIS]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[estagiarios]]"
  - "[[_Stack de Ferramentas (Arsenal)]]"
tags:
  - tema/ia
  - arquitetura
  - adr
---

# 🧭 ADR — Orquestração multi-agente: subagentes nativos do Claude Code vs Ruflo

**Data:** 2026-07-03 · **Status:** Aceito · **Decisão de:** delegada pelo Operador ("só cabe a você decidir como trabalhar").

## Contexto

O Operador pediu que o Jarvis deixe de ser um prompt e vire o **orquestrador** central, com uma frota de "Estagiários" especializados trabalhando em paralelo ([[protocolo_orquestracao_jarvis]]). Surge a escolha de **substrato de orquestração**. Dois candidatos concretos, já presentes no ecossistema:

- **Ruflo** (`github.com/talesoftalles1-dev/ruflo`) — meta-harness de agentes já instalado como plugins nesta sessão.
- **Subagentes nativos do Claude Code** — `.claude/agents/*.md` + a ferramenta Agent, já disponíveis.

A [[_Arquitetura JARVIS]] já registrava o Ruflo como **"diferido"**, com gate: "orquestração multi-agente quando houver 5–7 agentes operacionais".

## Decisão

**Adotar subagentes NATIVOS do Claude Code** como substrato dos Estagiários agora. **Manter o Ruflo DIFERIDO** como opção documentada, não adotada.

## Alternativas consideradas

### Opção A — Ruflo (meta-harness)
O que é, honestamente: 100+ agentes especializados, swarms lideradas por "queen" com consenso Raft/Byzantine, memória vetorial HNSW (AgentDB), auto-aprendizado SONA, federação zero-trust entre máquinas, 35 categorias de plugin, daemon de background workers, guardrails de segurança (AIDefence).
- **Prós:** poder bruto; memória semântica; aprendizado de trajetória; já parcialmente instalado.
- **Contras:** superfície gigante para um OS **pessoal**; introduz daemon, MCP server, DB vetorial e dezenas de agentes — **carga cognitiva** alta; muitos componentes (federação, neural trading, IoT) irrelevantes ao vault; manutenção e depuração pesadas; acopla o JARVIS a um framework externo em evolução rápida.

### Opção B — Subagentes nativos do Claude Code (escolhida)
`.claude/agents/estagiario-*.md` com frontmatter (name/description/tools/model) + a ferramenta Agent para spawn paralelo.
- **Prós:** zero dependência nova; least-privilege por agente (campo `tools`); paralelismo real via Agent; alinhado a "aditivo sempre" e ao gate de carga cognitiva; totalmente legível/versionável; reversível (é só apagar arquivos).
- **Contras:** sem memória vetorial/aprendizado nativo (mitigado por memória local em `wiki/ai_agents/memoria/`); orquestração é responsabilidade do main-loop (o Jarvis), não de um scheduler dedicado.

## Critérios de decisão

| Critério | Ruflo | Nativo |
|---|---|---|
| Carga cognitiva | ❌ alta | ✅ baixa |
| Manutenibilidade | ⚠️ | ✅ |
| Aditividade (não quebra o que existe) | ⚠️ | ✅ |
| Custo/complexidade operacional | ❌ daemon+DB+MCP | ✅ arquivos .md |
| Reversibilidade | ⚠️ | ✅ trivial |
| Alinhamento ao gate "5–7 agentes operacionais" | prematuro | ✅ |

Hoje o JARVIS tem os agentes de domínio + 9 Estagiários (E1–E9, com a adição do E9/BOBBY em 2026-07-03) — mas ainda em **rodagem inicial**. O gate do Ruflo pede maturidade operacional comprovada, não apenas contagem.

## Consequências

- Os Estagiários nascem como subagentes nativos, governados pelo [[_Contrato de Autoridade dos Agentes]] e pelo [[protocolo_orquestracao_jarvis]].
- Nada do ecossistema atual é tocado (aditivo). O Ruflo permanece instalado mas **não é o substrato**.
- Perde-se, por ora, memória vetorial/aprendizado automático — aceito conscientemente; a memória local em markdown cobre o essencial.

## Gatilho de reavaliação

Reconsiderar o Ruflo (ou parte dele — ex.: só a memória AgentDB) quando **todos**: (1) os 9 Estagiários tiverem uso real comprovado por semanas; (2) a memória markdown demonstrar limite concreto (busca/recall insuficiente); (3) houver ganho mensurável que justifique a carga. Até lá, diferido.

> **Nota de proveniência (2026-07-03):** este ADR foi originalmente escrito numa sessão em worktree isolado (`claude/zen-mclaren-ab1c72`) e materializado aqui no vault principal numa sessão de continuidade. O worktree original nunca foi mergeado via git; o conteúdo foi portado por cópia direta de arquivo (mesmo texto, sem alterar a decisão).
