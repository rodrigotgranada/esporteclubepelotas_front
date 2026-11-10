'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  LayoutContainer,
  Text,
  Title,
  Button,
  Input,
  Textarea,
  FormField,
  Switch,
  Badge,
  MaskedInput,
  SafeImage,
  CropModal,
} from '@/shared/ui/components';
import {
  ShoppingBag,
  Globe,
  MessageCircle,
  MapPin,
  Sparkles,
  Save,
  Upload,
  Trash2,
  ImageIcon,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import { STORE_SETTINGS_TEXTS } from './StoreSettingsTab.constants';
import { useStoreSettingsTab } from '@/features/admin/hooks/settings/useStoreSettingsTab';

export const StoreSettingsTab = () => {
  const {
    form,
    isLoading,
    savingLabel,
    facadeFileInputRef,
    facadePreview,
    isCropOpen,
    imageToCrop,
    triggerFacadeFileInput,
    handleFacadeFileChange,
    handleCropComplete,
    handleCropCancel,
    handleUseOriginal,
    handleRemoveFacade,
    handleSave,
  } = useStoreSettingsTab();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const isOnlineActive = watch('storeIsOnlineActive');
  const hasMemberDiscount = watch('storeHasMemberDiscount');

  return (
    <>
      <LayoutContainer className="max-w-4xl bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-8">
        {/* Header */}
        <LayoutContainer className="pb-4 border-b border-border flex items-start justify-between gap-4">
          <LayoutContainer className="flex flex-col gap-1">
            <LayoutContainer className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <Title level="h2" className="text-xl font-bold text-text-primary">
                {STORE_SETTINGS_TEXTS.TITLE}
              </Title>
            </LayoutContainer>
            <Text as="p" className="text-sm text-text-secondary">
              {STORE_SETTINGS_TEXTS.DESCRIPTION}
            </Text>
          </LayoutContainer>

          <Badge variant={isOnlineActive ? 'success' : 'default'} className="shrink-0">
            {isOnlineActive
              ? STORE_SETTINGS_TEXTS.ONLINE_STATUS_ACTIVE_BADGE
              : STORE_SETTINGS_TEXTS.ONLINE_STATUS_SOON_BADGE}
          </Badge>
        </LayoutContainer>

        {/* Section 1: Basic Info & Fachada Hero */}
        <LayoutContainer className="flex flex-col gap-5">
          <LayoutContainer className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STORE_SETTINGS_TEXTS.SECTION_GENERAL_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary -mt-3">
            {STORE_SETTINGS_TEXTS.SECTION_GENERAL_DESC}
          </Text>

          <LayoutContainer className="grid grid-cols-1 gap-4">
            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_STORE_NAME_LABEL}
              error={errors.storeName?.message}
              required
            >
              <Input
                {...register('storeName')}
                placeholder={STORE_SETTINGS_TEXTS.FIELD_STORE_NAME_PLACEHOLDER}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_STORE_DESC_LABEL}
              error={errors.storeDescription?.message}
            >
              <Textarea
                {...register('storeDescription')}
                rows={3}
                placeholder={STORE_SETTINGS_TEXTS.FIELD_STORE_DESC_PLACEHOLDER}
                disabled={isLoading}
              />
            </FormField>

            {/* Upload da Foto da Fachada (Hero Background) */}
            <LayoutContainer className="p-4 rounded-xl bg-surface-elevated/40 border border-border flex flex-col gap-3">
              <LayoutContainer className="flex items-center justify-between">
                <LayoutContainer className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <Text as="span" className="font-bold text-xs uppercase tracking-wider text-text-primary">
                    {STORE_SETTINGS_TEXTS.SECTION_FACADE_TITLE}
                  </Text>
                </LayoutContainer>
                {facadePreview && (
                  <Badge variant="primary" size="sm" className="font-semibold text-[10px]">
                    Foto Definida
                  </Badge>
                )}
              </LayoutContainer>

              <Text as="p" className="text-xs text-text-secondary leading-snug">
                {STORE_SETTINGS_TEXTS.SECTION_FACADE_DESC}
              </Text>

              {/* Input de arquivo oculto */}
              <LayoutContainer className="hidden">
                <input
                  ref={facadeFileInputRef}
                  type="file"
                  onChange={handleFacadeFileChange}
                  accept="image/png,image/jpeg,image/webp"
                />
              </LayoutContainer>

              {/* Preview da Fachada */}
              <LayoutContainer className="relative w-full h-44 rounded-xl bg-[#0b1329] border border-blue-900/40 p-2 flex items-center justify-center overflow-hidden my-1">
                {facadePreview ? (
                  <SafeImage
                    src={facadePreview}
                    alt="Foto da Fachada da Loja"
                    fill
                    className="object-cover"
                    fallbackSrc="/images/stadium-default.jpg"
                  />
                ) : (
                  <LayoutContainer className="flex flex-col items-center gap-2 text-slate-500">
                    <ShoppingBag size={32} className="opacity-40" />
                    <Text as="span" className="text-xs font-medium text-slate-400">
                      {STORE_SETTINGS_TEXTS.FACADE_EMPTY}
                    </Text>
                  </LayoutContainer>
                )}
              </LayoutContainer>

              <LayoutContainer className="flex items-center gap-2 pt-2 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerFacadeFileInput}
                  leftIcon={<Upload size={14} />}
                  className="font-bold text-xs flex-1"
                  disabled={isLoading}
                >
                  {facadePreview
                    ? STORE_SETTINGS_TEXTS.BUTTON_CHANGE_FACADE
                    : STORE_SETTINGS_TEXTS.BUTTON_SELECT_FACADE}
                </Button>

                {facadePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFacade}
                    className="px-3 text-text-secondary hover:text-[#ea580c]"
                    title={STORE_SETTINGS_TEXTS.BUTTON_REMOVE_FACADE}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Section 2: Online Store (E-commerce) */}
        <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
          <LayoutContainer className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STORE_SETTINGS_TEXTS.SECTION_ONLINE_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary -mt-2">
            {STORE_SETTINGS_TEXTS.SECTION_ONLINE_DESC}
          </Text>

          <LayoutContainer className="bg-surface-elevated/40 border border-border/80 rounded-xl p-4 flex flex-col gap-4">
            <Controller
              control={control}
              name="storeIsOnlineActive"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label={STORE_SETTINGS_TEXTS.SWITCH_ONLINE_ACTIVE_LABEL}
                  description={STORE_SETTINGS_TEXTS.SWITCH_ONLINE_ACTIVE_DESC}
                  disabled={isLoading}
                />
              )}
            />

            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_EXTERNAL_URL_LABEL}
              error={errors.storeExternalUrl?.message}
            >
              <Input
                {...register('storeExternalUrl')}
                placeholder={STORE_SETTINGS_TEXTS.FIELD_EXTERNAL_URL_PLACEHOLDER}
                disabled={isLoading}
              />
            </FormField>
          </LayoutContainer>
        </LayoutContainer>

        {/* Section 3: Social & Direct Channels (WhatsApp & Instagram) */}
        <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
          <LayoutContainer className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STORE_SETTINGS_TEXTS.SECTION_CHANNELS_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary -mt-2">
            {STORE_SETTINGS_TEXTS.SECTION_CHANNELS_DESC}
          </Text>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp com prefixo fixo 55 e máscara celular */}
            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_NUMBER_LABEL}
              error={errors.storeWhatsappNumber?.message}
              description={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_NUMBER_HELP}
            >
              <LayoutContainer className="flex items-center gap-2">
                <LayoutContainer className="px-3 py-2.5 rounded-lg bg-surface-elevated border border-border text-xs font-mono font-bold text-text-secondary select-none shrink-0 flex items-center gap-1.5">
                  <FaWhatsapp className="w-4 h-4 text-emerald-500" />
                  <span>+55</span>
                </LayoutContainer>
                <Controller
                  control={control}
                  name="storeWhatsappNumber"
                  render={({ field }) => (
                    <MaskedInput
                      mask="(00) 00000-0000"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="(53) 99999-9999"
                      disabled={isLoading}
                    />
                  )}
                />
              </LayoutContainer>
            </FormField>

            {/* Instagram Link */}
            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_INSTAGRAM_URL_LABEL}
              error={errors.storeInstagramUrl?.message}
            >
              <LayoutContainer className="relative">
                <Input
                  {...register('storeInstagramUrl')}
                  placeholder={STORE_SETTINGS_TEXTS.FIELD_INSTAGRAM_URL_PLACEHOLDER}
                  disabled={isLoading}
                  className="pl-9"
                />
                <FaInstagram className="w-4 h-4 text-pink-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </LayoutContainer>
            </FormField>

            {/* Mensagem Personalizável do Card de WhatsApp */}
            <LayoutContainer className="sm:col-span-2">
              <FormField
                label={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_DESC_LABEL}
                error={errors.storeWhatsappDescription?.message}
              >
                <Input
                  {...register('storeWhatsappDescription')}
                  placeholder={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_DESC_PLACEHOLDER}
                  disabled={isLoading}
                />
              </FormField>
            </LayoutContainer>

            {/* Mensagem Inicial do Link do WhatsApp */}
            <LayoutContainer className="sm:col-span-2">
              <FormField
                label={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_MESSAGE_LABEL}
                error={errors.storeWhatsappMessage?.message}
              >
                <Input
                  {...register('storeWhatsappMessage')}
                  placeholder={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_MESSAGE_PLACEHOLDER}
                  disabled={isLoading}
                />
              </FormField>
            </LayoutContainer>

            {/* Mensagem Personalizável do Card de Instagram */}
            <LayoutContainer className="sm:col-span-2">
              <FormField
                label={STORE_SETTINGS_TEXTS.FIELD_INSTAGRAM_DESC_LABEL}
                error={errors.storeInstagramDescription?.message}
              >
                <Input
                  {...register('storeInstagramDescription')}
                  placeholder={STORE_SETTINGS_TEXTS.FIELD_INSTAGRAM_DESC_PLACEHOLDER}
                  disabled={isLoading}
                />
              </FormField>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Section 4: Physical Store & Opening Hours */}
        <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
          <LayoutContainer className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STORE_SETTINGS_TEXTS.SECTION_PHYSICAL_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary -mt-2">
            {STORE_SETTINGS_TEXTS.SECTION_PHYSICAL_DESC}
          </Text>

          <LayoutContainer className="grid grid-cols-1 gap-4">
            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_ADDRESS_LABEL}
              error={errors.storeAddress?.message}
            >
              <Input
                {...register('storeAddress')}
                placeholder={STORE_SETTINGS_TEXTS.FIELD_ADDRESS_PLACEHOLDER}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label={STORE_SETTINGS_TEXTS.FIELD_HOURS_LABEL}
              error={errors.storeOpeningHours?.message}
            >
              <Textarea
                {...register('storeOpeningHours')}
                rows={2}
                placeholder={STORE_SETTINGS_TEXTS.FIELD_HOURS_PLACEHOLDER}
                disabled={isLoading}
              />
            </FormField>
          </LayoutContainer>
        </LayoutContainer>

        {/* Section 5: Member Discount */}
        <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
          <LayoutContainer className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {STORE_SETTINGS_TEXTS.SECTION_MEMBER_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary -mt-2">
            {STORE_SETTINGS_TEXTS.SECTION_MEMBER_DESC}
          </Text>

          <LayoutContainer className="bg-surface-elevated/40 border border-border/80 rounded-xl p-4 flex flex-col gap-4">
            <Controller
              control={control}
              name="storeHasMemberDiscount"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  label={STORE_SETTINGS_TEXTS.SWITCH_MEMBER_DISCOUNT_LABEL}
                  description={STORE_SETTINGS_TEXTS.SWITCH_MEMBER_DISCOUNT_DESC}
                  disabled={isLoading}
                />
              )}
            />

            {hasMemberDiscount && (
              <FormField
                label={STORE_SETTINGS_TEXTS.FIELD_MEMBER_DISCOUNT_TEXT_LABEL}
                error={errors.storeMemberDiscountText?.message}
              >
                <Textarea
                  {...register('storeMemberDiscountText')}
                  rows={3}
                  placeholder={STORE_SETTINGS_TEXTS.FIELD_MEMBER_DISCOUNT_TEXT_PLACEHOLDER}
                  disabled={isLoading}
                />
              </FormField>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Footer / Submit */}
        <LayoutContainer className="pt-4 border-t border-border flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
            isLoading={isLoading}
            leftIcon={!isLoading ? <Save className="w-4 h-4" /> : undefined}
            className="font-bold min-w-[180px]"
          >
            {isLoading ? savingLabel || STORE_SETTINGS_TEXTS.SAVING_BUTTON : STORE_SETTINGS_TEXTS.BUTTON_SAVE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Modal de Crop da Foto de Fachada */}
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
