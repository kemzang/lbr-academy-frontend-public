// ============================================
// Service des abonnements (follows)
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { Follow, FollowStatus, PaginatedResponse, UserPublicProfile } from '@/types';

const { FOLLOWS } = API_CONFIG.ENDPOINTS;

export const followsService = {
  // Suivre un utilisateur
  async follow(userId: number): Promise<Follow> {
    const response = await apiClient.post<Follow>(FOLLOWS.BASE(userId));
    return response.data;
  },
  
  // Ne plus suivre
  async unfollow(userId: number): Promise<void> {
    await apiClient.delete(FOLLOWS.BASE(userId));
  },
  
  // Vérifier si suivi
  async check(userId: number): Promise<FollowStatus> {
    const response = await apiClient.get<FollowStatus>(FOLLOWS.CHECK(userId));
    return response.data;
  },
  
  // Activer/désactiver notifications
  async toggleNotifications(userId: number): Promise<Follow> {
    const response = await apiClient.patch<Follow>(FOLLOWS.NOTIFICATIONS(userId));
    return response.data;
  },
  
  // Mes abonnés
  async getMyFollowers(page = 0, size = 20): Promise<PaginatedResponse<UserPublicProfile>> {
    const response = await apiClient.get<PaginatedResponse<UserPublicProfile>>(FOLLOWS.MY_FOLLOWERS, { page, size });
    return response.data;
  },
  
  // Mes abonnements
  async getMyFollowing(page = 0, size = 20): Promise<PaginatedResponse<UserPublicProfile>> {
    const response = await apiClient.get<PaginatedResponse<UserPublicProfile>>(FOLLOWS.MY_FOLLOWING, { page, size });
    return response.data;
  },
  
  // Abonnés d'un utilisateur
  async getUserFollowers(userId: number, page = 0, size = 20): Promise<PaginatedResponse<UserPublicProfile>> {
    const response = await apiClient.get<PaginatedResponse<UserPublicProfile>>(FOLLOWS.USER_FOLLOWERS(userId), { page, size });
    return response.data;
  },
  
  // Abonnements d'un utilisateur
  async getUserFollowing(userId: number, page = 0, size = 20): Promise<PaginatedResponse<UserPublicProfile>> {
    const response = await apiClient.get<PaginatedResponse<UserPublicProfile>>(FOLLOWS.USER_FOLLOWING(userId), { page, size });
    return response.data;
  },
};

export default followsService;
