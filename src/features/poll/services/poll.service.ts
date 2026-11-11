import { api } from '@/services/api';
import { Poll, CreatePollPayload, UpdatePollPayload } from '../types/poll.types';

export const pollService = {
  getActivePoll: async () => {
    try {
      const { data, status } = await api.get<Poll>('/polls/active');
      if (status === 204 || !data) return null;
      return data;
    } catch {
      return null;
    }
  },

  getPollById: async (id: string) => {
    const { data } = await api.get<Poll>(`/polls/${id}`);
    return data;
  },

  vote: async (pollId: string, optionId: string) => {
    const { data } = await api.post<Poll>(`/polls/${pollId}/vote`, { optionId });
    return data;
  },

  // Admin
  getAllAdmin: async () => {
    const { data } = await api.get<Poll[]>('/admin/polls');
    return data;
  },

  create: async (payload: CreatePollPayload) => {
    const { data } = await api.post<Poll>('/admin/polls', payload);
    return data;
  },

  update: async (id: string, payload: UpdatePollPayload) => {
    const { data } = await api.put<Poll>(`/admin/polls/${id}`, payload);
    return data;
  },

  toggleActive: async (id: string) => {
    const { data } = await api.patch<Poll>(`/admin/polls/${id}/toggle-active`);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/admin/polls/${id}`);
  },
};

