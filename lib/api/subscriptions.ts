// ============================================
// Service des abonnements
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  SubscriptionPlan, 
  Subscription, 
  CreateSubscriptionRequest, 
  PaginatedResponse 
} from '@/types';

const { SUBSCRIPTIONS } = API_CONFIG.ENDPOINTS;

export const subscriptionsService = {
  // Plans disponibles
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlan[]>(SUBSCRIPTIONS.PLANS);
    return response.data;
  },
  
  // S'abonner
  async subscribe(data: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(SUBSCRIPTIONS.BASE, data);
    return response.data;
  },
  
  // Activer abonnement
  async activate(id: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(SUBSCRIPTIONS.ACTIVATE(id));
    return response.data;
  },
  
  // Annuler abonnement
  async cancel(id: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(SUBSCRIPTIONS.CANCEL(id));
    return response.data;
  },
  
  // Abonnement actuel
  async getCurrent(): Promise<Subscription | null> {
    try {
      const response = await apiClient.get<Subscription>(SUBSCRIPTIONS.CURRENT);
      return response.data;
    } catch {
      return null;
    }
  },
  
  // Historique
  async getHistory(page = 0, size = 20): Promise<PaginatedResponse<Subscription>> {
    const response = await apiClient.get<PaginatedResponse<Subscription>>(SUBSCRIPTIONS.HISTORY, { page, size });
    return response.data;
  },
  
  // Vérifier si abonné
  async checkSubscription(): Promise<boolean> {
    const response = await apiClient.get<{ subscribed: boolean }>(SUBSCRIPTIONS.CHECK);
    return response.data.subscribed;
  },
  
  // Créer un plan (Admin)
  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.post<SubscriptionPlan>(SUBSCRIPTIONS.PLANS, data);
    return response.data;
  },
  
  // Modifier un plan (Admin)
  async updatePlan(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.put<SubscriptionPlan>(`${SUBSCRIPTIONS.PLANS}/${id}`, data);
    return response.data;
  },
  
  // Activer/désactiver plan (Admin)
  async togglePlan(id: number): Promise<SubscriptionPlan> {
    const response = await apiClient.patch<SubscriptionPlan>(`${SUBSCRIPTIONS.PLANS}/${id}/toggle`);
    return response.data;
  },
};

export default subscriptionsService;
