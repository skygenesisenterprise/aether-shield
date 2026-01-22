/**
 * SystemModule - System management functionality
 */

import { ShieldClient } from '../ShieldClient';
import { HttpTransport } from '../../transport/HttpTransport';
import {
  User, UserInput, UserUpdate,
  Group, GroupInput,
  Privilege,
  Server,
  Tester,
  BackupConfig, BackupInput,
  ActivityLog,
  SystemStatistics,
  FirmwareInfo, PackageInfo,
  GatewayConfig,
  HAStatus, HASettings,
  RouteConfig,
  AdminSettings, CronSettings, GeneralSettings, LoggingSettings, MiscSettings, Tunable,
  CertificateAuthority, Certificate, RevokedCertificate, TrustSettings
} from './types';

export class SystemModule {
  constructor(
    private client: ShieldClient,
    private transport: HttpTransport
  ) {}
  
  // ============ Access Management ============
  
  /**
   * Get all users
   * @returns Array of users
   */
  async getUsers(): Promise<User[]> {
    return this.transport.get<User[]>('/api/v1/system/access/users');
  }
  
  /**
   * Create a new user
   * @param user User input
   * @returns Created user
   */
  async createUser(user: UserInput): Promise<User> {
    return this.transport.post<User>('/api/v1/system/access/users', user);
  }
  
  /**
   * Update a user
   * @param id User ID
   * @param user User update
   * @returns Updated user
   */
  async updateUser(id: string, user: UserUpdate): Promise<User> {
    return this.transport.put<User>(`/api/v1/system/access/users/${id}`, user);
  }
  
  /**
   * Delete a user
   * @param id User ID
   */
  async deleteUser(id: string): Promise<void> {
    await this.transport.delete(`/api/v1/system/access/users/${id}`);
  }
  
  /**
   * Get all groups
   * @returns Array of groups
   */
  async getGroups(): Promise<Group[]> {
    return this.transport.get<Group[]>('/api/v1/system/access/groups');
  }
  
  /**
   * Create a new group
   * @param group Group input
   * @returns Created group
   */
  async createGroup(group: GroupInput): Promise<Group> {
    return this.transport.post<Group>('/api/v1/system/access/groups', group);
  }
  
  /**
   * Update a group
   * @param id Group ID
   * @param group Group input
   * @returns Updated group
   */
  async updateGroup(id: string, group: GroupInput): Promise<Group> {
    return this.transport.put<Group>(`/api/v1/system/access/groups/${id}`, group);
  }
  
  /**
   * Delete a group
   * @param id Group ID
   */
  async deleteGroup(id: string): Promise<void> {
    await this.transport.delete(`/api/v1/system/access/groups/${id}`);
  }
  
  /**
   * Get all privileges
   * @returns Array of privileges
   */
  async getPrivileges(): Promise<Privilege[]> {
    return this.transport.get<Privilege[]>('/api/v1/system/access/privileges');
  }
  
  /**
   * Get all servers
   * @returns Array of servers
   */
  async getServers(): Promise<Server[]> {
    return this.transport.get<Server[]>('/api/v1/system/access/servers');
  }
  
  /**
   * Get all testers
   * @returns Array of testers
   */
  async getTesters(): Promise<Tester[]> {
    return this.transport.get<Tester[]>('/api/v1/system/access/testers');
  }
  
  // ============ Configuration ============
  
  /**
   * Get backup configuration
   * @returns Backup configuration
   */
  async getBackupConfig(): Promise<BackupConfig> {
    return this.transport.get<BackupConfig>('/api/v1/system/config/backup');
  }
  
  /**
   * Create backup configuration
   * @param config Backup input
   * @returns Created backup configuration
   */
  async createBackup(config: BackupInput): Promise<BackupConfig> {
    return this.transport.post<BackupConfig>('/api/v1/system/config/backup', config);
  }
  
  /**
   * Get default configuration
   * @returns Default configuration
   */
  async getDefaultConfig(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/config/default');
  }
  
  /**
   * Get configuration history
   * @returns Configuration history
   */
  async getConfigHistory(): Promise<any[]> {
    return this.transport.get<any[]>('/api/v1/system/config/history');
  }
  
  /**
   * Get configuration wizard
   * @returns Configuration wizard data
   */
  async getConfigWizard(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/config/wizard');
  }
  
