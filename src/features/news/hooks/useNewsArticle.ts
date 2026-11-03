'use client';

import { useState, useEffect } from 'react';
import { newsService } from '../services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';

export const useNewsArticle = (slug: string) => {
  const [article, setArticle] = useState<NewsArticleData | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    newsService
      .getNewsBySlug(slug)
      .then(async (data) => {
        if (!isMounted) return;
        setArticle(data);

        // Fetch related/recent news (excluding current)
        try {
          const recent = await newsService.getNews({ limit: 4 });
          if (isMounted) {
            setRelatedNews(
              recent.data.filter(
                (item) => (item.slug || item._id) !== slug && (item._id || item.id) !== data._id
              ).slice(0, 3)
            );
          }
        } catch (relatedErr) {
          console.error('Failed to load related news', relatedErr);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load article', err);
        setError('Matéria não encontrada ou indisponível.');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    article,
    relatedNews,
    isLoading,
    error,
  };
};
