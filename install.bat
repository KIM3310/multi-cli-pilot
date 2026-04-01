@echo off
echo 🚀 Gemini Pilot — Auto Installer
echo =================================

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 📦 Node.js not found. Installing via winget...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    echo Please restart this script after Node.js installation completes.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js %%i found
)

:: Check Gemini CLI
where gemini >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 📦 Installing Gemini CLI...
    call npm install -g @google/gemini-cli
) else (
    echo ✅ Gemini CLI found
)

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

:: Build
echo 🔨 Building...
call npm run build

:: Link globally
echo 🔗 Linking 'gp' command...
call npm link

:: Setup
echo ⚙️ Running setup...
node dist\cli\index.js setup

:: Doctor
echo.
echo 🏥 Running doctor...
node dist\cli\index.js doctor

echo.
echo ✅ Installation complete!
echo.
echo Usage:
echo   gp harness          # Launch enhanced Gemini session
echo   gp team 3           # Launch 3-agent team
echo   gp ask "question"   # Single query
echo   gp --help           # See all commands
pause
