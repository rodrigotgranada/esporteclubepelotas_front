'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { membershipService } from '@/features/membership/services/membership.service';
import { EleventicketsMember } from '@/features/membership/types/membership.types';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';

export const useAdminManualOverrideModal = (onSuccess?: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<EleventicketsMember | null>(null);
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'INACTIVE'>('SUSPENDED');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = (member: EleventicketsMember) => {
    setSelectedMember(member);
    setStatus(member.isSocio ? 'SUSPENDED' : 'ACTIVE');
    setReason(member.overrideReason || '');
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setSelectedMember(null);
    setReason('');
  };

  const handleSubmit = async () => {
    if (!selectedMember) return;
    const cleanReason = reason.trim();
    if (!cleanReason) {
      toast.error('Informe a justificativa da decisão manual.');
      return;
    }

    try {
      setIsSubmitting(true);
      const isSocio = status === 'ACTIVE';
      await membershipService.overrideMemberStatus(selectedMember.userId, {
        isSocio,
        status,
        reason: cleanReason,
      });

      toast.success(MEMBERSHIP_TEXTS.TOAST_OVERRIDE_SUCCESS);
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error('Erro ao aplicar trava manual:', err);
      toast.error(MEMBERSHIP_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isOpen,
    selectedMember,
    status,
    setStatus,
    reason,
    setReason,
    isSubmitting,
    handleOpen,
    handleClose,
    handleSubmit,
  };
};