  // ============ Diagnostics ============
  
  /**
   * Get activity logs
   * @returns Array of activity logs
   */
  async getActivity(): Promise<ActivityLog[]> {
    return this.transport.get<ActivityLog[]>('/api/v1/system/diagnostics/activity');
  }
  
  /**
   * Get service diagnostics
   * @returns Service diagnostics
   */
  async getServices(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/diagnostics/services');
  }
  
  /**
   * Get system statistics
   * @returns System statistics
   */
  async getStatistics(): Promise<SystemStatistics> {
    return this.transport.get<SystemStatistics>('/api/v1/system/diagnostics/statistics');
  }
  
  // ============ Firmware ============
  
  /**
   * Get changelog
   * @returns Changelog
   */
  async getChangelog(): Promise<string> {
    return this.transport.get<string>('/api/v1/system/firmware/changelog');
  }
  
  /**
   * Get packages
   * @returns Array of packages
   */
  async getPackages(): Promise<PackageInfo[]> {
    return this.transport.get<PackageInfo[]>('/api/v1/system/firmware/packages');
  }
  
  /**
   * Get plugins
   * @returns Array of plugins
   */
  async getPlugins(): Promise<PackageInfo[]> {
    return this.transport.get<PackageInfo[]>('/api/v1/system/firmware/plugins');
  }
  
  /**
   * Get firmware settings
   * @returns Firmware settings
   */
  async getFirmwareSettings(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/firmware/settings');
  }
  
  /**
   * Get firmware status
   * @returns Firmware status
   */
  async getFirmwareStatus(): Promise<FirmwareInfo> {
    return this.transport.get<FirmwareInfo>('/api/v1/system/firmware/status');
  }
  
  /**
   * Check for updates
   * @returns Update information
   */
  async checkUpdates(): Promise<any> {
    return this.transport.post<any>('/api/v1/system/firmware/updates', {});
  }
  
  // ============ Gateways ============
  
  /**
   * Get gateway configurations
   * @returns Array of gateway configurations
   */
  async getGatewayConfigs(): Promise<GatewayConfig[]> {
    return this.transport.get<GatewayConfig[]>('/api/v1/system/gateways/configs');
  }
  
  /**
   * Get gateway groups
   * @returns Array of gateway groups
   */
  async getGatewayGroups(): Promise<any[]> {
    return this.transport.get<any[]>('/api/v1/system/gateways/groups');
  }
  
  /**
   * Get gateway log
   * @returns Gateway log
   */
  async getGatewayLog(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/gateways/log');
  }
  
  // ============ High Availability ============
  
  /**
   * Get HA status
   * @returns HA status
   */
  async getHAStatus(): Promise<HAStatus> {
    return this.transport.get<HAStatus>('/api/v1/system/high-availability/status');
  }
  
  /**
   * Get HA settings
   * @returns HA settings
   */
  async getHASettings(): Promise<HASettings> {
    return this.transport.get<HASettings>('/api/v1/system/high-availability/settings');
  }
  
  /**
   * Update HA settings
   * @param settings HA settings
   * @returns Updated HA settings
   */
  async updateHASettings(settings: HASettings): Promise<HASettings> {
    return this.transport.put<HASettings>('/api/v1/system/high-availability/settings', settings);
  }
  
  // ============ Routes ============
  
  /**
   * Get route configurations
   * @returns Array of route configurations
   */
  async getRouteConfigs(): Promise<RouteConfig[]> {
    return this.transport.get<RouteConfig[]>('/api/v1/system/routes/configs');
  }
  
  /**
   * Get route log
   * @returns Route log
   */
  async getRouteLog(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/routes/log');
  }
  
  /**
   * Get route status
   * @returns Route status
   */
  async getRouteStatus(): Promise<any> {
    return this.transport.get<any>('/api/v1/system/routes/status');
  }
  
  // ============ Settings ============
  
  /**
   * Get admin settings
   * @returns Admin settings
   */
  async getAdminSettings(): Promise<AdminSettings> {
    return this.transport.get<AdminSettings>('/api/v1/system/settings/admin');
  }
  
  /**
   * Update admin settings
   * @param settings Admin settings
   * @returns Updated admin settings
   */
  async updateAdminSettings(settings: AdminSettings): Promise<AdminSettings> {
    return this.transport.put<AdminSettings>('/api/v1/system/settings/admin', settings);
  }
  
