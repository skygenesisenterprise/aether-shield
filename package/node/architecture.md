# Aether Shield Node.js SDK Architecture

## 🎯 Overview

The Aether Shield Node.js SDK provides a unified, type-safe interface to the Shield API, abstracting HTTP transport and providing a clean, modular architecture for client applications.

## 🏗️ Architecture Design

### Core Principles

1. **Single Entry Point**: All functionality accessible through `shield.*` namespace
2. **Modular Organization**: Each backend module has a dedicated SDK module
3. **Type Safety**: Comprehensive TypeScript interfaces for all API responses
4. **Security First**: Built-in authentication and token management
5. **Error Handling**: Consistent error patterns across all modules

### Module Structure

```
package/node/
├── src/
│   ├── client/
│   │   ├── ShieldClient.ts          # Main client class
│   │   ├── auth/
│   │   │   ├── AuthModule.ts        # Authentication module
│   │   │   └── types.ts            # Auth types
│   │   ├── home/
│   │   │   ├── HomeModule.ts        # Home/Dashboard module
│   │   │   └── types.ts            # Home types
│   │   ├── system/
│   │   │   ├── SystemModule.ts      # System module
│   │   │   └── types.ts            # System types
│   │   ├── interfaces/
│   │   │   ├── InterfaceModule.ts   # Interface module
│   │   │   └── types.ts            # Interface types
│   │   ├── firewall/
│   │   │   ├── FirewallModule.ts    # Firewall module
│   │   │   └── types.ts            # Firewall types
│   │   ├── vpn/
│   │   │   ├── VPNModule.ts         # VPN module
│   │   │   └── types.ts            # VPN types
│   │   ├── services/
│   │   │   ├── ServiceModule.ts     # Services module
│   │   │   └── types.ts            # Service types
│   │   ├── database/
│   │   │   ├── DatabaseModule.ts    # Database module
│   │   │   └── types.ts            # Database types
│   │   ├── routers/
│   │   │   ├── RouterModule.ts      # Router module
│   │   │   └── types.ts            # Router types
│   │   └── types.ts                # Shared types
│   ├── transport/
│   │   ├── HttpTransport.ts         # HTTP transport layer
│   │   └── types.ts                # Transport types
│   ├── errors/
│   │   ├── ShieldError.ts           # Base error class
│   │   └── errorCodes.ts            # Error codes
│   └── index.ts                    # Main export
├── test/                            # Unit tests
├── examples/                        # Usage examples
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Module Breakdown

### 1. ShieldClient (Main Entry Point)

The main client class that orchestrates all modules and provides authentication:

```typescript
class ShieldClient {
  public auth: AuthModule;
  public home: HomeModule;
  public system: SystemModule;
  public interfaces: InterfaceModule;
  public firewall: FirewallModule;
  public vpn: VPNModule;
  public services: ServiceModule;
  public database: DatabaseModule;
  public routers: RouterModule;

  constructor(config: ShieldClientConfig);
  
  // Authentication management
  setToken(token: string): void;
  getToken(): string | null;
  clearToken(): void;
  
  // Base URL management
  setBaseUrl(url: string): void;
}
```

### 2. Module Structure (Example: FirewallModule)

Each module follows a consistent pattern:

```typescript
class FirewallModule {
  constructor(private client: ShieldClient, private transport: HttpTransport);

  // Rules
  async listWanRules(): Promise<FirewallRule[]>;
  async listFloatingRules(): Promise<FirewallRule[]>;
  async createRule(rule: FirewallRuleInput): Promise<FirewallRule>;
  async updateRule(id: string, rule: FirewallRuleInput): Promise<FirewallRule>;
  async deleteRule(id: string): Promise<void>;

  // Aliases
  async listAliases(): Promise<FirewallAlias[]>;
  async createAlias(alias: FirewallAliasInput): Promise<FirewallAlias>;
  async updateAlias(id: string, alias: FirewallAliasInput): Promise<FirewallAlias>;
  async deleteAlias(id: string): Promise<void>;

  // Categories & Groups
  async listCategories(): Promise<FirewallCategory[]>;
  async listGroups(): Promise<FirewallGroup[]>;

  // NAT
  async listOneToOneNat(): Promise<NatRule[]>;
  async listOutboundNat(): Promise<NatRule[]>;
  async listPortForward(): Promise<PortForwardRule[]>;
  async listNptv6Nat(): Promise<NatRule[]>;

