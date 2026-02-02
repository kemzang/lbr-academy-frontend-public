// ============================================
// Service des notifications
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { Notification, NotificationCount, PaginatedResponse } from '@/types';

const { NOTIFICATIONS } = API_CONFIG.ENDPOINTS;

export const notificationsService = {
  // Toutes mes notifications
  async getAll(page = 0, size = 20): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<PaginatedResponse<Notification>>(NOTIFICATIONS.BASE, { page, size });
    return response.data;
  },
  
  // Non lues
  async getUnread(page = 0, size = 20): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<PaginatedResponse<Notification>>(NOTIFICATIONS.UNREAD, { page, size });
    return response.data;
  },
  
  // 10 dernières
  async getLatest(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(NOTIFICATIONS.LATEST);
    return response.data;
  },
  
  // Compteur non lues
  async getCount(): Promise<NotificationCount> {
    const response = await apiClient.get<NotificationCount>(NOTIFICATIONS.COUNT);
    return response.data;
  },
  
  // Marquer comme lue
  async markAsRead(id: number): Promise<Notification> {
    const response = await apiClient.patch<Notification>(NOTIFICATIONS.READ(id));
    return response.data;
  },
  
  // Tout marquer comme lu
  async markAllAsRead(): Promise<void> {
    await apiClient.patch(NOTIFICATIONS.READ_ALL);
  },
  
  // Supprimer les lues
  async deleteRead(): Promise<void> {
    await apiClient.delete(NOTIFICATIONS.DELETE_READ);
  },
  
  // Supprimer une notification
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${NOTIFICATIONS.BASE}/${id}`);
  },
};

export default notificationsService;
