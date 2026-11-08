'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Modal,
} from '@/shared/ui/components';
import { StadiumGalleryImage } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import {
  Loader2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface StadiumGalleryDeleteModalProps {
  isOpen: boolean;
  photo: StadiumGalleryImage | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StadiumGalleryDeleteModal: React.FC<StadiumGalleryDeleteModalProps> = ({
  isOpen,
  photo,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="flex flex-col gap-5 p-2">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ADMIN_STADIUM_TEXTS.GALLERY.DELETE_CONFIRM_TITLE}
        </Title>
        <LayoutContainer className="flex items-start gap-3">
          <LayoutContainer className="w-10 h-10 rounded-full bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col gap-1">
            <Text className="text-sm text-text-primary font-medium">
              {ADMIN_STADIUM_TEXTS.GALLERY.DELETE_CONFIRM_DESC}
            </Text>
            {photo && photo.caption && (
              <Text className="text-xs text-text-secondary italic mt-1">
                &quot;{photo.caption}&quot;
              </Text>
            )}
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            disabled={isDeleting}
            onClick={onClose}
            className="cursor-pointer"
          >
            <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CANCEL_BUTTON}</Text>
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-1.5" />
            )}
            <Text as="span">
              {isDeleting ? 'Excluindo...' : ADMIN_STADIUM_TEXTS.GALLERY.CONFIRM_DELETE_BUTTON}
            </Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
