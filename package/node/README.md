<div align="center">

# 📦 Aether Shield Node.js SDK

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/) [![Browser](https://img.shields.io/badge/Browser-Compatible-brightgreen?style=for-the-badge&logo=google-chrome)](https://caniuse.com/)

**🚀 Universal TypeScript SDK for Aether Shield - Node.js and Browser Compatible**

A comprehensive, type-safe SDK for interacting with Aether Shield's API. Designed for both Node.js and browser environments with full TypeScript support and modern JavaScript features.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Installation](#-installation) • [📚 Usage](#-usage) • [📦 API Reference](#-api-reference) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/skygenesisenterprise/aether-shield?style=social)](https://github.com/skygenesisenterprise/aether-shield/stargazers) [![GitHub forks](https://img.shields.io/github/forks/skygenesisenterprise/aether-shield?style=social)](https://github.com/skygenesisenterprise/aether-shield/network)

</div>

---

## 🌟 What is Aether Shield Node.js SDK?

**Aether Shield Node.js SDK** is a universal TypeScript client library that provides seamless integration with the Aether Shield API. It's designed to work in both Node.js and browser environments, offering:

- **🔐 Complete Authentication** - JWT-based authentication with automatic token refresh
- **📦 Type-Safe API** - Full TypeScript support with comprehensive type definitions
- **🌐 Universal Compatibility** - Works in Node.js and browser environments
- **📦 Modular Design** - Import only what you need
- **🔄 Automatic Error Handling** - Comprehensive error handling and retry mechanisms
- **📊 Request Batching** - Efficient API calls with batching support

### 🎯 Key Features

- ✅ **Universal Client** - Single SDK for Node.js and browser environments
- ✅ **TypeScript Strict Mode** - Full type safety and IntelliSense support
- ✅ **Authentication Handling** - Built-in JWT token management
- ✅ **Email Operations** - Send, receive, and manage emails
- ✅ **User Management** - CRUD operations for user administration
- ✅ **Domain Management** - Multi-domain configuration
- ✅ **Comprehensive Examples** - Ready-to-use code examples
- ✅ **Error Handling** - Detailed error types and recovery mechanisms
- ✅ **Request Batching** - Optimize API calls with batching
- ✅ **WebSocket Support** - Real-time notifications and updates

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended)
- **TypeScript** 5.0 or higher (recommended)

### 🔧 Installation

#### Using pnpm (recommended)

```bash
pnpm add @aether-shield/node
```

#### Using npm

```bash
npm install @aether-shield/node
```

#### Using yarn

```bash
yarn add @aether-shield/node
```

### 🌐 Basic Usage

```typescript
import { AetherShieldClient } from "@aether-shield/node";

// Initialize the client
const client = new AetherShieldClient({
  baseURL: "https://your-aether-shield-instance.com",
  apiKey: "your-api-key",
  // Optional: For browser environments
  storage: window.localStorage,
});

// Send an email
await client.email.send({
  to: "user@example.com",
  subject: "Hello from Aether Shield",
  body: "This is a test email sent using the Node.js SDK",
});

console.log("Email sent successfully!");
```

---

## 🛠️ Installation

### 📦 Package Installation

The SDK is available through npm, pnpm, and yarn:

```bash
# Using pnpm (recommended)
pnpm add @aether-shield/node

# Using npm
npm install @aether-shield/node

# Using yarn
yarn add @aether-shield/node
```

### 🔧 Peer Dependencies

- **TypeScript** 5.0+ (recommended)
- **Node.js** 18.0+
- **Browser** - Modern browsers with ES6+ support

### 📦 Development Installation

For development and contribution:

```bash
cd package/node
pnpm install
pnpm build
```

---

## 📚 Usage

### 🎯 Basic Client Initialization

```typescript
import { AetherShieldClient } from "@aether-shield/node";

// Node.js environment
const client = new AetherShieldClient({
  baseURL: "https://api.aether-shield.com",
  apiKey: "your-api-key",
});

// Browser environment with localStorage
const browserClient = new AetherShieldClient({
  baseURL: "https://api.aether-shield.com",
  apiKey: "your-api-key",
  storage: window.localStorage,
});
```

### 🔐 Authentication

The SDK automatically handles JWT token management:

```typescript
// Login with credentials
const { accessToken, refreshToken } = await client.auth.login({
  email: "user@example.com",
  password: "your-password",
});

// The client will automatically use the access token for subsequent requests

// Logout
await client.auth.logout();
```

### 📧 Email Operations

```typescript
// Send an email
await client.email.send({
  to: "recipient@example.com",
  subject: "Test Email",
  body: "Hello, this is a test email!",
  cc: ["cc@example.com"],
  bcc: ["bcc@example.com"],
  attachments: [
    {
      filename: "document.pdf",
      content: "base64-encoded-content",
    },
  ],
});

// List emails
const emails = await client.email.list({
  limit: 10,
  offset: 0,
  folder: "inbox",
});

// Get email details
const email = await client.email.get("email-id");

// Delete email
await client.email.delete("email-id");
```

### 👥 User Management

```typescript
// Create user
const user = await client.users.create({
  email: "newuser@example.com",
  password: "secure-password",
  name: "John Doe",
  role: "user",
});

// Get user
const currentUser = await client.users.get("user-id");

// Update user
const updatedUser = await client.users.update("user-id", {
  name: "John Updated",
  role: "admin",
});

// List users
const users = await client.users.list({
  limit: 20,
  offset: 0,
});

// Delete user
await client.users.delete("user-id");
```

### 🌐 Domain Management

```typescript
// Create domain
const domain = await client.domains.create({
  name: "example.com",
  description: "Main domain",
});

// Get domain
const domainDetails = await client.domains.get("domain-id");

// List domains
const domains = await client.domains.list();

// Delete domain
await client.domains.delete("domain-id");
```

### 🔄 Batch Operations

```typescript
// Batch multiple operations
const results = await client.batch([
  {
    method: "POST",
    path: "/api/v1/emails",
    body: {
      to: "user1@example.com",
      subject: "Batch Email 1",
      body: "First email",
    },
  },
  {
    method: "POST",
    path: "/api/v1/emails",
    body: {
      to: "user2@example.com",
      subject: "Batch Email 2",
      body: "Second email",
    },
  },
]);

console.log(results); // Array of responses
```

### 🌐 WebSocket Connection

```typescript
// Connect to WebSocket for real-time updates
const ws = client.ws.connect();

ws.on("message", (data) => {
  console.log("Received message:", data);
});

ws.on("email:received", (email) => {
  console.log("New email received:", email);
});

// Disconnect
ws.disconnect();
```

---

## 📦 API Reference

### 🎨 Client Configuration

```typescript
interface AetherShieldClientOptions {
  baseURL: string; // Base URL of the Aether Shield API
  apiKey?: string; // API key for authentication
  accessToken?: string; // JWT access token
  refreshToken?: string; // JWT refresh token
  storage?: Storage; // Storage for token persistence (browser only)
  timeout?: number; // Request timeout in milliseconds
  retry?: number; // Number of retry attempts for failed requests
  headers?: Record<string, string>; // Custom headers
}
```

### 🔐 Authentication API

#### `client.auth.login(credentials)`

Login with email and password.

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

#### `client.auth.refresh()`

Refresh the access token using the refresh token.

```typescript
interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

#### `client.auth.logout()`

Logout and clear authentication tokens.

#### `client.auth.me()`

Get current authenticated user.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}
```

### 📧 Email API

#### `client.email.send(emailData)`

Send an email.

```typescript
interface EmailSendData {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: EmailAttachment[];
}

interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded
  contentType?: string;
}

interface EmailResponse {
  id: string;
  messageId: string;
  status: "queued" | "sent" | "failed";
  createdAt: Date;
}
```

#### `client.email.list(options)`

List emails.

```typescript
interface EmailListOptions {
  limit?: number;
  offset?: number;
  folder?: "inbox" | "sent" | "drafts" | "trash";
  search?: string;
  sort?: "date" | "subject" | "from";
  order?: "asc" | "desc";
}

interface EmailListResponse {
  emails: Email[];
  total: number;
  limit: number;
  offset: number;
}

interface Email {
  id: string;
  messageId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  html?: string;
  read: boolean;
  folder: string;
  receivedAt: Date;
  attachments: EmailAttachment[];
}
```

#### `client.email.get(emailId)`

Get email details.

#### `client.email.delete(emailId)`

Delete an email.

### 👥 User API

#### `client.users.create(userData)`

Create a new user.

```typescript
interface UserCreateData {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
}
```

#### `client.users.get(userId)`

Get user details.

#### `client.users.update(userId, userData)`

Update user.

#### `client.users.list(options)`

List users.

```typescript
interface UserListOptions {
  limit?: number;
  offset?: number;
  search?: string;
  role?: "admin" | "user";
}
```

#### `client.users.delete(userId)`

Delete user.

### 🌐 Domain API

#### `client.domains.create(domainData)`

Create a new domain.

```typescript
interface DomainCreateData {
  name: string;
  description?: string;
}
```

#### `client.domains.get(domainId)`

Get domain details.

#### `client.domains.list(options)`

List domains.

```typescript
interface DomainListOptions {
  limit?: number;
  offset?: number;
  search?: string;
}
```

#### `client.domains.delete(domainId)`

Delete domain.

### 🔄 Batch API

#### `client.batch(operations)`

Execute multiple operations in a single request.

```typescript
interface BatchOperation {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

interface BatchResponse {
  results: any[];
  errors: BatchError[];
}

interface BatchError {
  operationIndex: number;
  error: Error;
}
```

### 🌐 WebSocket API

#### `client.ws.connect()`

Connect to WebSocket server.

```typescript
interface WebSocketConnection {
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
  disconnect(): void;
}
```

---

## 🤝 Contributing

We welcome contributions to the Aether Shield Node.js SDK! Here's how you can help:

### 🎯 How to Contribute

1. **Fork the repository** and create a feature branch
2. **Install dependencies** with `pnpm install`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Submit a pull request** with clear description

### 🏗️ Development Setup

```bash
# Clone the repository
cd package/node

# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format
```

### 📋 Coding Standards

- **TypeScript Strict Mode** - All code must pass strict type checking
- **ESLint** - Follow ESLint rules
- **Prettier** - Code formatting with Prettier
- **JSDoc** - Comprehensive documentation for all public APIs
- **Error Handling** - Proper error handling and type safety
- **Testing** - Unit tests for all new functionality

### 📝 Pull Request Guidelines

- **Clear Description** - Explain what the PR does and why
- **Related Issues** - Reference any related GitHub issues
- **Tests** - Include tests for new functionality
- **Documentation** - Update documentation if needed
- **Changelog** - Update CHANGELOG.md if applicable

---

## 📞 Support & Community

### 💬 Getting Help

- 📖 **[Main Documentation](https://github.com/skygenesisenterprise/aether-shield/docs/)** - Comprehensive guides
- 📦 **[Package Documentation](https://github.com/skygenesisenterprise/aether-shield/package/node/)** - SDK-specific docs
- 🐛 **[GitHub Issues](https://github.com/skygenesisenterprise/aether-shield/issues)** - Bug reports and feature requests
- 💡 **[GitHub Discussions](https://github.com/skygenesisenterprise/aether-shield/discussions)** - General questions

### 🐛 Reporting Issues

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Node.js version, browser, etc.)
- Error logs or screenshots
- Expected vs actual behavior

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Sky Genesis Enterprise** - Project leadership and development
- **TypeScript Team** - Excellent static typing for JavaScript
- **Node.js Community** - Robust JavaScript runtime
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🚀 **Build Amazing Email Applications with Aether Shield Node.js SDK!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-shield) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-shield/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-shield/discussions)

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building the future of email infrastructure with modern TypeScript SDKs_

</div>
