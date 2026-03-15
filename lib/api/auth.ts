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
function extractAuthData(response: unknown): { token?: string; refreshToken?: string; user?: AuthResponse['user'] } {
  const r = response as Record<string, unknown>;
  
  // Niveau 1: directement dans la réponse
  // Niveau 2: dans response.data
  const data = (r.data || r) as Record<string, unknown>;
  
  const token = (data.token || data.accessToken || r.token || r.accessToken) as string | undefined;
  const refreshToken = (data.refreshToken || r.refreshToken) as string | undefined;
  const user = (data.user || r.user) as AuthResponse['user'] | undefined;
  
  return { token, refreshToken, user };
}

export const authService = {
  // Inscription
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.REGISTER, data);
    const { token, refreshToken, user } = extractAuthData(response);
    
    if (token && refreshToken) {
      apiClient.saveTokens(token, refreshToken);
      if (user) apiClient.saveUser(user);
    }
    return { token: token || '', refreshToken: refreshToken || '', user } as AuthResponse;
  },
  
  // Connexion
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.LOGIN, data);
    
    console.log('🔍 LOGIN RÉPONSE BRUTE:', JSON.stringify(response).substring(0, 500));
    
    const { token, refreshToken, user } = extractAuthData(response);
    
    console.log('🔍 LOGIN TOKENS EXTRAITS:', {
      token: token ? token.substring(0, 30) + '...' : 'MANQUANT',
      refreshToken: refreshToken ? refreshToken.substring(0, 30) + '...' : 'MANQUANT',
      hasUser: !!user,
    });
    
    if (token && refreshToken) {
      apiClient.saveTokens(token, refreshToken);
      if (user) apiClient.saveUser(user);
    } else {
      console.error('❌ Login: token ou refreshToken manquant');
    }
    
    return { token: token || '', refreshToken: refreshToken || '', user } as AuthResponse;
  },
  
  // Déconnexion - ne fait QUE nettoyer les tokens, pas de redirection
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
    const { token, refreshToken, user } = extractAuthData(response);
    if (token && refreshToken) {
      apiClient.saveTokens(token, refreshToken);
    }
    return { token: token || '', refreshToken: refreshToken || '', user } as AuthResponse;
  },
  
  // Mot de passe oublié
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(AUTH.FORGOT_PASSWORD, { email });
  },
  
  // Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(AUTH.RESET_PASSWORD, { token, newPassword });
  },
  
  // Changer le mot de passe
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    await apiClient.post(AUTH.CHANGE_PASSWORD, data);
  },
  
  // Vérifier l'email
  async verifyEmail(token: string): Promise<void> {
    await apiClient.get(AUTH.VERIFY_EMAIL, { token });
  },
  
  // Vérifier si connecté - avec validation du token
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
