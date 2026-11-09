'use client';

import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import {
  Drawer,
  LayoutContainer,
  Text,
  Input,
  Textarea,
  Checkbox,
  Button,
  Select,
  Option,
  SafeImage,
  CropModal,
} from '@/shared/ui/components';
import { Upload, Image as ImageIcon, X, Loader2, Crop, Sparkles } from 'lucide-react';
import { ClubKit } from '../../../../types/kits.types';
import { KITS_TEXTS } from '../../../../constants/kits.constants';
import { useAdminKitDrawer } from '../../../../hooks/useAdminKitDrawer';

export interface AdminKitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  kit: ClubKit | null;
  onSuccess: () => void;
}

export const AdminKitDrawer: React.FC<AdminKitDrawerProps> = ({
  isOpen,
  onClose,
  kit,
  onSuccess,
}) => {
  const {
    form,
    isSaving,
    imagePreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    galleryUrls,
    isUploadingGallery,
    handleSelectImageFile,
    handleCropSave,
    handleUseOriginal,
    handleCloseCropModal,
    handleRemoveImage,
    handleAddGalleryImage,
    handleRemoveGalleryImage,
    handleSubmit,
  } = useAdminKitDrawer({
    kit,
    onClose,
    onSuccess,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const drawerTitle = kit
    ? `${KITS_TEXTS.DRAWER_TITLE_EDIT}: ${kit.name}`
    : KITS_TEXTS.DRAWER_TITLE_NEW;

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title={drawerTitle} size="xl">
        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
          <LayoutContainer className="flex flex-col gap-6 p-6 overflow-y-auto">
            {/* 1. Nome do Uniforme e Tipo */}
            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <LayoutContainer className="sm:col-span-8 flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_NAME} *
                </Text>
                <Input
                  {...register('name')}
                  placeholder={KITS_TEXTS.FIELD_NAME_PLACEHOLDER}
                  className="w-full text-sm"
                />
                {errors.name && (
                  <Text as="span" className="text-xs text-error font-medium">
                    {errors.name.message}
                  </Text>
                )}
              </LayoutContainer>

              <LayoutContainer className="sm:col-span-4 flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_TYPE} *
                </Text>
                <Controller
                  name="kitType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full text-sm"
                    >
                      <Option value="HOME">{KITS_TEXTS.TYPE_HOME}</Option>
                      <Option value="AWAY">{KITS_TEXTS.TYPE_AWAY}</Option>
                      <Option value="THIRD">{KITS_TEXTS.TYPE_THIRD}</Option>
                      <Option value="GOALKEEPER">{KITS_TEXTS.TYPE_GOALKEEPER}</Option>
                      <Option value="SPECIAL">{KITS_TEXTS.TYPE_SPECIAL}</Option>
                    </Select>
                  )}
                />
              </LayoutContainer>
            </LayoutContainer>

            {/* 2. Campeonato Obrigatório e Ano da Temporada */}
            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <LayoutContainer className="sm:col-span-8 flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_COMPETITION} *
                </Text>
                <Input
                  {...register('competition')}
                  placeholder={KITS_TEXTS.FIELD_COMPETITION_PLACEHOLDER}
                  className="w-full text-sm"
                />
                <Text as="span" className="text-[11px] text-text-muted">
                  {KITS_TEXTS.FIELD_COMPETITION_HELP}
                </Text>
                {errors.competition && (
                  <Text as="span" className="text-xs text-error font-medium">
                    {errors.competition.message}
                  </Text>
                )}
              </LayoutContainer>

              <LayoutContainer className="sm:col-span-4 flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_YEAR} *
                </Text>
                <Input
                  type="number"
                  {...register('seasonYear')}
                  placeholder={KITS_TEXTS.FIELD_YEAR_PLACEHOLDER}
                  className="w-full text-sm"
                />
                {errors.seasonYear && (
                  <Text as="span" className="text-xs text-error font-medium">
                    {errors.seasonYear.message}
                  </Text>
                )}
              </LayoutContainer>
            </LayoutContainer>

            {/* 3. Fornecedor Esportivo e Patrocínio */}
            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <LayoutContainer className="sm:col-span-6 flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_MANUFACTURER}
                </Text>
                <Input
                  {...register('manufacturer')}
                  placeholder={KITS_TEXTS.FIELD_MANUFACTURER_PLACEHOLDER}
                  className="w-full text-sm"
                />
              </LayoutContainer>

              <LayoutContainer className="sm:col-span-6 flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_SPONSOR}
                </Text>
                <Input
                  {...register('sponsor')}
                  placeholder={KITS_TEXTS.FIELD_SPONSOR_PLACEHOLDER}
                  className="w-full text-sm"
                />
              </LayoutContainer>
            </LayoutContainer>

            {/* 4. Descrição / Detalhes do Manto */}
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {KITS_TEXTS.FIELD_DESCRIPTION}
              </Text>
              <Textarea
                {...register('description')}
                rows={3}
                placeholder={KITS_TEXTS.FIELD_DESCRIPTION_PLACEHOLDER}
                className="w-full text-sm"
              />
            </LayoutContainer>

            {/* 5. Foto Principal com CropModal */}
            <LayoutContainer className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-background/50">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {KITS_TEXTS.FIELD_IMAGE} *
              </Text>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectImageFile(file);
                  e.target.value = '';
                }}
              />

              {imagePreviewUrl ? (
                <LayoutContainer className="flex items-center gap-4">
                  <LayoutContainer className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center shrink-0">
                    <SafeImage
                      src={imagePreviewUrl}
                      alt="Prévia do manto"
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                  </LayoutContainer>

                  <LayoutContainer className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      leftIcon={<Crop className="w-3.5 h-3.5" />}
                      className="text-xs font-bold"
                    >
                      Trocar Foto / Recortar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      leftIcon={<X className="w-3.5 h-3.5 text-error" />}
                      className="text-xs font-bold text-error hover:bg-error/10"
                    >
                      Remover Foto
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              ) : (
                <LayoutContainer
                  onClick={() => imageInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border hover:border-primary rounded-xl cursor-pointer bg-surface/50 hover:bg-surface transition-colors"
                >
                  <Upload className="w-8 h-8 text-primary mb-2" />
                  <Text as="span" className="text-xs font-bold text-text-primary">
                    Clique para selecionar a foto do uniforme
                  </Text>
                  <Text as="span" className="text-[11px] text-text-muted mt-1">
                    Formatos PNG, JPG ou WEBP. A ferramenta de recorte será aberta em seguida.
                  </Text>
                </LayoutContainer>
              )}

              {errors.imageUrl && (
                <Text as="span" className="text-xs text-error font-medium">
                  {errors.imageUrl.message}
                </Text>
              )}
            </LayoutContainer>

            {/* 6. Galeria de Fotos Complementares */}
            <LayoutContainer className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-background/50">
              <LayoutContainer className="flex items-center justify-between">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_GALLERY}
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isUploadingGallery}
                  leftIcon={
                    isUploadingGallery ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5" />
                    )
                  }
                  className="text-xs font-bold"
                >
                  Adicionar Foto
                </Button>
              </LayoutContainer>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddGalleryImage(file);
                  e.target.value = '';
                }}
              />

              {galleryUrls.length > 0 && (
                <LayoutContainer className="flex items-center gap-2 overflow-x-auto pt-2">
                  {galleryUrls.map((url, idx) => (
                    <LayoutContainer
                      key={idx}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-background group shrink-0"
                    >
                      <SafeImage
                        src={url}
                        alt={`Galeria ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        fallbackSrc="/images/pelotas-logo.png"
                      />
                      <LayoutContainer
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </LayoutContainer>
                    </LayoutContainer>
                  ))}
                </LayoutContainer>
              )}
            </LayoutContainer>

            {/* 7. Status e Opções: Definir como Oficial Atual / Ativo */}
            <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface/50">
              <Controller
                name="isCurrent"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isCurrent"
                    label={
                      <LayoutContainer className="flex items-center gap-1.5 font-bold text-text-primary">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <Text as="span">{KITS_TEXTS.FIELD_IS_CURRENT}</Text>
                      </LayoutContainer>
                    }
                    description={KITS_TEXTS.FIELD_IS_CURRENT_HELP}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isActive"
                    label={KITS_TEXTS.FIELD_IS_ACTIVE}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />

              <LayoutContainer className="flex items-center gap-4 pt-2 border-t border-border/50">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {KITS_TEXTS.FIELD_DISPLAY_ORDER}:
                </Text>
                <Input
                  type="number"
                  {...register('displayOrder')}
                  className="w-24 text-sm"
                />
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Rodapé com Botões de Ação */}
          <LayoutContainer className="p-4 border-t border-border flex items-center justify-end gap-3 bg-surface">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isSaving}
              className="text-xs font-bold"
            >
              {KITS_TEXTS.BTN_CANCEL}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
              leftIcon={
                isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined
              }
              className="text-xs font-bold shadow-md"
            >
              {isSaving ? 'Salvando...' : KITS_TEXTS.BTN_SAVE}
            </Button>
          </LayoutContainer>
        </form>
      </Drawer>

      {/* Modal de Recorte Oficial com Proporção 1:1 e Suporte Completo */}
      {isCropModalOpen && cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          aspect={1}
          onCropSave={handleCropSave}
          onUseOriginal={handleUseOriginal}
          onClose={handleCloseCropModal}
        />
      )}
    </>
  );
};

