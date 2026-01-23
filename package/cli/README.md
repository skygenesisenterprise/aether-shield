<div align="center">

# 🚀 Aether Shield CLI

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE) [![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

**🔧 Command Line Interface for Aether Shield - Complete Management Tools**

A comprehensive CLI tool for managing Aether Shield deployments, configurations, and operations. Built with Go for performance and TypeScript for extensibility, providing a unified command-line interface for all Aether Shield components.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Installation](#️-installation) • [📚 Commands](#-commands) • [🏗️ Architecture](#-architecture) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-shield?style=social)](https://github.com/skygenesisenterprise/aether-shield/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-shield?style=social)](https://github.com/skygenesisenterprise/aether-shield/network) [![GitHub issues](https://img.shields.io/github/issues/github/skygenesisenterprise/aether-shield)](https://github.com/skygenesisenterprise/aether-shield/issues)

</div>

---

## 🌟 What is Aether Shield CLI?

**Aether Shield CLI** is a powerful command-line interface for managing Aether Shield deployments. It provides comprehensive tools for configuration, deployment, monitoring, and maintenance of Aether Shield systems.

### 🎯 Our Vision

- **🚀 Unified Interface** - Single CLI for all Aether Shield components
- **🔧 Complete Management** - Configuration, deployment, monitoring
- **📦 Multi-Language Support** - Go backend with TypeScript extensions
- **🏗️ Enterprise-Ready** - Scalable, secure, and maintainable
- **📚 Comprehensive Documentation** - Detailed command references
- **🛠️ Developer-Friendly** - Extensible architecture with plugin support

---

## 🆕 What's New

### 🎯 **Major Features**

#### 📦 **Complete CLI Ecosystem**

- ✅ **Configuration Management** - Manage all Aether Shield configurations
- ✅ **Deployment Tools** - Streamline deployment processes
- ✅ **Monitoring & Diagnostics** - Comprehensive system monitoring
- ✅ **Backup & Recovery** - Complete backup solutions
- ✅ **Plugin System** - Extend functionality with custom plugins

#### 🔧 **Enhanced Management**

- ✅ **Multi-Component Support** - Manage all Aether Shield components
- ✅ **Interactive Mode** - User-friendly interactive interface
- ✅ **Automation Support** - Scriptable operations for CI/CD
- ✅ **Security Features** - Secure authentication and authorization
- ✅ **Cross-Platform** - Windows, macOS, and Linux support

---

## 📊 Current Status

> **✅ Production-Ready**: Complete CLI toolset for Aether Shield management.

### ✅ **Currently Implemented**

#### 🏗️ **Core CLI Features**

- ✅ **Authentication System** - JWT-based authentication with login/logout
- ✅ **Firewall Management** - Complete firewall rule, alias, and group management
- ✅ **Network Interface Control** - WAN, LAN, wireless, and virtual IP management
- ✅ **Service Management** - DHCP, DNS, OpenVPN, WireGuard, and Unbound DNS
- ✅ **System Commands** - Status, logs, configuration, firmware, and diagnostics
- ✅ **VPN Management** - IPsec, OpenVPN, and WireGuard configuration
- ✅ **Reporting** - System health, traffic, and NetFlow reports
- ✅ **Interactive Mode** - Interactive shell for command execution
- ✅ **Output Formatting** - Table, JSON, and YAML output formats
- ✅ **Cross-Platform Support** - Windows, macOS, and Linux support

#### 📦 **Integration Features**

- ✅ **API Client** - HTTP client for Aether Shield API
- ✅ **Configuration Management** - YAML-based configuration files
- ✅ **Error Handling** - Comprehensive error handling and reporting
- ✅ **Logging System** - Structured logging with multiple levels
- ✅ **Context Management** - Execution context for commands

### 🔄 **In Development**

- **Autocompletion** - Bash and Zsh autocompletion support
- **Plugin System** - Extensible plugin architecture
- **Advanced Monitoring** - Enhanced system metrics and alerts
- **Performance Optimization** - CLI performance improvements
- **Multi-Language Support** - Internationalization support
- **Documentation Generator** - Automatic command documentation

### 📋 **Planned Features**

- **Scripting Support** - Advanced scripting capabilities
- **Custom Commands** - User-defined command aliases
- **Web Interface** - Optional web-based CLI interface
- **Mobile Companion** - Mobile app for remote management
- **Enterprise Features** - Role-based access control and auditing

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Go** 1.21.0 or higher (for backend)
- **Node.js** 18.0.0 or higher (for TypeScript extensions)
- **pnpm** 9.0.0 or higher (recommended package manager)
- **Docker** (optional, for container management)
- **Make** (for command shortcuts - included with most systems)

### 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/skygenesisenterprise/aether-shield.git
   cd aether-shield
   ```

2. **Install CLI globally**

   ```bash
   # From the repository root
   make cli-install
   ```

3. **Verify installation**

   ```bash
   shieldctl --version
   ```

### 🌐 Usage Examples

```bash
# Basic commands
shieldctl --help
shieldctl version
shieldctl status

# Configuration management
shieldctl config list
shieldctl config set key=value
shieldctl config get key

# Deployment
shieldctl deploy --env=production
shieldctl deploy --env=staging

# Monitoring
shieldctl monitor --interval=30
shieldctl diagnostics

# Backup
shieldctl backup create
shieldctl backup list
shieldctl backup restore backup-id

# Interactive mode
shieldctl interactive
```

---

## 🛠️ Installation

### 📦 Global Installation

```bash
# Install globally from repository
make cli-install

# Or install specific version
npm install -g @aether-shield/cli
```

### 🐳 Docker Installation

```bash
# Run CLI in Docker container
docker run -it --rm aether-shield/cli shieldctl --version

# Interactive session
docker run -it --rm -v ~/.shieldctl:/root/.shieldctl aether-shield/cli
```

### 🏗️ Local Development Installation

```bash
# Clone repository
git clone https://github.com/skygenesisenterprise/aether-shield.git
cd aether-shield

# Install dependencies
make install

# Build CLI
make cli-build

# Run locally
./cmd/shieldctl/shieldctl --version
```

---

## 📚 Commands

### 🎯 **Core Commands**

#### 📋 **Help & Information**

```bash
# Show help
shield --help
shield help [command]

# Show version
shield --version
shield version

# Show status
shield system status
```

#### 🔐 **Authentication**

```bash
# Login to the system
shield auth login
shield auth login --username admin --password yourpassword

# Logout
shield auth logout

# Show current user
shield auth whoami
```

#### 🔥 **Firewall Management**

```bash
# Firewall rules
shield firewall rules list
shield firewall rules add --interface wan --action block --source 192.168.1.1
shield firewall rules delete --id 123

# Firewall aliases
shield firewall aliases list
shield firewall aliases add --name blocklist --address 10.0.0.0/8

# Firewall groups
shield firewall groups list
shield firewall groups add --name web-servers --members 192.168.1.1,192.168.1.2

# NAT configuration
shield firewall nat list
shield firewall nat add --interface wan --target 192.168.1.100 --port 80

# Traffic shaping
shield firewall shaper list
shield firewall shaper add --interface lan --bandwidth 100M

# Firewall logs
shield firewall log list
shield firewall log clear
```

#### 🌐 **Network Interfaces**

```bash
# Interface overview
shield interfaces overview
shield interfaces overview --interface wan

# Interface settings
shield interfaces settings list
shield interfaces settings edit --interface wan --mtu 1500

# WAN configuration
shield interfaces wan status
shield interfaces wan edit --gateway 203.0.113.1

# Wireless configuration
shield interfaces wireless list
shield interfaces wireless add --ssid MyWiFi --password securepass

# Virtual IP addresses
shield interfaces virtual-ips list
shield interfaces virtual-ips add --interface wan --address 203.0.113.100
```

#### ⚙️ **Service Management**

```bash
# DHCP service
shield services dhcp list
shield services dhcp edit --range 192.168.1.100-192.168.1.200

# DNS service
shield services dns status
shield services dns edit --primary 8.8.8.8 --secondary 8.8.4.4

# Unbound DNS
shield services unbound_dns status
shield services unbound_dns reload

# OpenVPN
shield services openvpn list
shield services openvpn start --config /etc/openvpn/server.conf

# WireGuard
shield services wireguard list
shield services wireguard add --name vpn1 --port 51820
```

#### 💻 **System Commands**

```bash
# System status
shield system status
shield system status --detailed

# System logs
shield system logs
shield system logs --follow
shield system logs --filter firewall

# System configuration
shield system config list
shield system config edit --key hostname --value myserver

# Firmware management
shield system firmware check
shield system firmware upgrade --file firmware.bin

# System diagnostics
shield system diagnostics
shield system diagnostics --output json
```

#### 🔌 **VPN Management**

```bash
# IPsec VPN
shield vpn ipsec status
shield vpn ipsec add --name site1 --peer 203.0.113.5

# OpenVPN
shield vpn openvpn list
shield vpn openvpn status --name server

# WireGuard
shield vpn wireguard list
shield vpn wireguard add --name client1 --public-key abc123...
```

#### 📊 **Reporting**

```bash
# System health
shield report health
shield report health --detailed

# Traffic reports
shield report traffic
shield report traffic --interface wan --period 1h

# NetFlow data
shield report netflow
shield report netflow --output json
```

#### 🤖 **Interactive Mode**

```bash
# Start interactive shell
shield

# Exit interactive mode
exit
quit

# Interactive commands
> firewall rules list
> system status
> help
```

---

## 🏗️ Architecture

### 📁 **CLI Structure**

```
package/cli/
├── cmd/                     # CLI Commands
│   ├── auth/                # Authentication commands
│   │   ├── login.go         # Login command
│   │   ├── logout.go        # Logout command
│   │   └── whoami.go        # Whoami command
│   ├── firewall/            # Firewall management
│   │   ├── aliases/         # Alias management
│   │   ├── rules/           # Rule management
│   │   ├── groups/          # Group management
│   │   ├── nat/             # NAT configuration
│   │   ├── shaper/          # Traffic shaping
│   │   └── log/             # Firewall logs
│   ├── interfaces/         # Network interfaces
│   │   ├── overview/        # Interface overview
│   │   ├── settings/        # Interface settings
│   │   ├── wan/             # WAN configuration
│   │   ├── wireless/        # Wireless configuration
│   │   └── virtual-ips/     # Virtual IP addresses
│   ├── services/           # Service management
│   │   ├── dhcp/            # DHCP service
│   │   ├── dns/             # DNS service
│   │   ├── openvpn/         # OpenVPN service
│   │   ├── unbound_dns/     # Unbound DNS service
│   │   └── wireguard/       # WireGuard service
│   ├── system/             # System commands
│   │   ├── status/          # System status
│   │   ├── logs/            # System logs
│   │   ├── config/          # System configuration
│   │   ├── firmware/        # Firmware management
│   │   └── diagnostics/     # System diagnostics
│   ├── vpn/                # VPN management
│   │   ├── ipsec/           # IPsec VPN
│   │   ├── openvpn/         # OpenVPN
│   │   └── wireguard/       # WireGuard
│   ├── report/             # Reporting commands
│   │   ├── health/          # System health
│   │   ├── traffic/         # Traffic reports
│   │   └── netflow/         # NetFlow data
│   ├── commands.go         # Command registration
│   ├── firewall_rules.go   # Legacy firewall rules
│   └── root.go             # Root command definition
├── internal/                # Internal packages
│   ├── auth/               # JWT authentication
│   │   └── auth.go          # Authentication logic
│   ├── client/             # API client
│   │   └── client.go        # HTTP client implementation
│   ├── config/             # Configuration management
│   │   └── config.go        # Configuration handling
│   ├── context/            # Execution context
│   │   └── context.go       # Context management
│   ├── logger/             # Logging system
│   ├── menu/               # Interactive menu (optional)
│   ├── ui/                 # User interface
│   │   └── output.go        # Output formatting
│   └── utils/              # Utility functions
├── pkg/                     # Public packages
│   ├── api/                # Public API client
│   ├── errors/             # Error handling
│   └── types/              # Type definitions
├── server/                  # Backend server (optional)
│   ├── controllers/        # API controllers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── config/             # Server configuration
│   ├── main.go             # Server entry point
│   ├── go.mod              # Server Go modules
│   └── Makefile            # Server build commands
├── web/                     # Web interface (optional)
│   ├── components.json     # UI components
│   ├── next.config.ts      # Next.js configuration
│   ├── package.json        # Web dependencies
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── tsconfig.json       # TypeScript config
├── tests/                   # Test suite
│   ├── unit/               # Unit tests
│   │   ├── auth_test.go     # Auth tests
│   │   ├── client_test.go   # Client tests
│   │   ├── config_test.go   # Config tests
│   │   └── ui_test.go       # UI tests
│   └── integration/        # Integration tests
├── examples/                # Usage examples
├── go.mod                   # Go modules file
├── main.go                  # CLI entry point
├── Makefile                 # Build commands
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose config
├── architecture.md          # Architecture documentation
└── README.md                # Documentation
```

### 🔄 **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CLI Commands   │    │   Internal       │    │   External      │
│   (User Input)   │◄──►│   Actions        │◄──►│   Systems        │
│  shieldctl       │    │   (Business Logic)│    │  (Aether Shield)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
           │                       │                       │
           ▼                       ▼                       ▼
     Command Parsing          Action Execution         System Integration
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
    │  Configuration  │    │  Deployment      │    │  Monitoring     │
    │  Management     │    │  Orchestration   │    │  & Diagnostics  │
    └─────────────────┘    └──────────────────┘    └─────────────────┘
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
    │  Backup &       │    │  Security        │    │  Package        │
    │  Recovery       │    │  Management      │    │  Management     │
    └─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🗺️ Development Roadmap

### 🎯 **Phase 1: Core CLI (✅ Complete)**

- ✅ **Command Structure** - Complete command hierarchy
- ✅ **Configuration Management** - Full config support
- ✅ **Deployment Tools** - Deployment orchestration
- ✅ **Monitoring & Diagnostics** - System health checks
- ✅ **Backup & Recovery** - Complete backup solutions
- ✅ **Security Features** - Authentication and authorization
- ✅ **Interactive Mode** - User-friendly interface
- ✅ **Cross-Platform Support** - Windows, macOS, Linux

### 🚀 **Phase 2: Advanced Features (🔄 In Progress)**

- 🔄 **Plugin System** - Extensible plugin architecture
- 🔄 **Advanced Monitoring** - Enhanced system metrics
- 🔄 **Performance Optimization** - CLI performance improvements
- 🔄 **AI Assistant Integration** - Smart command suggestions
- 🔄 **Enhanced Security** - Advanced authentication methods
- 🔄 **Multi-Cloud Support** - AWS, Azure, GCP deployments

### 🌟 **Phase 3: Enterprise Features (📋 Planned)**

- 📋 **Kubernetes Integration** - Kubernetes cluster management
- 📋 **Advanced Analytics** - System performance analytics
- 📋 **Custom Dashboard** - CLI-based dashboard interface
- 📋 **Mobile Companion** - Mobile app integration
- 📋 **Plugin Marketplace** - Community plugin ecosystem
- 📋 **Enterprise Support** - Professional support options

---

## 💻 Development

### 🎯 **Development Workflow**

```bash
# Clone repository
git clone https://github.com/skygenesisenterprise/aether-shield.git
cd aether-shield

# Install dependencies
make install

# Build CLI
make cli-build

# Run CLI
./cmd/shieldctl/shieldctl --version

# Run tests
make cli-test

# Lint code
make lint

# Format code
make format
```

### 📋 **Development Commands**

```bash
# Build CLI
make cli-build

# Run CLI
make cli

# Run tests
make cli-test

# Lint code
make lint

# Format code
make format

# Clean build artifacts
make clean

# Reset project
make reset
```

### 🎯 **Advanced Development**

```bash
# Debug CLI
shieldctl --debug
shieldctl --verbose

# Profile CLI
shieldctl --profile=cpu
shieldctl --profile=mem

# Generate documentation
make docs

# Generate man pages
make man

# Generate completion scripts
make completion
```

---

## 🔐 Security

### 🎯 **Security Features**

- **🔐 Authentication** - Secure authentication with JWT
- **🔑 Key Management** - Secure key generation and storage
- **📦 Certificate Management** - SSL/TLS certificate handling
- **🔒 Data Encryption** - Secure data transmission
- **🛡️ Input Validation** - Comprehensive input validation
- **🚫 Rate Limiting** - Protection against brute force attacks
- **📋 Audit Logging** - Comprehensive audit trails

### 🔄 **Security Best Practices**

- **Use strong passwords** for authentication
- **Keep CLI updated** to the latest version
- **Use HTTPS** for all communications
- **Regularly rotate keys** and certificates
- **Monitor system** for suspicious activity
- **Use backup encryption** for sensitive data
- **Follow principle of least privilege** for access control

---

## 🤝 Contributing

We're looking for contributors to help build this comprehensive CLI tool! Whether you're experienced with Go, TypeScript, CLI development, or system management, there's a place for you.

### 🎯 **How to Get Started**

1. **Fork the repository** and create a feature branch
2. **Check the issues** for tasks that need help
3. **Join discussions** about architecture and features
4. **Start small** - Documentation, tests, or minor features
5. **Follow our code standards** and commit guidelines

### 🏗️ **Areas Needing Help**

- **Go Development** - CLI commands, business logic, security
- **TypeScript Extensions** - Frontend integration, UI components
- **Command Development** - New commands and features
- **Documentation** - Command references, tutorials
- **Testing** - Unit and integration tests
- **Security** - Authentication, encryption, filtering
- **DevOps** - Docker, deployment, CI/CD
- **Plugin System** - Plugin architecture and ecosystem

### 📝 **Contribution Process**

1. **Choose an area** - Core CLI, commands, or extensions
2. **Read documentation** - Understand CLI conventions
3. **Create a branch** with a descriptive name
4. **Implement your changes** following our guidelines
5. **Test thoroughly** in all relevant environments
6. **Submit a pull request** with clear description and testing
7. **Address feedback** from maintainers and community

---

## 📞 Support & Community

### 💬 **Get Help**

- 📖 **[Documentation](https://github.com/skygenesisenterprise/aether-shield/tree/main/docs)** - Comprehensive guides and command references
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-shield/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-shield/discussions)** - General questions and ideas
- 📧 **Email** - support@skygenesisenterprise.com

### 🐛 **Reporting Issues**

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Go version, Node.js version, OS, etc.)
- Error logs or screenshots
- Expected vs actual behavior
- CLI version and command used

---

## 📊 Project Status

| Component                    | Status         | Technology             | Notes                            |
| ---------------------------- | -------------- | ---------------------- | -------------------------------- |
| **Core CLI**                 | ✅ Working     | Go 1.21+               | Complete command structure       |
| **Configuration Management** | ✅ Working     | Go + YAML/JSON         | Full configuration support       |
| **Deployment Tools**         | ✅ Working     | Go + Docker            | Deployment orchestration         |
| **Monitoring & Diagnostics** | ✅ Working     | Go + Prometheus        | System health checks             |
| **Backup & Recovery**        | ✅ Working     | Go + PostgreSQL        | Complete backup solutions        |
| **Security Features**        | ✅ Working     | Go + JWT               | Authentication and authorization |
| **Interactive Mode**         | ✅ Working     | Go + Readline          | User-friendly interface          |
| **Cross-Platform Support**   | ✅ Working     | Go + Cross-compilation | Windows, macOS, Linux support    |
| **Plugin System**            | 🔄 In Progress | Go + Plugins           | Extensible plugin architecture   |
| **Advanced Monitoring**      | 🔄 In Progress | Go + Prometheus        | Enhanced system metrics          |
| **AI Assistant Integration** | 📋 Planned     | Go + AI APIs           | Smart command suggestions        |
| **Multi-Cloud Support**      | 📋 Planned     | Go + Cloud SDKs        | AWS, Azure, GCP deployments      |
| **Kubernetes Integration**   | 📋 Planned     | Go + Kubernetes SDK    | Kubernetes cluster management    |

---

## 🏆 Sponsors & Partners

**Development led by [Sky Genesis Enterprise](https://skygenesisenterprise.com)**

We're looking for sponsors and partners to help accelerate development of this open-source CLI project.

[🤝 Become a Sponsor](https://github.com/sponsors/skygenesisenterprise)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sky Genesis Enterprise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The based copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Sky Genesis Enterprise** - Project leadership and development
- **Go Community** - High-performance programming language and ecosystem
- **Cobra Team** - Excellent CLI framework
- **Viper Team** - Configuration management library
- **Docker Team** - Container platform and tools
- **GitHub** - Version control and collaboration platform
- **pnpm** - Fast, disk space efficient package manager
- **Make** - Universal build automation and command interface
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Join Us in Building the Future of System Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-shield) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-shield/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-shield/discussions)

---

**🔧 Complete CLI Toolset for Aether Shield Management!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building a comprehensive CLI for system management and automation_

</div>
