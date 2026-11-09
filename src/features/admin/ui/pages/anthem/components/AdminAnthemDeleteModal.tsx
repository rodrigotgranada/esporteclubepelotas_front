import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { ClubAnthem } from '@/features/anthem/types/anthem.types';
import { ANTHEM_TEXTS } from '@/features/anthem/constants/anthem.constants';

export interface AdminAnthemDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  anthem: ClubAnthem | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const AdminAnthemDeleteModal: React.FC<AdminAnthemDeleteModalProps> = ({
  isOpen,
  onClose,
  anthem,
  onConfirm,
  isDeleting,
}) => {
  if (!anthem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="flex flex-col gap-5 py-2">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ANTHEM_TEXTS.DELETE_MODAL_TITLE}
        </Title>

        <LayoutContainer className="p-4 rounded-2xl bg-[#ea580c]/10 border border-[#ea580c]/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
          <LayoutContainer className="flex flex-col gap-1">
            <Text className="text-sm font-bold text-text-primary">
              {anthem.title}
            </Text>
            <Text className="text-xs text-text-secondary leading-relaxed">
              {ANTHEM_TEXTS.DELETE_MODAL_DESC}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="font-bold text-xs"
          >
            {ANTHEM_TEXTS.BTN_CANCEL}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="font-bold text-xs bg-[#ea580c] hover:bg-[#c2410c] text-white border-0"
          >
            {isDeleting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Excluindo...
              </span>
            ) : (
              ANTHEM_TEXTS.BTN_CONFIRM_DELETE
            )}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
