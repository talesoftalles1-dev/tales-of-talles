# vault-lint — wrapper PowerShell (mesmo padrão do executive-assistant/run.ps1)
# Uso:  .\run.ps1            → roda o lint e grava output/vault_lint.md
#       .\run.ps1 -Quiet     → só o exit code (para agendamento)
param(
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$vaultRoot = (Resolve-Path (Join-Path $scriptDir "..\..\..")).Path

$args = @("$scriptDir\lint.mjs", "--vault", $vaultRoot)
if ($Quiet) { $args += "--quiet" }

node @args
exit $LASTEXITCODE
