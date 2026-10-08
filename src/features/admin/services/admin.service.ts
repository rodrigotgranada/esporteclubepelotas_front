import { api } from '@/services/api';

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
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('avatar', file);
    }
    const response = await api.post('/users/admin/create', formData);
    return response.data;
  },

  updateUser: async (id: string, data: any): Promise<UserAdminData> => {
    const response = await api.patch(`/users/admin/${id}`, data);
    return response.data;
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
  }
};
