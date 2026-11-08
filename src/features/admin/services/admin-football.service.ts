import { uploadMedia } from '@/shared/services/media-upload.service';
import { api } from '@/services/api';
import {
  AthleteData,
  GetAthletesResponse,
  SquadData,
  YouthPortalConfig,
} from '@/features/football/services/football.service';

export interface GetAdminSquadsResponse {
  data: SquadData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminFootballService = {
  // --- Atletas ---
  getAthletes: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    position?: string;
    isActive?: boolean;
    isRetired?: boolean;
    gender?: 'MALE' | 'FEMALE';
    athleteType?: 'PROFESSIONAL' | 'YOUTH' | 'STAFF';
    scope?: 'PROFESSIONAL' | 'YOUTH';
  }): Promise<GetAthletesResponse> => {
    const response = await api.get('/athletes/admin', { params });
    return response.data;
  },

  getAthleteById: async (id: string): Promise<AthleteData> => {
    const response = await api.get(`/athletes/admin/${id}`);
    return response.data;
  },

  uploadAthletePhotoMedia: async (
    file: File,
    folderId?: string,
  ): Promise<{ url: string; photoUrl: string }> => {
    const res = await uploadMedia(file, {
      endpoint: '/athletes/admin/upload-photo',
      folderId,
      folder: 'athletes',
    });
    return { url: res.url, photoUrl: res.url };
  },

  createAthlete: async (data: Partial<AthleteData>): Promise<AthleteData> => {
    const response = await api.post('/athletes/admin', data);
    return response.data;
  },

  updateAthlete: async (
    id: string,
    data: Partial<AthleteData>,
  ): Promise<AthleteData> => {
    const response = await api.patch(`/athletes/admin/${id}`, data);
    return response.data;
  },

  deleteAthlete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/athletes/admin/${id}`);
    return response.data;
  },

  uploadAthletePhoto: async (
    id: string,
    file: File,
  ): Promise<{ photoUrl: string }> => {
    const res = await uploadMedia(file, {
      endpoint: `/athletes/admin/${id}/photo`,
      folder: 'athletes',
    });
    return { photoUrl: res.url };
  },

  // --- Elencos / Temporadas ---
  getSquads: async (params?: {
    page?: number;
    limit?: number;
    year?: number;
    category?: string;
    scope?: 'PROFESSIONAL' | 'YOUTH';
    search?: string;
    isCurrent?: boolean;
  }): Promise<GetAdminSquadsResponse> => {
    const response = await api.get('/squads/admin', { params });
    return response.data;
  },

  getSquadById: async (id: string): Promise<SquadData> => {
    const response = await api.get(`/squads/admin/${id}`);
    return response.data;
  },

  uploadSquadCoverMedia: async (
    file: File,
    folderId?: string,
  ): Promise<{ url: string; coverUrl: string }> => {
    const res = await uploadMedia(file, {
      endpoint: '/squads/admin/upload-cover',
      folderId,
      folder: 'squads',
    });
    return { url: res.url, coverUrl: res.url };
  },

  createSquad: async (data: Partial<SquadData>): Promise<SquadData> => {
    const response = await api.post('/squads/admin', data);
    return response.data;
  },

  updateSquad: async (
    id: string,
    data: Partial<SquadData>,
  ): Promise<SquadData> => {
    const response = await api.patch(`/squads/admin/${id}`, data);
    return response.data;
  },

  deleteSquad: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/squads/admin/${id}`);
    return response.data;
  },

  setSquadMembers: async (
    squadId: string,
    members: Array<{
      athleteId: string;
      jerseyNumber?: number | null;
      sector: string;
      role?: string;
      order?: number;
    }>,
  ): Promise<SquadData> => {
    const response = await api.put(`/squads/admin/${squadId}/members`, { members });
    return response.data;
  },

  uploadSquadCover: async (
    id: string,
    file: File,
  ): Promise<{ coverUrl: string }> => {
    const res = await uploadMedia(file, {
      endpoint: `/squads/admin/${id}/cover`,
      folder: 'squads',
    });
    return { coverUrl: res.url };
  },

  // --- Portal da Base (/base) ---
  getYouthPortalConfig: async (): Promise<YouthPortalConfig> => {
    const response = await api.get('/squads/admin/youth-config');
    return response.data;
  },

  updateYouthPortalConfig: async (
    data: YouthPortalConfig,
  ): Promise<YouthPortalConfig> => {
    const response = await api.put('/squads/admin/youth-config', data);
    return response.data;
  },
};
