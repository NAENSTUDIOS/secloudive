@echo off
TITLE SeCLOUDIVE Resilience Watchdog Daemon
COLOR 0A

echo ===============================================================================
echo   SeCLOUDIVE Permanent Crash Prevention Daemon
echo   Continuous Uptime & AI Self-Healing Sentinel
echo ===============================================================================
echo.

cd /d "%~dp0\.."

node src\solutions\watchdogDaemon.js

pause
