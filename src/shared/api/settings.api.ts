import { api } from '@/services/api';
import { Settings } from '@/store/useSettingsStore';

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (data: any, file?: File): Promise<Settings> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('logo', file);
    }
    const response = await api.put('/settings', formData);
    return response.data;
  }
};
