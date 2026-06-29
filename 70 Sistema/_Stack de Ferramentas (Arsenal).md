---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Arquitetura JARVIS]]"
  - "[[Agentes JARVIS]]"
  - "[[_Daily Brief (Canônico)]]"
  - "[[Ponte n8n ↔ JARVIS]]"
  - "[[🤖 JARVIS]]"
tags:
  - tema/ia
---

# 🧰 Stack de Ferramentas (Arsenal)

> [!jarvis] O que é este documento
> O **registro canônico das ferramentas externas** do JARVIS e da decisão de adoção de cada uma. Não substitui os contratos — mapeia cada ferramenta a uma das **4 camadas** ([[_Arquitetura JARVIS]]), define seu **papel**, seu **status de adoção** e onde ela se integra. É um **log de decisão estratégica**, não um manual de instalação.

> [!note] Instalado ≠ adotado
> Todas estas ferramentas já estão **instaladas no ambiente Claude Code** (skills, plugins e MCP servers). Este documento governa **se e como o JARVIS as adota** como camada oficial. Uma coisa é o binário existir; outra é ele virar contrato do sistema.

---

## 🎯 A decisão (2026-06-27)

> [!cyan] Os dois ativos de maior valor hoje
> **Obsidian Skills** e **n8n MCP**. Eles reforçam exatamente os **dois pilares centrais** do sistema — **Memória** e **Operação**. São os ativos de maior alavancagem imediata.
>
> **GSD Core** é, provavelmente, a peça que mais pode transformar o JARVIS: de um sistema que **organiza** trabalho para um sistema que **entrega** trabalho.

| # | Decisão | Ferramenta | Status |
|---|---|---|:--:|
| 1 | Interface oficial do Vault (I/O de memória) | **Obsidian Skills** | `oficial` |
| 2 | Camada oficial de engenharia de workflows | **n8n MCP** | `oficial` |
| 3 | Incorporar princípios ao Executive Assistant e ao Daily Brief | **GSD Core** | `em incorporação` |
| 4 | Evoluir o Dashboard / Decision Surface | **UI/UX Pro Max** | `em uso` |
| 5 | Estudar só quando houver **5–7 agentes realmente operacionais** | **Ruflo** | `diferido` |

**Vocabulário de status:** `oficial` (camada padrão do sistema) · `em incorporação` (princípios sendo absorvidos pelos contratos) · `em uso` (aplicado a um artefato específico) · `diferido` (decisão adiada, com gatilho explícito).

---

## 🗺️ Mapa — ferramenta por camada

```text
                    JARVIS OS
                 Executive Assistant
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
     GSD CORE           RUFLO            N8N MCP
   (Execução)        (Coordenação)     (Automação)
        │                  │                  │
        └──────────┬───────┴──────────┬───────┘
                   │                  │
                   ▼                  ▼
           OBSIDIAN SKILLS      UI/UX PRO MAX
            (Memory I/O)         (Interface)
                   │
                   ▼
                 JARVIS
```

| Camada ([[_Arquitetura JARVIS]]) | Ferramenta | Papel concreto |
|---|---|---|
| **1 · Memória** (Obsidian) | **Obsidian Skills** | I/O do vault: Markdown, Bases, Canvas, CLI — escrever com fidelidade ao [[_Spec JARVIS]] |
| **2 · Operação** (n8n) | **n8n MCP** | engenharia de workflows: buscar nós, validar e construir por código (aditivo) |
| **3 · Cognição** (Claude Code) | **GSD Core** (método) · **Ruflo** (coordenação, *diferido*) | método de entrega dos agentes; orquestração multi-agente futura |
| **4 · Interface** (Dashboard + `#daily`) | **UI/UX Pro Max** | inteligência de design para a superfície de decisão |

---

## 1 · Obsidian Skills — Interface oficial do Vault `oficial`

