'use client';

import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/news.service';
import {
  NewsArticleData,
  NewsCategoryData,
} from '@/features/admin/services/admin-news.service';

export const useNewsFeed = () => {
  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<NewsArticleData[]>([]);
  const [categories, setCategories] = useState<NewsCategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const loadNews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await newsService.getNews({
        page,
        limit: 9,
        category: selectedCategory || undefined,
        search: search.trim() || undefined,
      });

      setNews(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages || Math.ceil(res.total / 9) || 1);
    } catch (err) {
      console.error('Failed to load news feed', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCategory, search]);

  useEffect(() => {
    loadCategories();
    loadFeatured();
  }, [loadCategories, loadFeatured]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
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
