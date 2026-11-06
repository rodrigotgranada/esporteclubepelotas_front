'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import { SquadData } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const useAdminSquadsList = () => {
  const [squads, setSquads] = useState<SquadData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Delete modal state
  const [squadToDelete, setSquadToDelete] = useState<SquadData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadSquads = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedYear) params.year = selectedYear;

      const res = await adminFootballService.getSquads(params);
      setSquads(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Erro ao carregar elencos:', err);
      toast.error('Não foi possível carregar a lista de elencos.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, selectedCategory, selectedYear]);

  useEffect(() => {
    loadSquads();
  }, [loadSquads]);

  const handleDelete = async () => {
    if (!squadToDelete) return;
    try {
      setIsDeleting(true);
      await adminFootballService.deleteSquad(squadToDelete.id || squadToDelete._id);
      toast.success(ADMIN_FOOTBALL_CONSTANTS.DELETE_MODAL.SUCCESS_DELETE);
      setSquadToDelete(null);
      await loadSquads();
    } catch (err) {
      console.error('Erro ao inativar elenco:', err);
      toast.error('Erro ao inativar elenco.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleCurrent = async (squad: SquadData) => {
    try {
      const newStatus = !squad.isCurrent;
      await adminFootballService.updateSquad(squad.id || squad._id, {
        isCurrent: newStatus,
      });
      toast.success(
        newStatus
          ? 'Elenco marcado como atual em atividade!'
          : 'Elenco desmarcado como atual.',
      );
      await loadSquads();
    } catch (err) {
      console.error('Erro ao alternar status do elenco:', err);
      toast.error('Erro ao atualizar status do elenco.');
    }
  };

  return {
    squads,
    total,
    page,
    totalPages,
    isLoading,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    setPage,
    reload: loadSquads,
    squadToDelete,
    setSquadToDelete,
    isDeleting,
    handleDelete,
    handleToggleCurrent,
  };
};

