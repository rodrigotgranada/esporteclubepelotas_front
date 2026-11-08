'use client';

import React, { useRef } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  FormField,
  Input,
  SafeImage,
  Modal,
} from '@/shared/ui/components';
import { StadiumGalleryImage } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import {
  Loader2,
  Edit3,
  Crop as CropIcon,
  Check,
} from 'lucide-react';

interface StadiumGalleryEditModalProps {
  isOpen: boolean;
  photo: StadiumGalleryImage | null;
  caption: string;
  isSaving: boolean;
  onClose: () => void;
  onCaptionChange: (caption: string) => void;
  onSave: () => void;
  onOpenRecrop: () => void;
  onSelectReplaceFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const StadiumGalleryEditModal: React.FC<StadiumGalleryEditModalProps> = ({
  isOpen,
  photo,
  caption,
  isSaving,
  onClose,
  onCaptionChange,
  onSave,
  onOpenRecrop,
  onSelectReplaceFile,
}) => {
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !photo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="flex flex-col gap-5 p-2">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ADMIN_STADIUM_TEXTS.GALLERY.EDIT_MODAL_TITLE}
        </Title>

        <LayoutContainer className="group relative w-full h-56 rounded-2xl overflow-hidden bg-background border border-border shadow-inner">
          <SafeImage
            src={photo.url}
            alt="Foto em edição"
            fill
            sizes="600px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay que surge ao passar o mouse com as 2 opções solicitadas */}
          <LayoutContainer className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-3 backdrop-blur-xs z-10">
            <LayoutContainer className="flex items-center gap-4">
              {/* Opção 1: Ícone de recortar para recortar */}
              <Button
                type="button"
                size="none"
                variant="custom"
                onClick={onOpenRecrop}
                className="w-12 h-12 rounded-full bg-surface/95 text-text-primary hover:bg-primary hover:text-black border border-border shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                title={ADMIN_STADIUM_TEXTS.GALLERY.CROP_PHOTO_TOOLTIP}
                aria-label={ADMIN_STADIUM_TEXTS.GALLERY.CROP_PHOTO_TOOLTIP}
              >
                <CropIcon className="w-5 h-5 text-current" />
              </Button>

              {/* Opção 2: Caneta para alterar / substituir a foto se quiser */}
              <Button
                type="button"
                size="none"
                variant="custom"
                onClick={() => replaceFileInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-surface/95 text-text-primary hover:bg-primary hover:text-black border border-border shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                title={ADMIN_STADIUM_TEXTS.GALLERY.REPLACE_PHOTO_TOOLTIP}
                aria-label={ADMIN_STADIUM_TEXTS.GALLERY.REPLACE_PHOTO_TOOLTIP}
              >
                <Edit3 className="w-5 h-5 text-current" />
              </Button>
            </LayoutContainer>

            <Text className="text-xs text-white/90 font-medium tracking-wide">
              {ADMIN_STADIUM_TEXTS.GALLERY.CLICK_HINT}
            </Text>
          </LayoutContainer>

          {/* Indicador discreto no rodapé quando sem mouse hover */}
          <LayoutContainer className="absolute bottom-2.5 left-2.5 pointer-events-none group-hover:opacity-0 transition-opacity z-10">
            <LayoutContainer className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 flex items-center gap-1.5 shadow-md">
              <CropIcon className="w-3.5 h-3.5 text-primary" />
              <Text className="text-[11px] text-white font-medium">
                {ADMIN_STADIUM_TEXTS.GALLERY.HOVER_HINT}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <Input
            ref={replaceFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelectReplaceFile}
          />
        </LayoutContainer>

        <FormField label={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_LABEL}>
          <Input
            value={caption}
            placeholder={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_PLACEHOLDER}
            onChange={(e) => onCaptionChange(e.target.value)}
          />
        </FormField>

        <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            disabled={isSaving}
            onClick={onClose}
            className="cursor-pointer"
          >
            <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CANCEL_BUTTON}</Text>
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={onSave}
            className="cursor-pointer font-bold shadow-sm"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-1.5" />
            )}
            <Text as="span">
              {isSaving ? 'Salvando...' : ADMIN_STADIUM_TEXTS.GALLERY.UPDATE_CAPTION_BUTTON}
            </Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
