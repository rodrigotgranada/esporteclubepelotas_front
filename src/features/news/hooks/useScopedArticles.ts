'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { newsService } from '@/features/news/services/news.service';
import type { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export type NewsArticleScope = 'female' | 'youth';

const SCOPE_CONFIG: Record<
  NewsArticleScope,
  {
    limit: number;
    queryFlag: 'isFemale' | 'isYouth';
    keywords: string[];
    errorLabel: string;
  }
> = {
  female: {
    limit: 40,
    queryFlag: 'isFemale',
    keywords: ['fem', 'loba'],
    errorLabel: 'Erro ao carregar matérias das Lobas:',
  },
  youth: {
    limit: 30,
    queryFlag: 'isYouth',
    keywords: ['base', 'formação'],
    errorLabel: 'Erro ao carregar matérias da base:',
  },
};

export const useScopedArticles = (scope: NewsArticleScope) => {
  const [articles, setArticles] = useState<NewsArticleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const config = SCOPE_CONFIG[scope];

  const loadArticles = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setIsLoading(true);
        }
        const res = await newsService.getNews({
          [config.queryFlag]: true,
          limit: config.limit,
        });
        const rawList = res.data || [];

        const filtered = rawList.filter((art) => {
          const catName =
            typeof art.category === 'object' && art.category
              ? art.category.name?.toLowerCase() || ''
              : '';
          const hasMatchingCategory = config.keywords.some((kw) => catName.includes(kw));
          const hasMatchingTag = (art.tags || []).some((t) =>
            config.keywords.some((kw) => t.toLowerCase().includes(kw))
          );
          const hasScopeFlag = scope === 'female' ? Boolean(art.isFemale) : Boolean(art.isYouth);
          return hasScopeFlag || hasMatchingCategory || hasMatchingTag;
        });

        setArticles(filtered.length > 0 ? filtered : rawList);
      } catch (err) {
        console.warn(config.errorLabel, err);
        if (!options?.silent) {
          setArticles([]);
        }
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [config, scope]
  );

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useRealtimeEvents('news', () => {
    loadArticles({ silent: true });
  });

  const displayedArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return articles;
    return articles.filter((a) => {
      const titleMatch = a.title?.toLowerCase().includes(term);
      const summaryMatch = a.summary?.toLowerCase().includes(term);
      return Boolean(titleMatch || summaryMatch);
    });
  }, [articles, search]);

  return {
    articles,
    displayedArticles,
    isLoading,
    search,
    setSearch,
  };
};

