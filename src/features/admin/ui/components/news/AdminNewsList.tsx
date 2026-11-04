'use client';

import React from 'react';
import {
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Pin,
  Copy,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  LayoutContainer,
  Text,
  Badge,
  IconButton,
  Button,
  Spinner,
  ConfirmModal,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { NewsArticleData } from '../../../services/admin-news.service';

export interface AdminNewsListProps {
  news: NewsArticleData[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onEdit: (id: string) => void;
  onDelete: (article: NewsArticleData) => void;
  deleteModalOpen: boolean;
  articleToDelete: NewsArticleData | null;
  isDeleting: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onDuplicate?: (article: NewsArticleData) => void;
  duplicateModalOpen?: boolean;
  articleToDuplicate?: NewsArticleData | null;
  isDuplicating?: boolean;
  onCloseDuplicateModal?: () => void;
  onConfirmDuplicate?: () => void;
}

export const AdminNewsList: React.FC<AdminNewsListProps> = ({
  news,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  deleteModalOpen,
  articleToDelete,
  isDeleting,
  onCloseDeleteModal,
  onConfirmDelete,
  onDuplicate,
  duplicateModalOpen = false,
  articleToDuplicate = null,
  isDuplicating = false,
  onCloseDuplicateModal,
  onConfirmDuplicate,
}) => {
  const { TABLE: texts, STATUS_MAP } = ADMIN_NEWS_TEXTS;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="success">{STATUS_MAP.PUBLISHED}</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">{STATUS_MAP.DRAFT}</Badge>;
      case 'SCHEDULED':
        return <Badge variant="primary">{STATUS_MAP.SCHEDULED}</Badge>;
      case 'ARCHIVED':
        return <Badge variant="default">{STATUS_MAP.ARCHIVED}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getCategoryName = (category: any) => {
    if (!category) return 'Geral';
    if (typeof category === 'string') return category;
    return category.name || 'Geral';
  };

  const getAuthorName = (author: any) => {
    if (!author) return 'Redação';
    if (typeof author === 'string') return 'Redação';
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Redação';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Loading State */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-12 bg-surface rounded-xl border border-border shadow-xs">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium">
            {texts.LOADING}
          </Text>
        </LayoutContainer>
      ) : news.length === 0 ? (
        /* Empty State */
        <LayoutContainer className="flex flex-col items-center justify-center p-12 bg-surface rounded-xl border border-border shadow-xs text-center">
          <Text as="p" className="text-text-secondary font-medium text-base mb-2">
            {texts.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <>
          {/* Desktop Table */}
          <LayoutContainer className="hidden md:block bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">{texts.HEADER_COVER}</TableHead>
                  <TableHead>{texts.HEADER_TITLE}</TableHead>
                  <TableHead className="w-36">{texts.HEADER_CATEGORY}</TableHead>
                  <TableHead className="w-28">{texts.HEADER_STATUS}</TableHead>
                  <TableHead className="w-28">{texts.HEADER_FEATURED}</TableHead>
                  <TableHead className="w-32">{texts.HEADER_DATE}</TableHead>
                  <TableHead className="w-28 text-right">{texts.HEADER_ACTIONS}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item, idx) => (
                  <TableRow key={item.slug || (typeof item._id === 'string' ? item._id : item.id) || `admin-table-${idx}`}>
                    {/* Cover Thumbnail */}
                    <TableCell>
                      <LayoutContainer className="w-16 h-10 rounded-md overflow-hidden bg-background border border-border relative">
                        {item.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LayoutContainer className="w-full h-full flex items-center justify-center text-text-secondary text-[10px]">
                            Sem capa
                          </LayoutContainer>
                        )}
                      </LayoutContainer>
                    </TableCell>

                    {/* Title & Metadata */}
                    <TableCell>
                      <LayoutContainer className="flex flex-col gap-1 max-w-md">
                        <Text as="span" className="font-bold text-text-primary text-sm line-clamp-1 hover:text-primary transition-colors cursor-pointer" onClick={() => onEdit(item._id || item.id || '')}>
                          {item.title}
                        </Text>
                        <LayoutContainer className="flex items-center gap-3 text-xs text-text-secondary">
                          <Text as="span">{texts.AUTHOR_BY(getAuthorName(item.author))}</Text>
                          <Text as="span">•</Text>
                          <LayoutContainer className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <Text as="span">{texts.VIEWS(item.viewsCount || 0)}</Text>
                          </LayoutContainer>
                        </LayoutContainer>
                      </LayoutContainer>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge variant="default" size="sm">
                        {getCategoryName(item.category)}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(item.status)}</TableCell>

                    {/* Featured & Pinned */}
                    <TableCell>
                      <LayoutContainer className="flex flex-col gap-1 items-start">
                        {item.isPinned && (
                          <Badge variant="default" size="sm" className="flex items-center gap-1 border-primary/30 text-primary">
                            <Pin className="w-3 h-3 text-primary" />
                            {texts.BADGE_PINNED}
                          </Badge>
                        )}
                        {item.featuredSlot === 'MAIN' ? (
                          <Badge variant="primary" size="sm" className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {texts.BADGE_MAIN}
                          </Badge>
                        ) : item.featuredSlot === 'SECONDARY' ? (
                          <Badge variant="warning" size="sm" className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {texts.BADGE_SECONDARY}
                          </Badge>
                        ) : item.isFeatured ? (
                          <Badge variant="primary" size="sm" className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {texts.BADGE_MAIN}
                          </Badge>
                        ) : !item.isPinned ? (
                          <Text as="span" className="text-xs text-text-secondary">
                            {texts.BADGE_NORMAL}
                          </Text>
                        ) : null}
                      </LayoutContainer>
                    </TableCell>

                    {/* Date & Views */}
                    <TableCell>
                      <LayoutContainer className="flex flex-col gap-0.5">
                        <Text as="span" className="text-xs text-text-secondary">
                          {formatDate(item.publishedAt || item.createdAt)}
                        </Text>
                        <Text as="span" className="text-[10px] text-text-secondary font-mono flex items-center gap-1">
                          <Eye className="w-3 h-3 text-primary" />
                          {item.viewsCount || 0} views
                        </Text>
                      </LayoutContainer>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <LayoutContainer className="flex items-center justify-end gap-1">
                        {item.status === 'PUBLISHED' && (
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label="Ver no site"
                            title="Ver notícia publicada"
                            onClick={() => window.open(`/noticias/${item.slug}`, '_blank')}
                            icon={<ExternalLink className="w-4 h-4 text-text-secondary hover:text-text-primary" />}
                          />
                        )}
                        {onDuplicate && (
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label="Duplicar"
                            title="Duplicar matéria como rascunho"
                            onClick={() => onDuplicate(item)}
                            icon={<Copy className="w-4 h-4 text-text-secondary hover:text-primary" />}
                          />
                        )}
                        <IconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Editar"
                          title="Editar matéria"
                          onClick={() => onEdit(item._id || item.id || '')}
                          icon={<Edit2 className="w-4 h-4 text-text-secondary hover:text-primary" />}
                        />
                        <IconButton
                          variant="ghost"
                          size="sm"
                          aria-label="Excluir"
                          title="Excluir matéria"
                          onClick={() => onDelete(item)}
                          icon={<Trash2 className="w-4 h-4 text-text-secondary hover:text-error" />}
                        />
                      </LayoutContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </LayoutContainer>

          {/* Mobile Cards */}
          <LayoutContainer className="flex flex-col gap-3 md:hidden">
            {news.map((item, idx) => (
              <LayoutContainer
                key={item.slug || (typeof item._id === 'string' ? item._id : item.id) || `admin-card-${idx}`}
                className="bg-surface p-4 rounded-xl border border-border shadow-xs flex flex-col gap-3"
              >
                <LayoutContainer className="flex items-start gap-3">
                  <LayoutContainer className="w-20 h-14 rounded-lg overflow-hidden bg-background border border-border shrink-0">
                    {item.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LayoutContainer className="w-full h-full flex items-center justify-center text-text-secondary text-[10px]">
                        Sem capa
                      </LayoutContainer>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="flex flex-col gap-1 flex-1">
                    <Text as="span" className="font-bold text-text-primary text-sm line-clamp-2">
                      {item.title}
                    </Text>
                    <LayoutContainer className="flex items-center gap-2">
                      <Badge variant="default" size="sm">
                        {getCategoryName(item.category)}
                      </Badge>
                      {getStatusBadge(item.status)}
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-text-secondary">
                  <LayoutContainer className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <Text as="span">{formatDate(item.publishedAt || item.createdAt)}</Text>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center gap-1">
                    {onDuplicate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicate(item)}
                        leftIcon={<Copy className="w-3.5 h-3.5 text-primary" />}
                        className="text-xs h-8"
                      >
                        Duplicar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item._id || item.id || '')}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                      className="text-xs h-8"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-error" />}
                      className="text-xs h-8 text-error"
                    >
                      Excluir
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <LayoutContainer className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border shadow-xs">
              <Text as="span" className="text-xs text-text-secondary font-medium">
                Página {page} de {totalPages}
              </Text>
              <LayoutContainer className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  className="text-xs h-8"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  className="text-xs h-8"
                >
                  Próxima
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={onCloseDeleteModal}
          onConfirm={onConfirmDelete}
          title={ADMIN_NEWS_TEXTS.MODAL_DELETE.TITLE}
          description={ADMIN_NEWS_TEXTS.MODAL_DELETE.DESC(articleToDelete.title)}
          confirmText={ADMIN_NEWS_TEXTS.MODAL_DELETE.BUTTON_CONFIRM}
          cancelText={ADMIN_NEWS_TEXTS.MODAL_DELETE.BUTTON_CANCEL}
          isLoading={isDeleting}
          variant="danger"
        />
      )}

      {/* Duplicate Confirmation Modal */}
      {articleToDuplicate && onCloseDuplicateModal && onConfirmDuplicate && (
        <ConfirmModal
          isOpen={duplicateModalOpen}
          onClose={onCloseDuplicateModal}
          onConfirm={onConfirmDuplicate}
          title={ADMIN_NEWS_TEXTS.MODAL_DUPLICATE.TITLE}
          description={ADMIN_NEWS_TEXTS.MODAL_DUPLICATE.DESC(articleToDuplicate.title)}
          confirmText={ADMIN_NEWS_TEXTS.MODAL_DUPLICATE.BUTTON_CONFIRM}
          cancelText={ADMIN_NEWS_TEXTS.MODAL_DUPLICATE.BUTTON_CANCEL}
          isLoading={isDuplicating}
          variant="info"
        />
      )}
    </LayoutContainer>
  );
};

