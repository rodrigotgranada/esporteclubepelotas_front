'use client';

import { useState, useEffect, useCallback } from 'react';
import { MatchLiveDetails } from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export interface UsePublicMatchLiveProps {
  slugOrId: string;
}

export const usePublicMatchLive = ({ slugOrId }: UsePublicMatchLiveProps) => {
  const [liveDetails, setLiveDetails] = useState<MatchLiveDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedDisplayMinute, setElapsedDisplayMinute] = useState<number>(0);

  const loadLiveDetails = useCallback(async () => {
    if (!slugOrId) return;
    try {
      const data = await matchesService.publicGetLiveDetails(slugOrId);
      setLiveDetails(data);
    } catch (err) {
      console.error('Erro ao carregar detalhes ao vivo da partida:', err);
    } finally {
      setIsLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    loadLiveDetails();
  }, [loadLiveDetails]);

  // WebSocket: escuta eventos deste jogo e mudanças globais de partidas
  useRealtimeEvents(
    liveDetails?.match?.id
      ? ['match-live-' + liveDetails.match.id, 'matches']
      : ['matches'],
    () => {
      loadLiveDetails();
    }
  );

  // Cronômetro dinâmico quando a partida estiver rolando
  useEffect(() => {
    if (!liveDetails) return;

    const { isTimerRunning, timerStartedAt, currentPeriod } = liveDetails;

    if (!isTimerRunning || !timerStartedAt) {
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

  return {
    liveDetails,
    match: liveDetails?.match || null,
    events: liveDetails?.events || [],
    currentPeriod: liveDetails?.currentPeriod || 'PRE_MATCH',
    isTimerRunning: Boolean(liveDetails?.isTimerRunning),
    elapsedDisplayMinute,
    isLoading,
    reload: loadLiveDetails,
  };
};

