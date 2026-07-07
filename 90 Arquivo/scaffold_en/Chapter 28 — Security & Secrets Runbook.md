---
dominio: jarvis
aliases:
  - "Security & Secrets Runbook"
tipo: chapter
status: arquivado
area: 70 Sistema
title: Security & Secrets Runbook
created: 2026-06-27T18:24:00Z
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
# Security & Secrets Runbook

This runbook explains how secrets are managed for the Tales of Talles ecosystem and the mandatory steps to rotate, store, and revoke credentials.

- Secret storage: n8n credentials (recommended) or an external secret manager.
- Never store production credentials in plain markdown in the Vault.
- Steps to rotate a key: see `70 Sistema/Runbooks/Rotate_CRM_Key.md`.
