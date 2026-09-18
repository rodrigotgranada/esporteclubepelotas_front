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

  fetchViaCEP: async (zipCode: string) => {
    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
      return res.json();
    }
    throw new Error('Invalid Zip');
  }
};
