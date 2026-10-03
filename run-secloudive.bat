@echo off
TITLE SeCLOUDIVE Local Daemon Watchdog
COLOR 0B

echo ===============================================================================
echo   SeCLOUDIVE Production Local Server Watchdog
echo   Continuous Uptime & Crash Prevention Daemon
echo ===============================================================================
echo.

cd /d "%~dp0"

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your PATH.
    echo Please install Node.js from https://nodejs.org/ to run the platform.
    pause
    exit /b 1
)

:: 2. Check if port 5173 is already running
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>nul
if %errorlevel% equ 0 (
    echo [STATUS] SeCLOUDIVE is ALREADY active on http://localhost:5173/
    echo Opening browser...
    start http://localhost:5173/
    echo Watchdog active. Press Ctrl+C to stop.
)

:: 3. Continuous watchdog loop to ensure the server never dies
:SERVER_LOOP
echo.
echo [WATCHDOG] Starting / Verifying SeCLOUDIVE Dev Engine on port 5173...
echo ➜ Local URL: http://localhost:5173/
echo.

:: Launch browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173/"

:: Run the Vite development server
call npm run dev

echo.
echo [ALERT] The server process exited. Automatically restarting in 2 seconds...
timeout /t 2 /nobreak >nul
goto SERVER_LOOP
