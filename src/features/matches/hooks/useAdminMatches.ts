'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Championship, Match, MatchStatus } from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { MATCHES_CONSTANTS } from '../constants/matches.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export type AdminMatchesTab = 'matches' | 'championships';

export const useAdminMatches = () => {
  const [activeTab, setActiveTab] = useState<AdminMatchesTab>('matches');
  const [matches, setMatches] = useState<Match[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros de Partidas
  const [matchSearch, setMatchSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedChampionshipFilter, setSelectedChampionshipFilter] = useState<string>('ALL');

  // Filtros de Campeonatos
  const [champSearch, setChampSearch] = useState('');

  // Drawers
  const [isMatchDrawerOpen, setIsMatchDrawerOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [isChampionshipDrawerOpen, setIsChampionshipDrawerOpen] = useState(false);
  const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null);

  // Exclusão
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [champToDelete, setChampToDelete] = useState<Championship | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregamento de dados
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [matchesData, championshipsData] = await Promise.all([
        matchesService.adminGetMatches(),
        matchesService.adminGetChampionships(),
      ]);
      setMatches(matchesData);
      setChampionships(championshipsData);
    } catch (err) {
      console.error('Erro ao carregar dados administrativos de partidas:', err);
      toast.error(MATCHES_CONSTANTS.ADMIN.TOASTS.LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Atualização em tempo real via WebSocket
  useRealtimeEvents('matches', () => {
    loadData();
  });

  // Ações de Partida
  const handleOpenCreateMatch = useCallback(() => {
    setSelectedMatch(null);
    setIsMatchDrawerOpen(true);
  }, []);

  const handleOpenEditMatch = useCallback((match: Match) => {
    setSelectedMatch(match);
    setIsMatchDrawerOpen(true);
  }, []);

  const handleCloseMatchDrawer = useCallback(() => {
    setIsMatchDrawerOpen(false);
    setSelectedMatch(null);
  }, []);

  const handleOpenDeleteMatch = useCallback((match: Match) => {
    setMatchToDelete(match);
  }, []);

  const handleCloseDeleteMatch = useCallback(() => {
    setMatchToDelete(null);
  }, []);

  const handleConfirmDeleteMatch = useCallback(async () => {
    if (!matchToDelete) return;
    try {
      setIsDeleting(true);
      await matchesService.adminDeleteMatch(matchToDelete.id);
      toast.success(MATCHES_CONSTANTS.ADMIN.TOASTS.MATCH_DELETED);
      setMatchToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir partida:', err);
      toast.error(MATCHES_CONSTANTS.ADMIN.TOASTS.SAVE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  }, [matchToDelete, loadData]);

  // Ações de Campeonato
  const handleOpenCreateChampionship = useCallback(() => {
    setSelectedChampionship(null);
    setIsChampionshipDrawerOpen(true);
  }, []);

  const handleOpenEditChampionship = useCallback((championship: Championship) => {
    setSelectedChampionship(championship);
    setIsChampionshipDrawerOpen(true);
  }, []);

  const handleCloseChampionshipDrawer = useCallback(() => {
    setIsChampionshipDrawerOpen(false);
    setSelectedChampionship(null);
  }, []);

  const handleOpenDeleteChampionship = useCallback((championship: Championship) => {
    setChampToDelete(championship);
  }, []);

  const handleCloseDeleteChampionship = useCallback(() => {
    setChampToDelete(null);
  }, []);

  const handleConfirmDeleteChampionship = useCallback(async () => {
    if (!champToDelete) return;
    try {
      setIsDeleting(true);
      await matchesService.adminDeleteChampionship(champToDelete.id);
      toast.success(MATCHES_CONSTANTS.ADMIN.TOASTS.CHAMPIONSHIP_DELETED);
      setChampToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Erro ao excluir campeonato:', err);
      toast.error(MATCHES_CONSTANTS.ADMIN.TOASTS.SAVE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  }, [champToDelete, loadData]);

  // Filtragem de Partidas
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchText = `${match.opponentName} ${match.stadiumName} ${match.roundName} ${match.championshipName || ''}`.toLowerCase();
      const matchesSearch = matchText.includes(matchSearch.toLowerCase().trim());
      const matchesStatus = statusFilter === 'ALL' || match.status === statusFilter;
      const matchesChampionship =
        selectedChampionshipFilter === 'ALL' || match.championshipId === selectedChampionshipFilter;
      return matchesSearch && matchesStatus && matchesChampionship;
    });
  }, [matches, matchSearch, statusFilter, selectedChampionshipFilter]);

  // Filtragem de Campeonatos
  const filteredChampionships = useMemo(() => {
    return championships.filter((champ) => {
      const champText = `${champ.name} ${champ.seasonYear}`.toLowerCase();
      return champText.includes(champSearch.toLowerCase().trim());
    });
  }, [championships, champSearch]);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    // Partidas
    filteredMatches,
    championships,
    matchSearch,
    setMatchSearch,
    statusFilter,
    setStatusFilter,
    selectedChampionshipFilter,
    setSelectedChampionshipFilter,
    isMatchDrawerOpen,
    selectedMatch,
    handleOpenCreateMatch,
    handleOpenEditMatch,
    handleCloseMatchDrawer,
    matchToDelete,
    handleOpenDeleteMatch,
    handleCloseDeleteMatch,
    handleConfirmDeleteMatch,
    // Campeonatos
    filteredChampionships,
    champSearch,
    setChampSearch,
    isChampionshipDrawerOpen,
    selectedChampionship,
    handleOpenCreateChampionship,
    handleOpenEditChampionship,
    handleCloseChampionshipDrawer,
    champToDelete,
    handleOpenDeleteChampionship,
    handleCloseDeleteChampionship,
    handleConfirmDeleteChampionship,
    isDeleting,
    refetch: loadData,
  };
};