  // Traffic Shaping
  async listQueues(): Promise<ShaperQueue[]>;
  async listShaperRules(): Promise<ShaperRule[]>;
  async listPipes(): Promise<ShaperPipe[]>;
  async getShaperStatus(): Promise<ShaperStatus>;

  // Settings
  async getAdvancedSettings(): Promise<FirewallAdvancedSettings>;
  async updateAdvancedSettings(settings: FirewallAdvancedSettingsInput): Promise<FirewallAdvancedSettings>;
  async getNormalizationSettings(): Promise<FirewallNormalizationSettings>;
  async updateNormalizationSettings(settings: FirewallNormalizationSettingsInput): Promise<FirewallNormalizationSettings>;
  async listSchedules(): Promise<FirewallSchedule[]>;
  async updateSchedules(schedules: FirewallScheduleInput[]): Promise<FirewallSchedule[]>;

  // Logs
  async getGeneralLog(): Promise<FirewallLog>;
  async getLiveLog(): Promise<FirewallLog>;
  async getLogOverview(): Promise<FirewallLogOverview>;
  async getPlainViewLog(): Promise<FirewallLog>;

  // Diagnostics
  async getStatistics(): Promise<FirewallStatistics>;
  async getStates(): Promise<FirewallState[]>;
  async getAliasDiagnostics(): Promise<FirewallAliasDiagnostics>;
  async getSessions(): Promise<FirewallSession[]>;
}
```

### 3. HTTP Transport Layer

Centralized HTTP communication with automatic token injection:

```typescript
class HttpTransport {
  constructor(private baseUrl: string, private tokenManager: TokenManager);

  async get<T>(path: string, params?: Record<string, any>): Promise<T>;
  async post<T>(path: string, body: any): Promise<T>;
  async put<T>(path: string, body: any): Promise<T>;
  async delete<T>(path: string): Promise<T>;

  setToken(token: string): void;
  clearToken(): void;
}
```

### 4. Error Handling

Consistent error structure:

```typescript
class ShieldError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: any
  );
}
```

## 📡 API Endpoint Mapping

### Auth Module
- `POST /api/v1/auth/login` → `shield.auth.login()`
- `POST /api/v1/auth/logout` → `shield.auth.logout()`
- `POST /api/v1/auth/refresh` → `shield.auth.refreshToken()`
- `GET /api/v1/auth/me` → `shield.auth.getMe()`

### Home Module
- `GET /api/v1/home/dashboard/system-info` → `shield.home.getSystemInfo()`
- `GET /api/v1/home/dashboard/cpu-info` → `shield.home.getCpuInfo()`
- `GET /api/v1/home/dashboard/memory-info` → `shield.home.getMemoryInfo()`
- `GET /api/v1/home/dashboard/disk-info` → `shield.home.getDiskInfo()`
- `GET /api/v1/home/dashboard/interface-stats` → `shield.home.getInterfaceStats()`
- `GET /api/v1/home/dashboard/firewall-info` → `shield.home.getFirewallInfo()`
- `GET /api/v1/home/dashboard/services` → `shield.home.getServices()`
- `GET /api/v1/home/dashboard/announcements` → `shield.home.getAnnouncements()`
- `GET /api/v1/home/dashboard/traffic-data` → `shield.home.getTrafficData()`
- `GET /api/v1/home/license/info` → `shield.home.getLicenseInfo()`
- `PUT /api/v1/home/password/change` → `shield.home.changePassword()`

### System Module
- **Access**: Users, Groups, Privileges, Servers, Testers
- **Config**: Backup, Default, History, Wizard
- **Diagnostics**: Activity, Services, Statistics
- **Firmware**: Changelog, Packages, Plugins, Settings, Status, Updates
- **Gateways**: Configs, Groups, Log
- **High Availability**: Status, Settings
- **Routes**: Configs, Log, Status
- **Settings**: Admin, Cron, General, Logging, Misc, Tunables
- **Trust**: Authorities, Certificates, Revocation, Settings

### Interface Module
- **Assignments**: Get, Update
- **Devices**: Various device types
- **Diagnostics**: Ping, Traceroute, Netstat, DNS Lookup, Packet Capture, ARP Tables, Portprobe
- **Neighbors**: Get
- **Overview**: Get
- **Settings**: Get, Update
- **Virtual IPs**: Status, Settings
- **WAN**: Get, Update
- **Wireless**: Devices

### Firewall Module
- **Rules**: WAN, Floating, CRUD operations
- **Aliases**: CRUD operations
- **Categories & Groups**: List
- **Automation**: Filter, Source NAT
- **NAT**: One-to-One, Outbound, Port Forward, NPTv6
- **Traffic Shaping**: Queues, Rules, Pipes, Status
- **Settings**: Advanced, Normalization, Schedules
- **Logs**: General, Live, Overview, Plain View
- **Diagnostics**: Statistics, States, Aliases, Sessions

### VPN Module
- **OpenVPN**: Instances CRUD, Status, Log, Export, Client Overwrites
- **WireGuard**: Instances CRUD, Status, Log, Peers CRUD, Peer Generator
- **IPsec**: Connections, Sessions, Settings, Pre-shared Keys, Key Pairs, SAD, SPD, VTI, Leases, Log

### Services Module
- **DHCP**: v4, Log, Leases6, Status
- **DHCP Relay**: Configs, Log
- **DHCPv4**: Leases, Log, Static mappings CRUD
- **DNS**: Unbound statistics, blocklist, settings
- **OpenDNS**: Get
- **Monit**: Status, Log, Settings
- **Network**: Log, Status
- **Additional**: NTP, SNMP, Syslog status

### Database Module
- **Management**: Tables CRUD, Schemas CRUD
- **Operations**: Queries CRUD, Export, Import, Backup, Restore
- **Monitoring**: Status, Performance, Connections, Statistics, Logs, Locks, Slow Queries

### Router Module
- **Management**: CRUD operations
- **Status**: Get
- **Configuration**: Get, Update
- **Logs**: Get
- **Interfaces**: Get
- **Routes**: Get
- **Services**: Get
- **Firewall**: Get
- **VPN**: Get
- **Statistics**: Get
- **Commands**: Execute
- **Diagnostics**: Get
- **Backup**: Get, Create, Restore

## 🔐 Authentication Flow

```
Client → ShieldClient.setToken() → HttpTransport (auto-injects token)
                          ↓
                    API Request with Authorization header
                          ↓
                    Shield API → Response
                          ↓
                    HttpTransport → ShieldClient
                          ↓
                    Client receives typed response
