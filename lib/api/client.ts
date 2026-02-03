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
  
  // Récupérer le token d'accès
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }
  
  // Exposer publiquement pour les téléchargements
  public getAccessTokenPublic(): string | null {
    return this.getAccessToken();
  }
  
  // Récupérer le refresh token
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }
  
  // Sauvegarder les tokens
  public saveTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
  
  // Supprimer les tokens
  public clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
  }
  
  // Sauvegarder l'utilisateur
  public saveUser(user: unknown): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }
  
  // Récupérer l'utilisateur
  public getUser<T>(): T | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }
  
  // Construire l'URL avec les paramètres
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }
  
  // Rafraîchir le token
  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          this.saveTokens(data.data.accessToken, data.data.refreshToken);
          return true;
        }
      }
      
      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }
  
  // Requête principale
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, params, isFormData = false } = config;
    
    const url = this.buildUrl(endpoint, params);
    const accessToken = this.getAccessToken();
    
    const requestHeaders: Record<string, string> = {
      ...headers,
    };
    
    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
    
    if (!isFormData) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };
    
    if (body) {
      requestConfig.body = isFormData ? (body as FormData) : JSON.stringify(body);
    }
    
    let response = await fetch(url, requestConfig);
    
    // Si 401, essayer de rafraîchir le token
    if (response.status === 401 && accessToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        requestHeaders['Authorization'] = `Bearer ${this.getAccessToken()}`;
        response = await fetch(url, {
          ...requestConfig,
          headers: requestHeaders,
        });
      }
    }
    
    // Vérifier le Content-Type avant de parser
    const contentType = response.headers.get('content-type');
    let data: unknown;
    let responseText = '';
    
    try {
      responseText = await response.text();
      
      // Si ce n'est pas du JSON, lancer une erreur
      if (!contentType?.includes('application/json')) {
        console.error('Réponse non-JSON:', {
          url,
          status: response.status,
          contentType,
          preview: responseText.substring(0, 500)
        });
        throw new Error(`Réponse non-JSON reçue. Content-Type: ${contentType}`);
      }
      
      // Essayer de parser le JSON
      if (!responseText.trim()) {
        throw new Error('Réponse vide du serveur');
      }
      
      // Chercher le premier JSON valide dans la réponse (au cas où il y aurait du contenu avant/après)
      let jsonText = responseText.trim();
      const firstBrace = jsonText.indexOf('{');
      const firstBracket = jsonText.indexOf('[');
      
      if (firstBrace !== -1 || firstBracket !== -1) {
        const startIndex = firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket) 
          ? firstBrace 
          : firstBracket;
        jsonText = jsonText.substring(startIndex);
        
        // Trouver la fin du JSON (dernière accolade ou crochet correspondant)
        let braceCount = 0;
        let bracketCount = 0;
        let endIndex = -1;
        
        for (let i = 0; i < jsonText.length; i++) {
          if (jsonText[i] === '{') braceCount++;
          if (jsonText[i] === '}') braceCount--;
          if (jsonText[i] === '[') bracketCount++;
          if (jsonText[i] === ']') bracketCount--;
          
          if (braceCount === 0 && bracketCount === 0 && (jsonText[i] === '}' || jsonText[i] === ']')) {
            endIndex = i + 1;
            break;
          }
        }
        
        if (endIndex !== -1) {
          jsonText = jsonText.substring(0, endIndex);
        }
      }
      
      data = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('Erreur parsing JSON:', {
        error: parseError.message,
        url,
        status: response.status,
        contentType,
        responseLength: responseText.length,
        preview: responseText.substring(0, 1000)
      });
      
      // Si c'est une erreur de parsing JSON, essayer de récupérer plus d'infos
      const errorMessage = parseError.message || 'Erreur lors du parsing de la réponse du serveur';
      
      throw {
        success: false,
        message: errorMessage.includes('JSON') 
          ? 'Le serveur a retourné une réponse invalide. Vérifiez que le backend fonctionne correctement.'
          : errorMessage,
        error: {
          code: 'JSON_PARSE_ERROR',
          details: `Impossible de parser la réponse JSON: ${errorMessage}`,
        },
        timestamp: new Date().toISOString(),
      } as ApiError;
    }
    
    if (!response.ok) {
      throw data as ApiError;
    }
    
    return data as ApiResponse<T>;
  }
  
  // Méthodes utilitaires
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }
  
  async post<T>(endpoint: string, body?: unknown, isFormData = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, isFormData });
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

// Instance singleton
export const apiClient = new ApiClient();
export default apiClient;
