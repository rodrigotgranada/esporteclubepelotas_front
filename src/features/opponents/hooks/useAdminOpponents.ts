'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { OpponentClub } from '../types/opponents.types';
import { OPPONENTS_CONSTANTS } from '../constants/opponents.constants';
import { opponentsService } from '../services/opponents.service';

export type OpponentSortField = 'name' | 'shortName' | 'city' | 'stadiumName' | 'isActive';
export type SortDirection = 'asc' | 'desc';
export type OpponentStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export const useAdminOpponents = () => {
  const [opponents, setOpponents] = useState<OpponentClub[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OpponentStatusFilter>('ALL');
  const [sortField, setSortField] = useState<OpponentSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
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
      const data = await opponentsService.adminGetOpponents();
      setOpponents(data);
    } catch {
      toast.error(OPPONENTS_CONSTANTS.TOASTS.LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpponents();
  }, [fetchOpponents]);

  // Alternar ordenação ao clicar no cabeçalho
  const handleSort = (field: OpponentSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtragem e Ordenação Reativa
  const filteredAndSortedOpponents = useMemo(() => {
    let result = [...opponents];

    // 1. Filtro por Busca Textual
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.shortName && c.shortName.toLowerCase().includes(q)) ||
          (c.city && c.city.toLowerCase().includes(q)) ||
          (c.stadiumName && c.stadiumName.toLowerCase().includes(q))
      );
    }

    // 2. Filtro por Status
    if (statusFilter === 'ACTIVE') {
      result = result.filter((c) => c.isActive);
    } else if (statusFilter === 'INACTIVE') {
      result = result.filter((c) => !c.isActive);
    }

    // 3. Ordenação
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '', 'pt-BR', { sensitivity: 'base' });
          break;
        case 'shortName':
          comparison = (a.shortName || '').localeCompare(b.shortName || '', 'pt-BR', { sensitivity: 'base' });
          break;
        case 'city':
          comparison = (a.city || '').localeCompare(b.city || '', 'pt-BR', { sensitivity: 'base' });
          break;
        case 'stadiumName':
          comparison = (a.stadiumName || '').localeCompare(b.stadiumName || '', 'pt-BR', { sensitivity: 'base' });
          break;
        case 'isActive':
          comparison = Number(b.isActive) - Number(a.isActive);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [opponents, search, statusFilter, sortField, sortDirection]);

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
    opponents: filteredAndSortedOpponents,
    totalCount: opponents.length,
    filteredCount: filteredAndSortedOpponents.length,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    handleSort,
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
