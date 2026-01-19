# Aether Shield Backend Architecture

## Overview

This document defines the backend API architecture required to support the Aether Shield frontend application. The backend is built with Go and provides RESTful APIs under `/api/v1/*` to serve all frontend components.

## API Structure

### Base URL

```
https://<url>/api/v1
```

### Authentication

- JWT-based authentication
- Bearer token required for all protected endpoints
- OAuth2 authorization support

## API Endpoints

### 1. Authentication & User Management

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/oauth/authorize
```

### 2. Home Section

```
GET    /api/v1/home/dashboard/system-info
GET    /api/v1/home/dashboard/cpu-info
GET    /api/v1/home/dashboard/memory-info
GET    /api/v1/home/dashboard/disk-info
GET    /api/v1/home/dashboard/interface-stats
GET    /api/v1/home/dashboard/firewall-info
GET    /api/v1/home/dashboard/services
GET    /api/v1/home/dashboard/announcements
GET    /api/v1/home/dashboard/traffic-data
GET    /api/v1/home/license/info
PUT    /api/v1/home/password/change
```

### 3. System Section

#### Access Management

```
GET    /api/v1/system/access/users
POST   /api/v1/system/access/users
PUT    /api/v1/system/access/users/:id
DELETE /api/v1/system/access/users/:id
GET    /api/v1/system/access/groups
POST   /api/v1/system/access/groups
PUT    /api/v1/system/access/groups/:id
DELETE /api/v1/system/access/groups/:id
GET    /api/v1/system/access/privileges
GET    /api/v1/system/access/servers
GET    /api/v1/system/access/testers
```

#### Configuration

```
GET    /api/v1/system/config/backup
POST   /api/v1/system/config/backup
GET    /api/v1/system/config/default
GET    /api/v1/system/config/history
GET    /api/v1/system/config/wizard
```

#### Diagnostics

```
GET    /api/v1/system/diagnostics/activity
GET    /api/v1/system/diagnostics/services
GET    /api/v1/system/diagnostics/statistics
```

#### Firmware

```
GET    /api/v1/system/firmware/changelog
GET    /api/v1/system/firmware/packages
GET    /api/v1/system/firmware/plugins
GET    /api/v1/system/firmware/settings
GET    /api/v1/system/firmware/status
POST   /api/v1/system/firmware/updates
```

#### Gateways

```
GET    /api/v1/system/gateways/configs
GET    /api/v1/system/gateways/groups
GET    /api/v1/system/gateways/log
```

#### High Availability

```
GET    /api/v1/system/high-availability/status
GET    /api/v1/system/high-availability/settings
PUT    /api/v1/system/high-availability/settings
```

#### Routes

```
GET    /api/v1/system/routes/configs
GET    /api/v1/system/routes/log
GET    /api/v1/system/routes/status
```

#### Settings

```
GET    /api/v1/system/settings/admin
PUT    /api/v1/system/settings/admin
GET    /api/v1/system/settings/cron
PUT    /api/v1/system/settings/cron
GET    /api/v1/system/settings/general
PUT    /api/v1/system/settings/general
GET    /api/v1/system/settings/logging
PUT    /api/v1/system/settings/logging
GET    /api/v1/system/settings/miscellaneous
PUT    /api/v1/system/settings/miscellaneous
GET    /api/v1/system/settings/tunables
PUT    /api/v1/system/settings/tunables
```

#### Trust & Certificates

```
GET    /api/v1/system/trust/authorities
POST   /api/v1/system/trust/authorities
GET    /api/v1/system/trust/certificates
POST   /api/v1/system/trust/certificates
GET    /api/v1/system/trust/revocation
GET    /api/v1/system/trust/settings
```

### 4. Interfaces Section

```
GET    /api/v1/interfaces/assignments
PUT    /api/v1/interfaces/assignments
GET    /api/v1/interfaces/devices
GET    /api/v1/interfaces/devices/gif
GET    /api/v1/interfaces/devices/gre
GET    /api/v1/interfaces/devices/lagg
GET    /api/v1/interfaces/devices/vlan
GET    /api/v1/interfaces/devices/vxlan
GET    /api/v1/interfaces/devices/loopback
GET    /api/v1/interfaces/devices/point-to-point
GET    /api/v1/interfaces/devices/bridges
GET    /api/v1/interfaces/diagnostics/ping
POST   /api/v1/interfaces/diagnostics/ping
GET    /api/v1/interfaces/diagnostics/traceroute
POST   /api/v1/interfaces/diagnostics/traceroute
GET    /api/v1/interfaces/diagnostics/netstat
GET    /api/v1/interfaces/diagnostics/dns-lookup
POST   /api/v1/interfaces/diagnostics/dns-lookup
GET    /api/v1/interfaces/diagnostics/packet-capture
POST   /api/v1/interfaces/diagnostics/packet-capture
GET    /api/v1/interfaces/diagnostics/arp-tables
GET    /api/v1/interfaces/diagnostics/portprobe
POST   /api/v1/interfaces/diagnostics/portprobe
GET    /api/v1/interfaces/neighbors
GET    /api/v1/interfaces/overview
GET    /api/v1/interfaces/settings
PUT    /api/v1/interfaces/settings
GET    /api/v1/interfaces/virtual-ips/status
GET    /api/v1/interfaces/virtual-ips/settings
PUT    /api/v1/interfaces/virtual-ips/settings
GET    /api/v1/interfaces/wan
PUT    /api/v1/interfaces/wan
GET    /api/v1/interfaces/wireless/devices
```

### 5. Firewall Section

#### Rules & Aliases

```
GET    /api/v1/firewall/rules/wan
GET    /api/v1/firewall/rules/floating
POST   /api/v1/firewall/rules
PUT    /api/v1/firewall/rules/:id
DELETE /api/v1/firewall/rules/:id
GET    /api/v1/firewall/aliases
POST   /api/v1/firewall/aliases
PUT    /api/v1/firewall/aliases/:id
DELETE /api/v1/firewall/aliases/:id
GET    /api/v1/firewall/categories
GET    /api/v1/firewall/groups
```

#### Automation

```
GET    /api/v1/firewall/automation/filter
GET    /api/v1/firewall/automation/source-nat
```

#### NAT

```
GET    /api/v1/firewall/nat/one-to-one
GET    /api/v1/firewall/nat/outbound
GET    /api/v1/firewall/nat/port-forward
GET    /api/v1/firewall/nat/nptv6
```

#### Traffic Shaping

```
GET    /api/v1/firewall/shaper/queues
GET    /api/v1/firewall/shaper/rules
GET    /api/v1/firewall/shaper/pipes
GET    /api/v1/firewall/shaper/status
```

#### Settings & Logs

```
GET    /api/v1/firewall/settings/advanced
PUT    /api/v1/firewall/settings/advanced
GET    /api/v1/firewall/settings/normalization
PUT    /api/v1/firewall/settings/normalization
GET    /api/v1/firewall/settings/schedules
PUT    /api/v1/firewall/settings/schedules
GET    /api/v1/firewall/log/general
GET    /api/v1/firewall/log/live
GET    /api/v1/firewall/log/overview
GET    /api/v1/firewall/log/plain-view
```

#### Diagnostics

```
GET    /api/v1/firewall/diagnostics/statistics
GET    /api/v1/firewall/diagnostics/states
GET    /api/v1/firewall/diagnostics/aliases
GET    /api/v1/firewall/diagnostics/sessions
```

### 6. VPN Section

#### OpenVPN

```
GET    /api/v1/vpn/openvpn/instances
POST   /api/v1/vpn/openvpn/instances
PUT    /api/v1/vpn/openvpn/instances/:id
DELETE /api/v1/vpn/openvpn/instances/:id
GET    /api/v1/vpn/openvpn/status
GET    /api/v1/vpn/openvpn/log
GET    /api/v1/vpn/openvpn/export
GET    /api/v1/vpn/openvpn/client-overwrites
```

#### WireGuard

```
GET    /api/v1/vpn/wireguard/instances
POST   /api/v1/vpn/wireguard/instances
PUT    /api/v1/vpn/wireguard/instances/:id
DELETE /api/v1/vpn/wireguard/instances/:id
GET    /api/v1/vpn/wireguard/status
GET    /api/v1/vpn/wireguard/log
GET    /api/v1/vpn/wireguard/peers
POST   /api/v1/vpn/wireguard/peers
PUT    /api/v1/vpn/wireguard/peers/:id
DELETE /api/v1/vpn/wireguard/peers/:id
GET    /api/v1/vpn/wireguard/peer-generator
```

#### IPsec

```
GET    /api/v1/vpn/ipsec/connections
GET    /api/v1/vpn/ipsec/sessions
GET    /api/v1/vpn/ipsec/settings
PUT    /api/v1/vpn/ipsec/settings
GET    /api/v1/vpn/ipsec/pre-shared-keys
GET    /api/v1/vpn/ipsec/key-pairs
GET    /api/v1/vpn/ipsec/sad
GET    /api/v1/vpn/ipsec/spd
GET    /api/v1/vpn/ipsec/vti
GET    /api/v1/vpn/ipsec/leases
GET    /api/v1/vpn/ipsec/log
```

### 7. Services Section

#### DHCP Services

```
GET    /api/v1/services/dhcp/v4
GET    /api/v1/services/dhcp/log
GET    /api/v1/services/dhcp/leases6
GET    /api/v1/services/dhcprelay/configs
GET    /api/v1/services/dhcprelay/log
GET    /api/v1/services/dhcpv4/leases
GET    /api/v1/services/dhcpv4/log
```

#### DNS Services

```
GET    /api/v1/services/unbound-dns/statistics
GET    /api/v1/services/unbound-dns/blocklist
GET    /api/v1/services/opendns
```

#### Monitoring

```
GET    /api/v1/services/monit/status
GET    /api/v1/services/monit/log
GET    /api/v1/services/network/log
```

### 8. Reports Section

```
GET    /api/v1/report/health
GET    /api/v1/report/insight
GET    /api/v1/report/netflow
GET    /api/v1/report/settings
PUT    /api/v1/report/settings
GET    /api/v1/report/traffic
GET    /api/v1/report/unbound-dns
```

### 9. Database Section

#### Database Management

```
GET    /api/v1/database/tables
POST   /api/v1/database/tables
GET    /api/v1/database/tables/:name
PUT    /api/v1/database/tables/:name
DELETE /api/v1/database/tables/:name
GET    /api/v1/database/schemas
POST   /api/v1/database/schemas
GET    /api/v1/database/schemas/:name
DELETE /api/v1/database/schemas/:name
```

#### Database Operations

```
GET    /api/v1/database/queries
POST   /api/v1/database/queries
GET    /api/v1/database/queries/:id
DELETE /api/v1/database/queries/:id
POST   /api/v1/database/export
GET    /api/v1/database/import
POST   /api/v1/database/import
GET    /api/v1/database/backup
POST   /api/v1/database/backup
GET    /api/v1/database/restore
POST   /api/v1/database/restore
```

#### Database Monitoring

```
GET    /api/v1/database/status
GET    /api/v1/database/performance
GET    /api/v1/database/connections
GET    /api/v1/database/statistics
GET    /api/v1/database/logs
GET    /api/v1/database/locks
GET    /api/v1/database/slow-queries
```

### 10. Real-time & WebSocket Endpoints

```
WS     /api/v1/ws/dashboard/metrics
WS     /api/v1/ws/firewall/logs
WS     /api/v1/ws/interface-stats
WS     /api/v1/ws/system-status
WS     /api/v1/ws/traffic-monitor
```

## Data Models

### System Models

```go
type SystemInfo struct {
    Hostname     string `json:"hostname"`
    OS           string `json:"os"`
    Kernel       string `json:"kernel"`
    Uptime       int64  `json:"uptime"`
    Architecture string `json:"architecture"`
}

