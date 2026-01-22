/**
 * HttpTransport - Centralized HTTP communication layer
 * Handles all API requests with automatic token injection
 */

import { ShieldError } from '../errors/ShieldError';
import { ERROR_CODES } from '../errors/errorCodes';
import { HttpTransportConfig, HttpRequestOptions, HttpResponse, TokenManager } from './types';

export class HttpTransport implements TokenManager {
  private token: string | null = null;
  
  constructor(
    private config: HttpTransportConfig,
    private fetchFn: typeof fetch = fetch
  ) {}
  
  // Token management
  getToken(): string | null {
    return this.token;
  }
  
  setToken(token: string): void {
    this.token = token;
  }
  
  clearToken(): void {
    this.token = null;
  }
  
  // HTTP methods
  async get<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    return this.request<T>('GET', path, null, options);
  }
  
  async post<T>(path: string, body: any, options: HttpRequestOptions = {}): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }
  
  async put<T>(path: string, body: any, options: HttpRequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }
  
  async delete<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', path, null, options);
  }
  
  // Core request method
  private async request<T>(method: string, path: string, body: any | null, options: HttpRequestOptions): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    
    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    // Build headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.config.headers,
      ...options.headers
    });
    
    // Add authorization token if available
    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Build request options
    const requestOptions: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      timeout: options.timeout || this.config.timeout
    };
    
    try {
      const response = await this.fetchFn(url.toString(), requestOptions);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new ShieldError(
          'Invalid response format',
          ERROR_CODES.NETWORK_INVALID_RESPONSE,
          response.status
        );
      }
      
      const responseData = await response.json();
      
      // Handle error responses
      if (!response.ok) {
        throw this.createErrorFromResponse(response, responseData);
      }
      
      return responseData as T;
      
    } catch (error) {
      if (error instanceof ShieldError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new ShieldError(
          'Network connection failed',
          ERROR_CODES.NETWORK_CONNECTION_FAILED,
          0
        );
      }
      
      // Handle timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ShieldError(
          'Request timeout',
          ERROR_CODES.NETWORK_TIMEOUT,
          408
        );
      }
      
      // Handle other errors
      throw new ShieldError(
        error instanceof Error ? error.message : 'Unknown error',
        ERROR_CODES.SERVER_INTERNAL_ERROR,
        500,
        error
      );
    }
  }
  
  // Create error from API response
  private createErrorFromResponse(response: Response, data: any): ShieldError {
    let code = ERROR_CODES.SERVER_INTERNAL_ERROR;
    let message = 'Request failed';
    
    // Extract error details from response
    if (data && typeof data === 'object') {
      if (data.error) {
        message = data.error.message || message;
        code = data.error.code || code;
      } else if (data.message) {
        message = data.message;
      }
    }
    
    // Map status codes to error codes
    switch (response.status) {
      case 401:
        code = ERROR_CODES.AUTH_UNAUTHORIZED;
        message = message || 'Unauthorized';
        break;
      case 403:
        code = ERROR_CODES.AUTH_FORBIDDEN;
        message = message || 'Forbidden';
        break;
      case 404:
        code = ERROR_CODES.RESOURCE_NOT_FOUND;
        message = message || 'Resource not found';
        break;
      case 429:
        code = ERROR_CODES.SERVER_RATE_LIMITED;
        message = message || 'Rate limited';
        break;
      case 503:
        code = ERROR_CODES.SERVER_MAINTENANCE;
        message = message || 'Service unavailable';
        break;
    }
    
    return new ShieldError(message, code, response.status, data);
  }
}