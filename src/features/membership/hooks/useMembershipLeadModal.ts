import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { MembershipPlan } from '../types/membership.types';
import { membershipService } from '../services/membership.service';
import {
  MEMBERSHIP_TEXTS,
  buildMembershipWhatsAppUrl,
} from '../constants/membership.constants';

export const useMembershipLeadModal = () => {
  const { user } = useAuthStore();
  const { settings } = useSettingsStore();

  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQuickLeadOpen, setIsQuickLeadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtém o WhatsApp padrão da secretaria cadastrado nas configurações
  const defaultSecretariatPhone =
    settings?.contactPhones?.find((p) => p.isWhatsapp)?.number ||
    settings?.contactPhones?.[0]?.number ||
    '53981112024';

  const handleOpenDetails = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleCloseQuickLead = () => {
    setIsQuickLeadOpen(false);
  };

  const executeLeadAndOpenWhatsApp = async (plan: MembershipPlan, leadData: {
    name: string;
    phone: string;
    email: string;
    cpf?: string | null;
    userId?: string | null;
  }) => {
    try {
      setIsSubmitting(true);

      // 1. Persistência transacional do Lead no backend
      await membershipService.createLead({
        planId: plan.id,
        userId: leadData.userId || null,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        cpf: leadData.cpf || undefined,
      });

      // 2. Destino WhatsApp (override no plano ou telefone geral da secretaria)
      const targetPhone = plan.whatsappOverride?.trim() || defaultSecretariatPhone;

      // 3. Montagem da URL padrão com mensagem pré-formatada
      const whatsappUrl = buildMembershipWhatsAppUrl({
        phone: targetPhone,
        planName: plan.name,
        planPrice: plan.price,
        billingPeriod: plan.billingPeriod,
        userName: leadData.name,
        userPhone: leadData.phone,
        userCpf: leadData.cpf,
        userEmail: leadData.email,
      });

      toast.success(MEMBERSHIP_TEXTS.TOAST_LEAD_SUCCESS);
      setIsDetailsOpen(false);
      setIsQuickLeadOpen(false);

      // 4. Redirecionamento amigável para o WhatsApp em nova aba
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: unknown) {
      console.error('Erro ao registrar intenção de sócio:', err);
      toast.error(MEMBERSHIP_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartSubscription = async (plan: MembershipPlan) => {
    if (user) {
      // Usuário autenticado: dados são preenchidos automaticamente com 0 fricção
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Torcedor Áureo-Cerúleo';
      const userPhone = user.phones?.[0]?.number || '(53) 99999-9999';
      const userCpf = user.cpf || null;
      const userEmail = user.email;

      await executeLeadAndOpenWhatsApp(plan, {
        name: fullName,
        phone: userPhone,
        email: userEmail,
        cpf: userCpf,
        userId: user._id || null,
      });
    } else {
      // Usuário não autenticado: abre modal de cadastro rápido de lead
      setIsDetailsOpen(false);
      setIsQuickLeadOpen(true);
    }
  };

  const handleSubmitQuickLead = async (formData: {
    name: string;
    phone: string;
    email: string;
    cpf?: string;
  }) => {
    if (!selectedPlan) return;
    await executeLeadAndOpenWhatsApp(selectedPlan, {
      ...formData,
      userId: null,
    });
  };

  return {
    selectedPlan,
    isDetailsOpen,
    isQuickLeadOpen,
    isSubmitting,
    handleOpenDetails,
    handleCloseDetails,
    handleCloseQuickLead,
    handleStartSubscription,
    handleSubmitQuickLead,
  };
};
