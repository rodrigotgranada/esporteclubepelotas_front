import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  MembershipLead,
  MembershipLeadStatus,
} from '@/features/membership/types/membership.types';
import { membershipService } from '@/features/membership/services/membership.service';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAdminMembershipLeads = () => {
  const [leads, setLeads] = useState<MembershipLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await membershipService.getAdminLeads({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page,
        limit: 20,
      });
      setLeads(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalLeads(res.totalElements || 0);
    } catch (err: unknown) {
      console.error('Erro ao buscar leads de sócios:', err);
      toast.error('Erro ao carregar lista de interessados.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useRealtimeEvents('membership_leads', () => {
    fetchLeads();
  });

  const handleUpdateStatus = async (
    leadId: string,
    newStatus: MembershipLeadStatus
  ) => {
    try {
      await membershipService.updateAdminLeadStatus(leadId, { status: newStatus });
      toast.success(MEMBERSHIP_TEXTS.TOAST_STATUS_SUCCESS);
      await fetchLeads();
    } catch (err: unknown) {
      console.error('Erro ao atualizar status do lead:', err);
      toast.error('Erro ao atualizar status.');
    }
  };

  const openWhatsAppToTorcedor = (lead: MembershipLead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const planName = lead.planName || 'Quadro Social';

    const message = encodeURIComponent(
      `🐺 *Olá, ${lead.name}!* Aqui é da Secretaria do Esporte Clube Pelotas.\n\nVimos que você iniciou o cadastro de sócio para o plano *${planName}*. Como podemos te ajudar a concluir sua associação e emitir sua carteirinha?`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return {
    leads,
    isLoading,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    totalLeads,
    handleUpdateStatus,
    openWhatsAppToTorcedor,
    refetch: fetchLeads,
  };
};

