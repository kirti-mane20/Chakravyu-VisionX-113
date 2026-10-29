@echo off
title ENTC NOVA - One-Click Launcher
color 0A
cls

echo.
echo  =====================================================
echo        ENTC NOVA  -  Smart Learning Platform
echo  =====================================================
echo.

:: ── Step 1: Check Node.js ─────────────────────────────
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Install it from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  [OK] Node.js %NODE_VER% found.

:: ── Step 2: Create .env if missing ───────────────────
if not exist ".env" (
    echo  [INFO] No .env found – creating default...
    echo DATABASE_URL="file:./db/custom.db"> .env
    echo  [OK] .env created with SQLite path.
)

:: ── Step 3: Install dependencies if missing ──────────
if not exist "node_modules\" (
    echo  [INFO] Installing dependencies (first run only)...
    call npm install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo  [ERROR] npm install failed. Check your internet connection.
        pause
        exit /b 1
    )
    echo  [OK] Dependencies installed.
)

:: ── Step 4: Sync Prisma / SQLite schema ──────────────
echo  [INFO] Syncing database schema...
call npx prisma db push --skip-generate >nul 2>nul
echo  [OK] Database ready.

:: ── Step 5: Check if port 3000 is already in use ─────
netstat -ano | findstr ":3000 " >nul 2>nul
if %ERRORLEVEL% equ 0 (
    color 0E
    echo  [WARN] Port 3000 is already in use.
    echo  The browser will open but the server may not start.
    echo  Close whatever is using port 3000 and try again.
    color 0A
)

:: ── Step 6: Open browser after a short delay ─────────
echo.
echo  [INFO] Server starting at http://localhost:3000
echo  [INFO] Browser will open automatically in 4 seconds...
echo.
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

:: ── Step 7: Launch Next.js dev server ────────────────
call npx next dev -p 3000

echo.
echo  [INFO] Server stopped. Press any key to close.
pause >nul
