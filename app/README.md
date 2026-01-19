<div align="center">

# 🛡️ Aether Shield App

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**🔥 Modern Security & Network Protection Platform Frontend**

A comprehensive, modern frontend application for managing security and network protection infrastructure. Built with Next.js 16, React 19.2.3, and TypeScript for maximum performance and developer experience.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Architecture](#-architecture) • [🔧 Development](#-development) • [📚 Documentation](#-documentation)

</div>

---

## 🌟 What is Aether Shield App?

**Aether Shield App** is the frontend application for the Aether Shield security and network protection platform. It provides a comprehensive, modern interface for managing network security, monitoring system health, and configuring various security services.

### 🎯 Key Capabilities

- **🛡️ Security Management** - Complete firewall, IDS, and VPN management interface
- **🌐 Network Administration** - Interface configuration, routing, and gateway management
- **📊 System Monitoring** - Real-time dashboards, logs, and diagnostics
- **⚙️ Service Configuration** - DHCP, DNS, OpenDNS, and other network services
- **🔐 Access Control** - User management, authentication, and privilege control
- **📈 Reporting & Analytics** - Traffic analysis, health reports, and insights
- **🎨 Modern UI/UX** - Responsive design with dark mode support

---

## 📋 Features

### 🏠 **Home & Dashboard**

- **📊 Main Dashboard** - System overview and quick access to key features
- **🔑 Password Management** - Secure password change interface
- **📄 License Information** - License status and management

### 🛡️ **Firewall Management**

- **📋 Firewall Rules** - Complete rule management interface
- **📝 Firewall Logs** - Detailed logging with plain view options
- **⚙️ Firewall Settings** - Configuration and policy management

### 🌐 **Network Interfaces**

- **📡 Interface Overview** - Comprehensive network interface status
- **🌍 WAN Configuration** - Wide area network settings
- **📶 Wireless Management** - WiFi device and configuration management
- **🔄 Interface Assignments** - Network interface mapping
- **👥 Neighbor Discovery** - Network neighbor information
- **🔧 Virtual IPs** - Virtual IP configuration and status

### 🔐 **VPN Management**

- **🔒 WireGuard** - Modern VPN configuration and peer management
- **🌐 OpenVPN** - Traditional VPN client and server management
- **🔐 IPsec** - Secure VPN tunnel configuration
- **📊 VPN Status** - Real-time connection monitoring

### 📊 **Reporting & Analytics**

- **📈 Traffic Reports** - Network traffic analysis and reporting
- **🩺 Health Monitoring** - System health and performance metrics
- **🔍 DNS Insights** - DNS query analysis and reporting
- **🌊 NetFlow Analysis** - Network flow data collection and analysis

### ⚙️ **System Management**

- **🔧 System Settings** - General configuration and tunables
- **📝 Logging** - Comprehensive log management (general, web, backend, audit, boot)
- **🔍 Diagnostics** - System statistics, activity monitoring, and service health
- **📦 Firmware Management** - Updates, packages, plugins, and changelog
- **🔄 High Availability** - HA configuration and status monitoring
- **🗂️ Snapshots** - System backup and restore functionality
- **🛣️ Routing** - Route configuration and management
- **🌐 Gateways** - Gateway configuration and monitoring

### 🔐 **Access & Security**

- **👥 User Management** - User accounts and authentication
- **🔐 Privilege Control** - Access rights and permissions
- **🖥️ Server Access** - Remote server configuration
- **🧪 Test Accounts** - Testing user management
- **👥 Group Management** - User group organization

### 🛡️ **Trust & Certificates**

- **🔐 Certificate Management** - SSL/TLS certificate handling
- **🏛️ Certificate Authorities** - CA management
- **🚫 Revocation** - Certificate revocation lists
- **⚙️ Trust Settings** - Certificate trust configuration

### 📦 **Service Management**

- **🌐 DHCP Services** - IPv4, IPv6, and relay configuration
- **🔍 DNS Services** - DNSMasq and OpenDNS management
- **🛡️ IDS/IPS** - Intrusion detection and prevention
- **📊 Service Monitoring** - Real-time service status and logs

---

## 🛠️ Tech Stack

### 🎨 **Frontend Framework**

```
Next.js 16 + React 19.2.3 + TypeScript 5
├── 🎨 Tailwind CSS v4 (Styling & Design System)
├── 🎯 Radix UI Components (Accessible UI Components)
├── 📝 TypeScript Strict Mode (Type Safety)
├── 🔄 React Context (State Management)
├── 🛣️ Next.js App Router (Modern Routing)
├── 🎨 Lucide React (Icon Library)
├── 🔧 ESLint + Prettier (Code Quality)
└── 🐳 Docker Support (Containerization)
```

### 🎨 **UI Component Library**

```
shadcn/ui + Radix UI + Tailwind CSS
├── 🎨 Component System (Reusable UI Components)
├── 🎯 Accessibility (WCAG Compliant)
├── 📱 Responsive Design (Mobile-First)
├── 🌙 Dark Mode Support (Theme Switching)
├── 🎭 Animations (tw-animate-css)
└── 🎨 Design Tokens (Consistent Styling)
```

### 🔐 **Authentication & Security**

```
JWT-Based Authentication
├── 🔐 JWT Token Management (Secure Authentication)
├── 🔄 React Context (Global Auth State)
├── 🛡️ Protected Routes (Route Guards)
├── 🔑 Aether Vault Integration (Secure Storage)
└── 🚨 Security Headers (CORS, CSP, etc.)
```

### 📊 **Data & State Management**

```
React + Prisma + Aether Vault
├── 🔄 React Context (Client-Side State)
├── 🗄️ Prisma Client (Database Access)
├── 🔐 Aether Vault (Secure Configuration)
├── 📊 Real-Time Updates (Live Data)
└── 🎯 Optimistic Updates (Better UX)
```

---

## 📁 Architecture

### 🏗️ **Project Structure**

```
app/
├── 📄 package.json              # Package configuration
├── 🎨 tailwind.config.js        # Tailwind CSS configuration
├── 📝 tsconfig.build.json       # TypeScript build configuration
├── 🐳 Dockerfile                # Container configuration
├── 🔧 eslint.config.mjs         # ESLint configuration
├── 📄 components.json           # shadcn/ui configuration
├── 🎨 styles/
│   └── 🌺 globals.css           # Global styles and CSS variables
├── 📚 lib/
│   ├── 🔧 utils.ts              # Utility functions
│   ├── 🧭 navigation-config.ts  # Navigation configuration
│   └── 📝 logger.ts             # Logging utilities
├── 🎯 components/
│   ├── 🎨 ui/                   # shadcn/ui component library
│   │   ├── 📋 card.tsx          # Card component
│   │   ├── 🔘 button.tsx        # Button component
│   │   ├── 📝 input.tsx         # Input component
│   │   ├── 🏷️ label.tsx         # Label component
│   │   ├── 🚨 alert.tsx         # Alert component
│   │   ├── 🏷️ badge.tsx         # Badge component
│   │   └── 📦 collapsible.tsx   # Collapsible component
│   ├── 🎨 login-form.tsx        # Authentication form
│   ├── 📋 Sidebar.tsx           # Navigation sidebar
│   ├── 📄 Header.tsx            # Application header
│   └── 🎨 DashboardLayout.tsx   # Main layout component
├── 🔄 context/
│   └── 🔐 JwtAuthContext.tsx    # Authentication context
└── 📱 app/
    ├── 🏠 layout.tsx            # Root layout component
    ├── 📄 page.tsx              # Home page
    ├── 🔐 login/                # Authentication pages
    │   ├── 📄 page.tsx          # Login page
    │   ├── ⏳ loading.tsx        # Loading state
    │   └── ⚙️ options/           # Login options
    ├── 🏠 home/                 # Home section
    │   ├── 📊 dashboard/         # Main dashboard
    │   ├── 🔑 password/         # Password management
    │   └── 📄 license/          # License information
    ├── 🛡️ firewall/             # Firewall management
    ├── 🌐 interfaces/           # Network interfaces
    ├── 🔐 vpn/                  # VPN management
    ├── 📊 report/               # Reporting section
    ├── ⚙️ system/               # System management
    ├── 🔐 services/             # Service management
    └── 📊 interfaces/           # Interface management
```

### 🔄 **Component Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   React Context  │    │   API Services  │
│   (App Router)  │◄──►│   (State Mgmt)   │◄──►│   (Data Fetch)  │
│  TypeScript     │    │  JWT Auth        │    │  Aether Vault   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
            │                       │                       │
            ▼                       ▼                       ▼
      Page Components      Auth Context State    API Client Layer
      Route Guards         User Session          HTTP Requests
      Layout Components    Token Management      Error Handling
            │                       │
            ▼                       ▼
     ┌─────────────────┐    ┌──────────────────┐
     │  UI Components  │    │  Utility Layer   │
     │  shadcn/ui      │    │  Helpers         │
     │  Custom Comps   │    │  Logger          │
     │  Form Elements  │    │  Navigation      │
     └─────────────────┘    └──────────────────┘
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended)
- **Docker** (optional, for containerization)

