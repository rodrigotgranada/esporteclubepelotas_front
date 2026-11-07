'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Trash2, LogIn, UserPlus, MailCheck } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  SafeImage,
  Spinner,
  Form,
  FormField,
  Textarea,
} from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { useNewsComments } from '../../hooks/useNewsComments';

export interface NewsCommentsSectionProps {
  slug: string;
}

export const NewsCommentsSection: React.FC<NewsCommentsSectionProps> = ({ slug }) => {
  const {
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
  } = useNewsComments(slug);

  const content = form.watch('content') || '';

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
          {PUBLIC_NEWS_TEXTS.COMMENTS_TITLE(total)}
        </Title>
      </LayoutContainer>

      {/* Cenário 1: Usuário Autenticado e com Conta Ativa */}
      {user && isUserActive ? (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs">
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
          </LayoutContainer>

          <LayoutContainer className="relative">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder={PUBLIC_NEWS_TEXTS.COMMENTS_INPUT_PLACEHOLDER}
                  maxLength={1000}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full p-3 text-sm bg-drawer text-text-primary rounded-xl border border-border focus:border-primary focus:outline-hidden transition-all resize-none"
                />
              )}
            />
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between">
            <Text className="text-[11px] text-text-secondary">
              {content.length} / 1000
            </Text>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={!content.trim() || isSubmitting}
              rightIcon={<Send className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              {isSubmitting ? PUBLIC_NEWS_TEXTS.COMMENTS_SUBMITTING : PUBLIC_NEWS_TEXTS.COMMENTS_SUBMIT_BTN}
            </Button>
          </LayoutContainer>
        </Form>
      ) : user && !isUserActive ? (
        /* Cenário 2: Usuário Autenticado mas com Conta Inativa ou Pendente */
        <LayoutContainer className="p-6 rounded-2xl bg-surface border border-warning/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <LayoutContainer className="flex items-center gap-3">
            <LayoutContainer className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <MailCheck className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-1">
              <Text className="text-sm font-bold text-text-primary">
                {PUBLIC_NEWS_TEXTS.COMMENTS_INACTIVE_TITLE}
              </Text>
              <Text className="text-xs text-text-secondary max-w-md">
                {PUBLIC_NEWS_TEXTS.COMMENTS_INACTIVE_SUB}
              </Text>
            </LayoutContainer>
          </LayoutContainer>
          <Link href="/verify-email">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<MailCheck className="w-3.5 h-3.5" />}
              className="text-xs font-bold shrink-0"
            >
              {PUBLIC_NEWS_TEXTS.COMMENTS_VERIFY_BTN}
            </Button>
          </Link>
        </LayoutContainer>
      ) : (
        /* Cenário 3: Usuário Deslogado */
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
                    <Text className="text-xs font-bold text-text-primary">
                      {authorName}
                    </Text>
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

          {/* Botão de Paginação: Carregar Mais Comentários */}
          {hasMore && (
            <LayoutContainer className="flex items-center justify-center pt-3 pb-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                isLoading={isLoadingMore}
                disabled={isLoadingMore}
                className="text-xs font-bold px-6 py-2 border-border hover:border-primary shadow-xs"
              >
                {isLoadingMore ? (
                  PUBLIC_NEWS_TEXTS.COMMENTS_LOADING_MORE
                ) : (
                  <LayoutContainer className="flex items-center gap-1.5">
                    <Text as="span">{PUBLIC_NEWS_TEXTS.COMMENTS_LOAD_MORE}</Text>
                    <Text as="span" className="text-text-secondary text-[11px] font-mono">
                      {PUBLIC_NEWS_TEXTS.COMMENTS_REMAINING(Math.max(0, total - comments.length))}
                    </Text>
                  </LayoutContainer>
                )}
              </Button>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
