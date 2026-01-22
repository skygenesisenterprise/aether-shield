/**
 * System Module Types
 */

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'disabled' | 'locked';
}

export interface UserInput {
  username: string;
  email: string;
  fullName?: string;
  password: string;
  roles?: string[];
  permissions?: string[];
  status?: 'active' | 'disabled';
}

export interface UserUpdate {
  email?: string;
  fullName?: string;
  password?: string;
  roles?: string[];
  permissions?: string[];
  status?: 'active' | 'disabled';
}

// Group types
export interface Group {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupInput {
  name: string;
  description?: string;
  permissions?: string[];
  users?: string[];
}

// Privilege types
export interface Privilege {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Server types
export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  lastCheck: string;
}

// Tester types
export interface Tester {
  id: string;
  name: string;
  type: string;
  configuration: any;
  status: 'active' | 'inactive';
}

// Backup types
export interface BackupConfig {
  id: string;
  name: string;
  schedule: string;
  retention: number;
  destination: string;
  lastRun?: string;
  nextRun?: string;
  status: 'active' | 'inactive';
}

export interface BackupInput {
  name: string;
  schedule: string;
  retention: number;
  destination: string;
  status?: 'active' | 'inactive';
}

// Activity types
export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: any;
}

// Statistics types
export interface SystemStatistics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  uptime: number;
  processes: number;
  users: number;
}

// Firmware types
export interface FirmwareInfo {
  version: string;
  buildDate: string;
  changelog: string;
  availableUpdates: boolean;
  latestVersion?: string;
}

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
  installed: boolean;
  availableVersion?: string;
}

// Gateway types
export interface GatewayConfig {
  id: string;
  name: string;
  interface: string;
  gateway: string;
  monitor: string;
  description: string;
  status: 'online' | 'offline' | 'pending';
}

// High Availability types
export interface HAStatus {
  status: 'active' | 'backup' | 'disabled';
  syncStatus: 'synchronized' | 'pending' | 'failed';
  lastSync: string;
  peerStatus: 'online' | 'offline' | 'unknown';
}

export interface HASettings {
  enabled: boolean;
  syncInterface: string;
  syncIp: string;
  syncPort: number;
  heartbeatInterval: number;
  failoverTimeout: number;
}

// Route types
export interface RouteConfig {
  id: string;
  network: string;
  gateway: string;
  interface: string;
  description: string;
  disabled: boolean;
}

// Settings types
export interface AdminSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  dashboardLayout: string;
  notifications: boolean;
}

export interface CronSettings {
  enabled: boolean;
  schedule: string;
  lastRun?: string;
  nextRun?: string;
}

export interface GeneralSettings {
  hostname: string;
  domain: string;
  timezone: string;
  dnsServers: string[];
  ntpServers: string[];
}

export interface LoggingSettings {
  logLevel: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  logRetention: number;
  remoteLogging: boolean;
  remoteLogServer?: string;
}

export interface MiscSettings {
  webGui: {
    protocol: 'http' | 'https';
    port: number;
    sslCertificate?: string;
  };
  api: {
    enabled: boolean;
    port: number;
    sslCertificate?: string;
  };
}

export interface Tunable {
  id: string;
  name: string;
  value: string;
  description: string;
  type: 'sysctl' | 'loader' | 'rc';
}

// Trust types
export interface CertificateAuthority {
  id: string;
  name: string;
  description: string;
  certificate: string;
  privateKey: string;
  createdAt: string;
  expiresAt: string;
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
  certificate: string;
  privateKey?: string;
  caId: string;
  createdAt: string;
  expiresAt: string;
}

export interface RevokedCertificate {
  id: string;
  certificateId: string;
  revocationDate: string;
  reason: string;
}

export interface TrustSettings {
  ocspEnabled: boolean;
  crlEnabled: boolean;
  crlUrl?: string;
}