### 🔧 Installation & Setup

1. **Navigate to the app directory**

   ```bash
   cd app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Access the application**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)

### 🎯 **Available Scripts**

```bash
# 🚀 Development
pnpm dev                 # Start development server
pnpm dev:local          # Start with local environment
pnpm dev:debug          # Start with debug logging

# 🏗️ Building
pnpm build              # Build for production
pnpm start              # Start production server

# 🔧 Code Quality
pnpm lint               # Run ESLint
pnpm typecheck          # TypeScript type checking
pnpm clean              # Clean build artifacts
```

---

## 🔧 Development

### 🎯 **Development Workflow**

```bash
# Daily development
pnpm dev                # Start development server
pnpm lint               # Check code quality
pnpm typecheck          # Verify types

# Before committing
pnpm lint               # Ensure code quality
pnpm typecheck          # Type safety check
pnpm build              # Verify build works

# Container development
docker build -t aether-shield-app .
docker run -p 3000:3000 aether-shield-app
```

### 📋 **Development Guidelines**

- **TypeScript Strict Mode** - All code must pass strict type checking
- **Component Structure** - Follow established React patterns
- **Accessibility First** - Ensure WCAG compliance
- **Mobile-First Design** - Responsive design principles
- **Performance Optimization** - Code splitting and lazy loading
- **Security Best Practices** - Input validation and sanitization

### 🎨 **Styling Guidelines**

- **Tailwind CSS v4** - Use utility-first approach
- **Design Tokens** - Consistent spacing and colors
- **Dark Mode Support** - Theme-aware components
- **Responsive Design** - Mobile-first breakpoints
- **Animation Standards** - Smooth transitions and micro-interactions

---

## 📚 Documentation

### 📖 **Key Documentation**

- **[Component Library](components/ui/)** - shadcn/ui component documentation
- **[Authentication Guide](context/JwtAuthContext.tsx)** - JWT authentication implementation
- **[Navigation Config](lib/navigation-config.ts)** - Menu structure and routing
- **[Styling Guide](styles/globals.css)** - CSS variables and theming

### 🔧 **Configuration Files**

- **[package.json](package.json)** - Dependencies and scripts
- **[tailwind.config.js](tailwind.config.js)** - Tailwind CSS configuration
- **[tsconfig.build.json](tsconfig.build.json)** - TypeScript build settings
- **[eslint.config.mjs](eslint.config.mjs)** - Code linting rules
- **[components.json](components.json)** - shadcn/ui configuration

---

## 🤝 Contributing

We welcome contributions to improve the Aether Shield App! Whether you're experienced with React, Next.js, TypeScript, or UI/UX design, there's a place for you.

### 🎯 **How to Contribute**

1. **Fork the repository** and create a feature branch
2. **Follow our code standards** and TypeScript strict mode
3. **Test thoroughly** in different screen sizes and browsers
4. **Ensure accessibility** compliance
5. **Submit a pull request** with clear description

### 🏗️ **Areas Needing Help**

- **React Component Development** - New features and UI improvements
- **TypeScript Enhancement** - Better type safety and interfaces
- **UI/UX Design** - Better user experience and accessibility
- **Performance Optimization** - Code splitting and lazy loading
- **Testing** - Unit tests and integration tests
- **Documentation** - Component docs and usage examples

---

## 📊 Project Status

| Component                | Status         | Technology                | Notes                           |
| ------------------------ | -------------- | ------------------------- | ------------------------------- |
| **Frontend Framework**   | ✅ Working     | Next.js 16 + React 19.2.3 | App Router + TypeScript         |
| **UI Component Library** | ✅ Working     | shadcn/ui + Radix UI      | Accessible + Responsive         |
| **Styling System**       | ✅ Working     | Tailwind CSS v4           | Dark mode + Design tokens       |
| **Authentication**       | ✅ Working     | JWT + React Context       | Secure token management         |
| **State Management**     | ✅ Working     | React Context             | Global state management         |
| **Code Quality**         | ✅ Working     | ESLint + Prettier         | TypeScript strict mode          |
| **Container Support**    | ✅ Working     | Docker                    | Production-ready deployment     |
| **Accessibility**        | 🔄 In Progress | WCAG 2.1                  | Screen reader support           |
| **Testing Suite**        | 📋 Planned     | Jest + Testing Library    | Unit and integration tests      |
| **Performance**          | 🔄 In Progress | Next.js Optimizations     | Code splitting and lazy loading |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sky Genesis Enterprise

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Next.js Team** - Excellent React framework
- **React Team** - Modern UI library
- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **TypeScript Team** - Type-safe JavaScript
- **Sky Genesis Enterprise** - Project leadership and architecture

---

<div align="center">

### 🛡️ **Building the Future of Security Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-shield) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-shield/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-shield/discussions)

---

**🔧 Modern Security Platform with Next.js 16 + React 19.2.3 + TypeScript**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building comprehensive security and network protection management_

</div>
