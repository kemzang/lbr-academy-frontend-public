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

export const authService = {
  // Inscription
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.REGISTER, data);
    if (response.success && response.data) {
      apiClient.saveTokens(response.data.token, response.data.refreshToken);
      apiClient.saveUser(response.data.user);
    }
    return response.data;
  },
  
  // Connexion
  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Tentative de connexion avec:', { emailOrUsername: data.emailOrUsername });
    const response = await apiClient.post<AuthResponse>(AUTH.LOGIN, data);
    console.log('✅ Réponse login complète:', {
      success: response.success,
      hasData: !!response.data,
      data: response.data,
      hasToken: !!(response.data?.token),
      hasRefreshToken: !!(response.data?.refreshToken),
      hasUser: !!(response.data?.user)
    });
    if (response.success && response.data) {
      console.log('💾 Tentative de sauvegarde des tokens...');
      apiClient.saveTokens(response.data.token, response.data.refreshToken);
      apiClient.saveUser(response.data.user);
    }
    return response.data;
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
    if (response.success && response.data) {
      apiClient.saveTokens(response.data.token, response.data.refreshToken);
    }
    return response.data;
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
  
  // Vérifier si connecté
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  },
  
  // Récupérer l'utilisateur stocké
  getCurrentUser<T>(): T | null {
    return apiClient.getUser<T>();
  },
};

export default authService;