type CpuInfo struct {
    Usage       float64 `json:"usage"`
    Cores       int     `json:"cores"`
    Frequency   float64 `json:"frequency"`
    Temperature float64 `json:"temperature"`
}

type MemoryInfo struct {
    Total       int64   `json:"total"`
    Used        int64   `json:"used"`
    Available   int64   `json:"available"`
    Percentage  float64 `json:"percentage"`
}

type DiskInfo struct {
    Total      int64   `json:"total"`
    Used       int64   `json:"used"`
    Free       int64   `json:"free"`
    Percentage float64 `json:"percentage"`
    MountPoint string  `json:"mountPoint"`
}

type InterfaceStats struct {
    Name    string `json:"name"`
    Status  string `json:"status"`
    RxBytes int64  `json:"rx"`
    TxBytes int64  `json:"tx"`
    RxPackets int64 `json:"rxPackets"`
    TxPackets int64 `json:"txPackets"`
    RxErrors int64  `json:"rxErrors"`
    TxErrors int64  `json:"txErrors"`
}
```

### Firewall Models

```go
type FirewallInfo struct {
    Status  string `json:"status"`
    Rules   int    `json:"rules"`
    Blocked int64  `json:"blocked"`
    Allowed int64  `json:"allowed"`
}

type FirewallRule struct {
    ID          string `json:"id"`
    Action      string `json:"action"`
    Protocol    string `json:"protocol"`
    Source      string `json:"source"`
    Destination string `json:"destination"`
    Port        string `json:"port"`
    Description string `json:"description"`
    Enabled     bool   `json:"enabled"`
}

