'use client';

import { useState, useEffect, useCallback } from 'react';
import { stadiumService } from '../services/stadium.service';
import { StadiumData } from '../types/stadium.types';
import { FALLBACK_STADIUM_DATA } from '../constants/stadium.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useStadium = () => {
  const [stadium, setStadium] = useState<StadiumData | null>(FALLBACK_STADIUM_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStadium = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setIsLoading(true);
      setError(null);
      const data = await stadiumService.getStadiumInfo();
      setStadium(data);
    } catch (err: unknown) {
      console.warn(
        '[useStadium] Usando memorial padrão da Boca do Lobo enquanto o servidor sincroniza:',
        err
      );
      // Mantém a experiência ininterrupta para o usuário usando os dados oficiais da Boca do Lobo
      setStadium((prev) => prev || FALLBACK_STADIUM_DATA);
    } finally {
      if (!opts?.silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStadium();
  }, [fetchStadium]);

  // Sincronização em tempo real quando o Admin salvar alterações no estádio
  useRealtimeEvents('stadium', () => {
    fetchStadium({ silent: true });
  });

  return {
    stadium,
    isLoading,
    error,
    refresh: () => fetchStadium({ silent: false }),
  };
};
