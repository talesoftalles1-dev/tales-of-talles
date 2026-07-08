<#
.SYNOPSIS
  Healthcheck do ambiente Windows + n8n self-host do JARVIS.

.EXAMPLE
  .\WindowsHealthcheck.ps1
  .\WindowsHealthcheck.ps1 --json
#>

param()

$ErrorActionPreference = 'SilentlyContinue'
$jsonMode = $args -contains '--json'

function Write-Status {
  param([string]$Label, [bool]$Ok)
  if ($jsonMode) { return $Ok }
  Write-Host "  $(if($Ok){'✓'} else {'✗'}) $Label" -ForegroundColor $(if($Ok){'Green'} else {'Red'})
}

Write-Host "JARVIS Self-Host Healthcheck"
Write-Host "============================"

$dockerOk = $false
$composeOk = $false
$n8nEnvOk = $false
$n8nUp = $false

Write-Host "`n🐳 Docker Desktop"
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Status -Label 'docker CLI nao encontrado no PATH.' -Ok:$false
} else {
  $info = docker info 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Status -Label 'docker nao rodando ou sem permissao.' -Ok:$false
  } else {
    Write-Status -Label 'docker CLI ok.' -Ok:$true
    $compose = docker compose version 2>&1
    if ($LASTEXITCODE -ne 0) {
      Write-Status -Label 'docker compose indisponivel.' -Ok:$false
    } else {
      $composeOk = $true
      $ver = ($compose | Select-String "Docker Compose version v?(\d+\.\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value })
      if ($ver) {
        Write-Status -Label "docker compose v$ver" -Ok:$true
      } else {
        Write-Status -Label "docker compose instalado (versao nao parseada)" -Ok:$true
      }
    }
  }
}
$dockerOk = $composeOk

Write-Host "`n🔌 n8n self-host config"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir '.env'
if (-not (Test-Path $envFile)) {
  Write-Status -Label "$envFile nao encontrado." -Ok:$false
} else {
  $envVars = @{}
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
      $envVars[$matches[1]] = $matches[2].Trim('"','''')
    }
  }
  if ($envVars.ContainsKey('WEBHOOK_URL')) {
    Write-Status -Label "WEBHOOK_URL=$($envVars['WEBHOOK_URL'])" -Ok:$true
  } else {
    Write-Status -Label 'WEBHOOK_URL ausente.' -Ok:$false
  }
  if ($envVars.ContainsKey('N8N_ENCRYPTION_KEY')) {
    $ek = $envVars['N8N_ENCRYPTION_KEY']
    $ekLen = if ($null -ne $ek) { $ek.Length } else { 0 }
    Write-Status -Label "N8N_ENCRYPTION_KEY comprimento=$ekLen" -Ok:($ekLen -ge 32)
    $n8nEnvOk = $ekLen -ge 32
  } else {
    Write-Status -Label 'N8N_ENCRYPTION_KEY ausente.' -Ok:$false
  }
}

if ($dockerOk) {
  Write-Host "`n🏥 n8n health http://localhost:5678/healthz"
  try {
    $r = Invoke-WebRequest -Uri 'http://localhost:5678/healthz' -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($r.StatusCode -eq 200) {
      Write-Status -Label 'n8n responde ok.' -Ok:$true
      $n8nUp = $true
    }
  } catch {
    Write-Status -Label ('n8n nao alcancavel: ' + $_.Exception.Message) -Ok:$false
  }
} else {
  $n8nEnvOk = $false
}

if ($jsonMode) {
  $payload = [ordered]@{
    docker = $dockerOk
    compose = $composeOk
    n8nEnv = $n8nEnvOk
    n8nUp = $n8nUp
  }
  $payload | ConvertTo-Json -Compress | Write-Output
  exit 0
}

Write-Host "`n📋 SYNOPSIS"
if (-not $dockerOk) {
  Write-Host "  • Docker Desktop/Compose indisponivel. Instala/ativa primeiro:" -ForegroundColor Yellow
  Write-Host "      winget install Docker.DockerDesktop"
  Write-Host "    Depois reopen esta janela e volta a correr o healthcheck."
}
if (-not $n8nEnvOk) {
  Write-Host "  • n8n-selfhost/.env com problemas. Ajusta manualmente antes de subir." -ForegroundColor Yellow
}
if ($dockerOk -and $n8nEnvOk) {
  Write-Host "  • Ambiente pronto. Arranca com:" -ForegroundColor Green
  Write-Host "      cd '70 Sistema/Automacao/n8n-selfhost'"
  Write-Host "      docker compose up -d"
} else {
  Write-Host "  • Resolve os itens com ✗ acima antes de activar o stack." -ForegroundColor Yellow
}

if (-not $n8nUp) {
  Write-Host "`n🚀 Apos subir o stack:"
  Write-Host "  cd '70 Sistema/Automacao/n8n-selfhost'"
  Write-Host "  docker compose logs --tail 50 n8n"
  Write-Host "  docker compose exec n8n n8n import:workflow --separate --input=/workflows"
} else {
  Write-Host "`n✅ n8n self-host operacional. Abre http://localhost:5678 e importa workflows."
}

if ($dockerOk -and $n8nEnvOk -and $n8nUp) { exit 0 } else { exit 1 }
