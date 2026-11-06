'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  footballService,
  YouthPortalConfig,
} from '@/features/football/services/football.service';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';

export const useYouthHub = () => {
  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);

  const [youthConfig, setYouthConfig] = useState<YouthPortalConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);

  const loadYouthNews = useCallback(async () => {
    try {
      setIsLoadingNews(true);
      const res = await newsService.getNews({ limit: 12, isYouth: true });
      const articles = res.data || [];

      const filtered = articles.filter((art) => {
        const catName =
          typeof art.category === 'object' && art.category
            ? art.category.name?.toLowerCase() || ''
            : '';
        const hasBaseCategory = catName.includes('base') || catName.includes('formação');
        const hasBaseTag = (art.tags || []).some((t) => t.toLowerCase().includes('base'));
        return art.isYouth || hasBaseCategory || hasBaseTag;
      });

      setNews(filtered.length > 0 ? filtered.slice(0, 4) : articles.slice(0, 4));
    } catch (err) {
      console.error('[useYouthHub] Erro ao carregar notícias da base:', err);
      setNews([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  const loadYouthConfig = useCallback(async () => {
    try {
      setIsLoadingConfig(true);
      const data = await footballService.getYouthPortalConfig();
      setYouthConfig(data);
    } catch (err) {
      console.error('[useYouthHub] Erro ao carregar configurações da base:', err);
      setYouthConfig(null);
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    loadYouthNews();
    loadYouthConfig();
  }, [loadYouthNews, loadYouthConfig]);

  return {
    news,
    isLoadingNews,
    youthConfig,
    isLoadingConfig,
  };
};
