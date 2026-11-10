import { api } from '@/services/api';
import { uploadMedia } from '@/shared/services/media-upload.service';
import {
  Championship,
  ChampionshipFormData,
  Match,
  MatchFormData,
  MatchLiveDetails,
  MatchEvent,
  MatchEventFormData,
} from '../types/matches.types';

export const matchesService = {
  // ==========================================
  // PÚBLICO
  // ==========================================

  /**
   * Retorna a próxima partida agendada ou ao vivo com campeonato ativo para destaque na Home.
   * Retorna null se não houver partida.
   */
  async publicGetNextMatch(): Promise<Match | null> {
    try {
      const response = await api.get<Match | null>('/matches/public/next');
      return response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Retorna os campeonatos ativos da temporada atual
   */
  async publicGetChampionships(): Promise<Championship[]> {
    const response = await api.get<Championship[]>('/matches/public/championships');
    return response.data || [];
  },

  /**
   * Retorna as partidas do Pelotas (opcionalmente filtradas por campeonato)
   */
  async publicGetMatches(championshipId?: string): Promise<Match[]> {
    const params = championshipId ? { championshipId } : undefined;
    const response = await api.get<Match[]>('/matches/public', { params });
    return response.data || [];
  },

  /**
   * Retorna uma partida específica por ID
   */
  async publicGetMatchById(id: string): Promise<Match> {
    const response = await api.get<Match>(`/matches/public/${id}`);
    return response.data;
  },

  // ==========================================
  // ADMIN - PARTIDAS
  // ==========================================

  async adminGetMatches(championshipId?: string): Promise<Match[]> {
    const params = championshipId ? { championshipId } : undefined;
    const response = await api.get<Match[]>('/matches/admin', { params });
    return response.data || [];
  },

  async adminGetMatchById(id: string): Promise<Match> {
    const response = await api.get<Match>(`/matches/admin/${id}`);
    return response.data;
  },

  async adminCreateMatch(data: MatchFormData): Promise<Match> {
    const response = await api.post<Match>('/matches/admin', data);
    return response.data;
  },

  async adminUpdateMatch(id: string, data: MatchFormData): Promise<Match> {
    const response = await api.put<Match>(`/matches/admin/${id}`, data);
    return response.data;
  },

  async adminDeleteMatch(id: string): Promise<void> {
    await api.delete(`/matches/admin/${id}`);
  },

  async adminUploadMatchImage(file: File | Blob): Promise<string> {
    const res = await uploadMedia(file, {
      endpoint: '/matches/admin/upload',
      folder: 'matches',
    });
    return res.url;
  },

  // ==========================================
  // ADMIN - CAMPEONATOS
  // ==========================================

  async adminGetChampionships(): Promise<Championship[]> {
    const response = await api.get<Championship[]>('/championships/admin');
    return response.data || [];
  },

  async adminGetChampionshipById(id: string): Promise<Championship> {
    const response = await api.get<Championship>(`/championships/admin/${id}`);
    return response.data;
  },

  async adminCreateChampionship(data: ChampionshipFormData): Promise<Championship> {
    const response = await api.post<Championship>('/championships/admin', data);
    return response.data;
  },

  async adminUpdateChampionship(id: string, data: ChampionshipFormData): Promise<Championship> {
    const response = await api.put<Championship>(`/championships/admin/${id}`, data);
    return response.data;
  },

  async adminDeleteChampionship(id: string): Promise<void> {
    await api.delete(`/championships/admin/${id}`);
  },

  // ==========================================
  // MINUTO A MINUTO (AO VIVO)
  // ==========================================

  /**
   * Obtém os detalhes completos do lance a lance (público)
   */
  async publicGetLiveDetails(matchIdOrSlug: string): Promise<MatchLiveDetails> {
    const response = await api.get<MatchLiveDetails>(`/matches/public/${matchIdOrSlug}/live`);
    return response.data;
  },

  /**
   * Obtém os detalhes completos do lance a lance para o Painel do Narrador (admin)
   */
  async adminGetLiveDetails(matchId: string): Promise<MatchLiveDetails> {
    const response = await api.get<MatchLiveDetails>(`/matches/admin/${matchId}/live`);
    return response.data;
  },

  /**
   * Registra um novo lance na partida
   */
  async adminAddMatchEvent(matchId: string, data: MatchEventFormData): Promise<MatchEvent> {
    const response = await api.post<MatchEvent>(`/matches/admin/${matchId}/events`, data);
    return response.data;
  },

  /**
   * Exclui um lance da partida
   */
  async adminDeleteMatchEvent(eventId: string): Promise<void> {
    await api.delete(`/matches/admin/events/${eventId}`);
  },

  /**
   * Executa uma ação de ciclo de partida (iniciar 1T, intervalo, iniciar 2T, encerrar, atualizar tempo)
   */
  async adminExecuteLiveAction(
    matchId: string,
    action: string,
    data?: { minute?: number; period?: string; notes?: string }
  ): Promise<MatchLiveDetails> {
    const response = await api.post<MatchLiveDetails>(`/matches/admin/${matchId}/live/status`, {
      action,
      ...data,
    });
    return response.data;
  },
};
