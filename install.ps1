#Requires -Version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "🚀 Gemini Pilot — Auto Installer" -ForegroundColor Cyan
Write-Host "================================="

# 1. Check/Install Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "📦 Node.js not found. Installing..." -ForegroundColor Yellow

    $chocoCmd = Get-Command choco -ErrorAction SilentlyContinue
    $wingetCmd = Get-Command winget -ErrorAction SilentlyContinue

    if ($wingetCmd) {
        Write-Host "  Using winget..."
        winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    } elseif ($chocoCmd) {
        Write-Host "  Using Chocolatey..."
        choco install nodejs-lts -y
    } else {
        Write-Host "❌ Neither winget nor Chocolatey found." -ForegroundColor Red
        Write-Host "   Install Node.js manually from https://nodejs.org" -ForegroundColor Red
        exit 1
    }

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeCmd) {
        Write-Host "❌ Node.js installation succeeded but 'node' is not in PATH." -ForegroundColor Red
        Write-Host "   Please restart your terminal and run this script again." -ForegroundColor Red
        exit 1
    }
} else {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
}

# 2. Check/Install Gemini CLI
$geminiCmd = Get-Command gemini -ErrorAction SilentlyContinue
if (-not $geminiCmd) {
    Write-Host "📦 Installing Gemini CLI..." -ForegroundColor Yellow
    & npm install -g @google/gemini-cli
} else {
    Write-Host "✅ Gemini CLI found" -ForegroundColor Green
}

# 3. Install project dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
& npm install

# 4. Build
Write-Host "🔨 Building..." -ForegroundColor Yellow
& npm run build

# 5. Link globally
Write-Host "🔗 Linking 'gp' command..." -ForegroundColor Yellow
try {
    & npm link
} catch {
    Write-Host "⚠️  npm link failed — you may need to run as Administrator." -ForegroundColor Yellow
}

# 6. Run setup
Write-Host "⚙️ Running setup..." -ForegroundColor Yellow
& node dist/cli/index.js setup

# 7. Doctor check
Write-Host ""
Write-Host "🏥 Running doctor..." -ForegroundColor Yellow
& node dist/cli/index.js doctor

Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Usage:"
Write-Host "  gp harness          # Launch enhanced Gemini session"
Write-Host "  gp team 3           # Launch 3-agent team"
Write-Host '  gp ask "question"   # Single query'
Write-Host "  gp --help           # See all commands"
