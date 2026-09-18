import { api } from '@/services/api';
import { LoginForm, RegisterForm } from '../schemas';

export const authRepository = {
  login: async (data: LoginForm) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterForm) => {
    // Remove confirmPassword from payload and convert Date
    const { confirmPassword, ...restData } = data;
    const payload = {
      ...restData,
      birthDate: new Date(data.birthDate).toISOString(),
    };
    const response = await api.post('/users/register', payload);
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
