/**
 * InterfaceModule - Network interface management functionality
 */

import { ShieldClient } from '../ShieldClient';
import { HttpTransport } from '../../transport/HttpTransport';
import {
  InterfaceAssignment, InterfaceAssignmentInput,
  NetworkDevice, GifDevice, GreDevice, LaggDevice, VlanDevice, VxlanDevice, LoopbackDevice, PointToPointDevice, BridgeDevice,
  PingRequest, PingResult, TracerouteRequest, TracerouteResult, NetstatResult, DNSLookupRequest, DNSLookupResult,
  PacketCaptureRequest, PacketCaptureResult, ArpTableEntry, PortprobeRequest, PortprobeResult,
  NeighborEntry, InterfaceOverview, InterfaceSettings, VirtualIPStatus, VirtualIPSettings, WanSettings, WirelessDevice
} from './types';

export class InterfaceModule {
  constructor(
    private client: ShieldClient,
    private transport: HttpTransport
  ) {}
  
  // ============ Assignments ============
  
  /**
   * Get interface assignments
   * @returns Array of interface assignments
   */
  async getAssignments(): Promise<InterfaceAssignment[]> {
    return this.transport.get<InterfaceAssignment[]>('/api/v1/interfaces/assignments');
  }
  
  /**
   * Update interface assignments
   * @param assignments Array of interface assignments
   * @returns Updated interface assignments
   */
  async updateAssignments(assignments: InterfaceAssignmentInput[]): Promise<InterfaceAssignment[]> {
    return this.transport.put<InterfaceAssignment[]>('/api/v1/interfaces/assignments', assignments);
  }
  
  // ============ Devices ============
  
  /**
   * Get all devices
   * @returns Array of network devices
   */
  async getDevices(): Promise<NetworkDevice[]> {
    return this.transport.get<NetworkDevice[]>('/api/v1/interfaces/devices');
  }
  
  /**
   * Get GIF devices
   * @returns Array of GIF devices
   */
  async getGifDevices(): Promise<GifDevice[]> {
    return this.transport.get<GifDevice[]>('/api/v1/interfaces/devices/gif');
  }
  
  /**
   * Get GRE devices
   * @returns Array of GRE devices
   */
  async getGreDevices(): Promise<GreDevice[]> {
    return this.transport.get<GreDevice[]>('/api/v1/interfaces/devices/gre');
  }
  
  /**
   * Get LAGG devices
   * @returns Array of LAGG devices
   */
  async getLaggDevices(): Promise<LaggDevice[]> {
    return this.transport.get<LaggDevice[]>('/api/v1/interfaces/devices/lagg');
  }
  
  /**
   * Get VLAN devices
   * @returns Array of VLAN devices
   */
  async getVlanDevices(): Promise<VlanDevice[]> {
    return this.transport.get<VlanDevice[]>('/api/v1/interfaces/devices/vlan');
  }
  
  /**
   * Get VXLAN devices
   * @returns Array of VXLAN devices
   */
  async getVxlanDevices(): Promise<VxlanDevice[]> {
    return this.transport.get<VxlanDevice[]>('/api/v1/interfaces/devices/vxlan');
  }
  
  /**
   * Get loopback devices
   * @returns Array of loopback devices
   */
  async getLoopbackDevices(): Promise<LoopbackDevice[]> {
    return this.transport.get<LoopbackDevice[]>('/api/v1/interfaces/devices/loopback');
  }
  
  /**
   * Get point-to-point devices
   * @returns Array of point-to-point devices
   */
  async getPointToPointDevices(): Promise<PointToPointDevice[]> {
    return this.transport.get<PointToPointDevice[]>('/api/v1/interfaces/devices/point-to-point');
  }
  
  /**
   * Get bridge devices
   * @returns Array of bridge devices
   */
  async getBridgeDevices(): Promise<BridgeDevice[]> {
    return this.transport.get<BridgeDevice[]>('/api/v1/interfaces/devices/bridges');
  }
  
  // ============ Diagnostics ============
  
  /**
   * Get ping configuration
   * @returns Ping configuration
   */
  async getPing(): Promise<any> {
    return this.transport.get<any>('/api/v1/interfaces/diagnostics/ping');
  }
  
  /**
   * Execute ping
   * @param request Ping request
   * @returns Ping result
   */
  async executePing(request: PingRequest): Promise<PingResult> {
    return this.transport.post<PingResult>('/api/v1/interfaces/diagnostics/ping', request);
  }
  
  /**
   * Get traceroute configuration
   * @returns Traceroute configuration
   */
  async getTraceroute(): Promise<any> {
    return this.transport.get<any>('/api/v1/interfaces/diagnostics/traceroute');
  }
  
  /**
   * Execute traceroute
   * @param request Traceroute request
   * @returns Traceroute result
   */
  async executeTraceroute(request: TracerouteRequest): Promise<TracerouteResult> {
    return this.transport.post<TracerouteResult>('/api/v1/interfaces/diagnostics/traceroute', request);
  }
  
