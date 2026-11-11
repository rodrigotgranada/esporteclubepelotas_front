'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { pollService } from '@/features/poll/services/poll.service';
import { Poll } from '@/features/poll/types/poll.types';
import { POLL_TEXTS } from '@/features/poll/constants/poll.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export function useAdminPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);

  // Exclusão
  const [deleteTarget, setDeleteTarget] = useState<Poll | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchPolls = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pollService.getAllAdmin();
      setPolls(data || []);
    } catch (err) {
      console.error('Erro ao buscar enquetes no admin:', err);
      toast.error('Erro ao carregar lista de enquetes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  useRealtimeEvents('polls', () => {
    fetchPolls();
  });

  const handleOpenDrawer = (poll?: Poll) => {
    setEditingPoll(poll || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingPoll(null);
  };

  const handleToggleActive = async (pollId: string) => {
    try {
      await pollService.toggleActive(pollId);
      toast.success(POLL_TEXTS.ADMIN.STATUS_TOGGLED);
      await fetchPolls();
    } catch (err) {
      console.error('Erro ao alternar status da enquete:', err);
      toast.error('Falha ao alterar status da enquete.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await pollService.delete(deleteTarget.id);
      toast.success(POLL_TEXTS.ADMIN.DELETE_SUCCESS);
      setDeleteTarget(null);
      await fetchPolls();
    } catch (err) {
      console.error('Erro ao excluir enquete:', err);
      toast.error('Falha ao excluir enquete.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    polls,
    isLoading,
    isDrawerOpen,
    editingPoll,
    handleOpenDrawer,
    handleCloseDrawer,
    handleToggleActive,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
    refetch: fetchPolls,
  };
}

