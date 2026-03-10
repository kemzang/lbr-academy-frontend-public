// ============================================
// Service des contenus
// ============================================

import { API_CONFIG } from '@/config/api';
import { apiClient } from './client';
import { 
  Content, 
  ContentSummary, 
  CreateContentRequest, 
  UpdateContentRequest,
  ContentSearchParams,
  RateContentRequest,
  PaginatedResponse 
} from '@/types';

const { CONTENTS } = API_CONFIG.ENDPOINTS;

export const contentsService = {
  // Rechercher/lister les contenus
  async search(params?: ContentSearchParams): Promise<PaginatedResponse<ContentSummary>> {
    const response = await apiClient.get<PaginatedResponse<ContentSummary>>(
      CONTENTS.BASE, 
      params as Record<string, string | number | boolean | undefined>
    );
    return response.data;
  },
  
  // Obtenir un contenu par ID
  async getById(id: number): Promise<Content> {
    const response = await apiClient.get<Content>(CONTENTS.BY_ID(id));
    return response.data;
  },
  
  // Obtenir un contenu par slug
  async getBySlug(slug: string): Promise<Content> {
    const response = await apiClient.get<Content>(CONTENTS.BY_SLUG(slug));
    return response.data;
  },
  
  // Contenus en vedette
  async getFeatured(limit = 10): Promise<ContentSummary[]> {
    const response = await apiClient.get<ContentSummary[]>(CONTENTS.FEATURED, { limit });
    return response.data;
  },
  
  // Contenus populaires
  async getPopular(limit = 10): Promise<ContentSummary[]> {
    const response = await apiClient.get<ContentSummary[]>(CONTENTS.POPULAR, { limit });
    return response.data;
  },
  
  // Meilleures ventes
  async getBestsellers(limit = 10): Promise<ContentSummary[]> {
    const response = await apiClient.get<ContentSummary[]>(CONTENTS.BESTSELLERS, { limit });
    return response.data;
  },
  
  // Derniers contenus
  async getLatest(limit = 10): Promise<ContentSummary[]> {
    const response = await apiClient.get<ContentSummary[]>(CONTENTS.LATEST, { limit });
    return response.data;
  },
  
  // Mieux notés
  async getTopRated(limit = 10): Promise<ContentSummary[]> {
    const response = await apiClient.get<ContentSummary[]>(CONTENTS.TOP_RATED, { limit });
    return response.data;
  },
  
  // Par catégorie
  async getByCategory(categoryId: number, params?: ContentSearchParams): Promise<PaginatedResponse<ContentSummary>> {
    const response = await apiClient.get<PaginatedResponse<ContentSummary>>(
      CONTENTS.BY_CATEGORY(categoryId),
      params as Record<string, string | number | boolean | undefined>
    );
    return response.data;
  },
  
  // Par auteur
  async getByAuthor(authorId: number, params?: ContentSearchParams): Promise<PaginatedResponse<ContentSummary>> {
    const response = await apiClient.get<PaginatedResponse<ContentSummary>>(
      CONTENTS.BY_AUTHOR(authorId),
      params as Record<string, string | number | boolean | undefined>
    );
    return response.data;
  },
  
  // Créer un contenu
  async create(data: CreateContentRequest): Promise<Content> {
    const response = await apiClient.post<Content>(CONTENTS.BASE, data);
    return response.data;
  },
  
  // Modifier un contenu
  async update(id: number, data: UpdateContentRequest): Promise<Content> {
    const response = await apiClient.put<Content>(CONTENTS.BY_ID(id), data);
    return response.data;
  },
  
  // Uploader la couverture
  async uploadCover(id: number, file: File): Promise<Content> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Content>(CONTENTS.COVER(id), formData, true);
    return response.data;
  },
  
  // Uploader le fichier
  async uploadFile(id: number, file: File): Promise<Content> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Content>(CONTENTS.FILE(id), formData, true);
    return response.data;
  },
  
  // Soumettre pour validation
  async submit(id: number): Promise<Content> {
    const response = await apiClient.post<Content>(CONTENTS.SUBMIT(id));
    return response.data;
  },
  
  // Supprimer un contenu
  async delete(id: number): Promise<void> {
    await apiClient.delete(CONTENTS.BY_ID(id));
  },
  
  // Mes contenus
  async getMyContents(page = 0, size = 20): Promise<PaginatedResponse<Content>> {
    const response = await apiClient.get<PaginatedResponse<Content>>(
      CONTENTS.MY_CONTENTS,
      { page, size }
    );
    return response.data;
  },
  
  // Noter un contenu — le backend attend le paramètre "rating" en query (ex. POST /contents/:id/rate?rating=5)
  async rate(id: number, data: RateContentRequest): Promise<void> {
    await apiClient.post(CONTENTS.RATE(id), undefined, false, { rating: data.rating });
  },
  
  // Télécharger le fichier d'un contenu (lecture/stream)
  // Essaie d'abord GET /contents/:id/download, puis GET /contents/:id/file (même chemin que l'upload)
  async download(id: number): Promise<Blob> {
    const token = apiClient.getAccessTokenPublic();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const tryUrl = (url: string) =>
      fetch(url, { method: 'GET', headers }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      });

    try {
      return await tryUrl(`${API_CONFIG.BASE_URL}${CONTENTS.DOWNLOAD(id)}`);
    } catch {
      try {
        return await tryUrl(`${API_CONFIG.BASE_URL}${CONTENTS.FILE(id)}`);
      } catch {
        throw new Error('FILE_NOT_AVAILABLE');
      }
    }
  },

  /**
   * URL pour lecture en stream (vidéo/audio) — à utiliser dans <video src> / <audio src>.
   * Le backend doit accepter GET avec token en query ou en header (CORS autorisé).
   */
  getStreamUrl(id: number): string {
    const token = apiClient.getAccessTokenPublic();
    const base = `${API_CONFIG.BASE_URL}${CONTENTS.FILE(id)}`;
    return token ? `${base}?token=${encodeURIComponent(token)}` : base;
  },
  
  // Obtenir l'URL de téléchargement (pour utilisation directe)
  getDownloadUrl(id: number): string {
    const token = apiClient.getAccessTokenPublic();
    return `${API_CONFIG.BASE_URL}${CONTENTS.DOWNLOAD(id)}${token ? `?token=${token}` : ''}`;
  },
};

export default contentsService;
