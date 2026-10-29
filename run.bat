@echo off
title ENTC NOVA - One-Click Launcher
color 0A

echo ===================================================
echo        ENTC NOVA - Smart Learning Platform
echo ===================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not found in your PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Ensure .env file exists
if not exist ".env" (
    echo [INFO] Creating default .env file...
    echo DATABASE_URL="file:./db/custom.db" > .env
    echo [INFO] .env created successfully.
)

:: 3. Check dependencies
if not exist "node_modules\" (
    echo [INFO] Installing dependencies with npm install...
    call npm install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: 4. Sync Database Schema
echo [INFO] Syncing database schema with Prisma...
call npx prisma db push --skip-generate >nul 2>nul

echo.
echo [INFO] Starting ENTC NOVA at http://localhost:3000...
echo [INFO] Opening browser in 3 seconds...
echo.

:: 5. Open browser automatically
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: 6. Launch development server
call npx next dev -p 3000

pause
