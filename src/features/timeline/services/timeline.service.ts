import { api } from '@/services/api';

export interface TimelineCategoryData {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  eventsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineEventData {
  id: string;
  _id?: string;
  year: number;
  title: string;
  description: string;
  categoryId?: string | null;
  category: string;
  categoryName?: string;
  categoryIcon?: string;
  imageUrl?: string | null;
  eventDate?: string | null;
  dateFormatted?: string | null;
  displayOrder: number;
  isHighlighted: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTimelineResponse {
  data: TimelineEventData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const timelineService = {
  getTimeline: async (): Promise<GetTimelineResponse> => {
    try {
      const response = await api.get('/timeline', { timeout: 45000 });
      return response.data;
    } catch (err: any) {
      // Se for timeout de cold start do Render, tenta uma segunda vez com timeout ampliado
      if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        try {
          const retryRes = await api.get('/timeline', { timeout: 45000 });
          return retryRes.data;
        } catch {
          // Continua para o throw tratado
        }
      }
      throw err;
    }
  },

  getCategories: async (): Promise<TimelineCategoryData[]> => {
    const response = await api.get('/timeline/categories', { timeout: 30000 });
    return response.data;
  },
};
