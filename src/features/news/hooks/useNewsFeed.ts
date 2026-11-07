'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { newsService } from '../services/news.service';
import {
  NewsArticleData,
  NewsCategoryData,
} from '@/features/admin/services/admin-news.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useNewsFeed = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTag = searchParams?.get('tag') || '';

  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticleData[]>([]);
  const [categories, setCategories] = useState<NewsCategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const urlTag = searchParams?.get('tag') || '';
    setSelectedTag(urlTag);
  }, [searchParams]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await newsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load news categories', err);
    }
  }, []);

  const loadFeatured = useCallback(async () => {
    try {
      const data = await newsService.getFeaturedNews(3);
      setFeaturedArticles(data);
    } catch (err) {
      console.error('Failed to load featured news', err);
    }
  }, []);

  const loadNews = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setIsLoading(true);
        }
        const cleanTag = selectedTag.trim().replace(/^#/, '');
        const res = await newsService.getNews({
          page,
          limit: 9,
          category: selectedCategory || undefined,
          tag: cleanTag || undefined,
          search: search.trim() || undefined,
        });

        setNews(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || Math.ceil((res.total || 0) / 9) || 1);
      } catch (err) {
        console.error('Failed to load news feed', err);
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [page, selectedCategory, selectedTag, search],
  );

  useEffect(() => {
    loadCategories();
    loadFeatured();
  }, [loadCategories, loadFeatured]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useRealtimeEvents('news', () => {
    loadNews({ silent: true });
    loadFeatured();
  });

  useRealtimeEvents('news-categories', () => {
    loadCategories();
  });

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  const handleTagSelect = (tag: string) => {
    const cleanTag = tag.trim().replace(/^#/, '');
    setSelectedTag(cleanTag);
    setPage(1);
    if (cleanTag) {
      router.push(`/noticias?tag=${encodeURIComponent(cleanTag)}`);
    } else {
      router.push('/noticias');
    }
  };

  const clearTag = () => {
    handleTagSelect('');
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  return {
    news,
    featuredArticles,
    categories,
    selectedCategory,
    setSelectedCategory: handleCategorySelect,
    selectedTag,
    setSelectedTag: handleTagSelect,
    clearTag,
    search,
    setSearch: handleSearchChange,
    page,
    setPage,
    totalPages,
    total,
    isLoading,
    refreshFeed: loadNews,
  };
};
