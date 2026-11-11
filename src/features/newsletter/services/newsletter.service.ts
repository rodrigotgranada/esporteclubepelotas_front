import { api } from '@/services/api';
import { NewsletterSubscriber, SubscribeNewsletterPayload } from '../types/newsletter.types';

export const newsletterService = {
  subscribe: async (payload: SubscribeNewsletterPayload) => {
    const { data } = await api.post<NewsletterSubscriber>('/newsletter/subscribe', payload);
    return data;
  },

  getAdminSubscribers: async (page = 1, limit = 20) => {
    const { data } = await api.get<{
      content: NewsletterSubscriber[];
      totalElements: number;
      totalPages: number;
    }>('/admin/newsletter/subscribers', { params: { page, limit } });
    return data;
  },

  getAllSubscribersForExport: async () => {
    const { data } = await api.get<NewsletterSubscriber[]>('/admin/newsletter/subscribers/all');
    return data;
  },

  deleteSubscriber: async (id: string) => {
    await api.delete(`/admin/newsletter/subscribers/${id}`);
  },
};

