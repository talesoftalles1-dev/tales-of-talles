---
dominio: yalt
tipo: runbook
status: ativo
area: empresa
criado: 2026-07-09
atualizado: 2026-07-09
relacionado:
  - "[[_Briefing Comercial — Spec]]"
  - "[[_ICP e Critérios de Qualificação]]"
  - "[[catalogo_automacoes]]"
tags:
  - tema/vendas
  - automacao
---

# 🔎 Enriquecimento CRM — Runbook

> Completa contatos do Yalt CRM via **Lusha (endpoint nativo do CRM)** e lista leads que precisam de pesquisa de decisor. Substitui o fluxo manual LinkedIn+Lusha para a parte automatizável. Contrato: [[_Briefing Comercial — Spec]] §Enriquecimento.

## Pré-requisitos

1. Node 18+ e `YALT_API_KEY` no ambiente (mesma chave do briefing).
2. Integração Lusha configurada **no CRM** (a chave Lusha não passa por aqui).
3. Critérios de qualificação preenchidos em [[_ICP e Critérios de Qualificação]].

## Execução

```powershell
cd "70 Sistema/Automacao/enriquecimento-crm"

node enrich.mjs --dry-run        # mostra o que seria enriquecido, sem gastar créditos
node enrich.mjs                  # enriquece até 5 contatos (default)
node enrich.mjs --max 10         # sobe o teto de créditos da execução
node enrich.mjs --lead <uuid>    # foca um lead específico
```

Saída: `output/enriquecimento_YYYY-MM-DD.md` com:
- contatos enriquecidos (status ok/falha) — **sugestões pendentes de validação**;
- leads ativos sem nenhum contato → fila de pesquisa para o RESEARCH (E3) ou manual.

## Regras

- `--max` existe porque **crédito Lusha custa dinheiro** — subir o teto é decisão consciente, não default.
- Dados retornados são sugestão: o Operador valida no CRM antes de qualquer outreach.
- **Sem scraping de LinkedIn** (ToS). O que o Operador copiar manualmente do LinkedIn entra por `raw/inbox.md` e segue o fluxo normal.

## Cadência sugerida

Semanal no início (validar taxa de acerto ≥70% contra o processo manual — critério de verificação do plano); diária depois que a confiança se firmar. Agendável por Routine do Claude ou tarefa Windows, mesmo padrão do `briefing-comercial/RUNBOOK.md`.
