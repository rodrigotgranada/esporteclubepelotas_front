'use client';

import React from 'react';
import Image from 'next/image';
import {
  CalendarClock,
  Clock,
  Send,
  Edit3,
  Trash2,
  Plus,
  Sparkles,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Badge,
  Spinner,
  ConfirmModal, isUnoptimizedImageUrl,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminScheduled } from '../../../hooks/news/useAdminScheduled';
import { NewsArticleData } from '../../../services/admin-news.service';

export interface AdminScheduledTabProps {
  onEditArticle: (id: string) => void;
  onNewArticle: () => void;
  onArticleUpdated?: () => void;
}

export const AdminScheduledTab: React.FC<AdminScheduledTabProps> = ({
  onEditArticle,
  onNewArticle,
  onArticleUpdated,
}) => {
  const texts = ADMIN_NEWS_TEXTS.SCHEDULED;

  const {
    scheduledArticles,
    total,
    isLoading,
    publishModalOpen,
    articleToPublish,
    isPublishing,
    openPublishModal,
    closePublishModal,
    confirmPublishNow,
    deleteModalOpen,
    articleToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    formatScheduledDate,
    getTimeRemaining,
  } = useAdminScheduled(onArticleUpdated);

  const getFeaturedSlotBadge = (article: NewsArticleData) => {
    if (article.featuredSlot === 'MAIN') {
      return (
        <Badge variant="warning" className="font-bold flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3 text-primary" />
          {ADMIN_NEWS_TEXTS.SHOWCASE.SLOT_MAIN_BADGE}
        </Badge>
      );
    }
    if (article.featuredSlot === 'SECONDARY') {
      return (
        <Badge variant="default" className="font-bold text-xs border border-primary/40 text-primary">
          {ADMIN_NEWS_TEXTS.SHOWCASE.SLOT_SECONDARY_BADGE}
        </Badge>
      );
    }
    return null;
  };

  const getCategoryName = (category: any): string => {
    if (!category) return 'Geral';
    if (typeof category === 'string') return category;
    return category.name || 'Geral';
  };

  const getAuthorName = (author: any): string => {
    if (!author) return 'Redação';
    if (typeof author === 'string') return author;
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email || 'Redação';
  };

  return (
    <LayoutContainer className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* Top Header Card */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border">
        <LayoutContainer className="flex items-start sm:items-center gap-3">
          <LayoutContainer className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <CalendarClock className="w-6 h-6" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Title level="h2" className="text-xl font-black text-text-primary tracking-tight">
              {texts.PAGE_TITLE}
            </Title>
            <Text as="p" className="text-text-secondary text-xs sm:text-sm mt-0.5">
              {texts.PAGE_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <Badge variant="default" className="px-3 py-1 font-bold text-xs border border-border">
            {texts.QUEUE_COUNT(total)}
          </Badge>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onNewArticle}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold rounded-xl"
          >
            {texts.BTN_NEW_SCHEDULED}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Loading State */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center py-20 bg-surface/50 border border-border rounded-2xl">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium text-sm">
            {texts.LOADING}
          </Text>
        </LayoutContainer>
      ) : scheduledArticles.length === 0 ? (
        /* Empty State */
        <LayoutContainer className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 border border-dashed border-border rounded-2xl">
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border text-text-muted mb-4 shadow-sm">
            <Clock className="w-10 h-10 text-primary/70" />
          </LayoutContainer>
          <Title level="h3" className="text-lg font-bold text-text-primary mb-1">
            {texts.EMPTY_TITLE}
          </Title>
          <Text as="p" className="text-text-secondary text-xs sm:text-sm max-w-md leading-relaxed mb-6">
            {texts.EMPTY_DESC}
          </Text>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onNewArticle}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold"
          >
            {texts.BTN_NEW_SCHEDULED}
          </Button>
        </LayoutContainer>
      ) : (
        /* Chronological Scheduled Articles List */
        <LayoutContainer className="flex flex-col gap-4">
          {scheduledArticles.map((article, index) => {
            const articleId = article._id || article.id || '';
            const remaining = getTimeRemaining(article.publishedAt);
            const formattedDate = formatScheduledDate(article.publishedAt);
            const categoryName = getCategoryName(article.category);
            const authorName = getAuthorName(article.author);

            return (
              <LayoutContainer
                key={articleId || index}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm"
              >
                {/* Left Info & Cover */}
                <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                  {/* Cover Thumbnail */}
                  <LayoutContainer className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-surface border border-border shrink-0 shadow-inner">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 176px" unoptimized={isUnoptimizedImageUrl(article.coverImage)}
                      />
                    ) : (
                      <LayoutContainer className="w-full h-full flex items-center justify-center text-text-muted bg-surface/80">
                        <CalendarClock className="w-8 h-8 opacity-40" />
                      </LayoutContainer>
                    )}
                    {/* Index Badge */}
                    <LayoutContainer className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm border border-border text-[10px] font-black text-text-primary">
                      #{index + 1}
                    </LayoutContainer>
                  </LayoutContainer>

                  {/* Text Details */}
                  <LayoutContainer className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <LayoutContainer className="flex flex-wrap items-center gap-2">
                      <Badge variant="default" className="text-[10px] font-bold uppercase tracking-wider">
                        {categoryName}
                      </Badge>
                      {getFeaturedSlotBadge(article)}
                    </LayoutContainer>

                    <Title
                      level="h3"
                      className="text-base sm:text-lg font-black text-text-primary line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => onEditArticle(articleId)}
                    >
                      {article.title}
                    </Title>

                    {article.summary && (
                      <Text as="p" className="text-xs text-text-secondary line-clamp-1">
                        {article.summary}
                      </Text>
                    )}

                    <LayoutContainer className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-1">
                      <Text as="span">
                        Por <strong className="text-text-secondary">{authorName}</strong>
                      </Text>
                      {article.reporterName && (
                        <Text as="span">
                          • Repórter: <strong className="text-text-secondary">{article.reporterName}</strong>
                        </Text>
                      )}
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Right Scheduled Details & Actions */}
                <LayoutContainer className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
                  {/* Schedule Time Box */}
                  <LayoutContainer className="flex flex-col sm:items-start lg:items-end gap-1">
                    <LayoutContainer className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <Text as="span" className="font-semibold text-text-secondary">
                        {texts.LABEL_SCHEDULED_FOR}
                      </Text>
                    </LayoutContainer>
                    <Text as="span" className="text-sm font-extrabold text-text-primary tracking-tight">
                      {formattedDate}
                    </Text>
                    <Badge variant="warning" className="text-[11px] font-bold mt-0.5">
                      {remaining}
                    </Badge>
                  </LayoutContainer>

                  {/* Action Buttons */}
                  <LayoutContainer className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => openPublishModal(article)}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      className="font-bold text-xs rounded-xl shadow-sm"
                      title={texts.BTN_PUBLISH_NOW_TOOLTIP}
                    >
                      {texts.BTN_PUBLISH_NOW}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditArticle(articleId)}
                      leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      className="font-bold text-xs rounded-xl"
                    >
                      {texts.BTN_EDIT}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(article)}
                      className="text-error hover:bg-error/10 rounded-xl p-2"
                      title={texts.BTN_DELETE}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}

      {/* Modal Confirmar Publicação Imediata */}
      <ConfirmModal
        isOpen={publishModalOpen}
        onClose={closePublishModal}
        onConfirm={confirmPublishNow}
        title={texts.MODAL_PUBLISH_NOW.TITLE}
        description={texts.MODAL_PUBLISH_NOW.DESC(articleToPublish?.title || '')}
        confirmText={texts.MODAL_PUBLISH_NOW.BUTTON_CONFIRM}
        cancelText={texts.MODAL_PUBLISH_NOW.BUTTON_CANCEL}
        variant="warning"
        isLoading={isPublishing}
      />

      {/* Modal Confirmar Exclusão */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={ADMIN_NEWS_TEXTS.MODAL_DELETE.TITLE}
        description={ADMIN_NEWS_TEXTS.MODAL_DELETE.DESC(articleToDelete?.title || '')}
        confirmText={ADMIN_NEWS_TEXTS.MODAL_DELETE.BUTTON_CONFIRM}
        cancelText={ADMIN_NEWS_TEXTS.MODAL_DELETE.BUTTON_CANCEL}
        variant="danger"
        isLoading={isDeleting}
      />
    </LayoutContainer>
  );
};