type FirewallAlias struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    Type        string `json:"type"`
    Content     string `json:"content"`
    Description string `json:"description"`
}
```

### Network Models

```go
type Interface struct {
    Name       string `json:"name"`
    Type       string `json:"type"`
    Status     string `json:"status"`
    IP         string `json:"ip"`
    Subnet     string `json:"subnet"`
    Gateway    string `json:"gateway"`
    MAC        string `json:"mac"`
    MTU        int    `json:"mtu"`
}

type VpnConfig struct {
    ID         string `json:"id"`
    Type       string `json:"type"`
    Server     string `json:"server"`
    Port       int    `json:"port"`
    Protocol   string `json:"protocol"`
    Credentials string `json:"credentials"`
}

type Route struct {
    Destination string `json:"destination"`
    Gateway     string `json:"gateway"`
    Interface   string `json:"interface"`
    Metric      int    `json:"metric"`
}
```

### User & Auth Models

```go
type User struct {
    ID         string   `json:"id"`
    Username   string   `json:"username"`
    Email      string   `json:"email"`
    Role       string   `json:"role"`
    Permissions []string `json:"permissions"`
    CreatedAt  time.Time `json:"createdAt"`
    UpdatedAt  time.Time `json:"updatedAt"`
}

type Group struct {
    ID          string   `json:"id"`
    Name        string   `json:"name"`
    Permissions []string `json:"permissions"`
    Members     []string `json:"members"`
}

