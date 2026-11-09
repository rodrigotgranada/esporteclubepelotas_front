import { api } from '@/services/api';
import { uploadMedia } from '@/shared/services/media-upload.service';
import { ClubAnthem, ClubAnthemFormData } from '../types/anthem.types';

export const anthemService = {
  /**
   * Consulta pública do hino oficial ativo
   */
  async getOfficialAnthem(): Promise<ClubAnthem | null> {
    try {
      const response = await api.get<ClubAnthem>('/anthem');
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Lista todas as versões ativas públicas
   */
  async getPublicVersions(): Promise<ClubAnthem[]> {
    try {
      const response = await api.get<ClubAnthem[]>('/anthem/versions');
      return response.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Admin: Listar todas as versões (inclusive inativas)
   */
  async adminGetAll(): Promise<ClubAnthem[]> {
    const response = await api.get<ClubAnthem[]>('/admin/anthem');
    return response.data || [];
  },

  /**
   * Admin: Obter por ID
   */
  async adminGetById(id: string): Promise<ClubAnthem> {
    const response = await api.get<ClubAnthem>(`/admin/anthem/${id}`);
    return response.data;
  },

  /**
   * Admin: Cadastrar nova versão
   */
  async adminCreate(data: ClubAnthemFormData): Promise<ClubAnthem> {
    const response = await api.post<ClubAnthem>('/admin/anthem', data);
    return response.data;
  },

  /**
   * Admin: Atualizar versão existente
   */
  async adminUpdate(id: string, data: ClubAnthemFormData): Promise<ClubAnthem> {
    const response = await api.put<ClubAnthem>(`/admin/anthem/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Definir versão como oficial
   */
  async adminSetOfficial(id: string): Promise<ClubAnthem> {
    const response = await api.patch<ClubAnthem>(`/admin/anthem/${id}/official`);
    return response.data;
  },

  /**
   * Admin: Excluir versão (soft-delete)
   */
  async adminDelete(id: string): Promise<void> {
    await api.delete(`/admin/anthem/${id}`);
  },

  /**
   * Upload de arquivo de áudio via serviço central
   */
  async uploadAudio(file: File): Promise<{ url: string }> {
    return uploadMedia(file, {
      endpoint: '/admin/anthem/upload-audio',
      legacyFieldName: 'audio',
      prefix: 'hino-audio',
    });
  },

  /**
   * Upload de imagem de capa via serviço central
   */
  async uploadCover(file: File): Promise<{ url: string }> {
    return uploadMedia(file, {
      endpoint: '/admin/anthem/upload-cover',
      legacyFieldName: 'cover',
      prefix: 'hino-capa',
    });
  },
};

