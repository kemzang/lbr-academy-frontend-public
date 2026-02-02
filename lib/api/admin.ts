// ============================================
// Service d'administration
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  AdminDashboard, 
  User, 
  ContentSummary, 
  PaginatedResponse,
  AdminUserSearchParams 
} from '@/types';
import { UserRole } from '@/config/theme';

const { ADMIN } = API_CONFIG.ENDPOINTS;

export const adminService = {
  // Dashboard
  async getDashboard(): Promise<AdminDashboard> {
    const response = await apiClient.get<AdminDashboard>(ADMIN.DASHBOARD);
    return response.data;
  },
  
  // Lister les utilisateurs
  async getUsers(params?: AdminUserSearchParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      ADMIN.USERS,
      params as Record<string, string | number | boolean | undefined>
    );
    return response.data;
  },
  
  // Suspendre un utilisateur
  async suspendUser(id: number): Promise<User> {
    const response = await apiClient.patch<User>(ADMIN.SUSPEND_USER(id));
    return response.data;
  },
  
  // Activer un utilisateur
  async activateUser(id: number): Promise<User> {
    const response = await apiClient.patch<User>(ADMIN.ACTIVATE_USER(id));
    return response.data;
  },
  
  // Changer le rôle d'un utilisateur
  async changeUserRole(id: number, role: UserRole): Promise<User> {
    const response = await apiClient.patch<User>(ADMIN.CHANGE_ROLE(id), { role });
    return response.data;
  },
  
  // Contenus en attente
  async getPendingContents(page = 0, size = 20): Promise<PaginatedResponse<ContentSummary>> {
    const response = await apiClient.get<PaginatedResponse<ContentSummary>>(ADMIN.PENDING_CONTENTS, { page, size });
    return response.data;
  },
  
  // Approuver un contenu
  async approveContent(id: number): Promise<ContentSummary> {
    const response = await apiClient.post<ContentSummary>(ADMIN.APPROVE_CONTENT(id));
    return response.data;
  },
  
  // Rejeter un contenu
  async rejectContent(id: number, reason?: string): Promise<ContentSummary> {
    const response = await apiClient.post<ContentSummary>(ADMIN.REJECT_CONTENT(id), { reason });
    return response.data;
  },
  
  // Mettre en avant un contenu
  async featureContent(id: number): Promise<ContentSummary> {
    const response = await apiClient.patch<ContentSummary>(ADMIN.FEATURE_CONTENT(id));
    return response.data;
  },
};

export default adminService;
