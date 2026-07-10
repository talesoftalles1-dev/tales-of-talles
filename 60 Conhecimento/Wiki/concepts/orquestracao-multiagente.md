---
dominio: jarvis
tipo: nota
status: publicado
area: sistema
criado: 2026-07-10
atualizado: 2026-07-10
tags:
  - tema/ia
relacionado:
  - "[[jarvis-orquestrador]]"
  - "[[estagiarios]]"
  - "[[bobby-e9-comercial]]"
  - "[[protocolo_orquestracao_jarvis]]"
---

# 🕸️ Orquestração Multiagente

Padrão arquitetural do JARVIS OS: um **orquestrador** ([[jarvis-orquestrador|Jarvis]]) decompõe o estado operacional e delega para uma **camada de execução** de subagentes especializados.

## Definição
O JARVIS opera como sistema multiagente em duas camadas:
1. **Orquestrador** — [[jarvis-orquestrador|Jarvis]] (identidade do Executive Assistant). Visão única do estado, priorização e consolidação. Não executa ação de domínio.
2. **Execução** — [[estagiarios|9 Estagiários (E1–E9)]] + agentes de domínio (TOR, BOBBY, RESEARCH, WRITING, FINANCE, CALENDAR, KNOWLEDGE, HEALTH), concretizados como subagentes nativos do Claude Code.

## Como funciona ([[protocolo_orquestracao_jarvis]])
- Priorização pelo score oficial (_Spec JARVIS §8).
- Bloqueados saem do ranking → área de bloqueios.
- Sequência: agenda → eventos críticos → backlog priorizado.
- E1 (Organização), E6 (Automações), E9 (Comercial) avaliados por relevância de tarefa.
- Saída: Daily Brief + despacho por agente + atualização de `agent_roster.md`.^[raw/protocolo_orquestracao_jarvis.md]

## Governança anti-bifurcação
Cada Estagiário vincula-se a uma linha da matriz de autoridade; novas linhas exigem ratificação do Operador (cláusula de imutabilidade do [[_Contrato de Autoridade dos Agentes]]). E5/E6/E8 foram ratificadas no PR #20 (2026-07-03).^[raw/estagiarios.md]

## Relacionamentos
- Documentada no canon por [[_master_index]] (seção "Arquitetura multiagente").
- O [[bobby-e9-comercial|BOBBY (E9)]] é a projeção comercial desta orquestração.
