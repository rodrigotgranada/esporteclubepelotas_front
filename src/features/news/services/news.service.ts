import { api } from '@/services/api';
import { NewsArticleData, NewsCategoryData, GetAdminNewsResponse } from '@/features/admin/services/admin-news.service';

export type GetPublicNewsResponse = GetAdminNewsResponse;

export const newsService = {
  getNews: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
    isFeatured?: boolean;
  }): Promise<GetPublicNewsResponse> => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getFeaturedNews: async (limit = 4): Promise<NewsArticleData[]> => {
    const response = await api.get('/news/featured', { params: { limit } });
    return response.data;
  },

  getCategories: async (): Promise<NewsCategoryData[]> => {
    const response = await api.get('/news/categories');
    return response.data;
  },

  getNewsBySlug: async (slug: string): Promise<NewsArticleData> => {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  },
};

