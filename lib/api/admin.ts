// ============================================
// Service d'administration - Connecté à l'API Backend
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  User, 
  Content,
  ContentSummary, 
  PaginatedResponse,
} from '@/types';

const { ADMIN } = API_CONFIG.ENDPOINTS;

// Types pour les réponses admin
export interface DashboardStats {
  totalUsers: number;
  newUsersThisMonth: number;
  activeCreators: number;
  certifiedCoaches: number;
  totalContents: number;
  publishedContents: number;
  pendingContents: number;
  newContentsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalPurchases: number;
  activeSubscriptions: number;
  newSubscriptionsThisMonth: number;
  pendingRoleUpgrades: number;
  pendingContentApprovals: number;
}

export interface AnalyticsStats {
  totalUsers: number;
  totalContents: number;
  totalRevenue: number;
  totalViews: number;
  newUsersThisMonth: number;
  newContentsThisMonth: number;
  revenueThisMonth: number;
  viewsThisMonth: number;
  userGrowth: number;
  contentGrowth: number;
  revenueGrowth: number;
  viewsGrowth: number;
}

export interface TopContent {
  id: number;
  title: string;
  coverImage?: string;
  views: number;
  purchases: number;
  revenue: number;
  rating: number;
}

export interface TopCreator {
  id: number;
  name: string;
  username: string;
  avatarUrl?: string;
  contentsCount: number;
  followersCount: number;
  totalRevenue: number;
}

export interface RecentActivity {
  id: number;
  type: 'PURCHASE' | 'REGISTER' | 'CONTENT_PUBLISHED';
  userName: string;
  userAvatar?: string;
  action: string;
  targetName?: string;
  createdAt: string;
}

export interface UserDistribution {
  role: string;
  count: number;
  percentage: number;
}

export interface RevenueChartData {
  period: string;
  revenue: number;
}

export const adminService = {
  // ========================================
  // DASHBOARD
  // ========================================
  
  // Stats principales du dashboard
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(ADMIN.DASHBOARD);
    return response.data;
  },
  
  // Stats analytics avancées
  async getAnalytics(): Promise<AnalyticsStats> {
    const response = await apiClient.get<AnalyticsStats>(ADMIN.ANALYTICS);
    return response.data;
  },
  
  // Top contenus
  async getTopContents(limit = 5, period = 'month'): Promise<TopContent[]> {
    const response = await apiClient.get<TopContent[]>(ADMIN.TOP_CONTENTS, { limit, period });
    return response.data;
  },
  
  // Top créateurs
  async getTopCreators(limit = 5, period = 'month'): Promise<TopCreator[]> {
    const response = await apiClient.get<TopCreator[]>(ADMIN.TOP_CREATORS, { limit, period });
    return response.data;
  },
  
  // Activité récente
  async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    const response = await apiClient.get<RecentActivity[]>(ADMIN.RECENT_ACTIVITY, { limit });
    return response.data;
  },
  
  // Distribution des utilisateurs par rôle
  async getUserDistribution(): Promise<{ distribution: UserDistribution[] }> {
    const response = await apiClient.get<{ distribution: UserDistribution[] }>(ADMIN.USER_DISTRIBUTION);
    return response.data;
  },
  
  // Données du graphique des revenus
  async getRevenueChart(period = '6months'): Promise<{ data: RevenueChartData[] }> {
    const response = await apiClient.get<{ data: RevenueChartData[] }>(ADMIN.REVENUE_CHART, { period });
    return response.data;
  },

  // ========================================
  // GESTION DES UTILISATEURS
  // ========================================
  
  // Lister les utilisateurs avec filtres
  async getUsers(
    page = 0, 
    size = 20, 
    filters?: { role?: string; status?: string; search?: string }
  ): Promise<PaginatedResponse<User>> {
    const params: Record<string, string | number> = { page, size };
    if (filters?.role) params.role = filters.role;
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;
    
    const response = await apiClient.get<PaginatedResponse<User>>(ADMIN.USERS, params);
    return response.data;
  },
  
  // Changer le rôle d'un utilisateur
  async updateUserRole(userId: number, role: string): Promise<User> {
    const response = await apiClient.patch<User>(`${ADMIN.CHANGE_ROLE(userId)}?role=${role}`);
    return response.data;
  },
  
  // Suspendre un utilisateur
  async suspendUser(userId: number): Promise<void> {
    await apiClient.patch(ADMIN.SUSPEND_USER(userId));
  },
  
  // Réactiver un utilisateur
  async activateUser(userId: number): Promise<void> {
    await apiClient.patch(ADMIN.ACTIVATE_USER(userId));
  },

  // ========================================
  // GESTION DES CONTENUS
  // ========================================
  
  // Lister les contenus avec filtres
  async getContents(
    page = 0, 
    size = 20, 
    filters?: { status?: string; type?: string; search?: string }
  ): Promise<PaginatedResponse<Content>> {
    const params: Record<string, string | number> = { page, size };
    if (filters?.status) params.status = filters.status;
    if (filters?.type) params.type = filters.type;
    if (filters?.search) params.search = filters.search;
    
    const response = await apiClient.get<PaginatedResponse<Content>>(ADMIN.CONTENTS, params);
    return response.data;
  },
  
  // Contenus en attente de validation
  async getPendingContents(page = 0, size = 20): Promise<PaginatedResponse<ContentSummary>> {
    const response = await apiClient.get<PaginatedResponse<ContentSummary>>(ADMIN.PENDING_CONTENTS, { page, size });
    return response.data;
  },
  
  // Approuver un contenu
  async approveContent(contentId: number): Promise<Content> {
    const response = await apiClient.post<Content>(ADMIN.APPROVE_CONTENT(contentId));
    return response.data;
  },
  
  // Rejeter un contenu
  async rejectContent(contentId: number, reason: string): Promise<Content> {
    const response = await apiClient.post<Content>(ADMIN.REJECT_CONTENT(contentId), { reason });
    return response.data;
  },
  
  // Mettre en avant un contenu (toggle)
  async toggleFeatureContent(contentId: number, featured?: boolean): Promise<Content> {
    const url = featured !== undefined 
      ? `${ADMIN.FEATURE_CONTENT(contentId)}?featured=${featured}`
      : ADMIN.FEATURE_CONTENT(contentId);
    const response = await apiClient.patch<Content>(url);
    return response.data;
  },
  
  // Supprimer un contenu
  async deleteContent(contentId: number): Promise<void> {
    await apiClient.delete(ADMIN.DELETE_CONTENT(contentId));
  },
};

export default adminService;
