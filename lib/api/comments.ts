// ============================================
// Service des commentaires
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { Comment, CreateCommentRequest, PaginatedResponse } from '@/types';

const { COMMENTS } = API_CONFIG.ENDPOINTS;

export const commentsService = {
  // Commentaires d'un contenu
  async getByContent(contentId: number, page = 0, size = 20): Promise<PaginatedResponse<Comment>> {
    const response = await apiClient.get<PaginatedResponse<Comment>>(COMMENTS.BY_CONTENT(contentId), { page, size });
    return response.data;
  },
  
  // Ajouter un commentaire
  async create(contentId: number, data: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post<Comment>(COMMENTS.BY_CONTENT(contentId), data);
    return response.data;
  },
  
  // Modifier un commentaire
  async update(id: number, text: string): Promise<Comment> {
    const response = await apiClient.put<Comment>(COMMENTS.BY_ID(id), { text });
    return response.data;
  },
  
  // Supprimer un commentaire
  async delete(id: number): Promise<void> {
    await apiClient.delete(COMMENTS.BY_ID(id));
  },
  
  // Liker un commentaire
  async like(id: number): Promise<void> {
    await apiClient.post(COMMENTS.LIKE(id));
  },
  
  // Unliker un commentaire
  async unlike(id: number): Promise<void> {
    await apiClient.delete(COMMENTS.LIKE(id));
  },
  
  // Masquer (Admin)
  async hide(id: number): Promise<Comment> {
    const response = await apiClient.patch<Comment>(COMMENTS.HIDE(id));
    return response.data;
  },
  
  // Commentaires masqués (Admin)
  async getHidden(page = 0, size = 20): Promise<PaginatedResponse<Comment>> {
    const response = await apiClient.get<PaginatedResponse<Comment>>(COMMENTS.HIDDEN, { page, size });
    return response.data;
  },
};

export default commentsService;
