'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useRealtimeEvents } from '@/shared/hooks';
import {
  adminNewsService,
  NewsArticleData,
} from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';

export const useAdminScheduled = (onArticleUpdated?: () => void) => {
  const [scheduledArticles, setScheduledArticles] = useState<NewsArticleData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Publicar Agora
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [articleToPublish, setArticleToPublish] = useState<NewsArticleData | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Modal Exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticleData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchScheduled = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) {
        setIsLoading(true);
      }
      const res = await adminNewsService.getScheduledNews();
      setScheduledArticles(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Erro ao carregar matérias agendadas:', err);
      if (!opts?.silent) {
        toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
      }
    } finally {
      if (!opts?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchScheduled();
  }, [fetchScheduled]);

  useRealtimeEvents('news', () => {
    fetchScheduled({ silent: true });
  });

  // Publicar Agora Handlers
  const openPublishModal = (article: NewsArticleData) => {
    setArticleToPublish(article);
    setPublishModalOpen(true);
  };

  const closePublishModal = () => {
    setPublishModalOpen(false);
    setArticleToPublish(null);
  };

  const confirmPublishNow = async () => {
    if (!articleToPublish) return;
    const id = articleToPublish._id || articleToPublish.id;
    if (!id) return;

    try {
      setIsPublishing(true);
      await adminNewsService.publishNow(id);
      toast.success(ADMIN_NEWS_TEXTS.SCHEDULED.TOAST_PUBLISH_SUCCESS);
      closePublishModal();
      await fetchScheduled({ silent: true });
      if (onArticleUpdated) {
        onArticleUpdated();
      }
    } catch (err: any) {
      console.error('Erro ao publicar matéria agendada:', err);
      toast.error(
        err?.response?.data?.message || ADMIN_NEWS_TEXTS.SCHEDULED.TOAST_PUBLISH_ERROR,
      );
    } finally {
      setIsPublishing(false);
    }
  };

  // Delete Handlers
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
    const id = articleToDelete._id || articleToDelete.id;
    if (!id) return;

    try {
      setIsDeleting(true);
      await adminNewsService.deleteNews(id);
      toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_DELETE);
      closeDeleteModal();
      await fetchScheduled({ silent: true });
      if (onArticleUpdated) {
        onArticleUpdated();
      }
    } catch (err: any) {
      console.error('Erro ao excluir matéria agendada:', err);
      toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_GENERIC);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatScheduledDate = (dateString?: string) => {
    if (!dateString) return 'Data não definida';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Data inválida';

    return d.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (dateString?: string) => {
    if (!dateString) return '';
    const target = new Date(dateString).getTime();
    const diff = target - Date.now();

    if (diff <= 0) return 'Entrando no ar agora...';

    const diffMinutes = Math.floor(diff / (1000 * 60));
    if (diffMinutes < 60) {
      return `Em ${diffMinutes} min`;
    }

    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const remMinutes = diffMinutes % 60;
    if (diffHours < 24) {
      return `Em ${diffHours}h ${remMinutes > 0 ? `${remMinutes}m` : ''}`.trim();
    }

    const diffDays = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;
    return `Em ${diffDays} dia(s)${remHours > 0 ? ` e ${remHours}h` : ''}`;
  };

  return {
    scheduledArticles,
    total,
    isLoading,
    fetchScheduled,
    // Publish Now
    publishModalOpen,
    articleToPublish,
    isPublishing,
    openPublishModal,
    closePublishModal,
    confirmPublishNow,
    // Delete
    deleteModalOpen,
    articleToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    // Formatters
    formatScheduledDate,
    getTimeRemaining,
  };
};
