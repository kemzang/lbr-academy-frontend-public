// ============================================
// Service des catégories
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { Category, CreateCategoryRequest } from '@/types';

const { CATEGORIES } = API_CONFIG.ENDPOINTS;

export const categoriesService = {
  // Toutes les catégories
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(CATEGORIES.BASE);
    return response.data;
  },
  
  // Arbre des catégories
  async getTree(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(CATEGORIES.TREE);
    return response.data;
  },
  
  // Par ID
  async getById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(CATEGORIES.BY_ID(id));
    return response.data;
  },
  
  // Par slug
  async getBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<Category>(CATEGORIES.BY_SLUG(slug));
    return response.data;
  },
  
  // Créer (Admin)
  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<Category>(CATEGORIES.BASE, data);
    return response.data;
  },
  
  // Modifier (Admin)
  async update(id: number, data: Partial<CreateCategoryRequest>): Promise<Category> {
    const response = await apiClient.put<Category>(CATEGORIES.BY_ID(id), data);
    return response.data;
  },
  
  // Activer/désactiver (Admin)
  async toggle(id: number): Promise<Category> {
    const response = await apiClient.patch<Category>(CATEGORIES.TOGGLE(id));
    return response.data;
  },
  
  // Supprimer (Admin)
  async delete(id: number): Promise<void> {
    await apiClient.delete(CATEGORIES.BY_ID(id));
  },
};

export default categoriesService;
