---
dominio: jarvis
tipo: doc
status: arquivado
categoria: sistema
area: empresa
criado: 2026-06-27
atualizado: 2026-07-03
relacionado:
  - "[[70 Sistema/_Index]]"
  - "[[CRM — Mapeamento de Entidades]]"
  - "[[CRM Unification — Plan]]"
  - "[[CRM n8n Workflows — README]]"
  - "[[Chapter 18 — Sync & MCP Contracts]]"
tags:
  - crm
  - mcp
  - scaffold
---

> [!warning] Superado em 2026-07-03
> Este documento era um rascunho **especulativo** (endpoints e auth adivinhados, antes de existir qualquer conector). A skill `yalt-crm` foi instalada no Cowork e o contrato real — endpoints verdadeiros, auth confirmada, caveats de dado, achado do bloqueio de rede do sandbox — vive agora em [[Chapter 18 — Sync & MCP Contracts]]. Mantido aqui só como histórico; **não usar como referência técnica**.

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# CRM MCP — Contract & Scaffold

## Overview
Scaffold for a minimal MCP (connector) to the Yalt CRM. This contract documents endpoints, auth, idempotency, and retry behaviour.

## Auth
- API Key via `X-Api-Key` header or `Authorization: Bearer <key>`.
- Key must be kept in n8n credentials or external secret manager.

## Endpoints (minimal)
- GET /leads?external_id={external_id}
- POST /leads
- PATCH /leads/{id}
- (optional) POST /webhooks/verify

## Idempotency
- `external_id` is the dedupe key. Clients MUST calculate `external_id` before creating new leads.
- Server should accept `Idempotency-Key` header where supported.

## Retries
- Exponential backoff on 5xx and 429. Do not retry 4xx except 429.

## Sample payload
Refer to `70 Sistema/CRM — Mapeamento de Entidades.md` for field mapping.
