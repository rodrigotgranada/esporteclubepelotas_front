import { api } from '@/services/api';
import { uploadMedia, submitMultipartWithPayload } from '@/shared/services/media-upload.service';

export interface UserAdminData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  cpf: string;
  avatarUrl?: string;
  role: any;
  status: string;
  isActive: boolean;
  birthDate?: string;
  phones?: any[];
  addresses?: any[];
  preferences?: any;
  mustChangePassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUsersResponse {
  data: UserAdminData[];
  total: number;
  page: number;
  limit: number;
}

export const adminService = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }): Promise<GetUsersResponse> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  updateUserStatus: async (id: string, status: string): Promise<UserAdminData> => {
    const response = await api.patch(`/users/admin/${id}/status`, { status });
    return response.data;
  },

  updateUserRole: async (id: string, role: string): Promise<UserAdminData> => {
    const response = await api.patch(`/users/admin/${id}/role`, { role });
    return response.data;
  },

  createUser: async (data: any, file?: File): Promise<UserAdminData> => {
    if (!file) {
      return submitMultipartWithPayload<UserAdminData>({
        endpoint: '/users/admin/create',
        data,
      });
    }
    return submitMultipartWithPayload<UserAdminData>({
      endpoint: '/users/admin/create',
      data,
      file,
      legacyFieldName: 'avatar',
      prefix: 'avatar',
    });
  },

  updateUser: async (id: string, data: any): Promise<UserAdminData> => {
    const response = await api.patch(`/users/admin/${id}`, data);
    return response.data;
  },

  updateUserAvatar: async (id: string, file: File): Promise<{ url: string }> => {
    return uploadMedia(file, {
      endpoint: `/users/admin/${id}/avatar`,
      legacyFieldName: 'avatar',
      prefix: 'avatar',
    });
  },

  uploadUserAvatarMedia: async (file: File, folderId?: string): Promise<string> => {
    const res = await uploadMedia(file, {
      endpoint: '/users/admin/upload-avatar',
      legacyFieldName: 'avatar',
      folderId,
      prefix: 'avatar',
    });
    return res.url;
  },

  softDeleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/admin/${id}`);
  },

  resendVerification: async (id: string): Promise<void> => {
    await api.post(`/users/admin/${id}/resend-verification`);
  },

  forcePasswordReset: async (id: string): Promise<void> => {
    await api.post(`/users/admin/${id}/force-password-reset`);
  },

  getRoles: async (): Promise<any[]> => {
    const response = await api.get('/admin/roles');
    return response.data;
  },

  createRole: async (data: any): Promise<any> => {
    const response = await api.post('/admin/roles', data);
    return response.data;
  },

  updateRole: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/admin/roles/${id}`, data);
    return response.data;
  },

  getSystemModules: async (): Promise<any[]> => {
    const response = await api.get('/admin/modules');
    return response.data;
  },

  updateSystemModuleStatus: async (id: string, isActive: boolean): Promise<any> => {
    const response = await api.patch(`/admin/modules/${id}/status`, { isActive });
    return response.data;
  },
};
