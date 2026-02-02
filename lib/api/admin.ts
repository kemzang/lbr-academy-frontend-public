// ============================================
// Service d'administration
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  AdminDashboard, 
  User, 
  Content,
  ContentSummary, 
  PaginatedResponse,
  AdminUserSearchParams 
} from '@/types';
import { UserRole } from '@/config/theme';

const { ADMIN } = API_CONFIG.ENDPOINTS;

export const adminService = {
  // Dashboard stats
  async getStats(): Promise<{
    totalUsers: number;
    totalContents: number;
    totalPurchases: number;
    totalRevenue: number;
    pendingRoleRequests: number;
    pendingContents: number;
    newUsersThisMonth: number;
    newContentsThisMonth: number;
  }> {
    const response = await apiClient.get<AdminDashboard>(ADMIN.DASHBOARD);
    return response.data;
  },
  
  // Lister les utilisateurs
  async getUsers(page = 0, size = 20, role?: string): Promise<PaginatedResponse<User>> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    if (role) params.role = role;
    const response = await apiClient.get<PaginatedResponse<User>>(ADMIN.USERS, params);
    return response.data;
  },
  
  // Changer le rôle d'un utilisateur
  async updateUserRole(id: number, role: string): Promise<User> {
    const response = await apiClient.patch<User>(ADMIN.CHANGE_ROLE(id), { role });
    return response.data;
  },
  
  // Activer/désactiver un utilisateur
  async toggleUserStatus(id: number): Promise<User> {
    const response = await apiClient.patch<User>(`${ADMIN.USERS}/${id}/toggle-status`);
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
  
  // Lister les contenus (admin)
  async getContents(page = 0, size = 20, status?: string, type?: string): Promise<PaginatedResponse<Content>> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    if (status) params.status = status;
    if (type) params.type = type;
    const response = await apiClient.get<PaginatedResponse<Content>>('/api/admin/contents', params);
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
