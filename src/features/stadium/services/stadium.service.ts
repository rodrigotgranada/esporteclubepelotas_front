import { api } from '@/services/api';
import { StadiumData, UpdateStadiumInput } from '../types/stadium.types';

export const stadiumService = {
  getStadiumInfo: async (): Promise<StadiumData> => {
    const response = await api.get<StadiumData>('/stadium');
    return response.data;
  },

  getStadiumForAdmin: async (): Promise<StadiumData> => {
    const response = await api.get<StadiumData>('/admin/stadium');
    return response.data;
  },

  updateStadiumInfo: async (data: UpdateStadiumInput): Promise<StadiumData> => {
    const response = await api.put<StadiumData>('/admin/stadium', data);
    return response.data;
  },

  uploadCover: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/admin/stadium/upload-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadGalleryImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/admin/stadium/upload-gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

