import { api } from '@/services/api';
import { GlobalSearchResponse } from '../types/search.types';

export const searchService = {
  async searchGlobal(query: string, limit = 5, signal?: AbortSignal): Promise<GlobalSearchResponse> {
    const response = await api.get<GlobalSearchResponse>('/search', {
      params: { q: query, limit },
      signal,
    });
    return response.data;
  },
};

