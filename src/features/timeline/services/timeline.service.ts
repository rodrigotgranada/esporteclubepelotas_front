import { api } from '@/services/api';

export type TimelineCategory = 'FOUNDATION' | 'TITLE' | 'STADIUM' | 'MILESTONE' | 'GLORY';

export interface TimelineEventData {
  id: string;
  _id?: string;
  year: number;
  title: string;
  description: string;
  category: TimelineCategory;
  imageUrl?: string | null;
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
    const response = await api.get('/timeline');
    return response.data;
  },
};
