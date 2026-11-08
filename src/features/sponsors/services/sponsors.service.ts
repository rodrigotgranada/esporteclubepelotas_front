import { api } from '@/services/api';
import { Sponsor } from '../types/sponsors.types';

export const sponsorsService = {
  /**
   * Retorna os patrocinadores ativos e em vigência contratual ordenada.
   */
  getActiveSponsors: async (): Promise<Sponsor[]> => {
    const response = await api.get<Sponsor[]>('/sponsors');
    return response.data;
  },

  /**
   * Retorna os patrocinadores com destaque ativo (para o ticker da Home).
   */
  getFeaturedSponsors: async (): Promise<Sponsor[]> => {
    const response = await api.get<Sponsor[]>('/sponsors/featured');
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

