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
  - "[[_master_index]]"
  - "[[estagiarios]]"
  - "[[protocolo_orquestracao_jarvis]]"
---

# 📚 Sources — Ingest Comercial (2026-07-10)

Resumo das fontes ingeridas no sub-sistema LLM-wiki nesta sessão. Cada fonte original está preservada como captura imutável em `raw/`.

## Fontes ingeridas
1. **[[BOBBY relatorio comercial 2026-07-10]]** (tipo: doc, area: empresa, agente: E9) — Plano do dia comercial extraído do Yalt Sales CRM: funil de 315.778 leads (272 qualificados), 110/111 follow-ups vencidos, 12 oportunidades quentes. Materializado em [[pipeline-comercial-yalt]] e [[yalt-crm]].^[raw/BOBBY relatorio comercial 2026-07-10.md]
2. **[[estagiarios]]** (tipo: sistema, area: sistema) — Contrato canônico de autoridade dos 9 Estagiários (E1–E9). Base para [[bobby-e9-comercial]] e [[orquestracao-multiagente]].^[raw/estagiarios.md]
3. **[[protocolo_orquestracao_jarvis]]** (tipo: sistema, area: sistema) — Como o orquestrador Jarvis prioriza, delega e consolida. Base para [[orquestracao-multiagente]].^[raw/protocolo_orquestracao_jarvis.md]

## Síntese
O ingest revela dois eixos consolidáveis: (a) a [[orquestracao-multiagente|orquestração multiagente]] do JARVIS (Jarvis + 9 Estagiários) e (b) o [[pipeline-comercial-yalt|pipeline comercial Yalt]] operado pelo [[bobby-e9-comercial|BOBBY (E9)]].

> Limite deste ingest: dados de 2026-07-10. Pipeline comercial é volátil — re-ingerir o relatório BOBBY para atualizar [[pipeline-comercial-yalt]] e [[yalt-crm]].
