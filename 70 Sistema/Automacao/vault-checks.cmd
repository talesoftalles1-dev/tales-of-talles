@echo off
setlocal enabledelayedexpansion

echo JARVIS OS — Daily Healthchecks
echo =============================

pushd "%~dp0" || goto :done

set "fail=0"

call :run "Lint vault" node "..\vault-lint\lint.mjs"
call :run "EA dry-run" node "executive-assistant\dashboard.mjs" --dry-run
call :run "Brief dry-run" node "..\morning-brief\generate.mjs" --dry-run --no-slack --print
call :run "Self-host healthcheck" powershell -NoProfile -ExecutionPolicy Bypass -File "executive-assistant\WindowsHealthcheck.ps1"

echo.
echo ------------------------------------------------------------
echo SUMMARY
echo ------------------------------------------------------------
if %fail% GTR 1 (
  echo FAILED: %fail% step(s). Ve acima.
) else (
  echo OK: all local checks passed.
)

popd
pause
goto :done

:run
echo.
echo ------------------------------------------------------------
echo [%~1]
echo ------------------------------------------------------------
%*
set rc=%ERRORLEVEL%
echo -> exit %rc%
if %rc% NEQ 0 set /a fail+=1
goto :eof

:done
