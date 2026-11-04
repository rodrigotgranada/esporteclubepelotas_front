import { api } from '@/services/api';
import { IdolCategory, IdolData } from '../../idols/services/idols.service';

export interface GetAdminIdolsResponse {
  data: IdolData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateAdminIdolDto {
  name: string;
  nickname?: string;
  slug?: string;
  category: IdolCategory;
  photoUrl?: string;
  gallery?: string[];
  startYear: number;
  endYear?: number;
  isActiveInClub?: boolean;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  quote?: string;
  biography: string;
  playerStats?: any;
  coachStats?: any;
  staffStats?: any;
  fanStats?: any;
  isFeatured?: boolean;
  order?: number;
}

export type UpdateAdminIdolDto = Partial<CreateAdminIdolDto>;

export const adminIdolsService = {
  getIdols: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isFeatured?: boolean;
  }): Promise<GetAdminIdolsResponse> => {
    const response = await api.get('/idols/admin', { params });
    return response.data;
  },

  getIdolById: async (id: string): Promise<IdolData> => {
    const response = await api.get(`/idols/admin/${id}`);
    return response.data;
  },

  createIdol: async (dto: CreateAdminIdolDto): Promise<IdolData> => {
    const response = await api.post('/idols/admin', dto);
    return response.data;
  },

  updateIdol: async (id: string, dto: UpdateAdminIdolDto): Promise<IdolData> => {
    const response = await api.patch(`/idols/admin/${id}`, dto);
    return response.data;
  },

  deleteIdol: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/idols/admin/${id}`);
    return response.data;
  },

  uploadPhoto: async (id: string, file: File): Promise<{ photoUrl: string; message: string }> => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post(`/idols/admin/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadGallery: async (id: string, files: File[]): Promise<{ gallery: string[]; message: string }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('gallery', file));
    const response = await api.post(`/idols/admin/${id}/gallery`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
