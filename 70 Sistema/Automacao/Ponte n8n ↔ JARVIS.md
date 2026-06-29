---
dominio: jarvis
tipo: doc
status: rascunho
categoria: automacao
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[🔁 Automacoes]]"
  - "[[Agentes JARVIS]]"
tags:
  - tema/ia
  - tema/vendas
---

# 🔌 Ponte n8n ↔ JARVIS

> [!danger] Antes de tudo: respeitar a produção
> Existe uma operação n8n **viva e crítica** conectada (projeto *enyosolutions* / **Yalt**): ~42 workflows, máquina comercial SDR (backlog 307K leads) e suíte Cloudbeds (hotelaria). **Nada disso será alterado, arquivado ou testado** para integrar o JARVIS. A ponte é **aditiva**: cria workflow novo e isolado.

> [!cyan] Decisão atual (2026-06-27)
> Contrato do canal definido em [[_Canal Daily (Contrato)]]: duas mensagens — 🌅 **Morning Brief** (09h) e 🔴 **Critical Alerts** (Classe C). Restrição-chave: o n8n não lê o vault, então:
> - **n8n monta os Critical Alerts** → **Path 1**, buildável já, criado **inativo**, sem tocar produção.
> - **Morning Brief** é montado pela camada de cognição (Path 2, precisa rodar **local** onde o vault existe).
>
> ✅ **Path 1 CONSTRUÍDO em 2026-06-27** (inativo) — detalhes abaixo.

## ✅ Path 1 — Construído (inativo)

> [!success] JARVIS - Critical Alerts → #daily
> Criado em produção, **INATIVO**, sem tocar nenhum dos 42 workflows. ID `nCG0dfGEzyBLhxLv` · `https://n8n.enyo.cc/workflow/nCG0dfGEzyBLhxLv`

**O que faz:** scan da DataTable `yalt_leads_pilot` 3×/dia (9h/13h/17h — cron `0 9,13,17 * * *`) e detecta **só Classe C**:
- 💰 **Receita em risco:** `urgency_flag` = true · `fit_score` ≥ 50 · `expected_value_score` ≥ 5000 · estágio ativo.
- ⏰ **Follow-ups vencidos:** `follow_up_due_date` < hoje e `follow_up_done` ≠ true · estágio ativo.

**Silêncio sem ruído:** se não há nada crítico, o nó Code retorna `[]` e o Slack **não dispara** — nada é postado. Fiel ao contrato ([[_Canal Daily (Contrato)]]).

**Fluxo:** `Schedule (9/13/17h) + Teste Manual → DataTable get → Code (Classe C) → Slack #daily`.
Credencial Slack: "Slack account" (OAuth, auto-atribuída).

> [!warning] Para ATIVAR (você)
> 1. Abrir o workflow no n8n e revisar.
> 2. Garantir que o bot Slack é membro do **#daily** (`/invite @bot` no canal) — senão o post falha.
> 3. Rodar **Teste Manual** uma vez (lê e posta de verdade) para validar.
> 4. Ativar o agendamento quando estiver satisfeito.

**Ainda não construído:** ~~o 🌅 Morning Brief das 09h (Path 2)~~

> [!success] Path 2 CONSTRUÍDO em 2026-06-27
> Pipeline local-first em `70 Sistema/Automacao/morning-brief/`. Spec: [[_Morning Brief — Spec]] · Runbook: [[_Morning Brief — Runbook]]. Entrega via n8n webhook (`n8n-workflow-morning-brief-delivery.json`) + `config.json` + Task Scheduler.

## 🗺️ Inventário do que já roda (resumo)

**Comercial Yalt (persona [[Agentes JARVIS|BOBBY]]):**
- Captação: *Prospector*, *Pilot Qualificação & Outreach (307K)*, *Import CRM → DataTable*, *Apollo Enrichment*, *Google Maps Prospector*.
- Mensagens: *Outreach Writer*, *Follow-up Sequence*, *AgentMail Backlog Drafts*, *Export Drafts → Slack*.
- Inteligência: *SDR Copilot*, *Pipeline Analyst*, *Dashboard Funil*, *Monitorização & Throughput*.
- Operação: *Briefing Diário SDR* (Slack #sdr, 8h30), *Orquestrador Comercial (Control Tower)*, *Lembretes de Follow-up*, *QA Sampling*.

**Outras:** suíte *Cloudbeds* (check-in/folio/emails de hotelaria), *Yalt → LinkedIn*, *Auditoria Google Ads*.

**Credenciais disponíveis:** OpenAI, Anthropic, Slack (×2), Gmail (×2), LinkedIn, SendGrid (SMTP), S3, Header Auth.

## 🧩 O desafio técnico

O vault JARVIS é **local** (`OneDrive/Documents/Jarvis`, no seu Windows). O n8n é **cloud**. Logo, n8n não escreve direto no vault — precisamos de uma ponte de arquivo ou de notificação.

## 🛣️ Opções de integração (escolher uma)

| # | Caminho | Como funciona | Prós | Contras |
|---|---|---|---|---|
| **A** | **Slack/E-mail → colar** | n8n manda o resumo (já manda p/ #sdr); você cola no [[📥 Inbox]] | Zero build, hoje | Manual |
| **B** | **n8n → OneDrive (MS Graph)** | n8n escreve um `.md` na pasta do vault no OneDrive; sincroniza sozinho e aparece no Obsidian | Automático, nativo do seu OneDrive | Precisa credencial Microsoft Graph no n8n |
| **C** | **n8n → S3 → poller local** | n8n grava no S3 (credencial já existe); uma tarefa agendada (PowerShell) no seu PC puxa p/ o vault | Usa o que já há (S3) | Precisa um script local agendado |
| **D** | Obsidian Local REST API + túnel | n8n chama uma API local exposta | Tempo real | Expõe seu PC; **não recomendado** |

> [!tip] Recomendação
> **B** se você toparem adicionar uma credencial Microsoft Graph (mais limpo e automático). Senão, **A agora** (custo zero) e **C** quando quiser automação real sem expor nada.

## 🚀 Primeiro workflow proposto (a construir após você escolher A/B/C)

**`JARVIS – Briefing Comercial → Vault`**
- **Gatilho:** agendado, 1×/dia (ex.: 7h, antes do seu balanço de abertura).
- **Lê:** os mesmos dados do *Control Tower* / *Dashboard Funil* (só leitura): funil por estágio, top oportunidades por ARR, follow-ups vencidos.
- **Formata:** um bloco Markdown JARVIS (callout + tabela), com data e propriedades.
- **Entrega (fase 1):** Slack **`#daily`** — resumo formatado, pronto para ler de manhã.
- **Entrega (fase 2, opcional):** dali para o vault (colar, ou poller S3 → Daily Note / nota em [[🏢 Yalt]]).

Resultado: você recebe o pulso comercial do BOBBY no `#daily` ao lado das suas 3 ações do dia; depois, se quiser, ele também se arquiva no vault.

> [!warning] Quando você der o "go", confirmo só isto
> 1. Posso **criar um workflow novo** no projeto n8n (sem tocar nos existentes)?
> 2. Horário do disparo diário (ex.: 7h).
> 3. Confirmar o canal `#daily` como destino.

## 🔁 Fluxos JARVIS-nativos (independentes do n8n)

Captura, criação de notas, resumo de reunião e manutenção continuam em [[🔁 Automacoes]] (QuickAdd, Templater, Linter). Esta ponte cobre só o que vem do n8n.
