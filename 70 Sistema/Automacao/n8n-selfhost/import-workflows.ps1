# Importa os 8 workflows TALES para a instância n8n local (via CLI).
# IMPORTANTE: corre com o 'n8n start' PARADO (a CLI e o servidor partilham a mesma DB SQLite).
# Alternativa mais simples: importar pela UI (Workflows > ... > Import from File), um a um.
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (Test-Path .env) {
  Get-Content .env | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
    $idx = $_.IndexOf('='); if ($idx -lt 1) { return }
    [Environment]::SetEnvironmentVariable($_.Substring(0,$idx).Trim(), $_.Substring($idx+1).Trim(), 'Process')
  }
}
$env:N8N_USER_FOLDER = Join-Path $here 'n8n-data'

n8n import:workflow --separate --input="$here\workflows"
Write-Host 'Importado. Arranca o n8n (start-local.ps1), liga as credenciais e ativa os workflows.' -ForegroundColor Green
