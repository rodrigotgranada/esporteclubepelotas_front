'use client';

import { useEffect, useState, useCallback } from 'react';
import { AthleteData, footballService } from '../services/football.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAthleteDetail = (slug?: string) => {
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAthlete = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      try {
        if (!options?.silent) {
          setIsLoading(true);
        }
        const data = await footballService.getAthleteBySlug(slug);
        setAthlete(data);
        setError(null);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Atleta não encontrado.';
        setError(message);
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [slug]
  );

  useEffect(() => {
    loadAthlete();
  }, [loadAthlete]);

  useRealtimeEvents('football', () => {
    loadAthlete({ silent: true });
  });

  return {
    athlete,
    isLoading,
    error,
  };
};

