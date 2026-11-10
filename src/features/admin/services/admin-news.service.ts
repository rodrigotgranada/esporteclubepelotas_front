import { api } from '@/services/api';
import { uploadMedia, uploadMultipleMedia } from '@/shared/services/media-upload.service';

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

export interface AdminCommentData {
  _id: string;
  id?: string;
  news: {
    _id: string;
    title: string;
    slug: string;
  };
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    role: string;
  };
  content: string;
  status: 'ACTIVE' | 'HIDDEN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminCommentsResponse {
  data: AdminCommentData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ShowcaseResponse {
  main: NewsArticleData | null;
  secondary: NewsArticleData[];
  available: NewsArticleData[];
}

export interface UpdateShowcaseDto {
  mainId: string | null;
  secondaryIds: string[];
}

export interface CurrentMainResponse {
  _id: string;
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  publishedAt?: string;
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
  showOnHomepage?: boolean;
  isYouth?: boolean;
  isFemale?: boolean;
  isPinned?: boolean;
  reporterName?: string;
  photographerName?: string;
  author: NewsAuthorData | string;
  publishedAt?: string;
  gallery?: string[];
  youtubeVideoUrl?: string;
  allowReactions?: boolean;
  allowComments?: boolean;
  reactions?: {
    wolf: number;
    fire: number;
    clap: number;
    heart: number;
  };
  lastEditedBy?: {
    firstName: string;
    lastName: string;
    email?: string;
  } | string;
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

export interface ScheduledNewsResponse {
  data: NewsArticleData[];
  total: number;
}

export const adminNewsService = {
  getNews: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    isFeatured?: boolean;
    isYouth?: boolean;
    isFemale?: boolean;
    showOnHomepage?: boolean;
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
    return uploadMedia(file, {
      endpoint: `/news/admin/${id}/cover`,
      legacyFieldName: 'cover',
      folder: 'news',
    });
  },

  uploadCoverMedia: async (file: File, folderId?: string): Promise<{ url: string }> => {
    return uploadMedia(file, {
      endpoint: '/news/admin/upload-cover',
      legacyFieldName: 'cover',
      folderId,
      folder: 'news',
    });
  },

  uploadGalleryMedia: async (files: File[], folderId?: string): Promise<{ urls: string[] }> => {
    const urls = await uploadMultipleMedia(files, {
      endpoint: '/news/admin/upload-gallery',
      legacyFieldName: 'gallery',
      folderId,
      folder: 'news',
    });
    return { urls };
  },

  uploadContentImage: async (file: File | Blob): Promise<{ url: string }> => {
    return uploadMedia(file, {
      endpoint: '/news/admin/upload-image',
      legacyFieldName: 'image',
      prefix: 'content',
      folder: 'news',
    });
  },

  uploadGallery: async (id: string, files: File[]): Promise<{ urls: string[] }> => {
    const urls = await uploadMultipleMedia(files, {
      endpoint: `/news/admin/${id}/gallery`,
      legacyFieldName: 'gallery',
      folder: 'news',
    });
    return { urls };
  },

  getCategories: async (): Promise<NewsCategoryData[]> => {
    const response = await api.get('/news/admin/categories');
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<NewsCategoryData> => {
    const response = await api.post('/news/admin/categories', data);
    return response.data;
  },

  duplicateNews: async (id: string): Promise<NewsArticleData> => {
    const response = await api.post(`/news/admin/${id}/duplicate`);
    return response.data;
  },

  getComments: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<GetAdminCommentsResponse> => {
    const response = await api.get('/news/admin/comments', { params });
    return response.data;
  },

  updateCommentStatus: async (
    commentId: string,
    status: 'ACTIVE' | 'HIDDEN',
  ): Promise<AdminCommentData> => {
    const response = await api.patch(`/news/admin/comments/${commentId}/status`, { status });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/news/admin/comments/${commentId}`);
    return response.data;
  },

  getShowcase: async (): Promise<ShowcaseResponse> => {
    const response = await api.get('/news/admin/showcase');
    return response.data;
  },

  updateShowcase: async (dto: UpdateShowcaseDto): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/news/admin/showcase', dto);
    return response.data;
  },

  getCurrentMain: async (): Promise<CurrentMainResponse | null> => {
    const response = await api.get('/news/admin/current-main');
    return response.data;
  },

  getScheduledNews: async (): Promise<ScheduledNewsResponse> => {
    const response = await api.get('/news/admin/scheduled');
    return response.data;
  },

  publishNow: async (id: string): Promise<{ data: NewsArticleData; message: string }> => {
    const response = await api.post(`/news/admin/${id}/publish-now`);
    return response.data;
  },
};

