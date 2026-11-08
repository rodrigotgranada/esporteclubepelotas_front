import { api } from '@/services/api';
import { StadiumData, UpdateStadiumInput } from '../types/stadium.types';
import { uploadMedia } from '@/shared/services/media-upload.service';

export const stadiumService = {
  getStadiumInfo: async (): Promise<StadiumData> => {
    const response = await api.get<StadiumData>('/stadium', {
      params: { _t: Date.now() },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    return response.data;
  },

  getStadiumForAdmin: async (): Promise<StadiumData> => {
    const response = await api.get<StadiumData>('/admin/stadium', {
      params: { _t: Date.now() },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    return response.data;
  },

  updateStadiumInfo: async (data: UpdateStadiumInput): Promise<StadiumData> => {
    const response = await api.put<StadiumData>('/admin/stadium', data);
    return response.data;
  },

  uploadCover: async (file: File | Blob): Promise<{ url: string }> => {
    return uploadMedia(file, {
      endpoint: '/admin/stadium/upload-cover',
      folder: 'stadium',
      prefix: 'stadium-cover',
    });
  },

  uploadGalleryImage: async (file: File | Blob): Promise<{ url: string }> => {
    return uploadMedia(file, {
      endpoint: '/admin/stadium/upload-gallery',
      folder: 'stadium',
      prefix: 'stadium-gallery',
    });
  },
};

