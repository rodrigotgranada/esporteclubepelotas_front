import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998',
  timeout: 60000,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

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

// Interceptor to handle 401 with single-flight refresh lock
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const hasToken = typeof window !== 'undefined' ? !!useAuthStore.getState().token : false;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login' &&
      hasToken
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
            .then((refreshResponse) => {
              const newToken = refreshResponse.data.accessToken as string;
              if (typeof window !== 'undefined') {
                const currentUser = useAuthStore.getState().user;
                if (currentUser && newToken) {
                  useAuthStore.getState().setAuth(newToken, currentUser);
                }
              }
              return newToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
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
  },
);