  /**
   * Get netstat
   * @returns Netstat result
   */
  async getNetstat(): Promise<NetstatResult[]> {
    return this.transport.get<NetstatResult[]>('/api/v1/interfaces/diagnostics/netstat');
  }
  
  /**
   * Get DNS lookup configuration
   * @returns DNS lookup configuration
   */
  async getDNSLookup(): Promise<any> {
    return this.transport.get<any>('/api/v1/interfaces/diagnostics/dns-lookup');
  }
  
  /**
   * Execute DNS lookup
   * @param request DNS lookup request
   * @returns DNS lookup result
   */
  async executeDNSLookup(request: DNSLookupRequest): Promise<DNSLookupResult> {
    return this.transport.post<DNSLookupResult>('/api/v1/interfaces/diagnostics/dns-lookup', request);
  }
  
  /**
   * Get packet capture configuration
   * @returns Packet capture configuration
   */
  async getPacketCapture(): Promise<any> {
    return this.transport.get<any>('/api/v1/interfaces/diagnostics/packet-capture');
  }
  
  /**
   * Execute packet capture
   * @param request Packet capture request
   * @returns Packet capture result
   */
  async executePacketCapture(request: PacketCaptureRequest): Promise<PacketCaptureResult> {
    return this.transport.post<PacketCaptureResult>('/api/v1/interfaces/diagnostics/packet-capture', request);
  }
  
  /**
   * Get ARP tables
   * @returns Array of ARP table entries
   */
  async getArpTables(): Promise<ArpTableEntry[]> {
    return this.transport.get<ArpTableEntry[]>('/api/v1/interfaces/diagnostics/arp-tables');
  }
  
  /**
   * Get portprobe configuration
   * @returns Portprobe configuration
   */
  async getPortprobe(): Promise<any> {
    return this.transport.get<any>('/api/v1/interfaces/diagnostics/portprobe');
  }
  
  /**
   * Execute portprobe
   * @param request Portprobe request
   * @returns Portprobe result
   */
  async executePortprobe(request: PortprobeRequest): Promise<PortprobeResult> {
    return this.transport.post<PortprobeResult>('/api/v1/interfaces/diagnostics/portprobe', request);
  }
  
  // ============ Neighbors ============
  
  /**
   * Get neighbors
   * @returns Array of neighbor entries
   */
  async getNeighbors(): Promise<NeighborEntry[]> {
    return this.transport.get<NeighborEntry[]>('/api/v1/interfaces/neighbors');
  }
  
  // ============ Overview ============
  
  /**
   * Get interface overview
   * @returns Array of interface overviews
   */
  async getOverview(): Promise<InterfaceOverview[]> {
    return this.transport.get<InterfaceOverview[]>('/api/v1/interfaces/overview');
  }
  
  // ============ Settings ============
  
  /**
   * Get interface settings
   * @returns Interface settings
   */
  async getSettings(): Promise<InterfaceSettings> {
    return this.transport.get<InterfaceSettings>('/api/v1/interfaces/settings');
  }
  
  /**
   * Update interface settings
   * @param settings Interface settings
   * @returns Updated interface settings
   */
  async updateSettings(settings: InterfaceSettings): Promise<InterfaceSettings> {
    return this.transport.put<InterfaceSettings>('/api/v1/interfaces/settings', settings);
  }
  
  // ============ Virtual IPs ============
  
  /**
   * Get virtual IP status
   * @returns Array of virtual IP statuses
   */
  async getVirtualIPStatus(): Promise<VirtualIPStatus[]> {
    return this.transport.get<VirtualIPStatus[]>('/api/v1/interfaces/virtual-ips/status');
  }
  
  /**
   * Get virtual IP settings
   * @returns Array of virtual IP settings
   */
  async getVirtualIPSettings(): Promise<VirtualIPSettings[]> {
    return this.transport.get<VirtualIPSettings[]>('/api/v1/interfaces/virtual-ips/settings');
  }
  
  /**
   * Update virtual IP settings
   * @param settings Array of virtual IP settings
   * @returns Updated array of virtual IP settings
   */
  async updateVirtualIPSettings(settings: VirtualIPSettings[]): Promise<VirtualIPSettings[]> {
    return this.transport.put<VirtualIPSettings[]>('/api/v1/interfaces/virtual-ips/settings', settings);
  }
  
  // ============ WAN ============
  
  /**
   * Get WAN settings
   * @returns WAN settings
   */
  async getWan(): Promise<WanSettings> {
    return this.transport.get<WanSettings>('/api/v1/interfaces/wan');
  }
  
  /**
   * Update WAN settings
   * @param settings WAN settings
   * @returns Updated WAN settings
   */
  async updateWan(settings: WanSettings): Promise<WanSettings> {
    return this.transport.put<WanSettings>('/api/v1/interfaces/wan', settings);
  }
  
  // ============ Wireless ============
  
  /**
   * Get wireless devices
   * @returns Array of wireless devices
   */
  async getWirelessDevices(): Promise<WirelessDevice[]> {
    return this.transport.get<WirelessDevice[]>('/api/v1/interfaces/wireless/devices');
  }
}