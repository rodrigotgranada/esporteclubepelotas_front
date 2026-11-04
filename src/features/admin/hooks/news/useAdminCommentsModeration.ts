'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  adminNewsService,
  AdminCommentData,
} from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';

export const useAdminCommentsModeration = () => {
  const [comments, setComments] = useState<AdminCommentData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<AdminCommentData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const res = await adminNewsService.getComments(params);
      setComments(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages || Math.ceil(res.total / limit) || 1);
    } catch (err: unknown) {
      console.error('Failed to load comments', err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || 'Erro ao carregar comentários');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleToggleStatus = async (comment: AdminCommentData) => {
    const newStatus = comment.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    try {
      setUpdatingId(comment._id);
      await adminNewsService.updateCommentStatus(comment._id, newStatus);
      toast.success(ADMIN_NEWS_TEXTS.COMMENTS_MODERATION.TOAST_STATUS_SUCCESS);
      setComments((prev) =>
        prev.map((c) => (c._id === comment._id ? { ...c, status: newStatus } : c)),
      );
    } catch (err: unknown) {
      console.error('Failed to update comment status', err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || 'Erro ao alterar status do comentário');
    } finally {
      setUpdatingId(null);
    }
  };

  const openDeleteModal = (comment: AdminCommentData) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      setIsDeleting(true);
      await adminNewsService.deleteComment(commentToDelete._id);
      toast.success(ADMIN_NEWS_TEXTS.COMMENTS_MODERATION.TOAST_DELETE_SUCCESS);
      closeDeleteModal();
      loadComments();
    } catch (err: unknown) {
      console.error('Failed to delete comment', err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || 'Erro ao excluir comentário');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    comments,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    search,
    setSearch: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    updatingId,
    handleToggleStatus,
    deleteModalOpen,
    commentToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    refresh: loadComments,
  };
};

