#Requires -Version 5.1
<#
.SYNOPSIS
  Wrapper para agendar o Morning Brief via Task Scheduler (09:00).
#>
param(
  [switch]$DryRun,
  [switch]$Force,
  [switch]$NoSlack
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Node = Get-Command node -ErrorAction SilentlyContinue

if (-not $Node) {
  Write-Error "Node.js não encontrado no PATH. Instale Node 18+."
  exit 1
}

$Args = @("$ScriptDir\generate.mjs")
if ($DryRun) { $Args += "--dry-run" }
if ($Force) { $Args += "--force" }
if ($NoSlack) { $Args += "--no-slack" }

# Ancorar o cwd na pasta do script: config.json usa caminhos relativos
# (./output, ./state, ./logs). Sem isto, o Task Scheduler espalharia arquivos.
Push-Location $ScriptDir
try { & node @Args; $code = $LASTEXITCODE }
finally { Pop-Location }
exit $code
