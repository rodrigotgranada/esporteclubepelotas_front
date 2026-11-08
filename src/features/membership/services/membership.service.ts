import { api } from '@/services/api';
import {
  MembershipPlan,
  CreateMembershipPlanInput,
  UpdateMembershipPlanInput,
  MembershipLead,
  CreateMembershipLeadInput,
  UpdateMembershipLeadStatusInput,
} from '../types/membership.types';

export const membershipService = {
  // Públicos
  getActivePlans: async (): Promise<MembershipPlan[]> => {
    const response = await api.get<MembershipPlan[]>('/membership-plans');
    return response.data;
  },

  getPlanBySlug: async (slug: string): Promise<MembershipPlan> => {
    const response = await api.get<MembershipPlan>(`/membership-plans/${slug}`);
    return response.data;
  },

  createLead: async (input: CreateMembershipLeadInput): Promise<MembershipLead> => {
    const response = await api.post<MembershipLead>('/membership-plans/leads', input);
    return response.data;
  },

  // Administrativos
  getAdminPlans: async (): Promise<MembershipPlan[]> => {
    const response = await api.get<MembershipPlan[]>('/admin/membership/plans');
    return response.data;
  },

  getAdminPlanById: async (id: string): Promise<MembershipPlan> => {
    const response = await api.get<MembershipPlan>(`/admin/membership/plans/${id}`);
    return response.data;
  },

  createAdminPlan: async (input: CreateMembershipPlanInput): Promise<MembershipPlan> => {
    const response = await api.post<MembershipPlan>('/admin/membership/plans', input);
    return response.data;
  },

  updateAdminPlan: async (id: string, input: UpdateMembershipPlanInput): Promise<MembershipPlan> => {
    const response = await api.put<MembershipPlan>(`/admin/membership/plans/${id}`, input);
    return response.data;
  },

  toggleAdminPlanActive: async (id: string): Promise<MembershipPlan> => {
    const response = await api.patch<MembershipPlan>(`/admin/membership/plans/${id}/toggle-active`);
    return response.data;
  },

  reorderAdminPlans: async (planIds: string[]): Promise<void> => {
    await api.patch('/admin/membership/plans/reorder', { planIds });
  },

  deleteAdminPlan: async (id: string): Promise<void> => {
    await api.delete(`/admin/membership/plans/${id}`);
  },

  getSystemConfig: async (): Promise<{ provider: 'ELEVENTICKETS' | 'NATIVE'; externalUrl: string }> => {
    const response = await api.get<{ provider: 'ELEVENTICKETS' | 'NATIVE'; externalUrl: string }>('/admin/membership/system-config');
    return response.data;
  },

  updateSystemConfig: async (data: { provider: 'ELEVENTICKETS' | 'NATIVE'; externalUrl?: string }): Promise<{ provider: 'ELEVENTICKETS' | 'NATIVE'; externalUrl: string }> => {
    const response = await api.put<{ provider: 'ELEVENTICKETS' | 'NATIVE'; externalUrl: string }>('/admin/membership/system-config', data);
    return response.data;
  },

  getAdminLeads: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get<{
      content: MembershipLead[];
      totalElements: number;
      totalPages: number;
      number: number;
    }>('/admin/membership/leads', { params });
    return response.data;
  },

  updateAdminLeadStatus: async (
    id: string,
    input: UpdateMembershipLeadStatusInput
  ): Promise<MembershipLead> => {
    const response = await api.patch<MembershipLead>(`/admin/membership/leads/${id}/status`, input);
    return response.data;
  },
};

