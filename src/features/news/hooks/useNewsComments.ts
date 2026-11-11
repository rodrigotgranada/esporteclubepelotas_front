'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { PUBLIC_NEWS_TEXTS } from '../constants/news.constants';
import { newsService, NewsCommentData } from '../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';
import { commentSchema, CommentFormData } from '../schemas/comment.schema';

export const useNewsComments = (slug: string) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<NewsCommentData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reportingComment, setReportingComment] = useState<NewsCommentData | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const inFlightRef = useRef(false);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const isUserActive = Boolean(
    user && user.status === 'ACTIVE' && user.isActive !== false,
  );

  const loadInitialComments = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setIsLoading(true);
        }
        const res = await newsService.getComments(slug, 1, 10);
        const list = Array.isArray(res?.data) ? res.data : [];
        setComments(list);
        setPage(1);
        setTotal(res?.total ?? list.length);
        setHasMore(Boolean(res?.hasMore));
      } catch {
        // Silencioso em background
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [slug],
  );

  useEffect(() => {
    loadInitialComments();
  }, [loadInitialComments]);

  useRealtimeEvents('news-comments', (event) => {
    if (!event.entityId || event.entityId === slug) {
      loadInitialComments({ silent: true });
    }
  });

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await newsService.getComments(slug, nextPage, 10);
      const nextList = Array.isArray(res?.data) ? res.data : [];

      setComments((prev) => [...prev, ...nextList]);
      setPage(nextPage);
      setTotal(res?.total ?? comments.length + nextList.length);
      setHasMore(Boolean(res?.hasMore));
    } catch {
      toast.error('Erro ao carregar mais comentários.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = form.handleSubmit(async (data: CommentFormData) => {
    if (!user) {
      toast.error(PUBLIC_NEWS_TEXTS.COMMENTS_LOGIN_TITLE);
      return;
    }

    if (!isUserActive) {
      toast.error(PUBLIC_NEWS_TEXTS.COMMENTS_INACTIVE_ALERT);
      return;
    }

    const trimmed = data.content.trim();
    if (!trimmed || inFlightRef.current || isSubmitting) return;

    inFlightRef.current = true;
    try {
      setIsSubmitting(true);
      const created = await newsService.addComment(slug, trimmed);
      setComments((prev) => {
        const createdId = created._id || created.id;
        if (createdId && prev.some((c) => (c._id || c.id) === createdId)) {
          return prev;
        }
        return [created, ...prev];
      });
      setTotal((prev) => prev + 1);
      form.reset({ content: '' });
      toast.success(PUBLIC_NEWS_TEXTS.COMMENTS_POST_SUCCESS);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao publicar comentário.';
      toast.error(msg);
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  });

  const handleDelete = async (commentId: string) => {
    if (deletingId) return;
    if (!window.confirm(PUBLIC_NEWS_TEXTS.COMMENTS_DELETE_CONFIRM)) return;

    try {
      setDeletingId(commentId);
      await newsService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => (c._id || c.id) !== commentId));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(PUBLIC_NEWS_TEXTS.COMMENTS_DELETE_SUCCESS);
    } catch {
      toast.error('Erro ao excluir comentário.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenReport = (comment: NewsCommentData) => {
    setReportingComment(comment);
    setReportReason('');
    setIsReportModalOpen(true);
  };

  const handleCloseReport = () => {
    setReportingComment(null);
    setReportReason('');
    setIsReportModalOpen(false);
  };

  const handleConfirmReport = async () => {
    if (!reportingComment || isReporting) return;
    const commentId = reportingComment._id || (reportingComment as any).id;
    if (!commentId) return;

    try {
      setIsReporting(true);
      await newsService.reportComment(commentId, reportReason.trim() || undefined);
      toast.success(PUBLIC_NEWS_TEXTS.COMMENTS_REPORT_SUCCESS);
      handleCloseReport();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || 'Erro ao registrar denúncia.');
    } finally {
      setIsReporting(false);
    }
  };

  return {
    form,
    user,
    isUserActive,
    comments,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    isSubmitting,
    deletingId,
    handleSubmit,
    handleDelete,
    handleLoadMore,
    reportingComment,
    isReportModalOpen,
    reportReason,
    setReportReason,
    isReporting,
    handleOpenReport,
    handleCloseReport,
    handleConfirmReport,
  };
};
