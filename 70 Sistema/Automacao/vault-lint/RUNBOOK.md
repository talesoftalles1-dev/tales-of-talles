---
dominio: jarvis
tipo: runbook
status: ativo
categoria: automacao
area: sistema
criado: 2026-07-06
atualizado: 2026-07-06
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🔁 Automacoes]]"
  - "[[estagiarios]]"
tags:
  - tema/dev
---

# Vault Lint — Runbook

## Resumo

- **Pipeline:** `70 Sistema/Automacao/vault-lint/`
- **Objetivo:** validar o vault inteiro contra o contrato ([[_Spec JARVIS]] §2/§3/§10) de forma determinística — sem LLM, sem rede.
- **Gerador:** `lint.mjs` (Node, ESM, zero dependências). Substitui o antigo `tor-validator.mjs` (arquivado em `90 Arquivo/scripts/`).
- **Saída:** `output/vault_lint.md` (regenerável) + exit code `1` quando há erro.

## O que ele valida

1. **Frontmatter vs contrato** — `tipo` no enum; `status` válido para o tipo (com `arquivado` aceito como estado terminal universal); `area` ∈ pessoal|empresa|sistema; `dominio` ∈ jarvis|yalt|talles; datas `YYYY-MM-DD`; chaves proibidas (`contexto` fora de checklist, `title`, `created`); chaves fora do snake_case; tags que duplicam propriedade (taxonomia §3).
2. **Wikilinks quebrados** — todo `[[alvo]]` do corpo e do frontmatter é resolvido contra arquivos + aliases (inclui alvos em `90 Arquivo/`).
3. **Espelho CLAUDE.md ↔ AGENTS.md** — acusa drift se os dois divergirem (além do cabeçalho de espelho).

**Escopo pulado por design:** `90 Arquivo/` (histórico), `Templates/` (placeholders Templater), `raw/` (dump humano sem frontmatter), `.obsidian/`, `logs/`.

## Quick start

```powershell
cd "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\vault-lint"
.\run.ps1
# abrir o relatório:
# output/vault_lint.md
```

## Agendamento (opcional — ativação é decisão do Operador)

Roda às **06:50**, antes do Daily Dashboard das 07:00, para o cockpit nascer sobre um vault conforme:

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\vault-lint\run.ps1" -Quiet'
$trigger = New-ScheduledTaskTrigger -Daily -At 06:50
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
Register-ScheduledTask -TaskName "JARVIS Vault Lint" -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force
```

> [!warning] Fronteira de autoridade (E6)
> Construir/validar é autônomo; **agendar/ativar** é do Operador ([[_Contrato de Autoridade dos Agentes]]). Este runbook entrega o comando pronto — você decide ligar.

## Rotina de correção

1. `vault_lint.md` lista erros → **E5 (Revisão)** é o dono do critério.
2. Correções mecânicas de frontmatter/link → **E1 (Organização)** executa.
3. Erro que exige mudança de contrato → proposta ao Operador (canon é imutável para agentes).
