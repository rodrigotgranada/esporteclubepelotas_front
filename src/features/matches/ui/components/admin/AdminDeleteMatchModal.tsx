'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button, Spinner } from '@/shared/ui/components/atoms';
import { Modal } from '@/shared/ui/components/atoms/Modal';
import { Championship, Match } from '../../../types/matches.types';
import { MATCHES_CONSTANTS } from '../../../constants/matches.constants';

export interface AdminDeleteMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  championship: Championship | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminDeleteMatchModal: React.FC<AdminDeleteMatchModalProps> = ({
  isOpen,
  match,
  championship,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  const { DELETE_MODAL } = MATCHES_CONSTANTS.ADMIN;

  const isMatch = Boolean(match);
  const title = isMatch ? DELETE_MODAL.MATCH_TITLE : DELETE_MODAL.CHAMPIONSHIP_TITLE;
  const description = isMatch
    ? `Deseja realmente excluir a partida Pelotas vs ${match?.opponentName}? Os registros serão arquivados com segurança.`
    : `Deseja inativar o campeonato ${championship?.name}? As partidas vinculadas serão preservadas.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LayoutContainer className="space-y-6 pt-2">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {title}
        </Title>

        <Text className="text-sm text-text-muted">{description}</Text>

        <LayoutContainer className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            {DELETE_MODAL.CANCEL_BUTTON}
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-5 border-none"
          >
            {isDeleting ? (
              <LayoutContainer className="flex items-center space-x-2">
                <Spinner size={16} />
                <Text>Excluindo...</Text>
              </LayoutContainer>
            ) : (
              DELETE_MODAL.CONFIRM_BUTTON
            )}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
