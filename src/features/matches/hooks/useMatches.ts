'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Championship, Match } from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useMatches = () => {
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais: Próximo jogo, Campeonatos e Partidas
  const loadMatchesData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [nextMatchData, championshipsData] = await Promise.all([
        matchesService.publicGetNextMatch(),
        matchesService.publicGetChampionships(),
      ]);

      setNextMatch(nextMatchData);
      setChampionships(championshipsData);

      // Se houver campeonatos e nenhum selecionado, seleciona o primeiro
      const defaultChampId =
        selectedChampionshipId ||
        (championshipsData.length > 0 ? championshipsData[0].id : undefined);

      if (defaultChampId) {
        setSelectedChampionshipId(defaultChampId);
      }

      const matchesData = await matchesService.publicGetMatches(defaultChampId);
      setMatches(matchesData);
    } catch (err) {
      console.error('Erro ao carregar dados de partidas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChampionshipId]);

  useEffect(() => {
    loadMatchesData();
  }, [loadMatchesData]);

  // Atualização em tempo real via WebSocket
  useRealtimeEvents('matches', () => {
    loadMatchesData();
  });

  // Troca de campeonato selecionado
  const handleSelectChampionship = useCallback(async (champId: string | null) => {
    setSelectedChampionshipId(champId);
    try {
      setIsLoading(true);
      const data = await matchesService.publicGetMatches(champId || undefined);
      setMatches(data);
    } catch (err) {
      console.error('Erro ao filtrar partidas por campeonato:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Campeonato atualmente selecionado
  const selectedChampionship = useMemo(() => {
    if (!selectedChampionshipId) {
      return championships[0] || null;
    }
    return championships.find((c) => c.id === selectedChampionshipId) || null;
  }, [championships, selectedChampionshipId]);

  // Partidas anteriores (finalizadas) ordenadas da mais recente para a mais antiga
  const pastMatches = useMemo(() => {
    return matches
      .filter((m) => m.status === 'FINISHED')
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
  }, [matches]);

  // Próximas partidas (agendadas, ao vivo ou adiadas) ordenadas da mais próxima no tempo para frente
  const upcomingMatches = useMemo(() => {
    return matches
      .filter((m) => m.status !== 'FINISHED')
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
  }, [matches]);

  return {
    nextMatch,
    championships,
    selectedChampionship,
    selectedChampionshipId,
    matches,
    pastMatches,
    upcomingMatches,
    isLoading,
    handleSelectChampionship,
    refetch: loadMatchesData,
  };
};
