#requires -Version 5.1
<#
.SYNOPSIS
Registra o watcher do Jarvis como Scheduled Task.
#>
param(
  [string]$RepoRoot = 'C:\Users\talle\Desktop\Jarvis.worktrees\agents-jarvis-ai-personal-assistant-system',
  [string]$Python = 'python'
)

$action = New-ScheduledTaskAction -Execute $Python -Argument "tools\jarvis_watcher.py --repo-root `"$RepoRoot`" --dry-run" -WorkingDirectory $RepoRoot
$trigger = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest
Register-ScheduledTask -TaskName 'JarvisWatcher' -Action $action -Trigger $trigger -Principal $principal -Force
Write-Host 'Scheduled Task JarvisWatcher registrada (dry-run).'
