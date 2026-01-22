/**
 * HomeModule - Dashboard and system information functionality
 */

import { ShieldClient } from '../ShieldClient';
import { HttpTransport } from '../../transport/HttpTransport';
import {
  SystemInfo,
  CpuInfo,
  MemoryInfo,
  DiskInfo,
  InterfaceStats,
  FirewallInfo,
  ServiceStatus,
  Announcement,
  TrafficData,
  LicenseInfo,
  ChangePasswordRequest
} from './types';

export class HomeModule {
  constructor(
    private client: ShieldClient,
    private transport: HttpTransport
  ) {}
  
  /**
   * Get system information
   * @returns System information
   */
  async getSystemInfo(): Promise<SystemInfo> {
    return this.transport.get<SystemInfo>('/api/v1/home/dashboard/system-info');
  }
  
  /**
   * Get CPU information
   * @returns CPU information
   */
  async getCpuInfo(): Promise<CpuInfo> {
    return this.transport.get<CpuInfo>('/api/v1/home/dashboard/cpu-info');
  }
  
  /**
   * Get memory information
   * @returns Memory information
   */
  async getMemoryInfo(): Promise<MemoryInfo> {
    return this.transport.get<MemoryInfo>('/api/v1/home/dashboard/memory-info');
  }
  
  /**
   * Get disk information
   * @returns Array of disk information
   */
  async getDiskInfo(): Promise<DiskInfo[]> {
    return this.transport.get<DiskInfo[]>('/api/v1/home/dashboard/disk-info');
  }
  
  /**
   * Get interface statistics
   * @returns Array of interface statistics
   */
  async getInterfaceStats(): Promise<InterfaceStats[]> {
    return this.transport.get<InterfaceStats[]>('/api/v1/home/dashboard/interface-stats');
  }
  
  /**
   * Get firewall information
   * @returns Firewall information
   */
  async getFirewallInfo(): Promise<FirewallInfo> {
    return this.transport.get<FirewallInfo>('/api/v1/home/dashboard/firewall-info');
  }
  
  /**
   * Get services status
   * @returns Array of service statuses
   */
  async getServices(): Promise<ServiceStatus[]> {
    return this.transport.get<ServiceStatus[]>('/api/v1/home/dashboard/services');
  }
  
  /**
   * Get announcements
   * @returns Array of announcements
   */
  async getAnnouncements(): Promise<Announcement[]> {
    return this.transport.get<Announcement[]>('/api/v1/home/dashboard/announcements');
  }
  
  /**
   * Get traffic data
   * @returns Traffic data
   */
  async getTrafficData(): Promise<TrafficData> {
    return this.transport.get<TrafficData>('/api/v1/home/dashboard/traffic-data');
  }
  
  /**
   * Get license information
   * @returns License information
   */
  async getLicenseInfo(): Promise<LicenseInfo> {
    return this.transport.get<LicenseInfo>('/api/v1/home/license/info');
  }
  
  /**
   * Change user password
   * @param request Change password request
   */
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await this.transport.put('/api/v1/home/password/change', request);
  }
}