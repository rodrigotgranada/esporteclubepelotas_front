'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useNewsArticle = (slug: string, initialArticle?: NewsArticleData | null) => {
  const [article, setArticle] = useState<NewsArticleData | null>(initialArticle ?? null);
  const [relatedNews, setRelatedNews] = useState<NewsArticleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(!initialArticle);
  const [error, setError] = useState<string | null>(null);

  const loadRelated = useCallback(
    async (currentArticle: NewsArticleData, isActiveRef: { current: boolean }) => {
      try {
        const recent = await newsService.getNews({ limit: 4 });
        if (isActiveRef.current) {
          setRelatedNews(
            recent.data
              .filter(
                (item) =>
                  (item.slug || item._id) !== slug &&
                  (item._id || item.id) !== (currentArticle._id || currentArticle.id)
              )
              .slice(0, 3)
          );
        }
      } catch (relatedErr) {
        console.error('Failed to load related news', relatedErr);
      }
    },
    [slug]
  );

  const refreshArticle = useCallback(async () => {
    if (!slug) return;
    try {
      const data = await newsService.getNewsBySlug(slug);
      setArticle(data);
    } catch {
      // ignore silent realtime refresh errors
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const isActiveRef = { current: true };

    if (initialArticle && (initialArticle.slug === slug || initialArticle._redirectTo)) {
      setArticle(initialArticle);
      setIsLoading(false);
      setError(null);
      loadRelated(initialArticle, isActiveRef);
      return () => {
        isActiveRef.current = false;
      };
    }

    setIsLoading(true);
    setError(null);

    newsService
      .getNewsBySlug(slug)
      .then(async (data) => {
        if (!isActiveRef.current) return;
        setArticle(data);
        await loadRelated(data, isActiveRef);
      })
      .catch((err) => {
        if (!isActiveRef.current) return;
        console.error('Failed to load article', err);
        setError('Matéria não encontrada ou indisponível.');
      })
      .finally(() => {
        if (isActiveRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      isActiveRef.current = false;
    };
  }, [slug, initialArticle, loadRelated]);

  useRealtimeEvents('news', () => {
    refreshArticle();
  });

  return {
    article,
    relatedNews,
    isLoading,
    error,
  };
};
