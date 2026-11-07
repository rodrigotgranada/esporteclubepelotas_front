'use client';

import { useState, useEffect, useCallback } from 'react';
import { idolsService, IdolData } from '../services/idols.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useIdolsList = (initialCategory: string = '') => {
  const [idols, setIdols] = useState<IdolData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [isModuleActive, setIsModuleActive] = useState(true);

  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState('');

  const loadIdols = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setIsLoading(true);
        }
        const params: any = {
          page,
          limit,
        };
        if (category) params.category = category;
        if (search.trim()) params.search = search.trim();

        const res = await idolsService.getIdols(params);
        setIdols(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setIsModuleActive(res.isModuleActive !== false);
      } catch (err) {
        console.error('Erro ao buscar ídolos:', err);
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [page, limit, category, search],
  );

  useEffect(() => {
    loadIdols();
  }, [loadIdols]);

  useRealtimeEvents(['idols', 'system-modules'], () => {
    loadIdols({ silent: true });
  });

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  return {
    idols,
    total,
    page,
    totalPages,
    isLoading,
    isModuleActive,
    category,
    setCategory: handleCategoryChange,
    search,
    setSearch: handleSearchChange,
    setPage,
  };
};
