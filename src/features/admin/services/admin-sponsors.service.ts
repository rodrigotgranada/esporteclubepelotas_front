import { api } from '@/services/api';
import { uploadMedia } from '@/shared/services/media-upload.service';
import {
  Sponsor,
  GetSponsorsParams,
  GetSponsorsResponse,
  CreateSponsorPayload,
  UpdateSponsorPayload,
  SponsorReorderItem,
} from '@/features/sponsors/types/sponsors.types';

export const adminSponsorsService = {
  getSponsors: async (params?: GetSponsorsParams): Promise<GetSponsorsResponse> => {
    const response = await api.get<GetSponsorsResponse>('/admin/sponsors', { params });
    return response.data;
  },

  getSponsorById: async (id: string): Promise<Sponsor> => {
    const response = await api.get<Sponsor>(`/admin/sponsors/${id}`);
    return response.data;
  },

  createSponsor: async (payload: CreateSponsorPayload): Promise<Sponsor> => {
    const response = await api.post<Sponsor>('/admin/sponsors', payload);
    return response.data;
  },

  updateSponsor: async (id: string, payload: UpdateSponsorPayload): Promise<Sponsor> => {
    const response = await api.put<Sponsor>(`/admin/sponsors/${id}`, payload);
    return response.data;
  },

  deleteSponsor: async (id: string): Promise<void> => {
    await api.delete(`/admin/sponsors/${id}`);
  },

  uploadLogo: async (file: File): Promise<string> => {
    const result = await uploadMedia(file, {
      endpoint: '/admin/sponsors/upload-logo',
      folder: 'sponsors',
      prefix: 'sponsor-logo',
      legacyFieldName: 'logo',
    });
    return result.url;
  },

  reorderSponsors: async (items: SponsorReorderItem[]): Promise<void> => {
    await api.patch('/admin/sponsors/reorder', items);
  },
};
