// ============================================
// Service des demandes de rôle
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { RoleUpgradeRequest, CreateRoleUpgradeRequest, PaginatedResponse } from '@/types';

const { ROLE_UPGRADES } = API_CONFIG.ENDPOINTS;

function getArrayFromPayload<T>(p: Record<string, unknown> | null): T[] {
  if (!p || typeof p !== 'object') return [];
  if (Array.isArray(p.content)) return p.content as T[];
  if (Array.isArray(p.data)) return p.data as T[];
  if (Array.isArray(p.items)) return p.items as T[];
  if (Array.isArray(p.results)) return p.results as T[];
  return [];
}

function getTotalFromPayload(p: Record<string, unknown> | null, fallback: number): number {
  if (!p || typeof p !== 'object') return fallback;
  if (typeof p.totalElements === 'number') return p.totalElements;
  if (typeof p.total === 'number') return p.total;
  if (typeof p.totalCount === 'number') return p.totalCount;
  return fallback;
}

function normalizePaginatedResponse<T>(raw: unknown, pageSize = 20): PaginatedResponse<T> {
  const p = raw as Record<string, unknown> | null;
  const content = getArrayFromPayload<T>(p);
  const totalElements = getTotalFromPayload(p, content.length);
  const currentPage = typeof p?.currentPage === 'number' ? p.currentPage : 0;
  const totalPages = typeof p?.totalPages === 'number' ? p.totalPages : Math.max(0, Math.ceil(totalElements / pageSize) - 1);
  return {
    content,
    totalElements,
    currentPage,
    totalPages,
    pageSize: typeof p?.pageSize === 'number' ? p.pageSize : pageSize,
    first: typeof p?.first === 'boolean' ? p.first : currentPage <= 0,
    last: typeof p?.last === 'boolean' ? p.last : currentPage >= totalPages,
    hasNext: typeof p?.hasNext === 'boolean' ? p.hasNext : currentPage < totalPages,
    hasPrevious: typeof p?.hasPrevious === 'boolean' ? p.hasPrevious : currentPage > 0,
  };
}

export const roleUpgradesService = {
  // Demander un rôle
  async create(data: CreateRoleUpgradeRequest): Promise<RoleUpgradeRequest> {
    const response = await apiClient.post<RoleUpgradeRequest>(ROLE_UPGRADES.BASE, data);
    return response.data;
  },
  
  // Mes demandes — GET /api/role-upgrades/my?page=0&size=20 → data.content
  async getMyRequests(page = 0, size = 20): Promise<RoleUpgradeRequest[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<RoleUpgradeRequest> | RoleUpgradeRequest[]>(
        ROLE_UPGRADES.MY,
        { page, size }
      );
      const raw = (response as { data?: unknown })?.data ?? response;
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === 'object' && Array.isArray((raw as PaginatedResponse<RoleUpgradeRequest>).content)) {
        return (raw as PaginatedResponse<RoleUpgradeRequest>).content;
      }
      return [];
    } catch {
      return [];
    }
  },
  
  // Annuler ma demande
  async cancel(id: number): Promise<void> {
    await apiClient.delete(`${ROLE_UPGRADES.BASE}/${id}`);
  },
  
  // Demandes en attente (Admin) — GET /api/role-upgrades/pending?page=0&size=20 → data.content + pagination
  async getPending(page = 0, size = 20): Promise<PaginatedResponse<RoleUpgradeRequest>> {
    try {
      const response = await apiClient.get<PaginatedResponse<RoleUpgradeRequest>>(ROLE_UPGRADES.PENDING, { page, size });
      const raw = (response as { data?: PaginatedResponse<RoleUpgradeRequest> })?.data ?? response;
      return normalizePaginatedResponse(raw, size);
    } catch {
      return { content: [], totalElements: 0, currentPage: 0, totalPages: 0, pageSize: size, first: true, last: true, hasNext: false, hasPrevious: false };
    }
  },
  
  // Toutes les demandes (Admin) — GET /api/role-upgrades?status=...&page=0&size=20 → data.content + pagination
  async getAll(page = 0, size = 20, status?: string): Promise<PaginatedResponse<RoleUpgradeRequest>> {
    try {
      const params: Record<string, string | number | undefined> = { page, size };
      if (status) params.status = status;
      const response = await apiClient.get<PaginatedResponse<RoleUpgradeRequest>>(ROLE_UPGRADES.BASE, params);
      const raw = (response as { data?: PaginatedResponse<RoleUpgradeRequest> })?.data ?? response;
      return normalizePaginatedResponse(raw, size);
    } catch {
      return { content: [], totalElements: 0, currentPage: 0, totalPages: 0, pageSize: size, first: true, last: true, hasNext: false, hasPrevious: false };
    }
  },
  
  // Approuver (Admin)
  async approve(id: number, adminNote?: string): Promise<RoleUpgradeRequest> {
    const response = await apiClient.post<RoleUpgradeRequest>(ROLE_UPGRADES.APPROVE(id), { adminNote });
    return response.data;
  },
  
  // Rejeter (Admin)
  async reject(id: number, reason?: string): Promise<RoleUpgradeRequest> {
    const url = reason 
      ? `${ROLE_UPGRADES.REJECT(id)}?reason=${encodeURIComponent(reason)}`
      : ROLE_UPGRADES.REJECT(id);
    const response = await apiClient.post<RoleUpgradeRequest>(url);
    return response.data;
  },
  
  // Marquer comme en cours de revue (Admin)
  async markAsReviewing(id: number): Promise<RoleUpgradeRequest> {
    const response = await apiClient.patch<RoleUpgradeRequest>(`${ROLE_UPGRADES.BASE}/${id}/review`);
    return response.data;
  },
};

export default roleUpgradesService;
