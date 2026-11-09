'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Select,
  Option,
  Badge,
  Spinner,
} from '@/shared/ui/components';
import { EleventicketsMember } from '@/features/membership/types/membership.types';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { ShieldAlert, Check, X } from 'lucide-react';

export interface ManualSocioOverrideModalProps {
  isOpen: boolean;
  member: EleventicketsMember | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  onChangeStatus: (status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') => void;
  reason: string;
  onChangeReason: (reason: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const ManualSocioOverrideModal: React.FC<ManualSocioOverrideModalProps> = ({
  isOpen,
  member,
  status,
  onChangeStatus,
  reason,
  onChangeReason,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !member) return null;

  return (
    <LayoutContainer className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <LayoutContainer className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-surface border-2 border-border shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <LayoutContainer className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <LayoutContainer className="flex items-center gap-3">
            <LayoutContainer className="p-2.5 rounded-2xl bg-[#ea580c]/15 text-[#ea580c]">
              <ShieldAlert className="w-6 h-6" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <Title level="h3" className="text-lg font-black text-text-primary">
                {MEMBERSHIP_TEXTS.OVERRIDE_MODAL_TITLE}
              </Title>
              <Text as="span" className="text-xs text-text-secondary">
                {member.name} ({member.email})
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background"
          >
            <X className="w-5 h-5" />
          </Button>
        </LayoutContainer>

        {/* Descrição e Alerta de Trava */}
        <LayoutContainer className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-2">
          <LayoutContainer className="flex items-center gap-2">
            <Badge variant="warning" size="sm" className="font-bold text-[10px] uppercase">
              Trava Manual (MANUAL_OVERRIDE)
            </Badge>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary leading-relaxed">
            {MEMBERSHIP_TEXTS.OVERRIDE_MODAL_DESC}
          </Text>
        </LayoutContainer>

        {/* Formulário */}
        <LayoutContainer className="flex flex-col gap-4">
          {/* Seletor de Status */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {MEMBERSHIP_TEXTS.OVERRIDE_LABEL_STATUS}
            </Text>
            <Select
              value={status}
              onChange={(e) =>
                onChangeStatus(e.target.value as 'ACTIVE' | 'SUSPENDED' | 'INACTIVE')
              }
              className="text-xs"
            >
              <Option value="ACTIVE">{MEMBERSHIP_TEXTS.OVERRIDE_STATUS_ACTIVE}</Option>
              <Option value="SUSPENDED">{MEMBERSHIP_TEXTS.OVERRIDE_STATUS_SUSPENDED}</Option>
              <Option value="INACTIVE">{MEMBERSHIP_TEXTS.OVERRIDE_STATUS_INACTIVE}</Option>
            </Select>
          </LayoutContainer>

          {/* Campo de Justificativa */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {MEMBERSHIP_TEXTS.OVERRIDE_REASON_LABEL}
            </Text>
            <textarea
              value={reason}
              onChange={(e) => onChangeReason(e.target.value)}
              placeholder={MEMBERSHIP_TEXTS.OVERRIDE_REASON_PLACEHOLDER}
              rows={3}
              className="w-full p-3 rounded-xl bg-background border border-border text-text-primary text-xs focus:outline-hidden focus:border-primary transition-all resize-none"
            />
          </LayoutContainer>
        </LayoutContainer>

        {/* Botões de Ação */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-2 border-t border-border/80">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs font-bold"
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="font-bold text-xs uppercase px-5 py-2.5 inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4 text-background" />
                <span>{MEMBERSHIP_TEXTS.OVERRIDE_SAVING}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{MEMBERSHIP_TEXTS.OVERRIDE_BTN_CONFIRM}</span>
              </>
            )}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
