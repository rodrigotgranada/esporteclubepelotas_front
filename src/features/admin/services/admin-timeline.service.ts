import { uploadMedia } from '@/shared/services/media-upload.service';
import { api } from '@/services/api';
import { TimelineEventData, TimelineCategoryData } from '@/features/timeline/services/timeline.service';

export interface QueryTimelineAdminParams {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
  category?: string;
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
  categoryId?: string | null;
  category?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  eventDate?: string | null;
  dateFormatted?: string | null;
  displayOrder?: number;
  isHighlighted?: boolean;
  isActive?: boolean;
}

export interface UpdateTimelineEventInput {
  year?: number;
  title?: string;
  description?: string;
  categoryId?: string | null;
  category?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  eventDate?: string | null;
  dateFormatted?: string | null;
  displayOrder?: number;
  isHighlighted?: boolean;
  isActive?: boolean;
}

export interface CreateTimelineCategoryInput {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateTimelineCategoryInput {
  name?: string;
  slug?: string;
  icon?: string;
  description?: string;
  displayOrder?: number;
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

  uploadPhotoMedia: async (file: File, folderId?: string): Promise<string> => {
    const res = await uploadMedia(file, {
      endpoint: '/timeline/admin/upload-photo',
      legacyFieldName: 'photo',
      folderId,
      folder: 'timeline',
    });
    return res.url;
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

  // Categorias de Marcos
  getCategories: async (): Promise<TimelineCategoryData[]> => {
    const response = await api.get('/timeline/admin/categories');
    return response.data;
  },

  createCategory: async (data: CreateTimelineCategoryInput): Promise<TimelineCategoryData> => {
    const response = await api.post('/timeline/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: UpdateTimelineCategoryInput): Promise<TimelineCategoryData> => {
    const response = await api.put(`/timeline/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/timeline/admin/categories/${id}`);
  },
};
