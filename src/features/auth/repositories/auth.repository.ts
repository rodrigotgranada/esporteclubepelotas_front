import { api } from '@/services/api';
import { submitMultipartWithPayload } from '@/shared/services/media-upload.service';
import { LoginForm } from '../schemas';
import { fetchViaCEP } from '@/shared/utils/viacep';

export const authRepository = {
  login: async (data: LoginForm) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (payload: Record<string, unknown>, avatarBlob?: Blob | null) => {
    return submitMultipartWithPayload({
      endpoint: '/users/register',
      data: payload,
      file: avatarBlob,
      legacyFieldName: 'avatar',
      prefix: 'avatar',
    });
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    const response = await api.post('/auth/verify', data);
    return response.data;
  },

  resendCode: async (email: string) => {
    const response = await api.post('/auth/resend-code', { email });
    return response.data;
  },

  forgotPassword: async (cpf: string) => {
    const response = await api.post('/auth/forgot-password', { cpf });
    return response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  checkAvailability: async (type: 'email' | 'cpf', value: string) => {
    const response = await api.post('/users/check-availability', { type, value });
    return response.data;
  },

  fetchViaCEP: async (zipCode: string) => {
    const data = await fetchViaCEP(zipCode);
    if (!data) throw new Error('Invalid Zip');
    return data;
  },
};
