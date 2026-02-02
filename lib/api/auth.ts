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
      apiClient.saveTokens(response.data.accessToken, response.data.refreshToken);
      apiClient.saveUser(response.data.user);
    }
    return response.data;
  },
  
  // Connexion
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH.LOGIN, data);
    if (response.success && response.data) {
      apiClient.saveTokens(response.data.accessToken, response.data.refreshToken);
      apiClient.saveUser(response.data.user);
    }
    return response.data;
  },
  
  // Déconnexion
  logout(): void {
    apiClient.clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
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
      apiClient.saveTokens(response.data.accessToken, response.data.refreshToken);
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
