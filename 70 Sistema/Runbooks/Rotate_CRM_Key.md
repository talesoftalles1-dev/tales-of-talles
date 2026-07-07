---
dominio: jarvis
tipo: runbook
status: rascunho
categoria: operacao
area: empresa
criado: 2026-06-27
atualizado: 2026-07-06
relacionado:
  - "[[70 Sistema/_Index]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
tags:
  - tema/dev
---

# Runbook: Rotacionar Chave CRM (Yalt)

**Objetivo:** rotacionar com segurança a chave CRM exposta e garantir que todas as integrações usem a nova credencial.

## Passos

1. Gerar uma nova chave de API no CRM (escopo: criar/atualizar leads). Nome: `yalt-integ-n8n-YYYYMMDD`.
2. Guardar a nova chave no gestor de segredos escolhido (credenciais do n8n recomendadas).
3. Atualizar a credencial `yalt_api_key` do n8n nos workflows de staging para usar a nova chave.
4. Rodar o workflow de importação PoC (`yalt_sync_import_seed`) com 10 leads de teste.
5. Verificar que os leads aparecem no CRM com `external_id` correto e sem duplicatas.
6. Se estiver OK, atualizar os workflows de produção para a nova credencial e revogar a chave antiga.
7. Remover qualquer ocorrência da chave antiga do Vault e commitar a remoção com a mensagem: `chore(secrets): remove exposed CRM key (rotated)`.
8. Registrar o evento de rotação no log de segurança: quem, quando, `new_key_id`, `old_key_revoked`.

## Reversão

Se ocorrerem problemas críticos, restaurar temporariamente a chave anterior e investigar; revogar a chave restaurada após a correção.
