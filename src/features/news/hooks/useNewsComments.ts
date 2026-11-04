'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PUBLIC_NEWS_TEXTS } from '../constants/news.constants';
import { newsService, NewsCommentData } from '../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';

export const useNewsComments = (slug: string) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<NewsCommentData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isUserActive = Boolean(user && user.status === 'ACTIVE' && user.isActive !== false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setPage(1);

    newsService
      .getComments(slug, 1, 10)
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res?.data) ? res.data : [];
          setComments(list);
          setTotal(res?.total ?? list.length);
          setHasMore(Boolean(res?.hasMore));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const res = await newsService.getComments(slug, nextPage, 10);
      const nextList = Array.isArray(res?.data) ? res.data : [];

      setComments((prev) => [...prev, ...nextList]);
      setPage(nextPage);
      setTotal(res?.total ?? (comments.length + nextList.length));
      setHasMore(Boolean(res?.hasMore));
    } catch {
      toast.error('Erro ao carregar mais comentários.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(PUBLIC_NEWS_TEXTS.COMMENTS_LOGIN_TITLE);
      return;
    }

    if (!isUserActive) {
      toast.error(PUBLIC_NEWS_TEXTS.COMMENTS_INACTIVE_ALERT);
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);
      const created = await newsService.addComment(slug, trimmed);
      setComments((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);
      setNewComment('');
      toast.success(PUBLIC_NEWS_TEXTS.COMMENTS_POST_SUCCESS);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao publicar comentário.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
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

  return {
    user,
    isUserActive,
    comments,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    newComment,
    setNewComment,
    isSubmitting,
    deletingId,
    handleSubmit,
    handleDelete,
    handleLoadMore,
  };
};
