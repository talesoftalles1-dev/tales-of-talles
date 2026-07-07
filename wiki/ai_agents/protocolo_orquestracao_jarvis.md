---
dominio: jarvis
tipo: sistema
status: ativo
area: sistema
criado: 2026-07-03
atualizado: 2026-07-03
relacionado:
  - "[[_master_index]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[_Spec JARVIS]]"
  - "[[_Arquitetura JARVIS]]"
  - "[[estagiarios]]"
tags:
  - tema/ia
  - agent
  - orquestracao
---

# 🧠 Protocolo de Orquestração do Jarvis

> [!jarvis] Jarvis deixou de ser um prompt
> **Jarvis é o ORQUESTRADOR** — a identidade operacional do [[_Contrato de Autoridade dos Agentes|Executive Assistant]] elevada a cérebro central. Ele **coordena, prioriza e delega**; **não executa** ação de domínio sozinho. Os [[estagiarios|Estagiários]] são a camada de execução que ele dispara — em paralelo sempre que possível.

## Identidade e fronteira

| Jarvis **é** | Jarvis **não é** |
|---|---|
| O orquestrador: divide tarefas, distribui carga, consolida respostas | Um executor que faz tudo sozinho |
| Quem decide **prioridade** ([[_Spec JARVIS]] §8) | Quem escreve o código / envia o e-mail / move o dinheiro |
| Quem mantém o **contexto global** e evita retrabalho | Um segundo cérebro concorrente do EA — é a **mesma** função |
| Quem monitora execução e **valida qualidade** (via [[estagiarios|Estagiário 5]]) | Quem aprova o irreversível — isso é do Operador |

**Separação de poderes** ([[_Contrato de Autoridade dos Agentes]]): o orquestrador decide prioridade mas não executa no domínio; os especialistas executam no domínio mas não priorizam entre domínios. Efeito externo/irreversível → **default-deny** → Operador.

## Ciclo canônico de orquestração

```mermaid
graph LR
    A[RECEBER] --> B[DECOMPOR]
    B --> C[PRIORIZAR]
    C --> D[DELEGAR]
    D --> E[EXECUTAR EM PARALELO]
    E --> F[CONSOLIDAR]
    F --> G[VALIDAR]
    G -->|conforme| H[ENTREGAR]
    G -->|bloqueado| D
    H --> I{efeito externo?}
    I -->|sim| J[ESCALAR AO OPERADOR]
    I -->|não| K[FIM]
```

1. **RECEBER** — captura a intenção (Operador, `raw/`, evento do [[_Arquitetura JARVIS|Event Bus]]).
2. **DECOMPOR** — se não-trivial, aciona o [[estagiarios|Estagiário 8 (Planejamento)]] para quebrar em tarefas atômicas + dependências.
3. **PRIORIZAR** — aplica o score de prioridade ([[_Spec JARVIS]] §8). Bloqueados (com `dependencia` ou `status: pausado`) saem do ranking de ação.
4. **DELEGAR** — mapeia cada tarefa ao Estagiário dono (tabela abaixo). Least-privilege: cada um recebe só o necessário.
5. **EXECUTAR EM PARALELO** — tarefas **independentes** rodam ao mesmo tempo (ver regras abaixo).
6. **CONSOLIDAR** — reúne as saídas dos Estagiários num resultado único e coerente.
7. **VALIDAR** — o [[estagiarios|Estagiário 5 (Revisão)]] faz verificação adversarial antes da entrega. Bloqueado → volta para DELEGAR.
8. **ENTREGAR / ESCALAR** — entrega o resultado; se houver efeito externo/irreversível, **escala ao Operador** (default-deny).

## Matriz de delegação (gatilho → Estagiário)

| Gatilho / natureza da tarefa | Estagiário | Codinome |
|---|---|---|
| Triar `raw/`, classificar, arquivar, arrumar índices | E1 | ORGANIZER |
| Escrever docs, propostas, posts, SOPs (rascunho) | E2 | WRITING |
| Pesquisar, verificar fatos, comparar opções | E3 | RESEARCH |
| Codar, testar, mexer em repositório | E4 | TOR |
| Revisar / QA / verificação adversarial | E5 | REVIEWER |
| Construir/validar automação (n8n, script) | E6 | AUTOMATOR |
| Indexar, manter wiki, ligar backlinks | E7 | KNOWLEDGE |
| Decompor objetivo, sequenciar, montar roadmap | E8 | PLANNER |
| Consultar/atualizar o CRM Yalt, qualificar leads, briefing comercial | E9 | BOBBY |

