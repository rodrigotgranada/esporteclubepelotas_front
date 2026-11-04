'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Trash2, LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  SafeImage,
  Spinner,
} from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { newsService, NewsCommentData } from '../../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';

export interface NewsCommentsSectionProps {
  slug: string;
}

export const NewsCommentsSection: React.FC<NewsCommentsSectionProps> = ({ slug }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<NewsCommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.charAt(0) || 'T';
    const l = lastName?.charAt(0) || '';
    return (f + l).toUpperCase();
  };

  return (
    <LayoutContainer className="flex flex-col gap-6 pt-10 border-t border-border mt-8">
      {/* Cabeçalho da Seção de Comentários */}
      <LayoutContainer className="flex items-center justify-between">
        <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-primary" />
          {PUBLIC_NEWS_TEXTS.COMMENTS_TITLE(comments.length)}
        </Title>
      </LayoutContainer>

      {/* Formulário para Usuário Autenticado */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex items-center gap-2.5">
            {user.avatarUrl ? (
              <LayoutContainer className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                <SafeImage src={user.avatarUrl} alt={user.firstName} fill sizes="32px" className="object-cover" />
              </LayoutContainer>
            ) : (
              <LayoutContainer className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {getUserInitials(user.firstName, user.lastName)}
              </LayoutContainer>
            )}
            <Text className="text-xs font-bold text-text-primary">
              {user.firstName} {user.lastName}
            </Text>
            {user.role?.name && (
              <Badge variant="primary" size="sm" className="text-[10px] uppercase font-black">
                {user.role.name}
              </Badge>
            )}
          </LayoutContainer>

          <LayoutContainer className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={PUBLIC_NEWS_TEXTS.COMMENTS_INPUT_PLACEHOLDER}
              maxLength={1000}
              rows={3}
              disabled={isSubmitting}
              className="w-full p-3 text-sm bg-drawer text-text-primary rounded-xl border border-border focus:border-primary focus:outline-hidden transition-all resize-none"
            />
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between">
            <Text className="text-[11px] text-text-secondary">
              {newComment.length} / 1000
            </Text>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={!newComment.trim() || isSubmitting}
              rightIcon={<Send className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              {isSubmitting ? PUBLIC_NEWS_TEXTS.COMMENTS_SUBMITTING : PUBLIC_NEWS_TEXTS.COMMENTS_SUBMIT_BTN}
            </Button>
          </LayoutContainer>
        </form>
      ) : (
        /* Box Convidativo para Torcedores Não-Logados */
        <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <LayoutContainer className="flex flex-col gap-1">
            <Text className="text-sm font-bold text-text-primary">
              {PUBLIC_NEWS_TEXTS.COMMENTS_LOGIN_TITLE}
            </Text>
            <Text className="text-xs text-text-secondary max-w-md">
              {PUBLIC_NEWS_TEXTS.COMMENTS_LOGIN_SUB}
            </Text>
          </LayoutContainer>
          <LayoutContainer className="flex flex-wrap items-center justify-center gap-2">
            <Link href={`/login?redirect=/noticias/${slug}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<LogIn className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                {PUBLIC_NEWS_TEXTS.COMMENTS_LOGIN_BTN}
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                className="text-xs font-semibold"
              >
                {PUBLIC_NEWS_TEXTS.COMMENTS_REGISTER_BTN}
              </Button>
            </Link>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Lista de Comentários */}
      {isLoading ? (
        <LayoutContainer className="flex items-center justify-center py-8">
          <Spinner className="w-6 h-6 text-primary" />
        </LayoutContainer>
      ) : comments.length === 0 ? (
        <LayoutContainer className="text-center py-8 px-4 rounded-2xl bg-surface/50 border border-border">
          <Text className="text-xs text-text-secondary">
            {PUBLIC_NEWS_TEXTS.COMMENTS_EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-3">
          {comments.map((comment) => {
            const commentId = comment._id || comment.id || '';
            const author = comment.author;
            const authorName = author ? `${author.firstName || ''} ${author.lastName || ''}`.trim() : 'Torcedor';
            const authorAvatar = author?.avatarUrl || author?.avatar;
            const authorRole = author?.role;

            const isAuthor = Boolean(user && author?._id && (user._id === author._id));
            const isStaff = Boolean(user && ['Owner', 'Admin', 'Editor'].includes(user.role?.name));
            const canDelete = isAuthor || isStaff;

            return (
              <LayoutContainer
                key={commentId}
                className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-2.5 shadow-xs"
              >
                <LayoutContainer className="flex items-center justify-between">
                  <LayoutContainer className="flex items-center gap-2.5">
                    {authorAvatar ? (
                      <LayoutContainer className="relative w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
                        <SafeImage src={authorAvatar} alt={authorName} fill sizes="28px" className="object-cover" />
                      </LayoutContainer>
                    ) : (
                      <LayoutContainer className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                        {getUserInitials(author?.firstName, author?.lastName)}
                      </LayoutContainer>
                    )}
                    <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <Text className="text-xs font-bold text-text-primary">
                        {authorName}
                      </Text>
                      {authorRole && (
                        <Badge variant="default" size="sm" className="w-fit text-[9px] uppercase px-1.5 py-0 bg-drawer border border-border">
                          {authorRole}
                        </Badge>
                      )}
                    </LayoutContainer>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center gap-2">
                    <Text className="text-[11px] text-text-secondary">
                      {formatDate(comment.createdAt)}
                    </Text>
                    {canDelete && (
                      <Button
                        type="button"
                        variant="custom"
                        size="none"
                        onClick={() => handleDelete(commentId)}
                        disabled={deletingId === commentId}
                        className="p-1 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-error transition-colors"
                        aria-label={PUBLIC_NEWS_TEXTS.COMMENTS_DELETE_BTN}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </LayoutContainer>
                </LayoutContainer>

                <Text as="p" className="text-xs sm:text-sm text-text-primary/90 leading-relaxed pl-9 whitespace-pre-wrap">
                  {comment.content}
                </Text>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
