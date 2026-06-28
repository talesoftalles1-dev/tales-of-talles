---
dominio: jarvis
tipo: sop
status: ativo
responsavel: Talles Soares
versao: 1
criado: 2026-06-08
atualizado: 2026-06-27
tags:
  - tema/vendas
---

# 📋 SOP - Fechar Venda

> [!info] Procedimento Operacional Padrão
> Passo a passo para conduzir uma oportunidade da proposta até o fechamento e a passagem para o onboarding. Objetivo: tornar o fechamento previsível e sem pontas soltas. **Versão 1** · Responsável: Talles Soares.

## 🎯 Objetivo

Garantir que toda venda siga o mesmo fluxo — proposta clara, follow-up disciplinado, negociação registrada e handoff limpo para operações — reduzindo perdas por falta de acompanhamento.

## 🧭 Pré-requisitos

- Lead qualificado e registrado no CRM (`tipo: cliente`, `status: lead`).
- Necessidade e orçamento minimamente entendidos.
- Decisor identificado (ex.: [[Joao Silva]] na [[CRM API]]).

## 🔢 Passo a passo

### Passo 1 — Enviar proposta
Montar proposta com escopo, prazo e valor. Enviar por e-mail e confirmar recebimento. Atualizar `status` do cliente para `lead` em negociação.

### Passo 2 — Follow-up
Acompanhar em até 48h. Se não houver resposta, novo toque em 3 e em 7 dias. Registrar cada contato no histórico da nota do cliente.

### Passo 3 — Negociação
Tratar objeções de preço/prazo. Ajustar escopo, não o valor, sempre que possível. Registrar a versão final acordada.

### Passo 4 — Fechamento
Confirmar aceite por escrito. Enviar contrato para assinatura. Mudar `status` do cliente para `ativo` e preencher `valor` no frontmatter.

### Passo 5 — Registrar e fazer handoff
Lançar a primeira parcela no financeiro. Acionar o [[Processo de Onboarding de Cliente]] e agendar o kickoff.

## ✅ Checklist de fechamento

- [ ] Proposta enviada e recebimento confirmado
- [ ] Follow-up feito (48h / 3 dias / 7 dias)
- [ ] Objeções tratadas e escopo final acordado
- [ ] Aceite por escrito obtido
- [ ] Contrato enviado para assinatura
- [ ] Cliente atualizado para `status: ativo` com `valor` preenchido
- [ ] Primeira parcela registrada no financeiro
- [ ] [[Processo de Onboarding de Cliente]] acionado

## ⚠️ Erros comuns a evitar

> [!warning] Atenção
> - Não baixar preço sem reduzir escopo correspondente.
> - Não deixar follow-up sem cadência definida — é onde a maioria das vendas morre.
> - Não iniciar entrega antes do contrato assinado.

## 📜 Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| 1 | 2026-06-08 | Versão inicial do SOP. |

## 🔗 Relacionados

- [[Processo de Onboarding de Cliente]]
- Exemplo aplicado: [[CRM API]] / [[Lancamento do Novo Site]]
