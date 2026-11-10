'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  Match,
  MatchEvent,
  MatchEventType,
  MatchEventFormData,
  MatchLiveDetails,
} from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export interface UseAdminMatchNarratorProps {
  matchId: string;
}

export const useAdminMatchNarrator = ({ matchId }: UseAdminMatchNarratorProps) => {
  const [liveDetails, setLiveDetails] = useState<MatchLiveDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Modal de Lançamento de Lance
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activeEventType, setActiveEventType] = useState<MatchEventType | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Modal de Exclusão de Lance
  const [eventToDelete, setEventToDelete] = useState<MatchEvent | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

  // Cronômetro dinâmico em segundos
  const [elapsedDisplayMinute, setElapsedDisplayMinute] = useState<number>(0);
  const inFlightRef = useRef(false);

  // Carregar dados completos da partida e lances
  const loadLiveDetails = useCallback(async () => {
    if (!matchId) return;
    try {
      const data = await matchesService.adminGetLiveDetails(matchId);
      setLiveDetails(data);
    } catch (err) {
      console.error('Erro ao carregar minuto a minuto:', err);
      toast.error('Não foi possível carregar os dados ao vivo da partida.');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadLiveDetails();
  }, [loadLiveDetails]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents(['match-live-' + matchId, 'matches'], () => {
    loadLiveDetails();
  });

  // Cálculo e atualização contínua do cronômetro quando a bola estiver rolando
  useEffect(() => {
    if (!liveDetails) return;

    const { isTimerRunning, timerStartedAt, currentPeriod } = liveDetails;

    if (!isTimerRunning || !timerStartedAt) {
      // Se estiver parado no intervalo ou pré-jogo
      if (currentPeriod === 'HALF_TIME') {
        setElapsedDisplayMinute(45);
      } else if (currentPeriod === 'FINISHED') {
        setElapsedDisplayMinute(90);
      } else {
        setElapsedDisplayMinute(0);
      }
      return;
    }

    const interval = setInterval(() => {
      const started = new Date(timerStartedAt).getTime();
      const now = Date.now();
      const diffSecs = Math.max(0, Math.floor((now - started) / 1000));
      const diffMins = Math.floor(diffSecs / 60);

      if (currentPeriod === 'SECOND_HALF') {
        setElapsedDisplayMinute(45 + diffMins);
      } else {
        setElapsedDisplayMinute(diffMins);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [liveDetails]);

  // Executar Ação de Ciclo de Partida
  const handleExecuteAction = async (action: string) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsActionLoading(true);

    try {
      const updated = await matchesService.adminExecuteLiveAction(matchId, action);
      setLiveDetails(updated);
      toast.success('Status da partida atualizado!');
    } catch (err) {
      console.error('Erro ao executar ação de partida:', err);
      toast.error('Erro ao atualizar status da partida.');
    } finally {
      inFlightRef.current = false;
      setIsActionLoading(false);
    }
  };

  // Abrir Modal de Lançamento de Lance
  const handleOpenAddEvent = (type: MatchEventType) => {
    setActiveEventType(type);
    setIsEventModalOpen(true);
  };

  const handleCloseAddEvent = () => {
    setIsEventModalOpen(false);
    setActiveEventType(null);
  };

  // Submeter novo lance
  const handleSubmitEvent = async (data: MatchEventFormData) => {
    setIsSavingEvent(true);
    try {
      await matchesService.adminAddMatchEvent(matchId, data);
      toast.success('Lance registrado com sucesso!');
      await loadLiveDetails();
    } catch (err) {
      console.error('Erro ao registrar lance:', err);
      toast.error('Erro ao salvar lance.');
      throw err;
    } finally {
      setIsSavingEvent(false);
    }
  };

  // Excluir lance
  const handleConfirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeletingEvent(true);
    try {
      await matchesService.adminDeleteMatchEvent(eventToDelete.id);
      toast.success('Lance removido com sucesso!');
      setEventToDelete(null);
      await loadLiveDetails();
    } catch (err) {
      console.error('Erro ao excluir lance:', err);
      toast.error('Erro ao excluir lance.');
    } finally {
      setIsDeletingEvent(false);
    }
  };

  return {
    match: liveDetails?.match || null,
    events: liveDetails?.events || [],
    currentPeriod: liveDetails?.currentPeriod || 'PRE_MATCH',
    currentMinute: liveDetails?.currentMinute || '0\'',
    isTimerRunning: Boolean(liveDetails?.isTimerRunning),
    elapsedDisplayMinute,
    isLoading,
    isActionLoading,
    // Modal de Lance
    isEventModalOpen,
    activeEventType,
    isSavingEvent,
    handleOpenAddEvent,
    handleCloseAddEvent,
    handleSubmitEvent,
    // Exclusão
    eventToDelete,
    setEventToDelete,
    isDeletingEvent,
    handleConfirmDeleteEvent,
    // Ações de Partida
    handleExecuteAction,
    loadLiveDetails,
  };
};

