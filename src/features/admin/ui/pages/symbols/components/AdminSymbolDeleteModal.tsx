'use client';

import React from 'react';
import { ConfirmModal } from '@/shared/ui/components';
import { ClubSymbol } from '@/features/symbols/types/symbols.types';
import { SYMBOLS_TEXTS } from '@/features/symbols/constants/symbols.constants';

export interface AdminSymbolDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: ClubSymbol | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const AdminSymbolDeleteModal: React.FC<AdminSymbolDeleteModalProps> = ({
  isOpen,
  onClose,
  symbol,
  onConfirm,
  isDeleting,
}) => {
  if (!symbol) return null;

  const description = `${SYMBOLS_TEXTS.DELETE_MODAL_DESC} (${symbol.name})`;

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={SYMBOLS_TEXTS.DELETE_MODAL_TITLE}
      description={description}
      confirmText={SYMBOLS_TEXTS.BTN_CONFIRM_DELETE}
      cancelText={SYMBOLS_TEXTS.BTN_CANCEL}
      variant="danger"
      isLoading={isDeleting}
    />
  );
};

