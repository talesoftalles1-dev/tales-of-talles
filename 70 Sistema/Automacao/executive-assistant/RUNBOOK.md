---
dominio: jarvis
tipo: doc
status: publicado
categoria: automacao
criado: 2026-06-27
atualizado: 2026-07-06
tags:
  - tema/ia
---

# Executive Assistant — Daily Dashboard · Runbook

## Resumo
- Pipeline: `70 Sistema/Automacao/executive-assistant/`
- Objetivo: regenerar **`output/daily_dashboard.md`** (o cockpit "Filtro de Ruído" — §8 do `_Spec JARVIS`) de forma determinística, todo dia de manhã.
- Gerador: `dashboard.mjs` (Node, ESM). Reutiliza a lib de prioridade/vault do Morning Brief (`../morning-brief/lib/`) — **não duplica** scoring.

## O que o run automático FAZ (determinístico)
Lê as propriedades das notas do vault (fonte da verdade) + `raw/inbox.md` e compila:
- **🎯 Hoje** — até 3 ações críticas (tarefas com prazo ≤ hoje, por prioridade).
- **⏭ Próximo** — projetos `ativos` ranqueados por `score` (§8) + sinais comerciais.
- **⚠ Bloqueios** — projetos pausados/com dependência e tarefas atrasadas.
- **📥 Inbox** — contador de capturas pendentes em `raw/inbox.md`.
- **📊 Vitais** — capturas no inbox, tarefas hoje/atrasadas, projetos ativos, nº de notas, timestamp da última execução.

## O que o run automático NÃO faz
- **Não faz triagem LLM** de capturas livres (transcrições, ideias soltas) → isso exige raciocínio e roda numa **sessão interativa** do Executive Assistant (Claude). Quando há capturas pendentes, o dashboard sinaliza "N aguardando triagem" para você rodar essa passada.
- Motivo: não há `claude` CLI no PATH desta máquina, e escrita de arquivos por LLM sem supervisão (no agendamento) seria arriscada.

## Quick start (local)
```powershell
cd "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\executive-assistant"
# Dry-run (imprime, não escreve):
.\run.ps1 -DryRun
# Execução real (sobrescreve output/daily_dashboard.md):
.\run.ps1
```

## Agendamento (Windows Task Scheduler)
- Tarefa: **"JARVIS Executive Assistant"** — diária às **07:00** (antes do Morning Brief das 09:00, para o cockpit já estar fresco).
- Espelha a tarefa "JARVIS Morning Brief": `LogonType Interactive`, `RunLevel Limited`, limite 10 min, `StartWhenAvailable`.

Instalar/atualizar a tarefa:
```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\executive-assistant\run.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At 07:00
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -DontStopIfGoingOnBatteries:$false
Register-ScheduledTask -TaskName "JARVIS Executive Assistant" -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force
```

Rodar manualmente / remover:
```powershell
Start-ScheduledTask -TaskName "JARVIS Executive Assistant"
Unregister-ScheduledTask -TaskName "JARVIS Executive Assistant" -Confirm:$false
```

## Logs
- `executive-assistant/logs/YYYY-MM-DD.log` — uma linha JSON por execução (`status`, contadores, `path`). `status: written` = ok; `vault_error` = vault inacessível (exit 1).

## Notas / histórico
- **2026-06-28:** corrigido bug de parsing CRLF em `../morning-brief/lib/vault.mjs` (notas do vault são gravadas em CRLF no Windows; o parser assumia LF e lia toda nota como "sem tipo"). O fix normaliza CRLF→LF na leitura e beneficia **tanto o dashboard quanto o Morning Brief** — antes ambos saíam vazios.
