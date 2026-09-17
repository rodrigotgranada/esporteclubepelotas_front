import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998',
});

// Interceptor to inject Token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stateStr = localStorage.getItem('auth-storage');
    if (stateStr) {
      try {
        const parsed = JSON.parse(stateStr);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth state', error);
      }
    }
  }
  return config;
});
