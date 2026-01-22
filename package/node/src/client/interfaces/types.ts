/**
 * Interface Module Types
 */

// Assignment types
export interface InterfaceAssignment {
  interface: string;
  type: string;
  ipv4: string[];
  ipv6: string[];
  gateway: string;
  gatewayv6: string;
  description: string;
}

export interface InterfaceAssignmentInput {
  interface: string;
  type?: string;
  ipv4?: string[];
  ipv6?: string[];
  gateway?: string;
  gatewayv6?: string;
  description?: string;
}

// Device types
export interface NetworkDevice {
  name: string;
  type: string;
  status: 'up' | 'down' | 'unknown';
  macAddress: string;
  speed: number;
  duplex: string;
  mtu: number;
  description: string;
}

export interface GifDevice extends NetworkDevice {
  type: 'gif';
  tunnel: string;
}

export interface GreDevice extends NetworkDevice {
  type: 'gre';
  local: string;
  remote: string;
}

export interface LaggDevice extends NetworkDevice {
  type: 'lagg';
  protocol: string;
  members: string[];
}

export interface VlanDevice extends NetworkDevice {
  type: 'vlan';
  parent: string;
  vlanId: number;
}

export interface VxlanDevice extends NetworkDevice {
  type: 'vxlan';
  vxlanId: number;
  local: string;
  remote: string;
}

export interface LoopbackDevice extends NetworkDevice {
  type: 'loopback';
}

export interface PointToPointDevice extends NetworkDevice {
  type: 'point-to-point';
  destination: string;
}

export interface BridgeDevice extends NetworkDevice {
  type: 'bridge';
  members: string[];
}

// Diagnostic types
export interface PingRequest {
  host: string;
  count?: number;
  interval?: number;
  timeout?: number;
  size?: number;
}

export interface PingResult {
  host: string;
  packetsTransmitted: number;
  packetsReceived: number;
  packetLoss: number;
  minRtt: number;
  avgRtt: number;
  maxRtt: number;
  stdDevRtt: number;
}

export interface TracerouteRequest {
  host: string;
  maxHops?: number;
  timeout?: number;
  protocol?: 'icmp' | 'udp' | 'tcp';
}

export interface TracerouteResult {
  host: string;
  hops: Array<{
    ttl: number;
    address: string;
    rtt1: number;
    rtt2: number;
    rtt3: number;
    resolved?: string;
  }>;
}

export interface NetstatResult {
  protocol: string;
  localAddress: string;
  foreignAddress: string;
  state: string;
  pid?: number;
  program?: string;
}

export interface DNSLookupRequest {
  hostname: string;
  type?: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'SOA';
}

export interface DNSLookupResult {
  hostname: string;
  records: Array<{
    type: string;
    address: string;
    ttl: number;
    class: string;
  }>;
}

export interface PacketCaptureRequest {
  interface: string;
  filter?: string;
  count?: number;
  timeout?: number;
  snapLength?: number;
}

export interface PacketCaptureResult {
  interface: string;
  filter: string;
  packets: Array<{
    timestamp: string;
    length: number;
    protocol: string;
    source: string;
    destination: string;
    info: string;
  }>;
}

export interface ArpTableEntry {
  interface: string;
  ipAddress: string;
  macAddress: string;
  type: string;
  expires: string;
}

export interface PortprobeRequest {
  host: string;
  ports: string;
  protocol?: 'tcp' | 'udp';
  timeout?: number;
}

export interface PortprobeResult {
  host: string;
  ports: Array<{
    port: number;
    protocol: string;
    status: 'open' | 'closed' | 'filtered';
    service?: string;
  }>;
}

// Neighbor types
export interface NeighborEntry {
  interface: string;
  ipAddress: string;
  macAddress: string;
  state: string;
  expires: string;
}

// Overview types
export interface InterfaceOverview {
  name: string;
  type: string;
  status: 'up' | 'down';
  macAddress: string;
  ipv4: string[];
  ipv6: string[];
  gateway: string;
  gatewayv6: string;
  description: string;
  stats: {
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
    rxErrors: number;
    txErrors: number;
  };
}

// Settings types
export interface InterfaceSettings {
  interfaces: Array<{
    name: string;
    enabled: boolean;
    description: string;
    ipv4: Array<{
      address: string;
      subnet: string;
    }>;
    ipv6: Array<{
      address: string;
      subnet: string;
    }>;
    mtu: number;
    speed: string;
    duplex: string;
  }>;
}

// Virtual IP types
export interface VirtualIPStatus {
  interface: string;
  vip: string;
  status: 'active' | 'backup' | 'disabled';
  mode: string;
  advSkew: number;
  advInterval: number;
}

export interface VirtualIPSettings {
  interface: string;
  vip: string;
  password: string;
  advSkew: number;
  advInterval: number;
  preempt: boolean;
}

// WAN types
export interface WanSettings {
  interface: string;
  ipv4: string;
  ipv6: string;
  gateway: string;
  gatewayv6: string;
  dns: string[];
  mtu: number;
  description: string;
}

// Wireless types
export interface WirelessDevice {
  interface: string;
  ssid: string;
  mode: 'hostap' | 'station' | 'monitor';
  channel: number;
  frequency: number;
  bandwidth: number;
  security: string;
  signal: number;
  noise: number;
  clients: number;
  status: 'associated' | 'authenticated' | 'disconnected';
}