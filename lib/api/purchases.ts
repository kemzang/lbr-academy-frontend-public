// ============================================
// Service des achats
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { Purchase, CreatePurchaseRequest, PaginatedResponse } from '@/types';

const { PURCHASES } = API_CONFIG.ENDPOINTS;

export const purchasesService = {
  // Initier un achat
  async create(data: CreatePurchaseRequest): Promise<Purchase> {
    const response = await apiClient.post<Purchase>(PURCHASES.BASE, data);
    return response.data;
  },
  
  // Confirmer l'achat
  async complete(id: number): Promise<Purchase> {
    const response = await apiClient.post<Purchase>(PURCHASES.COMPLETE(id));
    return response.data;
  },
  
  // Mes achats
  async getMyPurchases(page = 0, size = 20): Promise<PaginatedResponse<Purchase>> {
    const response = await apiClient.get<PaginatedResponse<Purchase>>(PURCHASES.BASE, { page, size });
    return response.data;
  },
  
  // Vérifier si acheté
  async checkPurchase(contentId: number): Promise<boolean> {
    const response = await apiClient.get<{ purchased: boolean }>(PURCHASES.CHECK(contentId));
    return response.data.purchased;
  },
};

export default purchasesService;
