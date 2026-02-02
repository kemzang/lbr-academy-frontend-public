// ============================================
// Service des favoris
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { Favorite, FavoriteCollection, PaginatedResponse } from '@/types';

const { FAVORITES } = API_CONFIG.ENDPOINTS;

export const favoritesService = {
  // Ajouter aux favoris
  async add(contentId: number, collection?: string): Promise<Favorite> {
    const params = collection ? { collection } : undefined;
    const response = await apiClient.post<Favorite>(FAVORITES.BY_CONTENT(contentId), undefined);
    if (params) {
      return (await apiClient.get<Favorite>(FAVORITES.BY_CONTENT(contentId), params)).data;
    }
    return response.data;
  },
  
  // Retirer des favoris
  async remove(contentId: number): Promise<void> {
    await apiClient.delete(FAVORITES.BY_CONTENT(contentId));
  },
  
  // Vérifier si favori
  async check(contentId: number): Promise<boolean> {
    const response = await apiClient.get<{ isFavorite: boolean }>(FAVORITES.CHECK(contentId));
    return response.data.isFavorite;
  },
  
  // Changer de collection
  async changeCollection(contentId: number, collection: string): Promise<Favorite> {
    const response = await apiClient.patch<Favorite>(FAVORITES.COLLECTION(contentId), { collection });
    return response.data;
  },
  
  // Tous mes favoris
  async getAll(page = 0, size = 20): Promise<PaginatedResponse<Favorite>> {
    const response = await apiClient.get<PaginatedResponse<Favorite>>(FAVORITES.BASE, { page, size });
    return response.data;
  },
  
  // Alias pour getAll
  async getMyFavorites(page = 0, size = 20): Promise<PaginatedResponse<Favorite>> {
    return this.getAll(page, size);
  },
  
  // Favoris par collection
  async getByCollection(name: string, page = 0, size = 20): Promise<PaginatedResponse<Favorite>> {
    const response = await apiClient.get<PaginatedResponse<Favorite>>(FAVORITES.BY_COLLECTION(name), { page, size });
    return response.data;
  },
  
  // Mes collections
  async getCollections(): Promise<FavoriteCollection[]> {
    const response = await apiClient.get<FavoriteCollection[]>(FAVORITES.COLLECTIONS);
    return response.data;
  },
};

export default favoritesService;
