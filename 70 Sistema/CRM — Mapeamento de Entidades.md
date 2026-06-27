---
tipo: doc
status: rascunho
categoria: sistema
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[70 Sistema/_Index]]"
  - "[[CRM Unification — Plan]]"
  - "[[CRM MCP — Contract & Scaffold]]"
  - "[[CRM n8n Workflows — README]]"
  - "[[TALES OF TALLES OS — Master Evolution Report]]"
tags:
  - crm
  - mapping
  - vault
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# CRM — Mapeamento de Entidades (Vault ↔ CRM Yalt)

Objetivo
--------
Mapear as entidades e campos do Obsidian Vault para o CRM Yalt para permitir sincronização idempotente e auditável.

Princípios
---------
- SSOT: o Vault é a fonte canônica para specs/contratos e metadados.
- Não sincronizar segredos/credentials do Vault para o repo nem para o CRM.
- Usar `external_id` calculado para idempotência/dedupe.

Chave de deduplicação (external_id)
-----------------------------------
Recomendação: gerar `external_id` por frontmatter `vault.lead_id` quando presente; caso contrário, usar SHA256 do caminho da nota + criado_em (ou um `note_id` estável):

external_id = sha256("<vault_path>::<note_id>")

Mapeamento sugerido (frontmatter -> CRM)
-----------------------------------------
- vault.lead_id -> crm.external_id (string)
- vault.title / file name -> crm.name
- vault.email -> crm.email
- vault.phone -> crm.phone
- vault.company -> crm.account_name
- vault.tags -> crm.tags (array)
- vault.pipeline_state -> crm.pipeline_state (one of: new, enriching, qualified, drafted, sent_or_exported, synced, error)
- vault.assignee -> crm.owner_id (map to CRM user id)
- vault.notes (markdown excerpt) -> crm.notes (plain text + link)
- vault.source_url -> crm.source_url (obsidian:// link or https raw link)
- vault.last_updated -> crm.last_synced_at (timestamp)

Campos adicionais (operacionais)
- vault.priority -> crm.priority
- vault.arr_estimate -> crm.arr_estimate
- vault.tags.additional -> crm.labels

Exemplo de payload (POST /leads)
--------------------------------
{
  "external_id": "sha256:abc123...",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "+5511999999999",
  "company": "ACME Ltda",
  "tags": ["pilot","2026"],
  "pipeline_state": "new",
  "owner_id": "user_123",
  "source_url": "obsidian://open?path=70%20Sistema/lead-joao.md",
  "notes": "Resumo extraído: …"
}

Regra de atualização
--------------------
- Se `external_id` já existe: executar PATCH por id (update); registrar `last_synced_at`.
- Para prevenir duplicação, a criação deve definir external_id por fonte estável.

Links úteis
-----------
- _Contrato de Autoridade dos Agentes
- Automacao/_Morning Brief — Spec (Vault)

