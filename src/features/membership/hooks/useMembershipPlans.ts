import { useState, useEffect, useCallback } from 'react';
import { MembershipPlan } from '../types/membership.types';
import { membershipService } from '../services/membership.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useMembershipPlans = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await membershipService.getActivePlans();
      setPlans(data);
    } catch (err: unknown) {
      console.error('Erro ao buscar planos de sócio:', err);
      setError('Não foi possível carregar os planos de sócios no momento.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Sincronização em tempo real quando o Admin alterar ou reordenar planos
  useRealtimeEvents('membership', () => {
    fetchPlans();
  });

  return {
    plans,
    isLoading,
    error,
    refetch: fetchPlans,
  };
};