Domínios de negócio permanecem com os agentes nomeados do [[_Contrato de Autoridade dos Agentes]]: **BOBBY** (comercial/CRM, executado por E9), **FINANCE** (registro financeiro), **CALENDAR** (agenda), **HEALTH** (hábitos/treino). Os Estagiários são o substrato de execução; não substituem esses donos de domínio — E9 é o primeiro caso em que um Estagiário e um agente de domínio nomeado coincidem 1:1 (mesma linha de autoridade, projeção mecânica).

## Regras de paralelização (FASE 3)

1. **Divida quando houver ganho real.** Tarefa trivial não vira fan-out — o custo de coordenação supera o ganho.
2. **Paralelize só o independente.** Duas tarefas rodam juntas se nenhuma depende da saída da outra. Dependência → serialize (o E8 marca o caminho crítico).
3. **Um dono por artefato.** Para evitar conflito de escrita, cada arquivo/nota tem um único Estagiário responsável por vez. Escrita concorrente no mesmo alvo = serialize ou use worktrees isolados.
4. **Consolidação central.** As saídas paralelas convergem no Jarvis, nunca se auto-mesclam. O Jarvis dedup e resolve conflitos pela prioridade.
5. **Evite retrabalho.** Antes de delegar, o Jarvis checa a memória local dos Estagiários (`wiki/ai_agents/memoria/`) e o que já existe — não refaz o que já está feito.
6. **Sem gargalo humano falso.** O que é read-only/reversível flui; só o irreversível/externo espera aprovação.

## Conexão com Event Bus e Daily Brief

- O Jarvis consome eventos ([[_Arquitetura JARVIS]]): `TaskCreated`, `ProjectBlocked`, `RevenueRiskDetected`, etc., e decide quem age — sempre conforme o [[_Contrato de Autoridade dos Agentes]].
- A saída priorizada do Jarvis alimenta o [[_Daily Brief (Canônico)|Daily Brief]] e o `output/daily_dashboard.md`: o Operador vê **decisão** (as 3 ações de hoje), não o caos.

## Substrato técnico

Os Estagiários são **subagentes nativos do Claude Code** (`.claude/agents/estagiario-*.md`), disparados pela ferramenta Agent. Decisão de não adotar o Ruflo agora: [[adr_ruflo_vs_subagentes_nativos]]. Cartas de autoridade detalhadas: [[estagiarios]].

## Hierarquia de documentos desta camada (para não bifurcar)

Este protocolo descreve **processo** (como o Jarvis decompõe/prioriza/delega), não autoridade. Quatro documentos cobrem a camada de agentes — cada um com um papel único, sem sobreposição:

| Documento | Papel | Tipo |
|---|---|---|
| [[estagiarios]] | **Canon de autoridade** — cartas Pode/Não pode/Inputs/Outputs de cada Estagiário | Fonte da verdade |
| [[protocolo_orquestracao_jarvis]] (este arquivo) | **Canon de processo** — como o Jarvis decide, decompõe, delega, consolida | Fonte da verdade |
| [[agent_roster]] | Status operacional em tempo real (online/idle/carga) | Derivado — painel, não autoridade |
| [[Chapter 29 — Agent Roster & Authority]] | Ponteiro de navegação (repo-side) para os dois canônicos acima | Derivado — não duplica conteúdo |

Dúvida sobre "o que um agente pode fazer" → [[estagiarios]]. Dúvida sobre "como o trabalho flui entre eles" → este arquivo. Nenhum outro documento deve redefinir autoridade ou processo — só apontar para estes dois.

> **Nota de proveniência (2026-07-03):** este protocolo e o contrato [[estagiarios]] foram desenhados numa sessão anterior em worktree isolado (`claude/zen-mclaren-ab1c72`) e materializados aqui no vault principal numa sessão de continuidade que também adicionou o E9/BOBBY (skill `yalt-crm` recém-instalada). Ver [[Chapter 18 — Sync & MCP Contracts]] para o contrato técnico do CRM.
