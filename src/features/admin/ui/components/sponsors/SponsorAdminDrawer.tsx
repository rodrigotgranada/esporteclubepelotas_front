'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Drawer,
  LayoutContainer,
  Text,
  Title,
  Form,
  Input,
  Button,
  Switch,
  Badge,
  Spinner,
  FormField,
  SafeImage,
  CropModal,
} from '@/shared/ui/components';
import { Save, Upload, Building2, Globe, Calendar, Hash, Sparkles, Eye } from 'lucide-react';
import { ADMIN_SPONSORS_TEXTS } from '../../../constants/admin-sponsors.constants';
import { useSponsorAdminDrawer } from '../../../hooks/sponsors/useSponsorAdminDrawer';

export interface SponsorAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorId: string | null;
  onSaveSuccess: () => void;
}

export const SponsorAdminDrawer: React.FC<SponsorAdminDrawerProps> = ({
  isOpen,
  onClose,
  sponsorId,
  onSaveSuccess,
}) => {
  const texts = ADMIN_SPONSORS_TEXTS.DRAWER;

  const {
    form,
    fileInputRef,
    logoPreview,
    isCropOpen,
    imageToCrop,
    isLoadingDetails,
    isSaving,
    savingLabel,
    triggerFileInput,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleUseOriginal,
    onSubmit,
  } = useSponsorAdminDrawer({
    isOpen,
    sponsorId,
    onSaveSuccess,
    onClose,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={sponsorId ? texts.TITLE_EDIT : texts.TITLE_CREATE}
        size="lg"
      >
        {isLoadingDetails ? (
          <LayoutContainer className="flex flex-col items-center justify-center p-16">
            <Spinner size={36} />
            <Text as="p" className="text-text-secondary mt-3">
              Carregando dados do parceiro...
            </Text>
          </LayoutContainer>
        ) : (
          <Form onSubmit={onSubmit} className="flex flex-col gap-6 p-6">
            {/* Seção 1: Informações Gerais */}
            <LayoutContainer className="flex flex-col gap-4">
              <LayoutContainer className="flex items-center gap-2 border-b border-border pb-2">
                <Building2 size={18} className="text-primary" />
                <Title level="h3" className="text-base font-bold text-text-primary">
                  {texts.SECTION_GENERAL}
                </Title>
              </LayoutContainer>

              {/* Nome da Marca */}
              <FormField
                label={texts.LABEL_NAME}
                error={errors.name?.message}
                required
              >
                <Input
                  {...register('name')}
                  placeholder={texts.PLACEHOLDER_NAME}
                  error={errors.name?.message}
                />
              </FormField>

              {/* URL do Site */}
              <FormField
                label={texts.LABEL_WEBSITE}
                error={errors.websiteUrl?.message}
              >
                <LayoutContainer className="relative">
                  <Input
                    {...register('websiteUrl')}
                    placeholder={texts.PLACEHOLDER_WEBSITE}
                    error={errors.websiteUrl?.message}
                    className="pl-9"
                  />
                  <Globe className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </LayoutContainer>
              </FormField>

              {/* Ordem de Exibição */}
              <FormField
                label={texts.LABEL_DISPLAY_ORDER}
                error={errors.displayOrder?.message}
              >
                <LayoutContainer className="flex flex-col gap-1">
                  <LayoutContainer className="relative max-w-xs">
                    <Input
                      type="number"
                      {...register('displayOrder')}
                      error={errors.displayOrder?.message}
                      className="pl-9"
                    />
                    <Hash className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </LayoutContainer>
                  <Text as="p" className="text-xs text-text-secondary">
                    {texts.HELP_DISPLAY_ORDER}
                  </Text>
                </LayoutContainer>
              </FormField>
            </LayoutContainer>

            {/* Seção 2: Logotipo */}
            <LayoutContainer className="flex flex-col gap-4">
              <LayoutContainer className="flex items-center gap-2 border-b border-border pb-2">
                <Upload size={18} className="text-primary" />
                <Title level="h3" className="text-base font-bold text-text-primary">
                  {texts.SECTION_LOGO}
                </Title>
              </LayoutContainer>

              <Text as="p" className="text-xs text-text-secondary">
                {texts.LOGO_HELP}
              </Text>

              <LayoutContainer className="flex items-center gap-5 p-4 rounded-xl bg-surface/50 border border-border">
                {logoPreview ? (
                  <LayoutContainer className="relative w-28 h-20 rounded-xl bg-surface border border-border p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    <SafeImage
                      src={logoPreview}
                      alt="Logo do Patrocinador"
                      fill
                      className="object-contain"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                  </LayoutContainer>
                ) : (
                  <LayoutContainer className="w-28 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 text-text-secondary">
                    <Building2 size={28} className="opacity-40" />
                  </LayoutContainer>
                )}

                <LayoutContainer className="flex flex-col gap-2">
                  {/* Input hidden disparado pelo botão */}
                  <LayoutContainer className="hidden">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    />
                  </LayoutContainer>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    leftIcon={<Upload size={14} />}
                    className="font-bold"
                  >
                    {logoPreview ? texts.BUTTON_CHANGE_LOGO : texts.BUTTON_SELECT_LOGO}
                  </Button>

                  {errors.logoUrl && (
                    <Text as="span" className="text-xs text-orange-600 font-semibold">
                      {errors.logoUrl.message}
                    </Text>
                  )}
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Seção 3: Vigência Contratual */}
            <LayoutContainer className="flex flex-col gap-4">
              <LayoutContainer className="flex items-center gap-2 border-b border-border pb-2">
                <Calendar size={18} className="text-primary" />
                <Title level="h3" className="text-base font-bold text-text-primary">
                  {texts.SECTION_CONTRACT}
                </Title>
              </LayoutContainer>

              <Text as="p" className="text-xs text-text-secondary">
                {texts.HELP_CONTRACT}
              </Text>

              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label={texts.LABEL_START_DATE}
                  error={errors.contractStartDate?.message}
                >
                  <Input
                    type="date"
                    {...register('contractStartDate')}
                    error={errors.contractStartDate?.message}
                  />
                </FormField>

                <FormField
                  label={texts.LABEL_END_DATE}
                  error={errors.contractEndDate?.message}
                >
                  <Input
                    type="date"
                    {...register('contractEndDate')}
                    error={errors.contractEndDate?.message}
                  />
                </FormField>
              </LayoutContainer>
            </LayoutContainer>

            {/* Seção 4: Visibilidade e Destaques (Status & Ticker) */}
            <LayoutContainer className="flex flex-col gap-4">
              <LayoutContainer className="flex items-center gap-2 border-b border-border pb-2">
                <Eye size={18} className="text-primary" />
                <Title level="h3" className="text-base font-bold text-text-primary">
                  {texts.SECTION_VISIBILITY}
                </Title>
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-3">
                {/* Switch 1: Status Ativo / Inativo */}
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => {
                    const isActive = Boolean(field.value);
                    return (
                      <LayoutContainer className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 transition-all shadow-xs">
                        <LayoutContainer className="flex flex-col gap-1 pr-4">
                          <LayoutContainer className="flex items-center gap-2">
                            <Text as="span" className="font-bold text-sm text-text-primary">
                              {isActive ? texts.LABEL_IS_ACTIVE : texts.LABEL_IS_INACTIVE}
                            </Text>
                            <Badge variant={isActive ? 'success' : 'default'} size="sm" className="font-bold">
                              {isActive ? texts.BADGE_ACTIVE : texts.BADGE_INACTIVE}
                            </Badge>
                          </LayoutContainer>
                          <Text as="p" className="text-xs text-text-secondary leading-relaxed">
                            {isActive ? texts.DESC_IS_ACTIVE : texts.DESC_IS_INACTIVE}
                          </Text>
                        </LayoutContainer>
                        <Switch
                          checked={isActive}
                          onChange={(checked) => field.onChange(checked)}
                          id="sponsor-is-active-switch"
                          label=""
                        />
                      </LayoutContainer>
                    );
                  }}
                />

                {/* Switch 2: Destaque no Ticker Superior */}
                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => {
                    const isFeatured = Boolean(field.value);
                    return (
                      <LayoutContainer className="flex items-center justify-between p-4 rounded-xl bg-surface/60 border border-border hover:border-primary/40 transition-all shadow-xs">
                        <LayoutContainer className="flex flex-col gap-1 pr-4">
                          <LayoutContainer className="flex items-center gap-2">
                            <Sparkles className={`w-4 h-4 shrink-0 ${isFeatured ? 'text-primary' : 'text-text-secondary'}`} />
                            <Text as="span" className="font-bold text-sm text-text-primary">
                              {isFeatured ? texts.LABEL_IS_FEATURED : texts.LABEL_IS_STANDARD}
                            </Text>
                            <Badge variant={isFeatured ? 'primary' : 'default'} size="sm" className="font-bold">
                              {isFeatured ? texts.BADGE_FEATURED : texts.BADGE_STANDARD}
                            </Badge>
                          </LayoutContainer>
                          <Text as="p" className="text-xs text-text-secondary leading-relaxed">
                            {isFeatured ? texts.DESC_IS_FEATURED : texts.DESC_IS_STANDARD}
                          </Text>
                        </LayoutContainer>
                        <Switch
                          checked={isFeatured}
                          onChange={(checked) => field.onChange(checked)}
                          id="sponsor-is-featured-switch"
                          label=""
                        />
                      </LayoutContainer>
                    );
                  }}
                />
              </LayoutContainer>
            </LayoutContainer>

            {/* Rodapé de Ações */}
            <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSaving}
              >
                {texts.BUTTON_CANCEL}
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                isLoading={isSaving}
                leftIcon={!isSaving ? <Save size={16} /> : undefined}
                className="font-bold min-w-[150px]"
              >
                {isSaving ? savingLabel : texts.BUTTON_SAVE}
              </Button>
            </LayoutContainer>
          </Form>
        )}
      </Drawer>

      {/* Modal de Crop do Logotipo (Livre, idêntico ao restante do sistema) */}
      {imageToCrop && (
        <CropModal
          isOpen={isCropOpen}
          imageSrc={imageToCrop}
          onClose={handleCropCancel}
          onCropSave={handleCropComplete}
          onUseOriginal={handleUseOriginal}
        />
      )}
    </>
  );
};
