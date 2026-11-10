import { api } from '@/services/api';

export type PreferredFoot = 'RIGHT' | 'LEFT' | 'BOTH';

export type AthleteGender = 'MALE' | 'FEMALE';
export type AthleteType = 'PROFESSIONAL' | 'YOUTH' | 'STAFF';

export type SquadCategory =
  | 'PROFESSIONAL'
  | 'FEMININE'
  | 'SUB_20'
  | 'SUB_17'
  | 'SUB_15';

export type SquadSector =
  | 'GOALKEEPER'
  | 'DEFENDER'
  | 'MIDFIELDER'
  | 'FORWARD'
  | 'STAFF';

export type SquadMemberRole =
  | 'STARTER'
  | 'SUBSTITUTE'
  | 'CAPTAIN'
  | 'INJURED';

export interface AthleteSeasonHistory {
  squadId: string;
  year: number;
  category: SquadCategory;
  seasonName: string;
  jerseyNumber?: number | null;
  sector?: SquadSector | null;
  role?: SquadMemberRole;
}

export interface AthleteData {
  _id: string;
  id: string;
  name: string;
  nickname?: string | null;
  slug: string;
  photoUrl?: string | null;
  gender?: AthleteGender;
  athleteType?: AthleteType;
  youthCategory?: string | null;
  entryYear?: number | null;
  staffRole?: string | null;
  birthDate?: string | null;
  age?: number | null;
  birthPlace?: string | null;
  height?: number | null;
  weight?: number | null;
  preferredFoot?: PreferredFoot | null;
  primaryPosition: string;
  secondaryPositions: string[];
  pastClubs: string[];
  biography?: string | null;
  instagram?: string | null;
  isActive: boolean;
  isRetired?: boolean;
  seasons?: AthleteSeasonHistory[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SquadMemberData {
  athleteId: string;
  athlete?: AthleteData | null;
  jerseyNumber?: number | null;
  sector: SquadSector;
  role: SquadMemberRole;
  order: number;
}

export interface SquadStaffData {
  role: string;
  name: string;
}

export interface SquadData {
  _id: string;
  id: string;
  championshipId?: string | null;
  coachId?: string | null;
  coachPhotoUrl?: string | null;
  year: number;
  category: SquadCategory;
  seasonName: string;
  coachName?: string | null;
  staff: SquadStaffData[];
  coverUrl?: string | null;
  isCurrent: boolean;
  members: SquadMemberData[];
  sectors?: {
    goalkeepers: SquadMemberData[];
    defenders: SquadMemberData[];
    midfielders: SquadMemberData[];
    forwards: SquadMemberData[];
    staff?: SquadMemberData[];
  };
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface GetSquadsResponse {
  data: SquadData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isModuleActive: boolean;
}

export interface SeasonsFilterResponse {
  years: number[];
  categories: string[];
  categoriesByYear?: Record<number, SquadCategory[]>;
  isModuleActive: boolean;
}

export interface GetAthletesResponse {
  data: AthleteData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isModuleActive: boolean;
}

export interface YouthPillarItem {
  title: string;
  description: string;
}

export interface YouthPortalConfig {
  pillars: YouthPillarItem[];
  peneirasCriteria: string[];
  contactTitle?: string | null;
  contactDescription?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export const footballService = {
  getSeasons: async (): Promise<SeasonsFilterResponse> => {
    const response = await api.get('/squads/seasons');
    return response.data;
  },

  getSquads: async (params?: {
    page?: number;
    limit?: number;
    year?: number;
    category?: SquadCategory;
    isCurrent?: boolean;
  }): Promise<GetSquadsResponse> => {
    const response = await api.get('/squads', { params });
    return response.data;
  },

  getSquadById: async (id: string): Promise<SquadData> => {
    const response = await api.get(`/squads/id/${id}`);
    return response.data;
  },

  getCurrentSquad: async (category = 'PROFESSIONAL'): Promise<SquadData | null> => {
    const response = await api.get('/squads/current', { params: { category } });
    return response.data;
  },

  getByYearAndCategory: async (
    year: number,
    category = 'PROFESSIONAL',
  ): Promise<SquadData> => {
    const response = await api.get(`/squads/${year}/${category}`);
    return response.data;
  },

  getYouthPortalConfig: async (): Promise<YouthPortalConfig> => {
    const response = await api.get('/squads/youth-config');
    return response.data;
  },

  getAthletes: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    position?: string;
    athleteType?: AthleteType;
    gender?: AthleteGender;
  }): Promise<GetAthletesResponse> => {
    const response = await api.get('/athletes', { params });
    return response.data;
  },

  getAthleteBySlug: async (slug: string): Promise<AthleteData> => {
    const response = await api.get(`/athletes/${slug}`);
    return response.data;
  },
};
