import { api } from '@/services/api';
import { uploadMedia } from '@/shared/services/media-upload.service';
import { OpponentClub, OpponentClubFormData } from '../types/opponents.types';

export const opponentsService = {
  /**
   * Público: Listar todos os clubes adversários cadastrados
   */
  async publicGetOpponents(query?: string): Promise<OpponentClub[]> {
    const params = query ? { query } : undefined;
    const response = await api.get<OpponentClub[]>('/opponents/public', { params });
    return response.data || [];
  },

  /**
   * Admin: Listar todos os clubes adversários
   */
  async adminGetOpponents(query?: string): Promise<OpponentClub[]> {
    const params = query ? { query } : undefined;
    const response = await api.get<OpponentClub[]>('/opponents/admin', { params });
    return response.data || [];
  },

  /**
   * Admin: Obter clube por ID
   */
  async adminGetOpponentById(id: string): Promise<OpponentClub> {
    const response = await api.get<OpponentClub>(`/opponents/admin/${id}`);
    return response.data;
  },

  /**
   * Admin: Cadastrar novo clube adversário
   */
  async adminCreateOpponent(data: OpponentClubFormData): Promise<OpponentClub> {
    const response = await api.post<OpponentClub>('/opponents/admin', data);
    return response.data;
  },

  /**
   * Admin: Atualizar clube adversário
   */
  async adminUpdateOpponent(id: string, data: OpponentClubFormData): Promise<OpponentClub> {
    const response = await api.put<OpponentClub>(`/opponents/admin/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Excluir clube adversário (soft delete)
   */
  async adminDeleteOpponent(id: string): Promise<void> {
    await api.delete(`/opponents/admin/${id}`);
  },

  /**
   * Admin: Upload de distintivo oficial do clube (1:1)
   */
  async adminUploadBadge(file: File | Blob): Promise<string> {
    const res = await uploadMedia(file, {
      endpoint: '/opponents/admin/upload',
      folder: 'clubs',
    });
    return res.url;
  },
};

