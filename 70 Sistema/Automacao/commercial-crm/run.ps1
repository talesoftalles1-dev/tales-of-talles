$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root
try {
    node manager.mjs
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
