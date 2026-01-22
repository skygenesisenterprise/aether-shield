/**
 * Home Module Types
 */

export interface SystemInfo {
  hostname: string;
  version: string;
  uptime: number;
  loadAverage: number[];
  platform: string;
  arch: string;
  totalMemory: number;
  freeMemory: number;
  cpuCores: number;
}

export interface CpuInfo {
  model: string;
  speed: number;
  cores: number;
  usage: number;
  times: {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
  };
}

export interface MemoryInfo {
  total: number;
  free: number;
  used: number;
  active: number;
  available: number;
  buffers: number;
  cached: number;
  swapTotal: number;
  swapFree: number;
  swapUsed: number;
}

export interface DiskInfo {
  device: string;
  mount: string;
  size: number;
  used: number;
  available: number;
  capacity: number;
  type: string;
}

export interface InterfaceStats {
  name: string;
  rxBytes: number;
  txBytes: number;
  rxPackets: number;
  txPackets: number;
  rxErrors: number;
  txErrors: number;
  rxDropped: number;
  txDropped: number;
  speed: number;
  duplex: string;
  status: string;
}

export interface FirewallInfo {
  status: string;
  rulesCount: number;
  aliasesCount: number;
  natRulesCount: number;
  statesCount: number;
  uptime: number;
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'failed';
  description: string;
  version?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  expiresAt?: string;
}

export interface TrafficData {
  timestamp: string;
  rxBytes: number;
  txBytes: number;
  rxPackets: number;
  txPackets: number;
}

export interface LicenseInfo {
  status: 'valid' | 'expired' | 'invalid' | 'trial';
  type: string;
  expiresAt?: string;
  features: string[];
  maxUsers: number;
  currentUsers: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}