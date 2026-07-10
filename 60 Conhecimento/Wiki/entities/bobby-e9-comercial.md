---
dominio: jarvis
tipo: nota
status: publicado
area: empresa
criado: 2026-07-10
atualizado: 2026-07-10
tags:
  - tema/vendas
relacionado:
  - "[[estagiarios]]"
  - "[[yalt-crm]]"
  - "[[pipeline-comercial-yalt]]"
  - "[[orquestracao-multiagente]]"
---

# 🤝 BOBBY (E9 · Comercial)

Estagiário **E9** da camada de execução do JARVIS — braço de execução do CRM Yalt. Codinome **BOBBY**. Autoridade é projeção **verbatim** da linha BOBBY do [[_Contrato de Autoridade dos Agentes]] (já ratificada de origem; sem autoridade nova).

## O que é
Agente comercial que qualifica leads, monta briefings de pipeline e de preparação de reunião, sugere follow-ups e rascunha outreach — usando a skill `yalt-crm`. Faz parte da [[orquestracao-multiagente|orquestração multiagente]] (delegação do Jarvis).

## Pode
- Consultar o CRM (leads, contatos, logs, stats).
- Criar/editar leads e notas/logs no CRM.
- Qualificar e arquivar leads.
- Produzir briefings comerciais e rascunhos de outreach.^[raw/estagiarios.md]

## Não pode
- Enviar e-mail/outreach externo (rascunho ✅; envio é ⚠️ Operador).
- Redigir proposta comercial formal (é do E2; E9 fornece contexto).
- Criar projeto estratégico sozinho ou definir prioridade global.^[raw/estagiarios.md]

## Saída observada (2026-07-10)
O [[BOBBY relatorio comercial 2026-07-10]] mostra o agente operando em modo de recomendação: classifica FATO (dados do CRM) vs RECOMENDAÇÃO (leitura do BOBBY), **sem enviar outreach externo** — mensagens ficam para aprovação do Operador (Talles). Exemplo de ação de maior retorno: fechar o loop da **LADY BABKA** (send-proposal, 14 dias de silêncio).^[raw/BOBBY relatorio comercial 2026-07-10.md]

## Relacionamentos
- Pertence a [[estagiarios]] (carta E9).
- Opera sobre [[yalt-crm]] → alimenta [[pipeline-comercial-yalt]].
- Escalona → Operador (envio externo, risco de receita) · → E6 (integração) · → E2 (redigir peça formal).
