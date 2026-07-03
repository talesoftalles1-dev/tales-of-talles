---
dominio: jarvis
aliases:
  - "Automations & n8n Bridge"
tipo: chapter
status: ativo
area: 70 Sistema
title: Automations & n8n Bridge
created: 2026-06-27T18:24:00Z
atualizado: 2026-06-29
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
# Automations & n8n Bridge

A ponte de automação do JARVIS vive numa instância **n8n Cloud** (`talesoftalles.app.n8n.cloud`, projeto pessoal). O PWA (`index.html`, publicado em GitHub Pages) chama webhooks n8n via `fetch` POST. Cada "coach" é um workflow independente.

> Auditoria completa e estado atual: [[n8n Audit Report — 2026-06-29]].
> **Estado 2026-06-29:** instância Cloud congelada — o *trial* do n8n Cloud expirou; nenhum workflow executa. **Migração para self-host preparada** em [`Automacao/n8n-selfhost/`](Automacao/n8n-selfhost/README.md) (8 workflows exportados + docker-compose + npm + runbook).

## Endpoints (contrato PWA ↔ n8n)

| Endpoint (POST) | Workflow | Tipo | Resposta |
|---|---|---|---|
| `/webhook/tales-ilia` | Ilia (Striking) | Code puro | `{coach, flag, msg, workout}` |
| `/webhook/tales-muzy` | Muzy (Recuperação) | Code puro | `{coach, flag, msg, readiness, avgFat, band}` |
| `/webhook/tales-cariani` | Cariani (Biomecânica) | Code puro | `{coach, flag, msg, topMuscle, topFat}` |
| `/webhook/tales-sanji` | Sanji (Nutrição) | Code puro | `{coach, flag, msg, proteinEst, rem, mealsTotal}` |
| `/webhook/tales-vision` | Visão (Ilia/Cariani) | Proxy Anthropic | resposta Claude (JSON) |
| `/webhook/tales-meal-vision` | Sanji vê o prato | Proxy Anthropic | `{food, kcal, protein, slot}` |
| `/webhook/tales-sanji-vision` | Sanji lê a nota | Proxy Anthropic | `{items: [...]}` |
| `/webhook/tales-notion-sync` | Sync Notion | Notion create page | `{ok, url}` |

## Dependências externas
- **Anthropic Messages API** (`api.anthropic.com/v1/messages`) — 3 proxies de visão. Requer credencial *Header Auth* `x-api-key` (em falta).
- **Notion API** — Sync Notion (Diário do Camp, db `405d06f8…`). Requer credencial Notion (em falta).
- Os 4 coaches de texto não têm dependências externas (lógica em nó Code) — são o caminho mais resiliente.

## Padrão de design
`Webhook (CORS *) → [Code | Montar payload + HTTP] → Respond to Webhook (ACAO: *)`. Os proxies de visão têm agora **timeout 30 s + retry 3×/backoff** nos nós HTTP (auditoria 2026-06-29).

## Pendências
Ver secção "Itens que requerem ação do utilizador" em [[n8n Audit Report — 2026-06-29]].
