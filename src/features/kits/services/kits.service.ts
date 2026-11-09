import { api } from '@/services/api';
import { uploadMedia } from '@/shared/services/media-upload.service';
import {
  ClubKit,
  ClubKitCompetitionItem,
  ClubKitFormData,
} from '../types/kits.types';

export const kitsService = {
  /**
   * Público: Listar todos os mantos ativos
   */
  async publicGetAll(): Promise<ClubKit[]> {
    const response = await api.get<ClubKit[]>('/kits/public');
    return response.data || [];
  },

  /**
   * Público: Listar os mantos da temporada atual
   */
  async publicGetCurrent(): Promise<ClubKit[]> {
    const response = await api.get<ClubKit[]>('/kits/public/current');
    return response.data || [];
  },

  /**
   * Público: Listar competições que possuem mantos históricos
   */
  async publicGetCompetitions(): Promise<ClubKitCompetitionItem[]> {
    const response = await api.get<ClubKitCompetitionItem[]>('/kits/public/competitions');
    return response.data || [];
  },

  /**
   * Público: Listar mantos históricos (opcionalmente filtrados por competição)
   */
  async publicGetHistorical(competition?: string): Promise<ClubKit[]> {
    const params = competition ? { competition } : undefined;
    const response = await api.get<ClubKit[]>('/kits/public/historical', { params });
    return response.data || [];
  },

  /**
   * Público: Buscar manto por ID
   */
  async publicGetById(id: string): Promise<ClubKit> {
    const response = await api.get<ClubKit>(`/kits/public/${id}`);
    return response.data;
  },

  /**
   * Admin: Listar todos os mantos
   */
  async adminGetAll(): Promise<ClubKit[]> {
    const response = await api.get<ClubKit[]>('/kits/admin');
    return response.data || [];
  },

  /**
   * Admin: Obter manto por ID
   */
  async adminGetById(id: string): Promise<ClubKit> {
    const response = await api.get<ClubKit>(`/kits/admin/${id}`);
    return response.data;
  },

  /**
   * Admin: Criar manto
   */
  async adminCreate(data: ClubKitFormData): Promise<ClubKit> {
    const response = await api.post<ClubKit>('/kits/admin', data);
    return response.data;
  },

  /**
   * Admin: Atualizar manto
   */
  async adminUpdate(id: string, data: ClubKitFormData): Promise<ClubKit> {
    const response = await api.put<ClubKit>(`/kits/admin/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Alternar status de uniforme da temporada atual
   */
  async adminToggleCurrent(id: string): Promise<ClubKit> {
    const response = await api.patch<ClubKit>(`/kits/admin/${id}/current`);
    return response.data;
  },

  /**
   * Admin: Excluir manto (soft-delete)
   */
  async adminDelete(id: string): Promise<void> {
    await api.delete(`/kits/admin/${id}`);
  },

  /**
   * Admin: Upload de foto de manto via serviço canônico com "file"
   */
  async uploadKitImage(file: File | Blob): Promise<string> {
    const result = await uploadMedia(file, {
      endpoint: '/kits/admin/upload',
      prefix: 'kit',
    });
    return result.url;
  },
};

