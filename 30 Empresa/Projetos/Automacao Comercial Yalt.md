---
dominio: yalt
tipo: projeto
status: ativo
area: empresa
prioridade: alta
importancia: 3
valor_estrategico: 3
energia: media
inicio: 2026-06-10
prazo: 2026-07-10
progresso: 50
objetivo: "[[Crescer Faturamento 2026]]"
criado: 2026-07-03
atualizado: 2026-07-03
tags:
  - tema/automacao
  - tema/vendas
  - tema/ia
---

# 🚀 Automação Comercial Yalt

> [!info] Visão geral
> Motor de qualificação, enriquecimento e outreach de leads da Yalt, construído em n8n sobre IA (gpt-5.2). Fundação técnica pronta (5 workflows testados); o que falta é essencialmente **desbloqueio de credenciais** (trabalho manual do Talles) e depois a camada de execução automática. Detalhe técnico completo em [[Chapter 14 — Commercial Ops (Yalt)]].

## 🎯 Objetivo do projeto

Tirar o pipeline comercial da Yalt do "construído mas bloqueado" para "rodando sozinho": leads entram, são qualificados e enriquecidos por IA, o outreach é redigido automaticamente, o CRM fica sincronizado e o Talles só revisa/aprova o que exige julgamento comercial real.

## 📌 Status atual (verificado 2026-07-03)

| Frente | Status |
|---|---|
| Pilot Qualificação & Outreach | ✅ Ativo e publicado |
| Apollo Enrichment | ⛔ Bloqueado — credencial |
| CRM Status Sync | ⛔ Bloqueado — credencial (não existe ainda) |
| Orquestrador (Control Tower) | ⛔ Bloqueado — Slack OAuth |
| Rota de saída p/ leads sem Gmail | ⛔ Nenhuma ativa (2 opções construídas, nenhuma ligada) |
| Camada de execução automática | ⛔ Não construída — Orquestrador só lê/reporta |

## ✅ Tarefas

### Prioridade 0 — desbloqueadores imediatos (só Talles, ~30 min)
- [ ] Religar Slack OAuth no n8n (Credentials → Slack → reauth) 🔺 📅 2026-07-04
- [ ] Religar Gmail OAuth no n8n 🔺 📅 2026-07-04
- [ ] Criar credencial `CRM Yalt API` (Bearer token) 🔺 📅 2026-07-04
- [ ] Confirmar/renomear a credencial `Header Auth` existente (Apollo? n8n API Key?) 🔺 📅 2026-07-04
- [ ] Ativar Orquestrador (`0BFmxjllpEmxJGKN`) e desativar Briefing antigo (`Sq71PU4KyTtqB033`) 🔼 📅 2026-07-05
- [ ] Decidir rota de saída p/ leads sem Gmail: AgentMail vs. Export→Slack (ativar só uma) 🔼 📅 2026-07-05
- [ ] Apagar lead de teste `ZZ-TESTE-HARDENING-v8-apagar` (id 132) na DataTable 🔽 📅 2026-07-05

### Prioridade 1 — próximo incremento técnico
- [ ] Construir camada de execução do Orquestrador (chamar sub-workflows por `pipeline_state`) 🔼 📅 2026-07-17
- [ ] Ativar trigger automático do Pilot (schedule ou webhook de entrada) 📅 2026-07-17
- [ ] Fonte de entrada automática de leads (LinkedIn, formulários) 📅 2026-07-17
- [ ] Criar credencial `n8n API Key (yalt)` → ativa Admin Limpeza de Órfãos 📅 2026-07-17

### Prioridade 2 — escala de email
- [ ] Decidir camada de envio em escala (Gmail Classe A vs. ESP para volume) 📅 2026-08-01
- [ ] Configurar DKIM do ESP escolhido + atualizar SPF 📅 2026-08-01
- [ ] Tracking de opens/clicks (pixels/UTM) 🔽 📅 2026-08-01
- [ ] Webhooks de bounce/unsubscribe 🔽 📅 2026-08-01
- [ ] Link de unsubscribe/opt-out no CRM (obrigatório legal — CAN-SPAM/GDPR) 🔼 📅 2026-08-01
- [ ] Evoluir DMARC `p=none` → `p=quarantine` 🔽 📅 2026-08-01

### Prioridade 3 — enriquecimento e qualificação contínua
- [ ] Apollo Enrichment em schedule contínuo 🔽 📅 2026-08-15
- [ ] Score automático de leads (ARR + fit + urgência) 🔽 📅 2026-08-15
- [ ] MCP próprio para o CRM Yalt (acesso direto do Claude, sem passar pelo n8n) 🔽 📅 2026-08-15

## 🔐 Nota de segurança

Nenhuma credencial ou chave de API deste projeto deve ser colada em chat/automação — criação sempre manual, direto na UI do n8n ou do conector, pelo Talles. Ver [[Chapter 14 — Commercial Ops (Yalt)]] § Credenciais pendentes.

## 🔗 Relacionados

- Objetivo: [[Crescer Faturamento 2026]]
- Detalhe técnico: [[Chapter 14 — Commercial Ops (Yalt)]]
- Entregabilidade de email: [[Plano de Testes de Email Yalt]]
- Integração JARVIS ↔ Yalt: [[_Integracoes Yalt]]
- Hub: [[🏢 Yalt]]
