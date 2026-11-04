import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998',
  withCredentials: true,
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

// Interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const hasToken = typeof window !== 'undefined' ? !!useAuthStore.getState().token : false;
    
    // Only intercept 401s if the user actually had an active session and is not already on auth endpoints
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/auth/refresh' && 
      originalRequest.url !== '/auth/login' &&
      hasToken
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = refreshResponse.data.accessToken;
        
        // Update store with new token
        if (typeof window !== 'undefined') {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            useAuthStore.getState().setAuth(newToken, currentUser);
          }
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          useAuthStore.getState().logout();
          const pathname = window.location.pathname;
          const isProtectedRoute = 
            pathname.startsWith('/gestao') || 
            pathname.startsWith('/profile') || 
            pathname.startsWith('/dashboard');

          if (isProtectedRoute) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
