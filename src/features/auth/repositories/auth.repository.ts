import { api } from '@/services/api';
import { LoginForm, RegisterForm } from '../schemas';

export const authRepository = {
  login: async (data: LoginForm) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (formData: FormData) => {
    // Agora o registro envia o FormData completo que contem 'data' (JSON) e 'avatar' (Blob)
    const response = await api.post('/users/register', formData);
    return response.data;
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
    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
      return res.json();
    }
    throw new Error('Invalid Zip');
  }
};
