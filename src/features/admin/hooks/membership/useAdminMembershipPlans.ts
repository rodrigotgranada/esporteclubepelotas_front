import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { MembershipPlan } from '@/features/membership/types/membership.types';
import { membershipService } from '@/features/membership/services/membership.service';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAdminMembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await membershipService.getAdminPlans();
      setPlans(data);
    } catch (err: unknown) {
      console.error('Erro ao buscar planos admin:', err);
      toast.error('Erro ao carregar lista de planos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useRealtimeEvents('membership', () => {
    fetchPlans();
  });

  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPlan(null);
  };

  const handleToggleActive = async (plan: MembershipPlan) => {
    try {
      await membershipService.toggleAdminPlanActive(plan.id);
      toast.success(
        plan.active ? 'Plano pausado com sucesso.' : 'Plano ativado com sucesso.'
      );
      await fetchPlans();
    } catch (err: unknown) {
      console.error('Erro ao alternar status do plano:', err);
      toast.error('Erro ao alterar status do plano.');
    }
  };

  const handleOpenDelete = (plan: MembershipPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    try {
      setIsDeleting(true);
      await membershipService.deleteAdminPlan(planToDelete.id);
      toast.success(MEMBERSHIP_TEXTS.TOAST_DELETE_SUCCESS);
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
      await fetchPlans();
    } catch (err: unknown) {
      console.error('Erro ao excluir plano:', err);
      toast.error('Erro ao excluir o plano.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorder = async (reorderedPlans: MembershipPlan[]) => {
    try {
      setPlans(reorderedPlans);
      const ids = reorderedPlans.map((p) => p.id);
      await membershipService.reorderAdminPlans(ids);
      toast.success('Ordem dos planos salva com sucesso.');
    } catch (err: unknown) {
      console.error('Erro ao reordenar planos:', err);
      toast.error('Erro ao salvar nova ordem dos planos.');
      await fetchPlans();
    }
  };

  return {
    plans,
    isLoading,
    isDrawerOpen,
    selectedPlan,
    planToDelete,
    isDeleteModalOpen,
    isDeleting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseDrawer,
    handleToggleActive,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    handleReorder,
    refetch: fetchPlans,
  };
};
