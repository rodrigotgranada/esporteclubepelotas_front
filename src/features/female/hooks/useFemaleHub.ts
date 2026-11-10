'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRealtimeEvents } from '@/shared/hooks';
import {
  footballService,
  SquadData,
} from '@/features/football/services/football.service';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';

export const useFemaleHub = () => {
  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);

  const [currentSquad, setCurrentSquad] = useState<SquadData | null>(null);
  const [isLoadingSquad, setIsLoadingSquad] = useState<boolean>(true);

  const loadFemaleNews = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) {
        setIsLoadingNews(true);
      }
      const res = await newsService.getNews({ limit: 12, isFemale: true });
      const articles = res.data || [];

      const filtered = articles.filter((art) => {
        const catName =
          typeof art.category === 'object' && art.category
            ? art.category.name?.toLowerCase() || ''
            : '';
        const hasFemaleCategory = catName.includes('fem') || catName.includes('loba');
        const hasFemaleTag = (art.tags || []).some((t) => t.toLowerCase().includes('fem') || t.toLowerCase().includes('loba'));
        return art.isFemale || hasFemaleCategory || hasFemaleTag;
      });

      setNews(filtered.length > 0 ? filtered.slice(0, 4) : articles.slice(0, 4));
    } catch (err) {
      console.warn('[useFemaleHub] Falha temporária ao carregar notícias do feminino:', err);
      if (!opts?.silent) {
        setNews([]);
      }
    } finally {
      if (!opts?.silent) {
        setIsLoadingNews(false);
      }
    }
  }, []);

  const loadCurrentSquad = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) {
        setIsLoadingSquad(true);
      }
      const squad = await footballService.getCurrentSquad('FEMININE');
      setCurrentSquad(squad);
    } catch (err) {
      console.warn('[useFemaleHub] Erro ao carregar elenco feminino atual:', err);
      if (!opts?.silent) {
        setCurrentSquad(null);
      }
    } finally {
      if (!opts?.silent) {
        setIsLoadingSquad(false);
      }
    }
  }, []);

  useEffect(() => {
    loadFemaleNews();
    loadCurrentSquad();
  }, [loadFemaleNews, loadCurrentSquad]);

  useRealtimeEvents('news', () => {
    loadFemaleNews({ silent: true });
  });

  return {
    news,
    isLoadingNews,
    currentSquad,
    isLoadingSquad,
    reloadNews: () => loadFemaleNews({ silent: false }),
    reloadSquad: () => loadCurrentSquad({ silent: false }),
  };
};
