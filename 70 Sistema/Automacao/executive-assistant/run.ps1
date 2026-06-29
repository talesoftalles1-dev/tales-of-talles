#Requires -Version 5.1
<#
.SYNOPSIS
  Wrapper para agendar o Executive Assistant (Daily Dashboard) via Task Scheduler.
.DESCRIPTION
  Regenera output/daily_dashboard.md a partir das propriedades do vault.
  Espelha o padrao do Morning Brief (mesma lib, mesmo estilo de wrapper).
.PARAMETER DryRun
  Imprime o dashboard sem escrever o arquivo.
#>
param(
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Node = Get-Command node -ErrorAction SilentlyContinue

if (-not $Node) {
  Write-Error "Node.js nao encontrado no PATH. Instale Node 18+."
  exit 1
}

$Args = @("$ScriptDir\dashboard.mjs")
if ($DryRun) { $Args += "--dry-run" }

# Ancorar o cwd na pasta do script por consistencia com o Morning Brief.
# (dashboard.mjs resolve o vaultRoot por caminho absoluto, mas mantemos o padrao.)
Push-Location $ScriptDir
try { & node @Args; $code = $LASTEXITCODE }
finally { Pop-Location }
exit $code
