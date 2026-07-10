---
dominio: yalt
tipo: nota
status: publicado
area: empresa
criado: 2026-07-10
atualizado: 2026-07-10
tags:
  - tema/vendas
relacionado:
  - "[[bobby-e9-comercial]]"
  - "[[pipeline-comercial-yalt]]"
  - "[[BOBBY relatorio comercial 2026-07-10]]"
---

# 🏢 Yalt Sales CRM

Sistema de CRM do domínio **empresa** (`dominio: yalt`). Fonte de verdade dos dados comerciais do JARVIS; acessado via skill `yalt-crm` e pela API (chave válida em 2026-07-10).

## O que é
Plataforma de gestão de leads com estágios de funil, follow-ups agendados e enriquecimento (`salesData`: site, redes, decisor, fornecedor atual). O [[bobby-e9-comercial|BOBBY (E9)]] e os agentes comerciais consultam/atualizam via API — nunca escrevem a chave no vault.

## Fatos-chave (snapshot 2026-07-10, via [[BOBBY relatorio comercial 2026-07-10]])
- Total base: **315.778** leads (308.025 em `new`/scrapper não trabalhado + 7.373 `inadequate`).
- Pipeline qualificado (sem `new`/`inadequate`): **272 leads ativos**.
- Estágios ativos: approaching (148), to-prospect (77), later (35), negociation (10), send-proposal (2).
- Fechados (ganhos): 4 · Perdidos: 104.
- Valor total registado: €1.692,5 · Valor qualificado: €695. **Quase nenhum lead tem valor de negócio preenchido.**^[raw/BOBBY relatorio comercial 2026-07-10.md]
- **110 dos 111 follow-ups agendados estão vencidos**; 0 para hoje.^[raw/BOBBY relatorio comercial 2026-07-10.md]

## Qualidade de dados (sinalizada pelo BOBBY)
- `Supermercado Horizonte` e `Fogo de Chão` em `negociation` mas **nunca contactados** e sem telefone/email — provável classificação errada.
- `made in brazil` e `XMI` tocados recentemente mas com data de follow-up antiga (desatualizada).

## Relacionamentos
- Operado por [[bobby-e9-comercial|BOBBY (E9)]] → alimenta [[pipeline-comercial-yalt]].
- Contrato técnico de sincronização em `Chapter 18 — Sync & MCP Contracts` (referenciado por [[estagiarios]]).

> Contradição em aberto: o valor total (€1.692,5) é muito superior ao qualificado (€695) — gap deriva do preenchimento vazio de `valor` na grande maioria dos leads. Re-ingerir relatório para confirmar tendência.
