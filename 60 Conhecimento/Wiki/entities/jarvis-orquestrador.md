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
  - "[[orquestracao-multiagente]]"
  - "[[estagiarios]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[_master_index]]"
---

# 🧭 Jarvis (Orquestrador)

Identidade operacional do **Executive Assistant** no JARVIS OS. Não executa ação de domínio — coordena, prioriza, delega, consolida e valida.

## O que é
O **orquestrador** da [[orquestracao-multiagente|arquitetura multiagente]] do JARVIS: mantém visão única do estado operacional e delega execução para os [[estagiarios]] (E1–E9) e agents de domínio (TOR, BOBBY, RESEARCH, WRITING, FINANCE, CALENDAR, KNOWLEDGE, HEALTH).

## Regras de decisão (do [[protocolo_orquestracao_jarvis]])
- Priorizar tudo pelo score oficial (_Spec JARVIS §8).
- Itens bloqueados saem do ranking de ação → área de bloqueios.
- Irreversível/Operador → só propõe, não executa.
- Sequência de gates: agenda → eventos críticos → backlog priorizado; E1/E6/E9 avaliados por tarefa.^[raw/protocolo_orquestracao_jarvis.md]

## Saída esperada
- Daily Brief.
- Despacho estruturado por agente/estagiário.
- Atualização de `wiki/ai_agents/agent_roster.md` quando o estado muda.^[raw/protocolo_orquestracao_jarvis.md]

## Relacionamentos
- Define o fluxo em [[protocolo_orquestracao_jarvis]].
- Delega para [[estagiarios]] (E1–E9) e agentes de domínio.
- Governa o fluxo `raw/ → wiki/ → output/` documentado em [[_master_index]].
