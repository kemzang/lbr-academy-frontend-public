// ============================================
// Service d'authentification
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  PasswordChangeRequest 
} from '@/types';

const { AUTH } = API_CONFIG.ENDPOINTS;

// Extraire les tokens depuis n'importe quelle structure de réponse
function extractAuthData(response: unknown): { accessToken?: string; refreshToken?: string; user?: AuthResponse['user'] } {
  const r = response as Record<string, unknown>;
  const data = (r.data || r) as Record<string, unknown>;
  
  const accessToken = (data.accessToken || data.token || r.accessToken || r.token) as string | undefined;
  const refreshToken = (data.refreshToken || r.refreshToken) as string | undefined;
  const user = (data.user || r.user) as AuthResponse['user'] | undefined;
  
  return { accessToken, refreshToken, user };
}

export const authService = {
  // Inscription
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.REGISTER, data);
    const { accessToken, refreshToken, user } = extractAuthData(response);
    
    if (accessToken && refreshToken) {
      apiClient.saveTokens(accessToken, refreshToken);
      if (user) apiClient.saveUser(user);
    }
    return { accessToken: accessToken || '', refreshToken: refreshToken || '', user } as AuthResponse;
  },
  
  // Connexion
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.LOGIN, data);
    const { accessToken, refreshToken, user } = extractAuthData(response);
    
    if (accessToken && refreshToken) {
      apiClient.saveTokens(accessToken, refreshToken);
      if (user) apiClient.saveUser(user);
    }
    
    return { accessToken: accessToken || '', refreshToken: refreshToken || '', user } as AuthResponse;
  },
  
  // Déconnexion
  logout(): void {
    apiClient.clearTokens();
  },
  
  // Obtenir le profil actuel
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>(AUTH.ME);
    if (response.success && response.data) {
      apiClient.saveUser(response.data);
    }
    return response.data;
  },
  
  // Rafraîchir le token
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.REFRESH);
    const { accessToken, refreshToken, user } = extractAuthData(response);
    if (accessToken && refreshToken) {
      apiClient.saveTokens(accessToken, refreshToken);
    }
    return { accessToken: accessToken || '', refreshToken: refreshToken || '', user } as AuthResponse;
  },
  
  // Mot de passe oublié
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(AUTH.FORGOT_PASSWORD, { email });
  },
  
  // Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(AUTH.RESET_PASSWORD, { token, newPassword });
  },
  
  // Changer le mot de passe (JSON body)
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    await apiClient.post(AUTH.CHANGE_PASSWORD, data);
  },
  
  // Vérifier l'email
  async verifyEmail(token: string): Promise<void> {
    await apiClient.get(AUTH.VERIFY_EMAIL, { token });
  },
  
  // Vérifier si connecté
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    if (!token || token === 'undefined' || token === 'null' || token.split('.').length !== 3) {
      return false;
    }
    return true;
  },
  
  // Récupérer l'utilisateur stocké
  getCurrentUser<T>(): T | null {
    return apiClient.getUser<T>();
  },
};

export default authService;
