import { api } from '@/services/api';
import { NewsArticleData, NewsCategoryData, GetAdminNewsResponse } from '@/features/admin/services/admin-news.service';

export type GetPublicNewsResponse = GetAdminNewsResponse;

export interface NewsCommentData {
  _id: string;
  id?: string;
  content: string;
  createdAt: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    avatarUrl?: string;
    role: string;
  };
}

export interface NewsPrevNextData {
  previous: {
    title: string;
    slug: string;
    coverImage: string;
    publishedAt: string;
  } | null;
  next: {
    title: string;
    slug: string;
    coverImage: string;
    publishedAt: string;
  } | null;
}

export const newsService = {
  getNews: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
    isFeatured?: boolean;
    featuredSlot?: 'MAIN' | 'SECONDARY' | 'NONE';
    isPinned?: boolean;
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

  getPrevNext: async (slug: string): Promise<NewsPrevNextData> => {
    const response = await api.get(`/news/${slug}/prev-next`);
    return response.data;
  },

  reactToNews: async (
    slug: string,
    type: 'wolf' | 'fire' | 'clap' | 'heart',
  ): Promise<{ reactions: { wolf: number; fire: number; clap: number; heart: number } }> => {
    const response = await api.post(`/news/${slug}/reactions`, { type });
    return response.data;
  },

  getComments: async (slug: string): Promise<NewsCommentData[]> => {
    const response = await api.get(`/news/${slug}/comments`);
    return response.data;
  },

  addComment: async (slug: string, content: string): Promise<NewsCommentData> => {
    const response = await api.post(`/news/${slug}/comments`, { content });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/news/comments/${commentId}`);
    return response.data;
  },
};

