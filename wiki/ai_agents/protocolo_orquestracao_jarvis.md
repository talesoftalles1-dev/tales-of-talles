---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-07-09
atualizado: 2026-07-09
area: sistema
relacionado:
  - "[[_master_index]]"
  - "[[estagiarios]]"
  - "[[agent_roster]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
tags:
  - protocolo
  - orquestracao
---

# Protocolo de Orquestração JARVIS

## 1. Papel do orquestrador

Jarvis mantém visão única do estado operacional e delega execução para Estagiários/EAs especializados.

## 2. Regras de decisão

- priorizar tudo pelo score oficial do `_Spec JARVIS` §8
- bloqueados saem do ranking de ação e seguem para área de bloqueios
- irreversível/operador → não executa diretamente, só propõe

## 3. gates/regras adicionais

- agenda primeiro
- seguem-se eventos operacionais críticos
- depois backlog priorizado
- E1/E6/E9 avaliados como relevantes por tarefa

## 4. Saída esperada

- Daily Brief
- despacho estruturado por agente/estagiário
- atualização do `wiki/ai_agents/agent_roster.md` quando houver estado alterado
