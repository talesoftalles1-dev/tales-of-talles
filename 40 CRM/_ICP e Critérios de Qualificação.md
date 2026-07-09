---
dominio: yalt
tipo: doc
status: rascunho
categoria: comercial
area: empresa
criado: 2026-07-09
atualizado: 2026-07-09
relacionado:
  - "[[_Briefing Comercial — Spec]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
tags:
  - tema/vendas
---

# 🎯 ICP e Critérios de Qualificação

> [!warning] Rascunho — preencher pelo Operador
> Este documento é o **filtro humano** do pipeline de enriquecimento: todo lead novo sugerido pelos agentes (RESEARCH/BOBBY) é avaliado contra estes critérios ANTES de entrar como qualificado no CRM. Enquanto estiver `rascunho`, os agentes só sugerem — não qualificam.

## Perfil de Cliente Ideal (ICP)

| Critério | Valor | Exemplo |
|---|---|---|
| Segmento(s) | _preencher_ | ex.: varejo alimentar, redes de franquia |
| Porte | _preencher_ | ex.: 5–100 funcionários, X lojas |
| Região | _preencher_ | ex.: Grande Lisboa / Portugal |
| Sinal de compra | _preencher_ | ex.: abriu filial, contratou marketing |
| Ticket mínimo viável | _preencher_ | |

## Decisor-alvo

| Campo | Valor |
|---|---|
| Cargos prioritários | _preencher_ — ex.: dono, diretor de marketing, gerente comercial |
| Cargos a evitar | _preencher_ |
| Dado mínimo para outreach | e-mail validado + nome + cargo |

## Desqualificação imediata

- _preencher_ — ex.: concorrente, fora da região, porte abaixo do mínimo…

## Como os agentes usam

1. **RESEARCH (E3)** pesquisa empresas/decisores → só propõe quem passa nos filtros acima.
2. **Lusha (via CRM)** completa e-mail/telefone dos decisores propostos (`enriquecimento-crm/enrich.mjs`).
3. **Operador** valida a sugestão no CRM → só então o lead entra no ranking do Briefing Comercial e na fila de e-mails.
