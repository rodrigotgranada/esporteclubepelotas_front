import { api } from '@/services/api';
import { Settings } from '@/store/useSettingsStore';

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  uploadLogoMedia: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('logo', file);
    const response = await api.post('/settings/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.url || response.data;
  },

  updateSettings: async (data: any, file?: File): Promise<Settings> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('logo', file);
    }
    const response = await api.put('/settings', formData);
    return response.data;
  },
};
