import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ClubAnthem } from '../types/anthem.types';
import { anthemService } from '../services/anthem.service';
import { ANTHEM_TEXTS } from '../constants/anthem.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAdminAnthemList = () => {
  const [anthems, setAnthems] = useState<ClubAnthem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAnthem, setSelectedAnthem] = useState<ClubAnthem | null>(null);
  const [deletingAnthem, setDeletingAnthem] = useState<ClubAnthem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAnthems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await anthemService.adminGetAll();
      setAnthems(data);
    } catch (err) {
      console.error('Erro ao listar versões do hino:', err);
      toast.error(ANTHEM_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnthems();
  }, [fetchAnthems]);

  useRealtimeEvents('anthem', () => {
    fetchAnthems();
  });

  const handleOpenNew = () => {
    setSelectedAnthem(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (anthem: ClubAnthem) => {
    setSelectedAnthem(anthem);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAnthem(null);
  };

  const handleSetOfficial = async (anthem: ClubAnthem) => {
    try {
      await anthemService.adminSetOfficial(anthem.id);
      toast.success(ANTHEM_TEXTS.TOAST_SET_OFFICIAL_SUCCESS);
      fetchAnthems();
    } catch (err) {
      console.error('Erro ao definir versão como oficial:', err);
      toast.error(ANTHEM_TEXTS.TOAST_GENERIC_ERROR);
    }
  };

  const handleOpenDelete = (anthem: ClubAnthem) => {
    setDeletingAnthem(anthem);
  };

  const handleCloseDelete = () => {
    setDeletingAnthem(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAnthem) return;
    try {
      setIsDeleting(true);
      await anthemService.adminDelete(deletingAnthem.id);
      toast.success(ANTHEM_TEXTS.TOAST_DELETE_SUCCESS);
      setDeletingAnthem(null);
      fetchAnthems();
    } catch (err) {
      console.error('Erro ao excluir versão do hino:', err);
      toast.error(ANTHEM_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    anthems,
    isLoading,
    isDrawerOpen,
    selectedAnthem,
    deletingAnthem,
    isDeleting,
    handleOpenNew,
    handleOpenEdit,
    handleCloseDrawer,
    handleSetOfficial,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    reload: fetchAnthems,
  };
};

