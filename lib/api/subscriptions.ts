// ============================================
// Service des abonnements
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  SubscriptionPlan, 
  SubscriptionPlanRequest,
  Subscription, 
  CreateSubscriptionRequest, 
  PaginatedResponse 
} from '@/types';

const { SUBSCRIPTIONS } = API_CONFIG.ENDPOINTS;

function normalizeSubscriptionHistory(raw: unknown, pageSize: number): PaginatedResponse<Subscription> {
  const p = raw as Partial<PaginatedResponse<Subscription>> | null;
  const content = Array.isArray(p?.content) ? p.content : [];
  const totalElements = typeof p?.totalElements === 'number' ? p.totalElements : content.length;
  const currentPage = typeof p?.currentPage === 'number' ? p.currentPage : 0;
  const totalPages = typeof p?.totalPages === 'number' ? p.totalPages : Math.max(0, Math.ceil(totalElements / pageSize) - 1);
  return {
    content,
    totalElements,
    currentPage,
    totalPages,
    pageSize: typeof p?.pageSize === 'number' ? p.pageSize : pageSize,
    first: p?.first ?? currentPage <= 0,
    last: p?.last ?? currentPage >= totalPages,
    hasNext: p?.hasNext ?? currentPage < totalPages,
    hasPrevious: p?.hasPrevious ?? currentPage > 0,
  };
}

export const subscriptionsService = {
  // Plans disponibles — GET /api/subscriptions/plans → data = tableau de plans (ou data.content)
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get<SubscriptionPlan[] | { content?: SubscriptionPlan[]; data?: SubscriptionPlan[] }>(SUBSCRIPTIONS.PLANS);
      const raw = (response as { data?: unknown })?.data ?? response;
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === 'object') {
        const o = raw as Record<string, unknown>;
        if (Array.isArray(o.content)) return o.content as SubscriptionPlan[];
        if (Array.isArray(o.data)) return o.data as SubscriptionPlan[];
        if (Array.isArray(o.items)) return o.items as SubscriptionPlan[];
      }
      return [];
    } catch {
      return [];
    }
  },
  
  // S'abonner (avec objet)
  async create(data: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(SUBSCRIPTIONS.BASE, data);
    return response.data;
  },
  
  // S'abonner (simplifié avec planId)
  async subscribe(planId: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(`${SUBSCRIPTIONS.BASE}/${planId}`);
    return response.data;
  },
  
  // Activer abonnement
  async activate(id: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(SUBSCRIPTIONS.ACTIVATE(id));
    return response.data;
  },
  
  // Annuler abonnement (avec id)
  async cancelById(id: number): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(SUBSCRIPTIONS.CANCEL(id));
    return response.data;
  },
  
  // Annuler abonnement actuel
  async cancel(): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(`${SUBSCRIPTIONS.CURRENT}/cancel`);
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
  
  // Alias pour getCurrent
  async getMySubscription(): Promise<Subscription | null> {
    return this.getCurrent();
  },
  
  // Historique — GET /api/subscriptions/history?page=0&size=20 → data.content + pagination
  async getHistory(page = 0, size = 20): Promise<PaginatedResponse<Subscription>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Subscription>>(SUBSCRIPTIONS.HISTORY, { page, size });
      const raw = (response as { data?: PaginatedResponse<Subscription> })?.data ?? response;
      return normalizeSubscriptionHistory(raw, size);
    } catch {
      return { content: [], totalElements: 0, currentPage: 0, totalPages: 0, pageSize: size, first: true, last: true, hasNext: false, hasPrevious: false };
    }
  },
  
  // Vérifier si abonné
  async checkSubscription(): Promise<boolean> {
    const response = await apiClient.get<{ subscribed: boolean }>(SUBSCRIPTIONS.CHECK);
    return response.data.subscribed;
  },
  
  // Créer un plan (Admin) — type, name, price, durationDays obligatoires côté API
  async createPlan(data: SubscriptionPlanRequest): Promise<SubscriptionPlan> {
    const response = await apiClient.post<SubscriptionPlan>(SUBSCRIPTIONS.PLANS, data);
    return response.data;
  },
  
  // Modifier un plan (Admin)
  async updatePlan(id: number, data: SubscriptionPlanRequest): Promise<SubscriptionPlan> {
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
