/**
 * Aether Shield Node.js SDK
 * Main export file
 */

export { CreateShieldClient, ShieldClient, ShieldClientConfig } from './client/ShieldClient';

// Export error classes
export { ShieldError } from './errors/ShieldError';
export { ERROR_CODES } from './errors/errorCodes';

// Export types
export type {
  // Auth types
  LoginCredentials,
  LoginResponse,
  UserProfile,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  OAuthAuthorizeRequest
} from './client/auth/types';

// Export transport types
export type {
  HttpTransportConfig,
  HttpRequestOptions,
  HttpResponse,
  TokenManager
} from './transport/types';

// Export module classes for advanced usage
export { AuthModule } from './client/auth/AuthModule';
export { HomeModule } from './client/home/HomeModule';
export { SystemModule } from './client/system/SystemModule';
export { InterfaceModule } from './client/interfaces/InterfaceModule';
export { FirewallModule } from './client/firewall/FirewallModule';
export { VPNModule } from './client/vpn/VPNModule';
export { ServiceModule } from './client/services/ServiceModule';
export { DatabaseModule } from './client/database/DatabaseModule';
export { RouterModule } from './client/routers/RouterModule';

// Export HttpTransport for advanced usage
export { HttpTransport } from './transport/HttpTransport';
