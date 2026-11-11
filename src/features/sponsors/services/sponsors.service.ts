import { api } from '@/services/api';
import { Sponsor } from '../types/sponsors.types';

export const sponsorsService = {
  /**
   * Retorna os patrocinadores ativos e em vigência contratual ordenada.
   * Suporta filtragem por escopo (MAIN = Home/Geral, YOUTH = Categorias de Base, FEMALE = Futebol Feminino).
   */
  getActiveSponsors: async (scope?: 'MAIN' | 'YOUTH' | 'FEMALE'): Promise<Sponsor[]> => {
    const params = scope ? { scope } : {};
    const response = await api.get<Sponsor[]>('/sponsors', { params });
    return response.data;
  },

  /**
   * Retorna os patrocinadores com destaque ativo (para o ticker da Home ou hubs).
   */
  getFeaturedSponsors: async (scope?: 'MAIN' | 'YOUTH' | 'FEMALE'): Promise<Sponsor[]> => {
    const params = scope ? { scope } : {};
    const response = await api.get<Sponsor[]>('/sponsors/featured', { params });
    return response.data;
  },

  /**
   * Incrementa contagem de cliques do patrocinador.
   */
  trackSponsorClick: async (id: string): Promise<{ clicksCount: number }> => {
    const response = await api.post<{ clicksCount: number }>(`/sponsors/${id}/click`);
    return response.data;
  },
};

