import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const installScript = `#!/bin/bash

# Aether Shield CLI Installer
set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Detect OS and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $OS in
  linux|darwin) ;;
  *)
    echo -e "\${RED}Error: Unsupported OS $OS\${NC}"
    exit 1
    ;;
esac

case $ARCH in
  x86_64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  armv7l) ARCH="arm" ;;
  *)
    echo -e "\${RED}Error: Unsupported architecture $ARCH\${NC}"
    exit 1
    ;;
esac

# Version and download URLs
VERSION="latest"
BINARY_NAME="aether-shield"
INSTALL_DIR="/usr/local/bin"

echo -e "\${BLUE}Aether Shield CLI Installer\${NC}"
echo -e "\${BLUE}=============================\${NC}"
echo ""

# Check if already installed
if command -v "$BINARY_NAME" &> /dev/null; then
  echo -e "\${YELLOW}⚠️  Aether Shield CLI is already installed at $(which $BINARY_NAME)\${NC}"
  read -p "Do you want to reinstall? [y/N]: " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\${GREEN}Installation cancelled.\${NC}"
    exit 0
  fi
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo -e "\${BLUE}📦 Downloading Aether Shield CLI for \${OS}-\${ARCH}...\${NC}"

# For now, since we don't have actual binaries, let's create a placeholder script
cat > "$TEMP_DIR/$BINARY_NAME" << 'EOFBLOCK'
#!/bin/bash

# Aether Shield CLI - Placeholder
# This is a placeholder until actual binaries are available

echo "Aether Shield CLI - Placeholder"
echo "================================"
echo ""
echo "This is a placeholder for the Aether Shield CLI."
echo "The actual CLI functionality will be available once the Go binary is built."
echo ""
echo "Usage: aether-shield [command]"
echo ""
echo "Available commands:"
echo "  help     Show this help message"
echo "  version  Show version information"
echo "  status   Show system status"
echo ""

# Parse arguments
case "\${1:-help}" in
  help)
    echo "Aether Shield CLI - Network Security Management Tool"
    echo ""
    echo "This is a placeholder version. The full CLI will include:"
    echo "  - Firewall rule management"
    echo "  - Interface configuration"
    echo "  - VPN management"
    echo "  - System monitoring"
    echo "  - And much more..."
    ;;
  version)
    echo "Aether Shield CLI v0.1.0-placeholder"
    echo "Build: development"
    echo "Platform: $(uname -s)-$(uname -m)"
    ;;
  status)
    echo "System Status:"
    echo "  Platform: $(uname -s)-$(uname -m)"
    echo "  Uptime: $(uptime -p 2>/dev/null || uptime)"
    echo "  Memory: $(free -h 2>/dev/null | grep '^Mem:' || echo 'N/A')"
    echo ""
    echo "Note: This is placeholder data. Real system integration coming soon."
    ;;
  *)
    echo "Unknown command: $1"
    echo "Run 'aether-shield help' for available commands"
    exit 1
    ;;
esac
EOFBLOCK

chmod +x "$TEMP_DIR/$BINARY_NAME"

# Install the binary
echo -e "\${BLUE}🔧 Installing Aether Shield CLI...\${NC}"

if [ -w "$INSTALL_DIR" ]; then
  mv "$TEMP_DIR/$BINARY_NAME" "$INSTALL_DIR/"
else
  echo -e "\${YELLOW}⚠️  Need sudo privileges to install to $INSTALL_DIR\${NC}"
  sudo mv "$TEMP_DIR/$BINARY_NAME" "$INSTALL_DIR/"
fi

# Verify installation
if command -v "$BINARY_NAME" &> /dev/null; then
  echo -e "\${GREEN}✅ Aether Shield CLI successfully installed!\${NC}"
  echo ""
  echo -e "\${BLUE}Next steps:\${NC}"
  echo "  Run 'aether-shield help' to get started"
  echo "  Run 'aether-shield version' to check the version"
  echo ""
  echo -e "\${YELLOW}Note: This is a placeholder version.\${NC}"
  echo -e "\${YELLOW}The full CLI will be available once the Go binary is built.\${NC}"
else
  echo -e "\${RED}❌ Installation failed\${NC}"
  exit 1
fi
`;

  return new NextResponse(installScript, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
