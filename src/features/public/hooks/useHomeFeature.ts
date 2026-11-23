'use client';

import { useCallback, useEffect, useState } from 'react';
import { newsService } from '@/features/news/services/news.service';
import type { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';
import { Match, matchesService } from '@/features/matches';
import { logNonNetworkWarning } from '@/shared/utils';

export const useHomeFeature = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsArticleData[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticleData[]>([]);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHomeData = useCallback(async () => {
    try {
      const [featuredResult, feedResult, nextMatchData] = await Promise.allSettled([
        newsService.getFeaturedNews(3),
        newsService.getNews({ limit: 6 }),
        matchesService.publicGetNextMatch(),
      ]);

      if (nextMatchData.status === 'fulfilled') {
        setNextMatch(nextMatchData.value);
      }

      const featuredArticles =
        featuredResult.status === 'fulfilled' && Array.isArray(featuredResult.value)
          ? featuredResult.value
          : [];

      const feedArticles =
        feedResult.status === 'fulfilled' && Array.isArray(feedResult.value?.data)
          ? feedResult.value.data
          : [];

      setFeaturedNews(featuredArticles);

      const featuredSlugs = new Set(featuredArticles.map((f) => f.slug).filter(Boolean));
      const filteredLatest = feedArticles
        .filter((a) => a?.slug && !featuredSlugs.has(a.slug))
        .slice(0, 3);

      setLatestNews(filteredLatest);
    } catch (err) {
      logNonNetworkWarning('Nenhuma notícia carregada para a Home:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  useRealtimeEvents('news', () => {
    loadHomeData();
  });

  useRealtimeEvents('matches', () => {
    loadHomeData();
  });

  return {
    featuredNews,
    latestNews,
    nextMatch,
    isLoading,
  };
};

