<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# CRM n8n Workflows — README

This README describes the PoC n8n workflows for syncing Vault notes to the Yalt CRM.

Workflows (exports available in the `workflows/` folder in a follow-up commit):
- yalt_sync_import_seed: manual import of seed leads from exported JSON/CSV.
- yalt_sync_periodic_updates: Cron job to patch changed notes since last_sync.
- yalt_webhook_receiver: HTTP webhook endpoint to receive CRM events and create reconciliation tasks.

Each workflow should use an n8n credential named `yalt_api_key` (created by the Operator during the rotation window).
