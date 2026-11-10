import { api } from '@/services/api';
import { Settings } from '@/store/useSettingsStore';
import { uploadMedia } from '@/shared/services/media-upload.service';

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  uploadLogoMedia: async (file: File): Promise<string> => {
    const res = await uploadMedia(file, {
      endpoint: '/settings/upload-logo',
      folder: 'settings',
      legacyFieldName: 'logo',
    });
    return res.url;
  },

  uploadFacadeMedia: async (file: File): Promise<string> => {
    const res = await uploadMedia(file, {
      endpoint: '/settings/upload-facade',
      folder: 'settings',
      legacyFieldName: 'facade',
    });
    return res.url;
  },

  updateSettings: async (data: any, file?: File): Promise<Settings> => {
    if (!file) {
      const response = await api.put('/settings', data);
      return response.data;
    }
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('logo', file);
    const response = await api.put('/settings', formData);
    return response.data;
  },
};
