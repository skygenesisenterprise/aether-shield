/**
 * Firewall Module Types
 */

// Rule types
export interface FirewallRule {
  id: string;
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  port: string;
  action: 'pass' | 'block' | 'reject';
  description: string;
  enabled: boolean;
  schedule?: string;
  log: boolean;
  quick: boolean;
  direction: 'in' | 'out';
  ipVersion: 'inet' | 'inet6';
}

export interface FirewallRuleInput {
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  port?: string;
  action: 'pass' | 'block' | 'reject';
  description?: string;
  enabled?: boolean;
  schedule?: string;
  log?: boolean;
  quick?: boolean;
  direction?: 'in' | 'out';
  ipVersion?: 'inet' | 'inet6';
}

// Alias types
export interface FirewallAlias {
  id: string;
  name: string;
  type: 'host' | 'network' | 'port' | 'url' | 'urltable';
  value: string;
  description: string;
  enabled: boolean;
}

export interface FirewallAliasInput {
  name: string;
  type: 'host' | 'network' | 'port' | 'url' | 'urltable';
  value: string;
  description?: string;
  enabled?: boolean;
}

// Category types
export interface FirewallCategory {
  id: string;
  name: string;
  description: string;
  aliases: string[];
}

// Group types
export interface FirewallGroup {
  id: string;
  name: string;
  description: string;
  rules: string[];
}

// NAT types
export interface NatRule {
  id: string;
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  target: string;
  description: string;
  enabled: boolean;
}

export interface PortForwardRule {
  id: string;
  interface: string;
  protocol: string;
  externalPort: number;
  internalIp: string;
  internalPort: number;
  description: string;
  enabled: boolean;
}

// Traffic shaping types
export interface ShaperQueue {
  id: string;
  name: string;
  bandwidth: number;
  mask: string;
  description: string;
  enabled: boolean;
}

export interface ShaperRule {
  id: string;
  interface: string;
  queue: string;
  source: string;
  destination: string;
  protocol: string;
  port: string;
  description: string;
  enabled: boolean;
}

export interface ShaperPipe {
  id: string;
  name: string;
  bandwidth: number;
  mask: string;
  description: string;
  enabled: boolean;
}

export interface ShaperStatus {
  queues: Array<{
    name: string;
    packets: number;
    bytes: number;
    dropped: number;
  }>;
  pipes: Array<{
    name: string;
    packets: number;
    bytes: number;
    dropped: number;
  }>;
}

// Settings types
export interface FirewallAdvancedSettings {
  skipRules: string[];
  optimization: string;
  ruleOrder: string;
  timeout: number;
  maxStates: number;
  maxFragments: number;
  maxSrcNodes: number;
  maxSrcStates: number;
  maxSrcConn: number;
  maxSrcConnRate: number;
}

export interface FirewallAdvancedSettingsInput {
  skipRules?: string[];
  optimization?: string;
  ruleOrder?: string;
  timeout?: number;
  maxStates?: number;
  maxFragments?: number;
  maxSrcNodes?: number;
  maxSrcStates?: number;
  maxSrcConn?: number;
  maxSrcConnRate?: number;
}

export interface FirewallNormalizationSettings {
  scrub: boolean;
  randomId: boolean;
  noDf: boolean;
  minTtl: number;
  maxMss: number;
  ttl: number;
}

export interface FirewallNormalizationSettingsInput {
  scrub?: boolean;
  randomId?: boolean;
  noDf?: boolean;
  minTtl?: number;
  maxMss?: number;
  ttl?: number;
}

export interface FirewallSchedule {
  id: string;
  name: string;
  timeRanges: Array<{
    days: string[];
    start: string;
    end: string;
  }>;
  description: string;
}

export interface FirewallScheduleInput {
  name: string;
  timeRanges: Array<{
    days: string[];
    start: string;
    end: string;
  }>;
  description?: string;
}

// Log types
export interface FirewallLog {
  timestamp: string;
  interface: string;
  action: string;
  direction: string;
  protocol: string;
  source: string;
  destination: string;
  port: string;
  ruleId: string;
  reason: string;
}

export interface FirewallLogOverview {
  total: number;
  blocked: number;
  passed: number;
  rejected: number;
  byInterface: Record<string, number>;
  byProtocol: Record<string, number>;
}

// Diagnostic types
export interface FirewallStatistics {
  states: number;
  maxStates: number;
  packetsIn: number;
  packetsOut: number;
  bytesIn: number;
  bytesOut: number;
  uptime: number;
}

export interface FirewallState {
  id: string;
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  port: string;
  expiration: number;
  packets: number;
  bytes: number;
}

export interface FirewallAliasDiagnostics {
  alias: string;
  resolved: string[];
  status: 'active' | 'inactive' | 'error';
  lastUpdate: string;
}

export interface FirewallSession {
  id: string;
  interface: string;
  protocol: string;
  source: string;
  destination: string;
  port: string;
  startTime: string;
  endTime: string;
  packets: number;
  bytes: number;
}