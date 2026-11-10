'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Input,
  Button,
} from '@/shared/ui/components/atoms';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { OpponentClub } from '../../types/opponents.types';
import { OPPONENTS_CONSTANTS, DEFAULT_CLUB_BADGE } from '../../constants/opponents.constants';
import { useAdminOpponentModal } from '../../hooks/useAdminOpponentModal';

export interface AdminOpponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  opponent?: OpponentClub | null;
  initialName?: string;
  onSuccess?: (savedClub?: OpponentClub) => void;
  isQuickMode?: boolean;
}

export const AdminOpponentModal: React.FC<AdminOpponentModalProps> = ({
  isOpen,
  onClose,
  opponent,
  initialName,
  onSuccess,
  isQuickMode = false,
}) => {
  const { MODAL } = OPPONENTS_CONSTANTS;
  const isEditing = Boolean(opponent);

  const {
    register,
    handleSubmit,
    errors,
    isActive,
    setValue,
    isSaving,
    isUploadingBadge,
    fileInputRef,
    previewBadgeUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectBadgeClick,
    handleBadgeFileChange,
    handleCropSave,
    handleCropCancel,
  } = useAdminOpponentModal({
    isOpen,
    onClose,
    opponent,
    initialName,
    onSuccess,
  });

  const modalTitle = isQuickMode
    ? MODAL.QUICK_CREATE_TITLE
    : isEditing
    ? MODAL.EDIT_TITLE
    : MODAL.CREATE_TITLE;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <LayoutContainer className="space-y-6">
          {/* Cabeçalho */}
          <LayoutContainer className="border-b border-border/60 pb-3">
            <Title level="h3" className="text-xl font-bold text-text-primary">
              {modalTitle}
            </Title>
            <Text className="text-xs text-text-muted mt-1">
              {isQuickMode
                ? 'Preencha os dados do clube para utilizá-lo imediatamente nesta partida.'
                : 'Cadastre clubes adversários para compor o calendário de jogos oficiais e amistosos.'}
            </Text>
          </LayoutContainer>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input oculto para seleção de distintivo */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleBadgeFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Linha 1: Nome Completo e Nome Reduzido */}
            <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LayoutContainer className="space-y-1">
                <Text className="text-xs font-semibold text-text-secondary">
                  {MODAL.NAME_LABEL}
                </Text>
                <Input
                  placeholder={MODAL.NAME_PLACEHOLDER}
                  {...register('name')}
                />
                {errors.name && (
                  <Text className="text-xs text-orange-500 font-medium">
                    {errors.name.message}
                  </Text>
                )}
              </LayoutContainer>

              <LayoutContainer className="space-y-1">
                <Text className="text-xs font-semibold text-text-secondary">
                  {MODAL.SHORT_NAME_LABEL}
                </Text>
                <Input
                  placeholder={MODAL.SHORT_NAME_PLACEHOLDER}
                  {...register('shortName')}
                />
                {errors.shortName && (
                  <Text className="text-xs text-orange-500 font-medium">
                    {errors.shortName.message}
                  </Text>
                )}
              </LayoutContainer>
            </LayoutContainer>

            {/* Linha 2: Cidade e Estádio Sede */}
            <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LayoutContainer className="space-y-1">
                <Text className="text-xs font-semibold text-text-secondary">
                  {MODAL.CITY_LABEL}
                </Text>
                <Input
                  placeholder={MODAL.CITY_PLACEHOLDER}
                  {...register('city')}
                />
                {errors.city && (
                  <Text className="text-xs text-orange-500 font-medium">
                    {errors.city.message}
                  </Text>
                )}
              </LayoutContainer>

              <LayoutContainer className="space-y-1">
                <Text className="text-xs font-semibold text-text-secondary">
                  {MODAL.STADIUM_LABEL}
                </Text>
                <Input
                  placeholder={MODAL.STADIUM_PLACEHOLDER}
                  {...register('stadiumName')}
                />
                {errors.stadiumName && (
                  <Text className="text-xs text-orange-500 font-medium">
                    {errors.stadiumName.message}
                  </Text>
                )}
              </LayoutContainer>
            </LayoutContainer>

            {/* Linha 3: Distintivo Oficial 1:1 com CropModal */}
            <LayoutContainer className="space-y-2 p-4 rounded-xl border border-border/60 bg-surface/40">
              <Text className="text-xs font-semibold text-text-secondary">
                {MODAL.BADGE_LABEL}
              </Text>
              <LayoutContainer className="flex items-center gap-4">
                <LayoutContainer className="w-16 h-16 rounded-xl bg-surface-hover border border-border flex items-center justify-center p-1 overflow-hidden shadow-inner">
                  <SafeImage
                    src={previewBadgeUrl || DEFAULT_CLUB_BADGE}
                    alt="Escudo do Clube"
                    width={56}
                    height={56}
                    className="object-contain max-h-14"
                  />
                </LayoutContainer>

                <LayoutContainer className="space-y-1 flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSelectBadgeClick}
                    className="text-xs font-bold border-secondary/40 text-secondary hover:bg-secondary/10 cursor-pointer"
                  >
                    {previewBadgeUrl ? 'Trocar Distintivo (Recortar 1:1)' : 'Selecionar & Recortar Distintivo'}
                  </Button>
                  <Text className="text-[11px] text-text-muted block">
                    Formato quadrado recomendado (PNG ou WEBP com fundo transparente).
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Linha 4: Status Ativo */}
            <LayoutContainer className="pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setValue('isActive', e.target.checked)}
                  className="rounded border-border text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                />
                <Text className="text-xs font-medium text-text-primary">
                  {MODAL.ACTIVE_LABEL}
                </Text>
              </label>
            </LayoutContainer>

            {/* Rodapé com Ações */}
            <LayoutContainer className="flex items-center justify-end space-x-3 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="cursor-pointer"
              >
                {MODAL.CANCEL_BUTTON}
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSaving || isUploadingBadge}
                className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-5 cursor-pointer shadow-md"
              >
                {isSaving || isUploadingBadge ? MODAL.SAVING_BUTTON : MODAL.SAVE_BUTTON}
              </Button>
            </LayoutContainer>
          </form>
        </LayoutContainer>
      </Modal>

      {/* Modal de Recorte Oficial 1:1 */}
      {isCropModalOpen && cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          aspect={1}
          onCropSave={handleCropSave}
          onClose={handleCropCancel}
        />
      )}
    </>
  );
};

