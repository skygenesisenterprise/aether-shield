/**
 * ShieldClient - Main entry point for the Aether Shield SDK
 * Provides access to all modules and manages authentication
 */

import { HttpTransport } from '../transport/HttpTransport';
import { AuthModule } from './auth/AuthModule';
import { HomeModule } from './home/HomeModule';
import { SystemModule } from './system/SystemModule';
import { InterfaceModule } from './interfaces/InterfaceModule';
import { FirewallModule } from './firewall/FirewallModule';
import { VPNModule } from './vpn/VPNModule';
import { ServiceModule } from './services/ServiceModule';
import { DatabaseModule } from './database/DatabaseModule';
import { RouterModule } from './routers/RouterModule';

export interface ShieldClientConfig {
  baseUrl: string;
  token?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ShieldClient {
  // Public modules
  public auth: AuthModule;
  public home: HomeModule;
  public system: SystemModule;
  public interfaces: InterfaceModule;
  public firewall: FirewallModule;
  public vpn: VPNModule;
  public services: ServiceModule;
  public database: DatabaseModule;
  public routers: RouterModule;
  
  // Private members
  private transport: HttpTransport;
  
  constructor(config: ShieldClientConfig) {
    // Validate config
    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }
    
    // Initialize transport
    this.transport = new HttpTransport({
      baseUrl: config.baseUrl,
      timeout: config.timeout,
      headers: config.headers
    });
    
    // Set initial token if provided
    if (config.token) {
      this.transport.setToken(config.token);
    }
    
    // Initialize all modules
    this.auth = new AuthModule(this, this.transport);
    this.home = new HomeModule(this, this.transport);
    this.system = new SystemModule(this, this.transport);
    this.interfaces = new InterfaceModule(this, this.transport);
    this.firewall = new FirewallModule(this, this.transport);
    this.vpn = new VPNModule(this, this.transport);
    this.services = new ServiceModule(this, this.transport);
    this.database = new DatabaseModule(this, this.transport);
    this.routers = new RouterModule(this, this.transport);
  }
  
  /**
   * Set authentication token
   * @param token JWT token
   */
  setToken(token: string): void {
    this.transport.setToken(token);
  }
  
  /**
   * Get current authentication token
   * @returns Current token or null
   */
  getToken(): string | null {
    return this.transport.getToken();
  }
  
  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.transport.clearToken();
  }
  
  /**
   * Update base URL
   * @param url New base URL
   */
  setBaseUrl(url: string): void {
    // Note: This creates a new transport instance to update the base URL
    const currentToken = this.getToken();
    this.transport = new HttpTransport({
      baseUrl: url,
      timeout: this.transport['config']?.timeout,
      headers: this.transport['config']?.headers
    });
    
    if (currentToken) {
      this.transport.setToken(currentToken);
    }
  }
  
  /**
   * Get current base URL
   * @returns Current base URL
   */
  getBaseUrl(): string {
    return this.transport['config']?.baseUrl || '';
  }
}

/**
 * Factory function to create ShieldClient instance
 * @param config Client configuration
 * @returns ShieldClient instance
 */
export function CreateShieldClient(config: ShieldClientConfig): ShieldClient {
  return new ShieldClient(config);
}