type Privilege struct {
    ID           string `json:"id"`
    Name         string `json:"name"`
    Description  string `json:"description"`
    Capabilities []string `json:"capabilities"`
}
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration management
│   ├── controllers/     # HTTP handlers
│   ├── middleware/      # Middleware (auth, logging, etc.)
│   ├── model/          # Data models and structs
│   ├── routes/         # Route definitions
│   └── services/       # Business logic
├── Dockerfile
├── docker-compose.yml
├── go.mod
└── main.go
```

## Technology Stack

- **Language**: Go 1.21+
- **Web Framework**: Gin (or Echo)
- **Database**: PostgreSQL (primary) + Redis (caching)
- **Authentication**: JWT + OAuth2
- **Real-time**: WebSockets (Gorilla WebSocket)
- **Configuration**: Viper
- **Logging**: Logrus
- **Validation**: Go-playground validator
- **Documentation**: Swagger/OpenAPI

## Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Rate Limiting**: Per-endpoint rate limiting
4. **CORS**: Configurable CORS policies
5. **Input Validation**: Strict validation for all inputs
6. **SQL Injection**: Parameterized queries only
7. **HTTPS**: TLS 1.3 required in production
8. **Audit Logging**: All actions logged for compliance

## Performance Considerations

1. **Caching**: Redis for frequently accessed data
2. **Database**: Connection pooling and query optimization
3. **Compression**: Gzip compression for responses
4. **Pagination**: All list endpoints support pagination
5. **WebSockets**: Efficient real-time data streaming
6. **Monitoring**: Prometheus metrics and health checks

## Development Guidelines

1. **Code Style**: `gofmt` and `golangci-lint` mandatory
2. **Error Handling**: Explicit error returns, no panics
3. **Testing**: Unit tests for all business logic
4. **Documentation**: Swagger annotations for all endpoints
5. **Versioning**: Semantic versioning for API changes
6. **Environment**: Docker-based development setup

## Next Steps

1. Implement authentication middleware
2. Create base controller structure
3. Set up database connections
4. Implement user management endpoints
5. Add system monitoring endpoints
6. Create firewall management APIs
7. Implement real-time WebSocket endpoints
8. Add comprehensive testing
9. Set up CI/CD pipeline
10. Deploy with Docker and Kubernetes
