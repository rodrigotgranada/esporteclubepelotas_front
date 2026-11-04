'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import { AthleteData } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const useAdminAthletesList = () => {
  const [athletes, setAthletes] = useState<AthleteData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  // Delete modal state
  const [athleteToDelete, setAthleteToDelete] = useState<AthleteData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadAthletes = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (position.trim()) params.position = position.trim();

      const res = await adminFootballService.getAthletes(params);
      setAthletes(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Erro ao carregar atletas:', err);
      toast.error('Não foi possível carregar a lista de atletas.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, position]);

  useEffect(() => {
    loadAthletes();
  }, [loadAthletes]);

  const handleDelete = async () => {
    if (!athleteToDelete) return;
    try {
      setIsDeleting(true);
      await adminFootballService.deleteAthlete(athleteToDelete.id || athleteToDelete._id);
      toast.success(ADMIN_FOOTBALL_CONSTANTS.DELETE_MODAL.SUCCESS_DELETE);
      setAthleteToDelete(null);
      await loadAthletes();
    } catch (err) {
      console.error('Erro ao inativar atleta:', err);
      toast.error('Erro ao inativar atleta.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    athletes,
    total,
    page,
    totalPages,
    isLoading,
    search,
    setSearch,
    position,
    setPosition,
    setPage,
    reload: loadAthletes,
    athleteToDelete,
    setAthleteToDelete,
    isDeleting,
    handleDelete,
  };
};
