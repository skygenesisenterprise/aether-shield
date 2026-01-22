/**
 * HTTP Transport types and interfaces
 */

export interface HttpTransportConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpRequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface TokenManager {
  getToken(): string | null;
  setToken(token: string): void;
  clearToken(): void;
}