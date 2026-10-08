import { api } from '@/services/api';
import { User } from '@/store/useAuthStore';

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  addresses?: any[]; // We can use Address[] but any[] is fine for now
}

export const updateProfile = async (data: UpdateProfilePayload): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const updateAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.put<{ url: string }>('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteAccount = async (password: string): Promise<void> => {
  await api.delete('/users/me', {
    data: { password },
  });
};

export const requestProfileChange = async (type: 'email' | 'phone', newValue: string, currentPassword: string): Promise<{ success: boolean; user: User }> => {
  const response = await api.post<{ success: boolean; user: User }>('/users/profile/request-change', { type, newValue, currentPassword });
  return response.data;
};

export const confirmProfileChange = async (type: 'email' | 'phone', code: string): Promise<User> => {
  const response = await api.post<User>('/users/profile/confirm-change', { type, code });
  return response.data;
};

export const confirmFirebasePhone = async (idToken: string, currentPassword?: string): Promise<User> => {
  const response = await api.post<User>('/users/profile/confirm-firebase-phone', { idToken, currentPassword });
  return response.data;
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.patch('/users/profile/password', { currentPassword, newPassword });
};
