@echo off
REM Scheduled Task helper for Jarvis Watcher
REM Usage: register_jarvis_watcher.bat "%USERPROFILE%\path\to\repo"
REM Requires: Git Bash or python on PATH

set REPO=%~1
if "%REPO%"=="" set REPO=%CD%

schtasks /Create /TN "JarvisWatcher" /TR "\"python\" \"%REPO%\tools\jarvis_watcher.py\" --repo-root \"%REPO%\" --dry-run" /SC ONLOGON /RL HIGHEST /F >NUL
echo Task created (dry-run). Edit task in Task Scheduler to remove --dry-run.
