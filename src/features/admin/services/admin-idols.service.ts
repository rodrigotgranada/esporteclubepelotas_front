import { uploadMedia, uploadMultipleMedia } from '@/shared/services/media-upload.service';
import { api } from '@/services/api';
import {
  IdolCategory,
  IdolData,
  IdolGalleryItem,
  IdolPeriod,
} from '../../idols/services/idols.service';

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
  galleryItems?: IdolGalleryItem[];
  startYear: number;
  endYear?: number;
  periods?: IdolPeriod[];
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

  uploadPhotoMedia: async (
    file: File,
    folderId?: string,
  ): Promise<{ url: string; photoUrl: string }> => {
    const res = await uploadMedia(file, {
      endpoint: '/idols/admin/upload-photo',
      legacyFieldName: 'photo',
      folderId,
      folder: 'idols',
    });
    return { url: res.url, photoUrl: res.url };
  },

  uploadGalleryMedia: async (
    files: File[],
    folderId?: string,
  ): Promise<{ urls: string[]; gallery: string[] }> => {
    const urls = await uploadMultipleMedia(files, {
      endpoint: '/idols/admin/upload-gallery',
      legacyFieldName: 'gallery',
      folderId,
      folder: 'idols',
    });
    return { urls, gallery: urls };
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
    const res = await uploadMedia(file, {
      endpoint: `/idols/admin/${id}/photo`,
      legacyFieldName: 'photo',
      folder: 'idols',
    });
    return { photoUrl: res.url, message: 'Foto atualizada com sucesso.' };
  },

  uploadGallery: async (id: string, files: File[]): Promise<{ gallery: string[]; message: string }> => {
    const urls = await uploadMultipleMedia(files, {
      endpoint: `/idols/admin/${id}/gallery`,
      legacyFieldName: 'gallery',
      folder: 'idols',
    });
    return { gallery: urls, message: 'Galeria atualizada com sucesso.' };
  },
};
