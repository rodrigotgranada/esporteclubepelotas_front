import { api } from '@/services/api';

export const profileService = {
  updateMe: async (data: any) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  deactivateMe: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  }
};
