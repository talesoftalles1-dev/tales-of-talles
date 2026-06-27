---
tipo: runbook
status: draft
categoria: operations
area: security
criado: 2026-06-27
atualizado: 2026-06-27
---

# Runbook: Rotate CRM Key (yalt)

Purpose: Safely rotate the exposed CRM key and ensure all integrations use the new credential.

Steps:
1. Generate a new API key in the CRM (scope to leads create/update). Name: `yalt-integ-n8n-YYYYMMDD`.
2. Store the new key in the chosen secret manager (n8n credentials recommended).
3. Update the n8n credential `yalt_api_key` in staging workflows to use the new key.
4. Run the PoC import workflow (`yalt_sync_import_seed`) with 10 test leads.
5. Verify leads appear in CRM with correct `external_id` and no duplicates.
6. If OK, update production workflows to the new credential and revoke the old key.
7. Remove any occurrences of the old key from the Vault and commit the removal with message: `chore(secrets): remove exposed CRM key (rotated)`.
8. Record rotation event in the security log: who, when, new_key_id, old_key_revoked.

Rollback: If critical issues occur, restore previous key temporarily and investigate; revoke restored key after fix.
