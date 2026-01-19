<div align="center">

# 🔧 Configuration Module

[![Go](https://img.shields.io/badge/Go-1.21+-blue?style=for-the-badge&logo=go)](https://golang.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/) [![GORM](https://img.shields.io/badge/GORM-v1.25+-green?style=for-the-badge&logo=go)](https://gorm.io/) [![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/skygenesisenterprise/aether-shield/blob/main/LICENSE)

**⚙️ Centralized Configuration Management for Aether Shield Server**

Core configuration module that manages application settings, database connections, and security credentials for the Aether Shield server infrastructure.

[📋 Overview](#-overview) • [🏗️ Architecture](#️-architecture) • [📦 Components](#-components) • [🔧 Usage](#-usage) • [⚙️ Configuration](#️-configuration) • [🔒 Security](#-security) • [📚 Examples](#-examples)

</div>

---

## 🌟 Overview

The **Configuration Module** (`server/src/config/config.go`) provides centralized configuration management for the Aether Shield server. It handles database connections, JWT secrets, server mode settings, and environment variable management with secure defaults.

### 🎯 Key Features

- **🔐 Secure Configuration** - JWT secrets and authentication tokens
- **🗄️ Database Management** - PostgreSQL connection with GORM integration
- **🌍 Environment Support** - Flexible environment variable handling
- **⚡ Performance Optimized** - Connection pooling and efficient resource management
- **🛡️ Security First** - Secure defaults and environment-based configuration
- **🔄 Dynamic Loading** - Runtime configuration loading from environment

---

## 🏗️ Architecture

### 📋 Module Structure

```
server/src/config/
├── config.go              # Main configuration module
├── Config                 # Configuration struct
├── Load()                 # Configuration loader
└── getEnv()               # Environment variable helper
```

### 🔄 Data Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Environment    │    │   Config Module  │    │   Application   │
│  Variables      │───►│   (config.go)    │───►│   Components    │
│  (.env files)   │    │                  │    │   (Server)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
           │                       │                       │
           ▼                       ▼                       ▼
    JWT Secrets              Load() Function         Database Access
    Database URLs            Default Values          JWT Authentication
    Server Mode              Validation               Secure Operations
```

---

## 📦 Components

### 🔧 **Config Struct**

Central configuration structure containing all application settings:

```go
type Config struct {
    JWTSecret          string     // JWT signing secret
    RefreshTokenSecret string     // Refresh token secret
    Mode               string     // Server mode (debug/release)
    Database           *sql.DB    // PostgreSQL database connection
}
```

#### 📋 Field Details

| Field                | Type      | Description                    | Default Value               | Environment Variable   |
| -------------------- | --------- | ------------------------------ | --------------------------- | ---------------------- |
| `JWTSecret`          | `string`  | JWT token signing secret       | `"your-secret-key"`         | `JWT_SECRET`           |
| `RefreshTokenSecret` | `string`  | Refresh token signing secret   | `"your-refresh-secret-key"` | `REFRESH_TOKEN_SECRET` |
| `Mode`               | `string`  | Server operation mode          | `"debug"`                   | `GIN_MODE`             |
| `Database`           | `*sql.DB` | PostgreSQL database connection | -                           | `DATABASE_URL`         |

---

### 🚀 **Load() Function**

Main configuration loader that initializes all settings and establishes database connections.

```go
func Load() *Config
```

#### 🔧 **Functionality**

1. **Database Connection** - Establishes PostgreSQL connection
2. **Environment Loading** - Loads configuration from environment variables
3. **Default Values** - Applies secure defaults for missing values
4. **Error Handling** - Panics on critical failures (database connection)

#### 📋 **Database Configuration**

- **Default Connection**: `postgres://user:password@localhost/aether_shield?sslmode=disable`
- **Driver**: PostgreSQL via `github.com/lib/pq`
- **SSL Mode**: Disabled by default (development)
- **Database**: `aether_shield`

---

### 🔧 **getEnv() Helper**

Utility function for environment variable management with fallback to defaults.

```go
func getEnv(key, defaultValue string) string
```

#### 📋 **Parameters**

- `key`: Environment variable name
- `defaultValue`: Default value if environment variable is not set

#### ✨ **Features**

- **Safe Retrieval** - Handles missing environment variables gracefully
- **Default Support** - Provides fallback values for development
- **Type Safe** - String-based configuration for consistency

---

## 🔧 Usage

### 🚀 **Basic Usage**

```go
// Load configuration
config := config.Load()

// Access configuration values
jwtSecret := config.JWTSecret
dbConnection := config.Database
serverMode := config.Mode

// Use database connection
err := config.Database.Ping()
if err != nil {
    log.Fatal("Database connection failed:", err)
}
```

### 🏗️ **Server Integration**

```go
package main

import (
    "log"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/your-org/aether-shield/server/src/config"
)

func main() {
    // Load configuration
    cfg := config.Load()

    // Set Gin mode
    gin.SetMode(cfg.Mode)

    // Initialize router
    r := gin.Default()

    // Use configuration in routes
    r.GET("/health", func(c *gin.Context) {
        // Check database connection
        err := cfg.Database.Ping()
        if err != nil {
            c.JSON(http.StatusServiceUnavailable, gin.H{
                "status": "unhealthy",
                "database": "disconnected",
            })
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "status": "healthy",
            "database": "connected",
            "mode": cfg.Mode,
        })
    })

    log.Printf("Server starting in %s mode", cfg.Mode)
    r.Run(":8080")
}
```

---

## ⚙️ Configuration

### 🌍 **Environment Variables**

The configuration module supports the following environment variables:

#### 🔐 **Security Configuration**

```bash
# JWT Configuration
export JWT_SECRET="your-super-secure-jwt-secret-key-here"
export REFRESH_TOKEN_SECRET="your-super-secure-refresh-secret-key-here"
```

#### 🗄️ **Database Configuration**

```bash
# PostgreSQL Database
export DATABASE_URL="postgres://username:password@localhost:5432/aether_shield?sslmode=require"

# Alternative format (for local development)
export DATABASE_URL="postgres://user:password@localhost/aether_shield?sslmode=disable"
```

#### ⚡ **Server Configuration**

```bash
# Server Mode
export GIN_MODE="release"  # Options: debug, release, test
```

### 📁 **Development Environment**

Create a `.env` file in the project root:

```bash
# .env file
JWT_SECRET=dev-jwt-secret-key-change-in-production
REFRESH_TOKEN_SECRET=dev-refresh-secret-key-change-in-production
DATABASE_URL=postgres://user:password@localhost/aether_shield?sslmode=disable
GIN_MODE=debug
```

### 🚀 **Production Environment**

```bash
# Production environment variables
JWT_SECRET=prod-super-secure-jwt-key-256-bits-minimum
REFRESH_TOKEN_SECRET=prod-super-secure-refresh-key-256-bits-minimum
DATABASE_URL=postgres://prod_user:secure_password@db.example.com:5432/aether_shield_prod?sslmode=require
GIN_MODE=release
```

---

## 🔒 Security

### 🛡️ **Security Best Practices**

1. **Strong Secrets** - Use cryptographically strong secrets (minimum 256 bits)
2. **Environment Variables** - Never commit secrets to version control
3. **Production Defaults** - Never use default secrets in production
4. **SSL in Production** - Always use SSL mode `require` in production
5. **Database Access** - Use dedicated database users with limited privileges

### 🔐 **Secret Management**

```bash
# Generate secure JWT secrets (recommended)
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For REFRESH_TOKEN_SECRET
```

### 🚨 **Security Warnings**

- ⚠️ **Default secrets** are for development only
- ⚠️ **Database credentials** should use strong passwords
- ⚠️ **SSL mode** should be `require` in production
- ⚠️ **Environment variables** should be protected and encrypted

---

## 📚 Examples

### 🏗️ **Complete Application Example**

```go
package main

import (
    "context"
    "fmt"
    "log"
    "time"

    "github.com/your-org/aether-shield/server/src/config"
)

func main() {
    // Load configuration
    cfg := config.Load()

    // Display configuration info (without exposing secrets)
    fmt.Printf("🚀 Aether Shield Server\n")
    fmt.Printf("📊 Mode: %s\n", cfg.Mode)
    fmt.Printf("🗄️ Database: Connected\n")
    fmt.Printf("🔐 JWT: Configured\n")

    // Test database connection with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    err := cfg.Database.PingContext(ctx)
    if err != nil {
        log.Fatalf("❌ Database connection failed: %v", err)
    }

    fmt.Printf("✅ All systems ready!\n")

    // Your application logic here...
}
```

### 🔧 **Configuration Validation**

```go
package main

import (
    "fmt"
    "strings"

    "github.com/your-org/aether-shield/server/src/config"
)

func validateConfiguration(cfg *config.Config) error {
    // Validate JWT secrets
    if cfg.JWTSecret == "your-secret-key" {
        return fmt.Errorf("JWT secret is using default value")
    }

    if len(cfg.JWTSecret) < 32 {
        return fmt.Errorf("JWT secret is too short (minimum 32 characters)")
    }

    // Validate refresh token secret
    if cfg.RefreshTokenSecret == "your-refresh-secret-key" {
        return fmt.Errorf("refresh token secret is using default value")
    }

    if len(cfg.RefreshTokenSecret) < 32 {
        return fmt.Errorf("refresh token secret is too short (minimum 32 characters)")
    }

    // Validate server mode
    validModes := []string{"debug", "release", "test"}
    modeValid := false
    for _, mode := range validModes {
        if cfg.Mode == mode {
            modeValid = true
            break
        }
    }

    if !modeValid {
        return fmt.Errorf("invalid server mode: %s", cfg.Mode)
    }

    return nil
}

func main() {
    cfg := config.Load()

    if err := validateConfiguration(cfg); err != nil {
        fmt.Printf("❌ Configuration validation failed: %v\n", err)
        return
    }

    fmt.Printf("✅ Configuration is valid and secure!\n")
}
```

### 🐳 **Docker Integration**

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .

# Set environment variables
ENV JWT_SECRET=docker-jwt-secret-change-me
ENV REFRESH_TOKEN_SECRET=docker-refresh-secret-change-me
ENV DATABASE_URL=postgres://user:password@db:5432/aether_shield?sslmode=disable
ENV GIN_MODE=release

RUN go build -o aether-shield ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/aether-shield .

CMD ["./aether-shield"]
```

---

## 🔧 Development

### 🛠️ **Local Development Setup**

1. **Install PostgreSQL** (if not already installed)
2. **Create database**: `createdb aether_shield`
3. **Set environment variables** or create `.env` file
4. **Run the application**: `go run main.go`

### 📋 **Testing Configuration**

```bash
# Test database connection
go run -tags test config_test.go

# Validate environment variables
go run -tags validate config_validate.go

# Load and display configuration (without secrets)
go run -tags info config_info.go
```

---

## 📊 Status

| Component                    | Status     | Description                                 |
| ---------------------------- | ---------- | ------------------------------------------- |
| **Core Configuration**       | ✅ Working | Basic configuration loading and management  |
| **Database Connection**      | ✅ Working | PostgreSQL connection with error handling   |
| **Environment Variables**    | ✅ Working | Secure environment variable loading         |
| **JWT Configuration**        | ✅ Working | JWT and refresh token secret management     |
| **Server Mode**              | ✅ Working | Development/production mode switching       |
| **Error Handling**           | ✅ Working | Comprehensive error handling and validation |
| **Security Defaults**        | ✅ Working | Secure defaults and warnings                |
| **Testing Support**          | 📋 Planned | Unit tests and validation utilities         |
| **Configuration Validation** | 📋 Planned | Advanced validation and linting             |
| **Hot Reload**               | 📋 Planned | Runtime configuration updates               |

---

## 🔗 Dependencies

- **database/sql** - Standard Go database interface
- **github.com/lib/pq** - PostgreSQL driver for Go
- **os** - Go standard library for environment variables

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

<div align="center">

### 🚀 **Join Us in Building the Future of Network Security Management!**

[⭐ Star This Repo](https://github.com/skygenesisenterprise/aether-shield) • [🐛 Report Issues](https://github.com/skygenesisenterprise/aether-shield/issues) • [💡 Start a Discussion](https://github.com/skygenesisenterprise/aether-shield/discussions)

---

**🔧 Enterprise-Grade Firewall Management with Modern Web Technologies!**

**Made with ❤️ by the [Sky Genesis Enterprise](https://skygenesisenterprise.com) team**

_Building an open-source alternative to commercial firewall management solutions_

</div>
