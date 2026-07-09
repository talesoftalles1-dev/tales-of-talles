---
dominio: yalt
tipo: sistema
status: ativo
area: sistema
criado: 2026-07-03
atualizado: 2026-07-03
relacionado:
  - "[[🔁 Automacoes]]"
  - "[[estagiarios]]"
  - "[[Chapter 14 — Commercial Ops (Yalt)]]"
tags:
  - tema/ia
  - automacao
  - n8n
---

# 🗂️ Catálogo de Automações

Entrada de referência para o **E6 · AUTOMATOR** ([[estagiarios]]) antes de criar workflow novo — checa o que já existe para não duplicar. Fonte primária dos dados abaixo: [[Chapter 14 — Commercial Ops (Yalt)]] (estado verificado via API n8n em 2026-07-03).

## Workflows comerciais (n8n `1PX1Rl4zSy2AjmI3`)

| Workflow | ID | Estado | Aprovação humana? |
|---|---|---|---|
| Pilot Qualificação & Outreach | `8joJZGZhRP33ASuK` | ✅ Ativo (v9) | Já aprovado/publicado |
| Apollo Enrichment | `d7UZ2jt2lpnK7sBn` | ⛔ Inativo — falta credencial `Header Auth` (Apollo) | Sim, para ativar |
| CRM Status Sync | `3Yx6Je5MtsrKcO2P` | ⛔ Inativo — falta credencial `CRM Yalt API` (Bearer) | Sim, para ativar |
| Orquestrador Comercial (Control Tower) | `0BFmxjllpEmxJGKN` | ⛔ Inativo — aguarda Slack OAuth religado | Sim, para ativar |
| Admin Limpeza de Órfãos | `BXHXWXqOLx7GOZF6` | ⛔ Inativo — falta credencial `n8n API Key (yalt)` | Sim, para ativar |
| Briefing Diário SDR (legado) | `Sq71PU4KyTtqB033` | ✅ Ativo — duplica o Orquestrador | Desativar quando o Orquestrador subir |
| AgentMail Backlog Drafts | `EWgOiQ3Kg0BEB4j5` | ⛔ Inativo — decisão pendente (esta OU a próxima) | Sim |
| Export Drafts → Slack (Bypass Gmail) | `NkVxv3kQRZc2K7dM` | ⛔ Inativo — decisão pendente (esta OU a anterior) | Sim |

## Automações locais (Node, sem n8n)

| Automação | Pasta | Estado | Aprovação humana? |
|---|---|---|---|
| Briefing Comercial (gerente diário do CRM) | `briefing-comercial/` | ✅ Pronto — requer `YALT_API_KEY` | Não (só lê o CRM) |
| Fila de e-mails pré-cold-call | `briefing-comercial/send-approved.mjs` | ✅ Pronto | **Sim — todo envio** (`aprovacao: aprovado` na fila) |
| Enriquecimento CRM (Lusha via CRM) | `enriquecimento-crm/` | ✅ Pronto — Lusha configurada no CRM | Validação das sugestões; `--max` limita créditos |

> Contrato dos três: [[_Briefing Comercial — Spec]]. Substituem, em versão local-first, os papéis dos workflows n8n "Briefing Diário SDR", "Apollo Enrichment" e "AgentMail Backlog Drafts" acima — que permanecem congelados (aditivo, nada foi tocado).

## Regra para o E6 · AUTOMATOR

Antes de propor um workflow novo: (1) checar esta tabela — se já existe algo próximo, editar/desbloquear em vez de criar; (2) todo workflow novo nasce **inativo**; (3) credenciais nunca em texto — sempre via credential store do n8n; (4) registrar aqui ao criar/alterar, com Estado e "Aprovação humana?".

## Navegação

Detalhe operacional completo (arquitetura, gap ativo, credenciais pendentes): [[Chapter 14 — Commercial Ops (Yalt)]] · Projeto acionável: [[Automacao Comercial Yalt]] · Hub de automação: [[🔁 Automacoes]].