- **Papel:** a **Memory I/O** da camada de Memória. É como o JARVIS lê e escreve o vault com fidelidade ao contrato.
- **O que entrega:** `obsidian-markdown` (wikilinks, callouts, properties), `obsidian-bases` (.base), `json-canvas` (.canvas), `obsidian-cli` (operações de vault por linha de comando), `defuddle` (extração limpa de páginas web).
- **Decisão:** toda criação/edição de nota estruturada passa pela gramática dessas skills — **sem inventar sintaxe** fora do [[_Spec JARVIS]].
- **Estado:** `obsidian-markdown`, `obsidian-bases` e `json-canvas` funcionam já; `obsidian-cli` e `defuddle` precisam de binários externos (CLI do Obsidian / Defuddle via Node) para rodar.

## 2 · n8n MCP — Camada oficial de engenharia de workflows `oficial`

- **Papel:** a ferramenta padrão da camada de **Operação**. Quando a Cognição precisa **projetar, validar ou construir** automação, fala com o n8n via MCP — não monta workflow no escuro.
- **Decisão:** todo workflow novo nasce com o ciclo do MCP (`search_nodes` → `get_node_types` → `validate_workflow` → `create_workflow_from_code`), **respeitando a regra aditiva** da [[Ponte n8n ↔ JARVIS]]: cria workflow novo e isolado, **nunca toca os ~42 da produção Yalt**.
- **Estado:** já há um servidor n8n MCP conectado na sessão; isso o torna a interface canônica de engenharia. Prioridade continua sendo contrato humano ([[_Spec JARVIS]] §8) — **n8n nunca decide prioridade**.

## 3 · GSD Core — Princípios de entrega `em incorporação`

- **Papel:** o **método** que move a Cognição de *organizar* para *entregar*. Aplica-se ao [[Agentes JARVIS|Executive Assistant]] e ao [[_Daily Brief (Canônico)|Daily Brief]].
- **Princípios adotados:** laço **discutir → planejar → executar → verificar**; trabalho em **fases** pequenas com estado atômico; **UAT** (validação conversacional) ao fim de cada fase; o brief diário presta contas do que foi **entregue e verificado**, não do que só se mexeu.
- **Limite constitucional:** os princípios rodam **dentro** do [[_Contrato de Autoridade dos Agentes]]. O EA *planeja, prioriza e verifica* (Executar ❌); **quem dispara efeito externo** continua sendo o especialista ou o Operador. Adotamos o **método**, não a autonomia de execução.
- **Estado:** princípios incorporados nos docs; o conjunto completo de 69 skills `gsd-*` fica disponível como ferramenta, mas a adoção é **seletiva**.

## 4 · UI/UX Pro Max — Evolução do Decision Surface `em uso`

- **Papel:** inteligência de design da camada de **Interface**. Evolui o [[🤖 JARVIS|Dashboard]] (e o espelho Slack `#daily`) como **superfície de decisão**, não de inventário.
- **Decisão:** aplicar à evolução visual do dashboard a paleta da marca ([[_Spec JARVIS]] §7), hierarquia decisão-primeiro (Top 3 → Mudou → Riscos → Hoje) e os cartões de métrica — via o snippet `jarvis.css` / `cssclass: jarvis-dashboard`.
- **Estado:** direção definida; a evolução concreta do CSS/layout é o próximo passo executável (sob demanda).

## 5 · Ruflo — Coordenação multi-agente `diferido`

- **Papel:** orquestração de **enxames** de agentes (swarm, memória, federação). É a camada de **Coordenação** — relevante só quando há agentes suficientes para coordenar.
- **Gatilho de reavaliação:** estudar **apenas quando o ecossistema tiver 5–7 agentes realmente operacionais** (autônomos/rodando, não apenas "chapéus" manuais).
- **Estado hoje:** o [[Agentes JARVIS|roster]] tem 9 personas, mas **operacionais de fato** são poucas (BOBBY roda em produção no n8n; o EA é o loop principal). Bem abaixo do gatilho → **não estudar agora**. Reavaliar quando ≥5 personas virarem subagentes/rotinas autônomas.

---

> [!amber] Como esta stack me obriga a operar
> Daqui em diante, dentro do vault: **escrever via Obsidian Skills** (fiel ao Spec), **engenheirar automação via n8n MCP** (aditivo, sem tocar produção), **entregar pelo método GSD** (dentro da autoridade do agente), **evoluir a interface com UI/UX Pro Max**, e **não tocar em Ruflo** até o gatilho de 5–7 agentes operacionais.
