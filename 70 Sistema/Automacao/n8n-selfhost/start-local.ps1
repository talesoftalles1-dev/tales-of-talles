# Arranca o n8n self-host localmente via npm. Pré-requisito: Node.js (tens v26).
# Doc: https://docs.n8n.io/hosting/
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

# Carrega .env para o processo
if (Test-Path .env) {
  Get-Content .env | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
    $idx = $_.IndexOf('='); if ($idx -lt 1) { return }
    $k = $_.Substring(0, $idx).Trim()
    $v = $_.Substring($idx + 1).Trim()
    [Environment]::SetEnvironmentVariable($k, $v, 'Process')
  }
}

# Guarda dados (DB + credenciais cifradas) NESTA pasta, não em C:\Users\...\.n8n
$env:N8N_USER_FOLDER = Join-Path $here 'n8n-data'
New-Item -ItemType Directory -Force -Path $env:N8N_USER_FOLDER | Out-Null

# Pré-requisito: n8n compila o módulo nativo isolated-vm. Precisa de Node 20/22 LTS
# e, se não houver binário pré-compilado, de Visual Studio Build Tools (C++).
$nodeMajor = [int]((node --version) -replace 'v(\d+).*','$1')
if ($nodeMajor -gt 22 -or $nodeMajor -lt 18) {
  Write-Warning "Node v$nodeMajor não é suportado pelo n8n (usa 20 ou 22 LTS). O install pode falhar a compilar isolated-vm."
  Write-Host "Recomendado: Caminho A (Docker) no README.md — evita compilação nativa." -ForegroundColor Yellow
}
if (-not (Get-Command n8n -ErrorAction SilentlyContinue)) {
  Write-Host 'A instalar n8n globalmente (uma vez)...' -ForegroundColor Cyan
  npm install -g n8n
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha ao instalar n8n (provavelmente isolated-vm sem build tools). Usa Docker (README.md, Caminho A)."
    exit 1
  }
}

$port = if ($env:N8N_PORT) { $env:N8N_PORT } else { '5678' }
Write-Host "Editor: http://localhost:$port   (Ctrl+C para parar)" -ForegroundColor Green
n8n start
