#!/usr/bin/env bash
set -e

echo "🚀 Gemini Pilot — Auto Installer"
echo "================================="

# 1. Check/Install Node.js
if ! command -v node &>/dev/null; then
  echo "📦 Node.js not found. Installing..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command -v brew &>/dev/null; then
      brew install node
    else
      echo "Installing Homebrew first..."
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      brew install node
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - use NodeSource
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi
else
  echo "✅ Node.js $(node --version) found"
fi

# 2. Check/Install Gemini CLI
if ! command -v gemini &>/dev/null; then
  echo "📦 Installing Gemini CLI..."
  npm install -g @google/gemini-cli
else
  echo "✅ Gemini CLI found"
fi

# 3. Install project dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Build
echo "🔨 Building..."
npm run build

# 5. Install globally (optional, link for gp command)
echo "🔗 Linking 'gp' command..."
npm link 2>/dev/null || sudo npm link

# 6. Run setup
echo "⚙️ Running setup..."
node dist/cli/index.js setup

# 7. Doctor check
echo ""
echo "🏥 Running doctor..."
node dist/cli/index.js doctor

echo ""
echo "✅ Installation complete!"
echo ""
echo "Usage:"
echo "  gp harness          # Launch enhanced Gemini session"
echo "  gp team 3           # Launch 3-agent team"
echo "  gp ask \"question\"   # Single query"
echo "  gp --help           # See all commands"
