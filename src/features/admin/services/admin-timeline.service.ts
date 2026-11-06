import { api } from '@/services/api';
import { TimelineEventData, TimelineCategory } from '@/features/timeline/services/timeline.service';

export interface QueryTimelineAdminParams {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
  category?: TimelineCategory;
  isHighlighted?: boolean;
  isActive?: boolean;
}

export interface GetAdminTimelineResponse {
  data: TimelineEventData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTimelineEventInput {
  year: number;
  title: string;
  description: string;
  category: TimelineCategory;
  imageUrl?: string;
  dateFormatted?: string;
  displayOrder?: number;
  isHighlighted?: boolean;
  isActive?: boolean;
}

export interface UpdateTimelineEventInput {
  year?: number;
  title?: string;
  description?: string;
  category?: TimelineCategory;
  imageUrl?: string;
  dateFormatted?: string;
  displayOrder?: number;
  isHighlighted?: boolean;
  isActive?: boolean;
}

export const adminTimelineService = {
  getEvents: async (params?: QueryTimelineAdminParams): Promise<GetAdminTimelineResponse> => {
    const response = await api.get('/timeline/admin', { params });
    return response.data;
  },

  getEventById: async (id: string): Promise<TimelineEventData> => {
    const response = await api.get(`/timeline/admin/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateTimelineEventInput, photoFile?: File): Promise<TimelineEventData> => {
    if (photoFile) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('photo', photoFile);
      const response = await api.post('/timeline/admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await api.post('/timeline/admin', data);
    return response.data;
  },

  updateEvent: async (
    id: string,
    data: UpdateTimelineEventInput,
    photoFile?: File
  ): Promise<TimelineEventData> => {
    if (photoFile) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('photo', photoFile);
      const response = await api.patch(`/timeline/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await api.patch(`/timeline/admin/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/timeline/admin/${id}`);
  },
};
