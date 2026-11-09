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
} from '@/shared/ui/components';
import { Upload, Image as ImageIcon, X, Loader2, Sparkles } from 'lucide-react';
import { ClubSymbol } from '@/features/symbols/types/symbols.types';
import { SYMBOLS_TEXTS, CATEGORY_LABELS } from '@/features/symbols/constants/symbols.constants';
import { useAdminSymbolDrawer } from '@/features/symbols/hooks/useAdminSymbolDrawer';

export interface AdminSymbolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: ClubSymbol | null;
  onSuccess: () => void;
}

export const AdminSymbolDrawer: React.FC<AdminSymbolDrawerProps> = ({
  isOpen,
  onClose,
  symbol,
  onSuccess,
}) => {
  const {
    form,
    isSaving,
    imagePreviewUrl,
    galleryUrls,
    isUploadingGallery,
    handleSelectImageFile,
    handleRemoveImage,
    handleAddGalleryImage,
    handleRemoveGalleryImage,
    handleSubmit,
  } = useAdminSymbolDrawer({
    symbol,
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

  const drawerTitle = symbol
    ? `${SYMBOLS_TEXTS.DRAWER_TITLE_EDIT}: ${symbol.name}`
    : SYMBOLS_TEXTS.DRAWER_TITLE_NEW;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={drawerTitle} size="xl">
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        <LayoutContainer className="flex flex-col gap-6 p-6 overflow-y-auto">
          {/* 1. Categoria e Identificação */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {SYMBOLS_TEXTS.FIELD_CATEGORY} *
              </Text>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full text-sm"
                  >
                    <Option value="MASCOT">{CATEGORY_LABELS.MASCOT}</Option>
                    <Option value="SHIELD">{CATEGORY_LABELS.SHIELD}</Option>
                    <Option value="FLAG">{CATEGORY_LABELS.FLAG}</Option>
                    <Option value="COLORS">{CATEGORY_LABELS.COLORS}</Option>
                  </Select>
                )}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {SYMBOLS_TEXTS.FIELD_NAME} *
              </Text>
              <Input
                type="text"
                placeholder={SYMBOLS_TEXTS.FIELD_NAME_PLACEHOLDER}
                {...register('name')}
                error={errors.name?.message}
                className="text-sm py-2.5"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* 2. Subtítulo e Período (Ano Início / Fim) */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <LayoutContainer className="sm:col-span-6 flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {SYMBOLS_TEXTS.FIELD_SUBTITLE}
              </Text>
              <Input
                type="text"
                placeholder={SYMBOLS_TEXTS.FIELD_SUBTITLE_PLACEHOLDER}
                {...register('subtitle')}
                className="text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="sm:col-span-3 flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {SYMBOLS_TEXTS.FIELD_YEAR_START}
              </Text>
              <Input
                type="number"
                placeholder={SYMBOLS_TEXTS.FIELD_YEAR_START_PLACEHOLDER}
                {...register('yearStart')}
                className="text-sm py-2.5"
              />
            </LayoutContainer>

            <LayoutContainer className="sm:col-span-3 flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {SYMBOLS_TEXTS.FIELD_YEAR_END}
              </Text>
              <Input
                type="number"
                placeholder={SYMBOLS_TEXTS.FIELD_YEAR_END_PLACEHOLDER}
                {...register('yearEnd')}
                className="text-sm py-2.5"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* 3. Descrição / História */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-secondary">
              {SYMBOLS_TEXTS.FIELD_DESCRIPTION}
            </Text>
            <Textarea
              rows={4}
              placeholder={SYMBOLS_TEXTS.FIELD_DESCRIPTION_PLACEHOLDER}
              {...register('description')}
              className="text-sm leading-relaxed"
            />
          </LayoutContainer>

          {/* 4. Imagem Principal */}
          <LayoutContainer className="flex flex-col gap-2 p-4 rounded-2xl bg-surface border border-border">
            <Text as="span" className="text-xs font-bold text-text-secondary">
              {SYMBOLS_TEXTS.FIELD_IMAGE}
            </Text>

            <LayoutContainer className="flex flex-col sm:flex-row items-center gap-4">
              {imagePreviewUrl ? (
                <LayoutContainer className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary/40 bg-background/50 shadow-md flex items-center justify-center p-2 group">
                  <SafeImage
                    src={imagePreviewUrl}
                    alt="Preview"
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                    fallbackSrc="/images/pelotas-logo.png"
                  />
                  <Button
                    type="button"
                    variant="custom"
                    size="none"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-md hover:opacity-90"
                    title="Remover imagem"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </LayoutContainer>
              ) : (
                <LayoutContainer className="w-28 h-28 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-text-secondary bg-background/50">
                  <ImageIcon className="w-6 h-6" />
                  <Text className="text-[10px] font-bold">Sem Foto</Text>
                </LayoutContainer>
              )}

              <LayoutContainer className="flex flex-col gap-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) handleSelectImageFile(file);
                  }}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  leftIcon={<Upload className="w-4 h-4" />}
                  className="text-xs font-bold"
                >
                  Selecionar Imagem Principal
                </Button>
                <Text className="text-[11px] text-text-secondary">
                  Formatos aceitos: PNG, JPG, WebP ou SVG (máx. 10MB)
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* 5. Galeria de Imagens Complementares */}
          <LayoutContainer className="flex flex-col gap-3 p-4 rounded-2xl bg-surface border border-border">
            <LayoutContainer className="flex items-center justify-between">
              <LayoutContainer className="flex flex-col">
                <Text as="span" className="text-xs font-bold text-text-secondary">
                  {SYMBOLS_TEXTS.FIELD_GALLERY}
                </Text>
                <Text className="text-[11px] text-text-secondary">
                  Adicione fotos de acervo, fantasias antigas e registros de época
                </Text>
              </LayoutContainer>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddGalleryImage(file);
                }}
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingGallery}
                onClick={() => galleryInputRef.current?.click()}
                leftIcon={
                  isUploadingGallery ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )
                }
                className="text-xs font-bold"
              >
                {isUploadingGallery ? 'Enviando Foto...' : 'Adicionar Foto'}
              </Button>
            </LayoutContainer>

            {galleryUrls.length > 0 ? (
              <LayoutContainer className="flex flex-wrap gap-3 pt-2">
                {galleryUrls.map((url, idx) => (
                  <LayoutContainer
                    key={idx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-background group"
                  >
                    <SafeImage
                      src={url}
                      alt={`Galeria ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                    <Button
                      type="button"
                      variant="custom"
                      size="none"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir foto"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            ) : (
              <Text className="text-xs text-text-secondary italic">
                Nenhuma foto complementar adicionada à galeria.
              </Text>
            )}
          </LayoutContainer>

          {/* 6. Opções (Oficial, Ativo, Ordem) */}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LayoutContainer className="p-3.5 rounded-xl bg-surface border border-border">
              <Checkbox
                label={SYMBOLS_TEXTS.BADGE_OFFICIAL}
                description="Versão oficial da categoria"
                {...register('isOfficial')}
              />
            </LayoutContainer>

            <LayoutContainer className="p-3.5 rounded-xl bg-surface border border-border">
              <Checkbox
                label={SYMBOLS_TEXTS.BADGE_ACTIVE}
                description="Visível para os torcedores"
                {...register('isActive')}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1">
              <Text as="span" className="text-xs font-bold text-text-secondary">
                {SYMBOLS_TEXTS.FIELD_DISPLAY_ORDER}
              </Text>
              <Input
                type="number"
                {...register('displayOrder')}
                className="text-sm py-2"
              />
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Rodapé com Ações */}
        <LayoutContainer className="p-4 sm:p-6 border-t border-border bg-surface/90 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="font-bold text-xs"
          >
            {SYMBOLS_TEXTS.BTN_CANCEL}
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="font-bold text-xs px-6 py-2.5 min-w-[140px]"
          >
            {isSaving ? (
              <LayoutContainer className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <Text as="span">Salvando...</Text>
              </LayoutContainer>
            ) : (
              SYMBOLS_TEXTS.BTN_SAVE
            )}
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
};
