'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { OpponentClub } from '../types/opponents.types';
import { OPPONENTS_CONSTANTS } from '../constants/opponents.constants';
import { opponentsService } from '../services/opponents.service';

export const useAdminOpponents = () => {
  const [opponents, setOpponents] = useState<OpponentClub[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modais de Criação/Edição e Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentClub | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [opponentToDelete, setOpponentToDelete] = useState<OpponentClub | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOpponents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await opponentsService.adminGetOpponents(search);
      setOpponents(data);
    } catch {
      toast.error(OPPONENTS_CONSTANTS.TOASTS.LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchOpponents();
  }, [fetchOpponents]);

  const handleOpenCreate = () => {
    setSelectedOpponent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (club: OpponentClub) => {
    setSelectedOpponent(club);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOpponent(null);
  };

  const handleOpenDelete = (club: OpponentClub) => {
    setOpponentToDelete(club);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setOpponentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!opponentToDelete) return;

    try {
      setIsDeleting(true);
      await opponentsService.adminDeleteOpponent(opponentToDelete.id);
      toast.success(OPPONENTS_CONSTANTS.TOASTS.DELETED);
      handleCloseDelete();
      fetchOpponents();
    } catch {
      toast.error(OPPONENTS_CONSTANTS.TOASTS.SAVE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccessSave = () => {
    handleCloseModal();
    fetchOpponents();
  };

  return {
    opponents,
    search,
    setSearch,
    isLoading,
    isModalOpen,
    selectedOpponent,
    isDeleteModalOpen,
    opponentToDelete,
    isDeleting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    handleSuccessSave,
    fetchOpponents,
  };
};
