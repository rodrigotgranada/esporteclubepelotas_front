import { api } from '@/services/api';

export type IdolCategory = 'PLAYER' | 'COACH' | 'STAFF' | 'FAN';

export interface IdolGalleryItem {
  url: string;
  caption?: string;
}

export interface IdolPeriod {
  startYear: number;
  endYear?: number | null;
  label?: string;
}

export interface IdolData {
  _id: string;
  id: string;
  name: string;
  nickname?: string;
  slug: string;
  category: IdolCategory;
  photoUrl?: string;
  gallery?: string[];
  galleryItems?: IdolGalleryItem[];
  startYear: number;
  endYear?: number | null;
  periods?: IdolPeriod[];
  isActiveInClub?: boolean;
  birthDate?: string | null;
  deathDate?: string | null;
  birthPlace?: string;
  quote?: string;
  biography: string;
  playerStats?: {
    position?: string;
    preferredFoot?: string;
    historicJerseyNumber?: number | null;
    matchesCount?: number;
    goalsCount?: number;
    titles?: string[];
    memorableMatch?: string;
  } | null;
  coachStats?: {
    matchesCount?: number;
    winsCount?: number;
    drawsCount?: number;
    lossesCount?: number;
    titles?: string[];
    tacticalStyle?: string;
  } | null;
  staffStats?: {
    roleName?: string;
    yearsOfDedication?: string;
    backstageStory?: string;
  } | null;
  fanStats?: {
    stadiumSector?: string;
    trademark?: string;
  } | null;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetIdolsResponse {
  data: IdolData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isModuleActive: boolean;
}

export const idolsService = {
  getIdols: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isFeatured?: boolean;
  }): Promise<GetIdolsResponse> => {
    const response = await api.get('/idols', { params });
    return response.data;
  },

  getIdolBySlug: async (slug: string): Promise<IdolData> => {
    const response = await api.get(`/idols/${slug}`);
    return response.data;
  },

  getPrevNext: async (
    slug: string,
  ): Promise<{ previous: IdolData | null; next: IdolData | null }> => {
    const response = await api.get(`/idols/${slug}/prev-next`);
    return response.data;
  },

  getFeaturedIdols: async (limit = 4): Promise<IdolData[]> => {
    const response = await api.get('/idols/featured', { params: { limit } });
    return response.data;
  },
};
