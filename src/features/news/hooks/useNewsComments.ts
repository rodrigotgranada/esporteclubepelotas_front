'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PUBLIC_NEWS_TEXTS } from '../constants/news.constants';
import { newsService, NewsCommentData } from '../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';

export const useNewsComments = (slug: string) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<NewsCommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isUserActive = Boolean(user && user.status === 'ACTIVE' && user.isActive !== false);

  useEffect(() => {
    let isMounted = true;
    newsService
      .getComments(slug)
      .then((data) => {
        if (isMounted) {
          setComments(Array.isArray(data) ? data : []);
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
    isLoading,
    newComment,
    setNewComment,
    isSubmitting,
    deletingId,
    handleSubmit,
    handleDelete,
  };
};
