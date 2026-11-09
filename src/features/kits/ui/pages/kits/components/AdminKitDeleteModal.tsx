'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { ClubKit } from '../../../../types/kits.types';
import { KITS_TEXTS } from '../../../../constants/kits.constants';

export interface AdminKitDeleteModalProps {
  isOpen: boolean;
  kit: ClubKit | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminKitDeleteModal: React.FC<AdminKitDeleteModalProps> = ({
  isOpen,
  kit,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!kit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <LayoutContainer className="p-6 flex flex-col items-center text-center gap-4">
        {/* Ícone de Alerta Terracota (Zero Vermelho) */}
        <LayoutContainer className="w-14 h-14 rounded-full bg-error/15 text-error flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </LayoutContainer>

        <Title level="h3" className="text-xl font-black text-text-primary">
          {KITS_TEXTS.DELETE_MODAL_TITLE}
        </Title>

        <Text className="text-sm text-text-secondary">
          {KITS_TEXTS.DELETE_MODAL_DESC} <strong>&quot;{kit.name}&quot;</strong> ({kit.competition} - {kit.seasonYear})?
        </Text>

        <Text className="text-xs text-text-muted bg-surface/80 p-3 rounded-lg border border-border">
          {KITS_TEXTS.DELETE_MODAL_WARNING}
        </Text>

        <LayoutContainer className="flex items-center justify-center gap-3 w-full mt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 text-xs font-bold"
          >
            {KITS_TEXTS.DELETE_MODAL_CANCEL}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 text-xs font-bold text-error border-error/40 hover:bg-error/15 hover:border-error"
          >
            {isDeleting ? 'Excluindo...' : KITS_TEXTS.DELETE_MODAL_CONFIRM}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};

