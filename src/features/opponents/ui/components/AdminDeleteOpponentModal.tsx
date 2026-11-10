'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components/atoms';
import { AlertTriangle } from 'lucide-react';
import { OpponentClub } from '../../types/opponents.types';
import { OPPONENTS_CONSTANTS } from '../../constants/opponents.constants';

export interface AdminDeleteOpponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  opponent: OpponentClub | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const AdminDeleteOpponentModal: React.FC<AdminDeleteOpponentModalProps> = ({
  isOpen,
  onClose,
  opponent,
  onConfirm,
  isDeleting,
}) => {
  const { DELETE_MODAL } = OPPONENTS_CONSTANTS;

  if (!opponent) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="space-y-4 text-center">
        <LayoutContainer className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </LayoutContainer>

        <LayoutContainer className="space-y-1">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {DELETE_MODAL.TITLE}
          </Title>
          <Text className="text-sm font-semibold text-secondary block">
            {opponent.name}
          </Text>
          <Text className="text-xs text-text-muted mt-2 block">
            {DELETE_MODAL.CONFIRM_TEXT}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center justify-center space-x-3 pt-4 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {DELETE_MODAL.CANCEL_BUTTON}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-orange-600 text-white hover:bg-orange-700 font-bold px-5 cursor-pointer shadow-md"
          >
            {isDeleting ? 'Excluindo...' : DELETE_MODAL.CONFIRM_BUTTON}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};

