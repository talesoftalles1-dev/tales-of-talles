---
tipo: doc
status: publicado
categoria: automacao
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Morning Brief — Spec]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/ia
---

# 🔧 Morning Brief — Runbook Operacional

> [!warning] Para future-you
> Se esqueceu tudo, comece aqui. O brief roda **local**, posta no **#daily**, e nunca depende do n8n para priorização.

> [!success] Status em 2026-06-27
> - ✅ Pipeline local rodando (Node v26). Tarefa agendada **"JARVIS Morning Brief"** criada (09:00 diário).
> - ✅ Workflow de entrega n8n criado **INATIVO**: `gCpvNjBzZ6ZTXg5I` — https://n8n.enyo.cc/workflow/gCpvNjBzZ6ZTXg5I (webhook `POST /webhook/jarvis-morning-brief`, já apontado por `config.json`).
> - ✅ Primeiro brief postado no #daily (validação manual).
> - ⏳ **Falta só ativar a entrega automática:** abrir o workflow → atribuir a credencial Slack "Slack account" ao nó *Post to #daily* → confirmar o bot no #daily → **ativar** o toggle. Enquanto inativo, o run das 09:00 gera+salva local (exit 2 = entrega pendente, esperado).

## Pré-requisitos

1. **Node.js 18+** no PATH (`node --version`)
2. Vault sincronizado em `C:\Users\talle\OneDrive\Documents\Jarvis`
3. Bot Slack membro do canal `#daily` (`/invite @seu-bot`)
4. Credencial Slack configurada (ver § Configuração)

## Configuração inicial (uma vez)

### Opção A — n8n webhook (recomendado)

Geração **local**, entrega via **n8n** (credencial Slack já existente na cloud).

1. Importe `morning-brief/n8n-workflow-morning-brief-delivery.json` no n8n (**inativo**).
2. Ajuste credencial Slack no nó "Slack #daily".
3. Ative e copie URL de produção (ex.: `https://n8n.enyo.cc/webhook/jarvis-morning-brief`).
4. Local:

```powershell
cd "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\morning-brief"
Copy-Item config.example.json config.json
notepad config.json   # preencha n8nWebhookUrl
```

### Opção B — Slack direto (local)

```powershell
Copy-Item config.example.json config.json
# slackWebhookUrl OU slackBotToken + slackChannel
notepad config.json
```

## Como iniciar (agendar 09:00)

```powershell
# Teste manual primeiro
.\run.ps1 -DryRun

# Teste real (posta no Slack)
.\run.ps1

# Se o Windows bloquear scripts nesta sessão:
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run.ps1 -DryRun

# Agendar via Task Scheduler (PowerShell como admin):
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\morning-brief\run.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At 9:00AM
Register-ScheduledTask -TaskName "JARVIS Morning Brief" -Action $action -Trigger $trigger `
  -Description "Gera e publica Morning Brief no Slack #daily"
```

## Como parar

```powershell
Unregister-ScheduledTask -TaskName "JARVIS Morning Brief" -Confirm:$false
```

Ou desative o toggle na Task Scheduler sem apagar a tarefa.

## Teste manual

| Comando | Efeito |
|---|---|
| `.\run.ps1 -DryRun` | Gera brief, imprime, **não** posta |
| `.\run.ps1 -NoSlack` | Salva em `output/`, sem Slack |
| `.\run.ps1 -Force` | Republica mesmo se já postou hoje |
| `node generate.mjs --print --no-slack` | Debug rápido no terminal |

Verifique:
- `output/YYYY-MM-DD-morning-brief.txt` — conteúdo gerado
- `logs/YYYY-MM-DD.log` — JSON por execução
- Slack `#daily` — mensagem única às 09h

## Mudar horário

Edite o trigger da tarefa agendada ou recrie com `-At 8:30AM`. O script não embute horário — só o Scheduler.

## Troubleshooting

| Sintoma | Causa provável | Fix |
|---|---|---|
| `node não encontrado` | Node não no PATH | Instalar Node LTS, reiniciar terminal |
| `run.ps1 não pode ser carregado` | Execution Policy do Windows bloqueou o wrapper | Usar `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run.ps1 -DryRun` ou agendar com o argumento `-ExecutionPolicy Bypass` |
| `webhook ... is not registered` | Workflow n8n não importado/ativo | Importar `n8n-workflow-morning-brief-delivery.json`, configurar credencial Slack, ativar workflow |
| Exit 2, brief em `output/` | Entrega indisponível (n8n/Slack) | Conferir `n8nWebhookUrl` ou credencial Slack; workflow n8n ativo |
| "Brief já publicado hoje" | Dedup funcionando | Use `-Force` se necessário |
| Top 3 vazio | Nenhuma tarefa com `📅` ≤ hoje | Adicionar due dates nas tarefas |
| Comercial vazio | Clientes sem frontmatter | Garantir `tipo: cliente` no CRM |
| Vault vazio / erro | Caminho errado | Ajustar `vaultRoot` em `config.json` |

## Logs

- **Execução:** `morning-brief/logs/YYYY-MM-DD.log` (NDJSON por linha)
- **Estado dedup:** `morning-brief/state/last-post.json`
- **Saída humana:** `morning-brief/output/YYYY-MM-DD-morning-brief.txt`

## Relação com n8n

| Mensagem | Quem produz |
|---|---|
| 🌅 Morning Brief 09h | **Este script (local)** |
| 🔴 Critical Alerts | n8n workflow `JARVIS - Critical Alerts → #daily` (inativo até você ativar) |

Nunca misture: n8n não lê o vault; este script não toca workflows Yalt.
