// ============================================
// Client API - La Bibliothèque des Rois
// ============================================

import { API_CONFIG } from '@/config/api';
import { ApiResponse, ApiError } from '@/types';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  isFormData?: boolean;
}

class ApiClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }
  
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    if (!token || token === 'undefined' || token === 'null' || token.split('.').length !== 3) {
      if (token) {
        localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      }
      return null;
    }
    return token;
  }
  
  public getAccessTokenPublic(): string | null {
    return this.getAccessToken();
  }
  
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  public saveTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    if (!accessToken || accessToken === 'undefined' || accessToken === 'null') return;
    if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') return;
    if (accessToken.split('.').length !== 3) return;
    
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  
  public clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
  }
  
  public saveUser(user: unknown): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }
  
  public getUser<T>(): T | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }
  
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    // Si baseUrl est relatif (ex: /api), construire avec window.location.origin
    let fullUrl: string;
    if (this.baseUrl.startsWith('http')) {
      fullUrl = `${this.baseUrl}${endpoint}`;
    } else if (typeof window !== 'undefined') {
      fullUrl = `${window.location.origin}${this.baseUrl}${endpoint}`;
    } else {
      fullUrl = `http://localhost:3001${this.baseUrl}${endpoint}`;
    }
    
    const url = new URL(fullUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }
  
  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    
    try {
      const refreshUrl = this.buildUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const responseData = data.data || data;
        const newToken = responseData.accessToken || responseData.token;
        const newRefreshToken = responseData.refreshToken;
        
        if (newToken && newRefreshToken) {
          this.saveTokens(newToken, newRefreshToken);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, params, isFormData = false } = config;
    
    const url = this.buildUrl(endpoint, params);
    const accessToken = this.getAccessToken();
    
    const requestHeaders: Record<string, string> = { ...headers };
    if (accessToken) requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    if (!isFormData) requestHeaders['Content-Type'] = 'application/json';
    
    const requestConfig: RequestInit = { method, headers: requestHeaders };
    if (body) {
      requestConfig.body = isFormData ? (body as FormData) : JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url, requestConfig);
    } catch (networkErr) {
      const msg = networkErr instanceof Error ? networkErr.message : 'Erreur réseau';
      const isFailedFetch = msg === 'Failed to fetch' || msg.includes('NetworkError');
      throw {
        success: false,
        message: isFailedFetch
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion et que le backend est démarré.'
          : msg,
        error: { code: 'NETWORK_ERROR', details: msg },
        timestamp: new Date().toISOString(),
      } as ApiError;
    }

    const isAuthEndpoint = endpoint.startsWith('/auth/');

    // Si 401, essayer de rafraîchir le token
    if (response.status === 401 && accessToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newAccessToken = this.getAccessToken();
        const newRequestHeaders: Record<string, string> = {
          ...headers,
          'Authorization': `Bearer ${newAccessToken}`,
        };
        if (!isFormData) newRequestHeaders['Content-Type'] = 'application/json';
        
        const newRequestConfig: RequestInit = { method, headers: newRequestHeaders };
        if (body) {
          newRequestConfig.body = isFormData ? (body as FormData) : JSON.stringify(body);
        }
        
        try {
          response = await fetch(url, newRequestConfig);
        } catch (retryErr) {
          const retryMsg = retryErr instanceof Error ? retryErr.message : 'Erreur réseau';
          throw {
            success: false,
            message: retryMsg === 'Failed to fetch'
              ? 'Impossible de joindre le serveur. Vérifiez votre connexion et que le backend est démarré.'
              : retryMsg,
            error: { code: 'NETWORK_ERROR', details: retryMsg },
            timestamp: new Date().toISOString(),
          } as ApiError;
        }
      } else {
        if (isAuthEndpoint) {
          this.clearTokens();
          throw {
            success: false,
            message: 'Token expiré ou invalide. Veuillez vous reconnecter.',
            error: { code: 'AUTH_TOKEN_EXPIRED', details: 'Session expirée' },
            timestamp: new Date().toISOString(),
          } as ApiError;
        }
        throw {
          success: false,
          message: 'Accès non autorisé à cette ressource.',
          error: { code: 'UNAUTHORIZED', details: 'Accès refusé' },
          timestamp: new Date().toISOString(),
        } as ApiError;
      }
    }
    
    if (response.status === 401) {
      if (isAuthEndpoint) this.clearTokens();
      throw {
        success: false,
        message: 'Non autorisé',
        error: { code: 'UNAUTHORIZED', details: 'Accès refusé pour cette ressource' },
        timestamp: new Date().toISOString(),
      } as ApiError;
    }

    
    // Parse response body
    let data: unknown;
    let responseText = '';

    try {
      responseText = await response.text();
    } catch {
      throw new Error('Impossible de lire la réponse du serveur');
    }

    const trimmed = responseText.replace(/^\uFEFF/, '').trim();

    try {
      if (trimmed === '') {
        data = {};
      } else {
        let jsonText = trimmed;
        const firstBrace = jsonText.indexOf('{');
        const firstBracket = jsonText.indexOf('[');

        if (firstBrace !== -1 || firstBracket !== -1) {
          const startIndex =
            firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)
              ? firstBrace
              : firstBracket;
          jsonText = jsonText.substring(startIndex);

          let braceCount = 0;
          let bracketCount = 0;
          let endIndex = -1;

          for (let i = 0; i < jsonText.length; i++) {
            if (jsonText[i] === '{') braceCount++;
            if (jsonText[i] === '}') braceCount--;
            if (jsonText[i] === '[') bracketCount++;
            if (jsonText[i] === ']') bracketCount--;

            if (
              braceCount === 0 &&
              bracketCount === 0 &&
              (jsonText[i] === '}' || jsonText[i] === ']')
            ) {
              endIndex = i + 1;
              break;
            }
          }

          if (endIndex !== -1) {
            jsonText = jsonText.substring(0, endIndex);
          }
        }

        data = JSON.parse(jsonText);
      }
    } catch (parseError: unknown) {
      if (response.ok) {
        data = trimmed === '[]' ? [] : {};
      } else {
        const errMsg = parseError instanceof Error ? parseError.message : 'Erreur lors du parsing de la réponse du serveur';
        throw {
          success: false,
          message: errMsg.includes('JSON')
            ? 'Le serveur a retourné une réponse invalide. Vérifiez que le backend fonctionne correctement.'
            : errMsg,
          error: { code: 'JSON_PARSE_ERROR', details: `Impossible de parser la réponse JSON: ${errMsg}` },
          timestamp: new Date().toISOString(),
        } as ApiError;
      }
    }
    
    if (!response.ok) {
      throw data as ApiError;
    }
    
    return data as ApiResponse<T>;
  }
  
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }
  
  async post<T>(endpoint: string, body?: unknown, isFormData = false, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, isFormData, params });
  }
  
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }
  
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;