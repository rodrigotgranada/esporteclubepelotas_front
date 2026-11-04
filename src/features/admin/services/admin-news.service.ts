import { api } from '@/services/api';

export interface NewsCategoryData {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order?: number;
}

export interface NewsAuthorData {
  _id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email?: string;
}

export type NewsStatusType = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

export interface NewsArticleData {
  _id: string;
  id?: string;
  title: string;
  subtitle?: string;
  slug: string;
  previousSlugs?: string[];
  _redirectTo?: string;
  coverImage: string;
  coverCaption?: string;
  content: Record<string, any>;
  summary?: string;
  category: NewsCategoryData | string;
  tags: string[];
  status: NewsStatusType;
  isFeatured: boolean;
  featuredSlot?: 'MAIN' | 'SECONDARY' | 'NONE';
  isPinned?: boolean;
  reporterName?: string;
  photographerName?: string;
  author: NewsAuthorData | string;
  publishedAt?: string;
  gallery?: string[];
  youtubeVideoUrl?: string;
  viewsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminNewsResponse {
  data: NewsArticleData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminNewsService = {
  getNews: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    isFeatured?: boolean;
  }): Promise<GetAdminNewsResponse> => {
    const response = await api.get('/news/admin', { params });
    return response.data;
  },

  getNewsById: async (id: string): Promise<NewsArticleData> => {
    const response = await api.get(`/news/admin/${id}`);
    return response.data;
  },

  createNews: async (data: Partial<NewsArticleData>): Promise<NewsArticleData> => {
    const response = await api.post('/news/admin', data);
    return response.data;
  },

  updateNews: async (id: string, data: Partial<NewsArticleData>): Promise<NewsArticleData> => {
    const response = await api.patch(`/news/admin/${id}`, data);
    return response.data;
  },

  deleteNews: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/news/admin/${id}`);
    return response.data;
  },

  uploadCover: async (id: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post(`/news/admin/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadContentImage: async (file: File | Blob): Promise<{ url: string }> => {
    const formData = new FormData();
    const uploadFile =
      file instanceof File
        ? file
        : new File([file], `content-${Date.now()}.png`, { type: file.type || 'image/png' });
    formData.append('image', uploadFile);
    const response = await api.post('/news/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadGallery: async (id: string, files: File[]): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach(f => formData.append('gallery', f));
    const response = await api.post(`/news/admin/${id}/gallery`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCategories: async (): Promise<NewsCategoryData[]> => {
    const response = await api.get('/news/admin/categories');
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<NewsCategoryData> => {
    const response = await api.post('/news/admin/categories', data);
    return response.data;
  },
};

