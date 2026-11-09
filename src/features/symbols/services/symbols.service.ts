import { api } from '@/services/api';
import { uploadMedia } from '@/shared/services/media-upload.service';
import { ClubSymbol, ClubSymbolFormData, SymbolCategory } from '../types/symbols.types';

export const symbolsService = {
  /**
   * Público: Listar todos os símbolos ativos
   */
  async publicGetAll(): Promise<ClubSymbol[]> {
    const response = await api.get<ClubSymbol[]>('/symbols');
    return response.data || [];
  },

  /**
   * Público: Listar símbolos por categoria
   */
  async publicGetByCategory(category: SymbolCategory): Promise<ClubSymbol[]> {
    const response = await api.get<ClubSymbol[]>(`/symbols/category/${category}`);
    return response.data || [];
  },

  /**
   * Público: Obter símbolo oficial de uma categoria
   */
  async publicGetOfficial(category: SymbolCategory): Promise<ClubSymbol | null> {
    try {
      const response = await api.get<ClubSymbol>(`/symbols/category/${category}/official`);
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Admin: Listar todos os símbolos
   */
  async adminGetAll(): Promise<ClubSymbol[]> {
    const response = await api.get<ClubSymbol[]>('/admin/symbols');
    return response.data || [];
  },

  /**
   * Admin: Criar símbolo ou versão histórica
   */
  async adminCreate(data: ClubSymbolFormData): Promise<ClubSymbol> {
    const response = await api.post<ClubSymbol>('/admin/symbols', data);
    return response.data;
  },

  /**
   * Admin: Atualizar símbolo
   */
  async adminUpdate(id: string, data: ClubSymbolFormData): Promise<ClubSymbol> {
    const response = await api.put<ClubSymbol>(`/admin/symbols/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Definir símbolo como versão oficial da categoria
   */
  async adminSetOfficial(id: string): Promise<ClubSymbol> {
    const response = await api.patch<ClubSymbol>(`/admin/symbols/${id}/official`);
    return response.data;
  },

  /**
   * Admin: Excluir símbolo (soft-delete)
   */
  async adminDelete(id: string): Promise<void> {
    await api.delete(`/admin/symbols/${id}`);
  },

  /**
   * Upload de imagem principal ou item de galeria
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    return uploadMedia(file, {
      endpoint: '/admin/symbols/upload-image',
      legacyFieldName: 'image',
      prefix: 'symbol-img',
    });
  },
};