```

## 📦 Type System

Comprehensive TypeScript interfaces for all API responses and inputs:

```typescript
// Example: Firewall types
interface FirewallRule {
  id: string;
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  action: 'pass' | 'block' | 'reject';
  description: string;
  enabled: boolean;
  // ... other properties
}

interface FirewallRuleInput {
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  action: 'pass' | 'block' | 'reject';
  description?: string;
  enabled?: boolean;
}
```

## 🚀 Usage Example

```typescript
import { CreateShieldClient } from 'aether-shield';

// Initialize client
const shield = CreateShieldClient({
  baseUrl: 'https://shield.aether-office.com',
  token: 'your-auth-token'
});

// Use firewall module
async function listFirewallRules() {
  try {
    const rules = await shield.firewall.listWanRules();
    console.log('WAN Rules:', rules);
    
    const aliases = await shield.firewall.listAliases();
    console.log('Aliases:', aliases);
  } catch (error) {
    if (error instanceof ShieldError) {
      console.error('Shield Error:', error.message, error.code);
    }
  }
}

// Use system module
async function getSystemInfo() {
  const systemInfo = await shield.system.getSystemInfo();
  const users = await shield.system.listUsers();
  
  console.log('System:', systemInfo);
  console.log('Users:', users);
}
```

## 🛡️ Security Considerations

1. **Token Management**: Tokens stored in memory only, never persisted
2. **HTTPS Only**: All communications use HTTPS
3. **Input Validation**: Client-side validation for required fields
4. **Error Handling**: Sensitive error details sanitized
5. **Rate Limiting**: Respects server-side rate limits

## 🔄 Future Extensibility

The architecture supports:
- Adding new modules without breaking changes
- Extending existing modules with new endpoints
- Custom middleware injection
- Plugin system for additional functionality

## 📝 Implementation Notes

1. All async operations return Promises
2. TypeScript strict mode enabled
3. Comprehensive JSDoc documentation
4. Unit tests for all modules
5. Integration tests for critical paths

## 🎯 Benefits

1. **Unified Interface**: Single import, consistent API
2. **Type Safety**: Compile-time checking of API contracts
3. **Reduced Boilerplate**: No manual HTTP requests
4. **Better DX**: Autocomplete and IDE support
5. **Maintainability**: Clear separation of concerns