  /**
   * Get cron settings
   * @returns Cron settings
   */
  async getCronSettings(): Promise<CronSettings> {
    return this.transport.get<CronSettings>('/api/v1/system/settings/cron');
  }
  
  /**
   * Update cron settings
   * @param settings Cron settings
   * @returns Updated cron settings
   */
  async updateCronSettings(settings: CronSettings): Promise<CronSettings> {
    return this.transport.put<CronSettings>('/api/v1/system/settings/cron', settings);
  }
  
  /**
   * Get general settings
   * @returns General settings
   */
  async getGeneralSettings(): Promise<GeneralSettings> {
    return this.transport.get<GeneralSettings>('/api/v1/system/settings/general');
  }
  
  /**
   * Update general settings
   * @param settings General settings
   * @returns Updated general settings
   */
  async updateGeneralSettings(settings: GeneralSettings): Promise<GeneralSettings> {
    return this.transport.put<GeneralSettings>('/api/v1/system/settings/general', settings);
  }
  
  /**
   * Get logging settings
   * @returns Logging settings
   */
  async getLoggingSettings(): Promise<LoggingSettings> {
    return this.transport.get<LoggingSettings>('/api/v1/system/settings/logging');
  }
  
  /**
   * Update logging settings
   * @param settings Logging settings
   * @returns Updated logging settings
   */
  async updateLoggingSettings(settings: LoggingSettings): Promise<LoggingSettings> {
    return this.transport.put<LoggingSettings>('/api/v1/system/settings/logging', settings);
  }
  
  /**
   * Get miscellaneous settings
   * @returns Miscellaneous settings
   */
  async getMiscSettings(): Promise<MiscSettings> {
    return this.transport.get<MiscSettings>('/api/v1/system/settings/miscellaneous');
  }
  
  /**
   * Update miscellaneous settings
   * @param settings Miscellaneous settings
   * @returns Updated miscellaneous settings
   */
  async updateMiscSettings(settings: MiscSettings): Promise<MiscSettings> {
    return this.transport.put<MiscSettings>('/api/v1/system/settings/miscellaneous', settings);
  }
  
  /**
   * Get tunables
   * @returns Array of tunables
   */
  async getTunables(): Promise<Tunable[]> {
    return this.transport.get<Tunable[]>('/api/v1/system/settings/tunables');
  }
  
  /**
   * Update tunables
   * @param tunables Array of tunables
   * @returns Updated array of tunables
   */
  async updateTunables(tunables: Tunable[]): Promise<Tunable[]> {
    return this.transport.put<Tunable[]>('/api/v1/system/settings/tunables', tunables);
  }
  
  // ============ Trust & Certificates ============
  
  /**
   * Get certificate authorities
   * @returns Array of certificate authorities
   */
  async getAuthorities(): Promise<CertificateAuthority[]> {
    return this.transport.get<CertificateAuthority[]>('/api/v1/system/trust/authorities');
  }
  
  /**
   * Create certificate authority
   * @param authority Certificate authority input
   * @returns Created certificate authority
   */
  async createAuthority(authority: any): Promise<CertificateAuthority> {
    return this.transport.post<CertificateAuthority>('/api/v1/system/trust/authorities', authority);
  }
  
  /**
   * Get certificates
   * @returns Array of certificates
   */
  async getCertificates(): Promise<Certificate[]> {
    return this.transport.get<Certificate[]>('/api/v1/system/trust/certificates');
  }
  
  /**
   * Create certificate
   * @param certificate Certificate input
   * @returns Created certificate
   */
  async createCertificate(certificate: any): Promise<Certificate> {
    return this.transport.post<Certificate>('/api/v1/system/trust/certificates', certificate);
  }
  
  /**
   * Get revocation list
   * @returns Array of revoked certificates
   */
  async getRevocation(): Promise<RevokedCertificate[]> {
    return this.transport.get<RevokedCertificate[]>('/api/v1/system/trust/revocation');
  }
  
  /**
   * Get trust settings
   * @returns Trust settings
   */
  async getTrustSettings(): Promise<TrustSettings> {
    return this.transport.get<TrustSettings>('/api/v1/system/trust/settings');
  }
}