'use client';

import { useState, useEffect, useCallback } from 'react';
import { idolsService, IdolData } from '../services/idols.service';

export const useIdolDetail = (slug: string) => {
  const [idol, setIdol] = useState<IdolData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadIdol = useCallback(async () => {
    if (!slug) return;
    try {
      setIsLoading(true);
      setNotFound(false);
      const data = await idolsService.getIdolBySlug(slug);
      setIdol(data);
    } catch (err: any) {
      console.error('Erro ao buscar ídolo por slug:', err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadIdol();
  }, [loadIdol]);

  return {
    idol,
    isLoading,
    notFound,
    reload: loadIdol,
  };
};
