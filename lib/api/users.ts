// ============================================
// Service des utilisateurs
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { UserProfile, UserPublicProfile, UpdateProfileRequest, PaginatedResponse } from '@/types';

const { USERS } = API_CONFIG.ENDPOINTS;

export const usersService = {
  // Mon profil complet
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(USERS.PROFILE);
    return response.data;
  },
  
  // Modifier mon profil
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(USERS.PROFILE, data);
    return response.data;
  },
  
  // Uploader photo de profil
  async uploadProfilePicture(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<UserProfile>(USERS.PROFILE_PICTURE, formData, true);
    return response.data;
  },
  
  // Alias pour updateProfilePicture
  async updateProfilePicture(file: File): Promise<UserProfile> {
    return this.uploadProfilePicture(file);
  },
  
  // Profil public d'un utilisateur
  async getPublicProfile(userId: number): Promise<UserPublicProfile> {
    const response = await apiClient.get<UserPublicProfile>(USERS.PUBLIC_PROFILE(userId));
    return response.data;
  },
  
  // Rechercher des utilisateurs
  async search(query: string, page = 0, size = 20): Promise<PaginatedResponse<UserPublicProfile>> {
    const response = await apiClient.get<PaginatedResponse<UserPublicProfile>>(USERS.SEARCH, { query, page, size });
    return response.data;
  },
  
  // Lister les créateurs
  async getCreators(page = 0, size = 20): Promise<PaginatedResponse<UserPublicProfile>> {
    const response = await apiClient.get<PaginatedResponse<UserPublicProfile>>(USERS.CREATORS, { page, size });
    return response.data;
  },
};

export default usersService;
