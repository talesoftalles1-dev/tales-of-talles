# Morning Brief — Runbook

Resumo
- Pipeline: 70 Sistema/Automacao/morning-brief/
- Objetivo: gerar e publicar o briefing diário (Slack #daily) via n8n webhook ou Slack webhook direto.
- Autor: @talesoftalles1-dev

Pré-requisitos
- Importar workflow n8n: `n8n-workflow-morning-brief-delivery.json`
- Copiar `config.example.json` → `config.json`
- Preencher `n8nWebhookUrl` (recomendado) ou `slackWebhookUrl`/`slackBotToken`+`slackChannel`.

Quick start (local — dry-run)
1. Abra PowerShell:
   cd "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\morning-brief"
2. Copiar exemplo:
   Copy-Item config.example.json config.json
3. Editar config.json e preencher `n8nWebhookUrl`.
4. Dry run:
   - Se run.ps1 suporta dry-run:
     .\run.ps1 -WhatIf
   - Ou ajustar `dryRun:true` em config.json:
     node generate.mjs --config ./config.json
5. Verificar logs:
   - debug-*.log e logs/YYYY-MM-DD.log no vaultRoot
   - procurar entradas `n8n_called` / `slack_sent`
6. Execução real:
   .\run.ps1 -Force

Importar e ativar n8n workflow
- UI: Settings → Workflows → Import → selecione `n8n-workflow-morning-brief-delivery.json` → salvar → ativar
- Teste: Execute Workflow manualmente no n8n e verifique HTTP 2xx no webhook

Script de teste webhook
- curl:
  curl -X POST "https://seu-n8n.exemplo/webhook/morning-brief" \
    -H "Content-Type: application/json" \
    -d '{"test":"morning-brief","timestamp":"2026-06-27"}'
- PowerShell:
  $body = @{ test = "morning-brief"; timestamp = (Get-Date).ToString("o") } | ConvertTo-Json
  Invoke-RestMethod -Uri "https://seu-n8n.exemplo/webhook/morning-brief" -Method Post -Body $body -ContentType "application/json"

Security (obrigatório)
- Nunca commitar `config.json` com tokens. Adicionar `70 Sistema/Automacao/morning-brief/config.json` ao `.gitignore`.
- SSOT para credenciais: usar secrets do host / n8n credentials / Vault.
- Revisão PR: confirmar ausência de tokens/webhooks reais nos commits.

Troubleshooting rápido
- `slack_failed`: preencher `n8nWebhookUrl` OU `slackWebhookUrl`.
- Logs vazios: checar `logLevel` e permissões de escrita no vaultRoot.
- n8n retornando 401/403: verificar autenticação do webhook no n8n.

Notas operacionais
- Placeholder `n8nWebhookUrl` é opcional se `slackWebhookUrl` for usado; documentado para evitar ambiguidade futura.
