'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useRealtimeEvents } from '@/shared/hooks';
import {
  adminNewsService,
  NewsArticleData,
  NewsCategoryData,
} from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';

export const useAdminNewsList = (options?: { fixedIsYouth?: boolean }) => {
  const fixedIsYouth = options?.fixedIsYouth;
  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [categories, setCategories] = useState<NewsCategoryData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<string>('ALL');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticleData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await adminNewsService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }, []);

  const loadNews = useCallback(
    async (opts?: { silent?: boolean }) => {
      try {
        if (!opts?.silent) {
          setIsLoading(true);
        }
        const params: any = {
          page,
          limit,
        };

        if (search.trim()) params.search = search.trim();
        if (categoryFilter) params.category = categoryFilter;
        if (statusFilter) params.status = statusFilter;
        if (featuredFilter === 'YES') params.isFeatured = true;
        if (featuredFilter === 'NO') params.isFeatured = false;
        if (typeof fixedIsYouth === 'boolean') params.isYouth = fixedIsYouth;

        const res = await adminNewsService.getNews(params);
        setNews(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages || Math.ceil(res.total / limit) || 1);
      } catch (err) {
        console.error(err);
        if (!opts?.silent) {
          toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
        }
      } finally {
        if (!opts?.silent) {
          setIsLoading(false);
        }
      }
    },
    [page, limit, search, categoryFilter, statusFilter, featuredFilter, fixedIsYouth],
  );

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Sincronização em tempo real via WebSocket quando matérias forem criadas, editadas, publicadas ou removidas
  useRealtimeEvents('news', () => {
    loadNews({ silent: true });
  });

  // Drawer controls
  const openCreateDrawer = () => {
    setSelectedArticleId(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (id: string) => {
    setSelectedArticleId(id);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedArticleId(null);
  };

  const handleDrawerSuccess = () => {
    closeDrawer();
    loadNews({ silent: true });
    loadCategories();
  };

  // Delete modal controls
  const openDeleteModal = (article: NewsArticleData) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      setIsDeleting(true);
      await adminNewsService.deleteNews(articleToDelete._id || articleToDelete.id || '');
      toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_DELETE);
      closeDeleteModal();
      await loadNews({ silent: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC;
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Duplicate modal state
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [articleToDuplicate, setArticleToDuplicate] = useState<NewsArticleData | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const openDuplicateModal = (article: NewsArticleData) => {
    setArticleToDuplicate(article);
    setDuplicateModalOpen(true);
  };

  const closeDuplicateModal = () => {
    setDuplicateModalOpen(false);
    setArticleToDuplicate(null);
  };

  const confirmDuplicate = async () => {
    if (!articleToDuplicate) return;
    try {
      setIsDuplicating(true);
      await adminNewsService.duplicateNews(articleToDuplicate._id || articleToDuplicate.id || '');
      toast.success(ADMIN_NEWS_TEXTS.DRAWER.SUCCESS_DUPLICATE);
      closeDuplicateModal();
      await loadNews({ silent: true });
    } catch {
      toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
    } finally {
      setIsDuplicating(false);
    }
  };

  return {
    news,
    categories,
    total,
    page,
    totalPages,
    isLoading,
    setPage,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    featuredFilter,
    setFeaturedFilter,
    loadNews,
    loadCategories,
    // Drawer
    drawerOpen,
    selectedArticleId,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleDrawerSuccess,
    // Delete
    deleteModalOpen,
    articleToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    // Duplicate
    duplicateModalOpen,
    articleToDuplicate,
    isDuplicating,
    openDuplicateModal,
    closeDuplicateModal,
    confirmDuplicate,
  };
};
