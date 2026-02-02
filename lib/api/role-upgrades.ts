// ============================================
// Service des demandes de rôle
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { RoleUpgradeRequest, CreateRoleUpgradeRequest, PaginatedResponse } from '@/types';

const { ROLE_UPGRADES } = API_CONFIG.ENDPOINTS;

export const roleUpgradesService = {
  // Demander un rôle
  async create(data: CreateRoleUpgradeRequest): Promise<RoleUpgradeRequest> {
    const response = await apiClient.post<RoleUpgradeRequest>(ROLE_UPGRADES.BASE, data);
    return response.data;
  },
  
  // Mes demandes
  async getMyRequests(): Promise<RoleUpgradeRequest[]> {
    const response = await apiClient.get<RoleUpgradeRequest[]>(ROLE_UPGRADES.MY);
    return response.data;
  },
  
  // Annuler ma demande
  async cancel(id: number): Promise<void> {
    await apiClient.delete(`${ROLE_UPGRADES.BASE}/${id}`);
  },
  
  // Demandes en attente (Admin)
  async getPending(page = 0, size = 20): Promise<PaginatedResponse<RoleUpgradeRequest>> {
    const response = await apiClient.get<PaginatedResponse<RoleUpgradeRequest>>(ROLE_UPGRADES.PENDING, { page, size });
    return response.data;
  },
  
  // Toutes les demandes (Admin)
  async getAll(page = 0, size = 20): Promise<PaginatedResponse<RoleUpgradeRequest>> {
    const response = await apiClient.get<PaginatedResponse<RoleUpgradeRequest>>(ROLE_UPGRADES.BASE, { page, size });
    return response.data;
  },
  
  // Approuver (Admin)
  async approve(id: number, adminNote?: string): Promise<RoleUpgradeRequest> {
    const response = await apiClient.post<RoleUpgradeRequest>(ROLE_UPGRADES.APPROVE(id), { adminNote });
    return response.data;
  },
  
  // Rejeter (Admin)
  async reject(id: number, adminNote?: string): Promise<RoleUpgradeRequest> {
    const response = await apiClient.post<RoleUpgradeRequest>(ROLE_UPGRADES.REJECT(id), { adminNote });
    return response.data;
  },
};

export default roleUpgradesService;
