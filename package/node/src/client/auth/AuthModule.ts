/**
 * AuthModule - Authentication functionality
 */

import { ShieldClient } from '../ShieldClient';
import { HttpTransport } from '../../transport/HttpTransport';
import { ShieldError } from '../../errors/ShieldError';
import { ERROR_CODES } from '../../errors/errorCodes';
import {
  LoginCredentials,
  LoginResponse,
  UserProfile,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  OAuthAuthorizeRequest
} from './types';

export class AuthModule {
  constructor(
    private client: ShieldClient,
    private transport: HttpTransport
  ) {}
  
  /**
   * Login with username and password
   * @param credentials Login credentials
   * @returns Login response with tokens
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.transport.post<LoginResponse>('/api/v1/auth/login', credentials);
      
      // Automatically set the token
      this.transport.setToken(response.token);
      
      return response;
    } catch (error) {
      if (error instanceof ShieldError && error.code === ERROR_CODES.AUTH_INVALID_CREDENTIALS) {
        throw new ShieldError(
          'Invalid username or password',
          ERROR_CODES.AUTH_INVALID_CREDENTIALS,
          401
        );
      }
      throw error;
    }
  }
  
  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await this.transport.post('/api/v1/auth/logout', {});
    this.transport.clearToken();
  }
  
  /**
   * Refresh authentication token
   * @param refreshToken Refresh token
   * @returns New login response
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.transport.post<LoginResponse>('/api/v1/auth/refresh', {
      refreshToken
    });
    
    // Update the token
    this.transport.setToken(response.token);
    
    return response;
  }
  
  /**
   * Get current user profile
   * @returns User profile
   */
  async getMe(): Promise<UserProfile> {
    return this.transport.get<UserProfile>('/api/v1/auth/me');
  }
  
  /**
   * Request password reset
   * @param request Forgot password request
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await this.transport.post('/api/v1/auth/forgot-password', request);
  }
  
  /**
   * Reset password using token
   * @param request Reset password request
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await this.transport.post('/api/v1/auth/reset-password', request);
  }
  
  /**
   * Change current user password
   * @param request Change password request
   */
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await this.transport.put('/api/v1/home/password/change', request);
  }
  
  /**
   * OAuth authorize endpoint
   * @param request OAuth authorize request
   * @returns Redirect URL or authorization code
   */
  async oauthAuthorize(request: OAuthAuthorizeRequest): Promise<any> {
    return this.transport.get('/api/v1/auth/oauth/authorize', {
      params: request
    });
  }
}