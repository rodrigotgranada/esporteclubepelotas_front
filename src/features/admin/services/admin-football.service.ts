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
    athleteType?: 'PROFESSIONAL' | 'YOUTH';
  }): Promise<GetAthletesResponse> => {
    const response = await api.get('/athletes/admin', { params });
    return response.data;
  },

  getAthleteById: async (id: string): Promise<AthleteData> => {
    const response = await api.get(`/athletes/admin/${id}`);
    return response.data;
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
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/athletes/admin/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // --- Elencos / Temporadas ---
  getSquads: async (params?: {
    page?: number;
    limit?: number;
    year?: number;
    category?: string;
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
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/squads/admin/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
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
