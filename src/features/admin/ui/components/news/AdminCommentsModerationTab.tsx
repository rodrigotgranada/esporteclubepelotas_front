'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
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
  Input,
  Select,
  Option,
  Spinner,
  ConfirmModal,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminCommentsModeration } from '../../../hooks/news/useAdminCommentsModeration';

export const AdminCommentsModerationTab: React.FC = () => {
  const {
    comments,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    updatingId,
    handleToggleStatus,
    handleDismissReport,
    deleteModalOpen,
    commentToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useAdminCommentsModeration();

  const texts = ADMIN_NEWS_TEXTS.COMMENTS_MODERATION;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getRoleBadgeVariant = (role?: string): 'primary' | 'default' => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
      case 'OWNER':
        return 'primary';
      case 'SOCIO':
      case 'SÓCIO':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Search and Filters Bar */}
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border shadow-xs">
        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <LayoutContainer className="relative flex-1">
            <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
              <Search className="w-4 h-4" />
            </LayoutContainer>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={texts.SEARCH_PLACEHOLDER}
              className="pl-9"
            />
          </LayoutContainer>

          {/* Status Filter */}
          <LayoutContainer className="w-full sm:w-56">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <Option value="">{texts.STATUS_FILTER_ALL}</Option>
              <Option value="REPORTED">{texts.STATUS_FILTER_REPORTED}</Option>
              <Option value="ACTIVE">{texts.STATUS_FILTER_ACTIVE}</Option>
              <Option value="HIDDEN">{texts.STATUS_FILTER_HIDDEN}</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        {/* Count Badge */}
        <LayoutContainer className="flex items-center justify-end">
          <Badge variant="default" size="sm" className="font-semibold px-3 py-1 text-xs">
            {texts.TOTAL_COUNT(total)}
          </Badge>
        </LayoutContainer>
      </LayoutContainer>

      {/* Table Section */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-16 bg-surface rounded-xl border border-border shadow-xs">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium">
            {texts.LOADING}
          </Text>
        </LayoutContainer>
      ) : comments.length === 0 ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-16 bg-surface rounded-xl border border-border text-center shadow-xs">
          <LayoutContainer className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
            <MessageSquare className="w-6 h-6" />
          </LayoutContainer>
          <Text as="p" className="text-text-secondary font-medium text-base">
            {texts.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="bg-surface rounded-xl border border-border shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{texts.COL_AUTHOR}</TableHead>
                <TableHead>{texts.COL_COMMENT}</TableHead>
                <TableHead>{texts.COL_ARTICLE}</TableHead>
                <TableHead>{texts.COL_DATE}</TableHead>
                <TableHead>{texts.COL_STATUS}</TableHead>
                <TableHead className="text-right">{texts.COL_ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => {
                const commentId = comment._id || comment.id || '';
                const authorName = comment.author
                  ? `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() || 'Torcedor'
                  : 'Torcedor';
                const isHidden = comment.status === 'HIDDEN';
                const isUpdating = updatingId === commentId;
                const isReported = Boolean(comment.isReported);

                return (
                  <TableRow
                    key={commentId}
                    className={
                      isReported
                        ? 'bg-amber-500/5 hover:bg-amber-500/10 border-l-4 border-l-amber-500'
                        : isHidden
                          ? 'opacity-70 bg-background/30'
                          : undefined
                    }
                  >
                    {/* Author */}
                    <TableCell className="min-w-[180px]">
                      <LayoutContainer className="flex items-center gap-2.5">
                        <LayoutContainer className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 overflow-hidden">
                          {authorName.charAt(0).toUpperCase()}
                        </LayoutContainer>
                        <LayoutContainer className="flex flex-col">
                          <Text as="span" className="font-bold text-xs text-text-primary">
                            {authorName}
                          </Text>
                          <LayoutContainer className="flex items-center gap-1.5 mt-0.5">
                            <Badge
                              variant={getRoleBadgeVariant(comment.author?.role)}
                              size="sm"
                              className="text-[10px] px-1.5 py-0 font-medium"
                            >
                              {comment.author?.role || texts.ROLE_USER}
                            </Badge>
                          </LayoutContainer>
                        </LayoutContainer>
                      </LayoutContainer>
                    </TableCell>

                    {/* Content */}
                    <TableCell className="max-w-[320px]">
                      <LayoutContainer className="flex flex-col gap-1.5">
                        <Text as="p" className="text-xs text-text-primary leading-relaxed line-clamp-3">
                          &ldquo;{comment.content}&rdquo;
                        </Text>
                        {isReported && (
                          <LayoutContainer className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col gap-0.5">
                            <LayoutContainer className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{texts.BADGE_REPORTED(comment.reportCount || 1)}</span>
                            </LayoutContainer>
                            {comment.lastReportReason && (
                              <Text className="text-[10px] text-text-secondary italic">
                                Motivo: &ldquo;{comment.lastReportReason}&rdquo;
                              </Text>
                            )}
                          </LayoutContainer>
                        )}
                      </LayoutContainer>
                    </TableCell>

                    {/* News Article */}
                    <TableCell className="max-w-[200px]">
                      {comment.news ? (
                        <Link
                          href={`/noticias/${comment.news.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Text as="span" className="line-clamp-2">
                            {comment.news.title}
                          </Text>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100" />
                        </Link>
                      ) : (
                        <Text as="span" className="text-xs text-text-secondary italic">
                          Matéria removida
                        </Text>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="whitespace-nowrap">
                      <Text as="span" className="text-xs text-text-secondary font-medium">
                        {formatDate(comment.createdAt)}
                      </Text>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {isHidden ? (
                        <Badge
                          variant="warning"
                          size="sm"
                          className="font-bold text-[10px] px-2 py-0.5 bg-error/15 text-error border-error/30"
                        >
                          {texts.STATUS_HIDDEN}
                        </Badge>
                      ) : (
                        <Badge
                          variant="success"
                          size="sm"
                          className="font-bold text-[10px] px-2 py-0.5"
                        >
                          {texts.STATUS_ACTIVE}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <LayoutContainer className="flex items-center justify-end gap-1">
                        {/* Falso Positivo / Manter */}
                        {isReported && (
                          <IconButton
                            icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                            aria-label={texts.ACTION_DISMISS_REPORT}
                            title={texts.ACTION_DISMISS_REPORT}
                            size="sm"
                            variant="ghost"
                            disabled={isUpdating}
                            onClick={() => handleDismissReport(comment)}
                          />
                        )}

                        {/* Ocultar / Tornar Visível */}
                        <IconButton
                          icon={
                            isUpdating ? (
                              <Spinner className="w-4 h-4 text-primary" />
                            ) : isHidden ? (
                              <Eye className="w-4 h-4 text-primary" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-text-secondary" />
                            )
                          }
                          aria-label={isHidden ? texts.ACTION_UNHIDE : texts.ACTION_HIDE}
                          title={isHidden ? texts.ACTION_UNHIDE : texts.ACTION_HIDE}
                          size="sm"
                          variant="ghost"
                          disabled={isUpdating}
                          onClick={() => handleToggleStatus(comment)}
                        />

                        {/* Excluir Definitivamente */}
                        <IconButton
                          icon={<Trash2 className="w-4 h-4 text-error" />}
                          aria-label={texts.ACTION_DELETE}
                          title={texts.ACTION_DELETE}
                          size="sm"
                          variant="ghost"
                          onClick={() => openDeleteModal(comment)}
                        />
                      </LayoutContainer>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <LayoutContainer className="flex items-center justify-between p-4 border-t border-border">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.PAGINATION_LABEL(page, totalPages)}
              </Text>
              <LayoutContainer className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  className="text-xs font-semibold"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  className="text-xs font-semibold"
                >
                  Próxima
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}

      {/* Delete Confirmation Modal */}
      {commentToDelete && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title={texts.DELETE_MODAL_TITLE}
          description={texts.DELETE_MODAL_DESC}
          confirmText={texts.DELETE_MODAL_CONFIRM}
          cancelText={texts.DELETE_MODAL_CANCEL}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </LayoutContainer>
  );
};
