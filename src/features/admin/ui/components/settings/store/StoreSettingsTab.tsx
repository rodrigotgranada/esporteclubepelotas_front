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
} from '@/shared/ui/components';
import {
  ShoppingBag,
  Globe,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Save,
} from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa6';
import { STORE_SETTINGS_TEXTS } from './StoreSettingsTab.constants';
import { useStoreSettingsTab } from '@/features/admin/hooks/settings/useStoreSettingsTab';

export const StoreSettingsTab = () => {
  const { form, isLoading, handleSave } = useStoreSettingsTab();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const isOnlineActive = watch('storeIsOnlineActive');
  const hasMemberDiscount = watch('storeHasMemberDiscount');

  return (
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

      {/* Section 1: Basic Info */}
      <LayoutContainer className="flex flex-col gap-4">
        <LayoutContainer className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <Title level="h3" className="text-base font-bold text-text-primary">
            {STORE_SETTINGS_TEXTS.SECTION_GENERAL_TITLE}
          </Title>
        </LayoutContainer>
        <Text as="p" className="text-xs text-text-secondary -mt-2">
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

      {/* Section 3: Social & Direct Channels */}
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
          <FormField
            label={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_NUMBER_LABEL}
            error={errors.storeWhatsappNumber?.message}
          >
            <Input
              {...register('storeWhatsappNumber')}
              placeholder={STORE_SETTINGS_TEXTS.FIELD_WHATSAPP_NUMBER_PLACEHOLDER}
              disabled={isLoading}
            />
          </FormField>

          <FormField
            label={STORE_SETTINGS_TEXTS.FIELD_INSTAGRAM_URL_LABEL}
            error={errors.storeInstagramUrl?.message}
          >
            <Input
              {...register('storeInstagramUrl')}
              placeholder={STORE_SETTINGS_TEXTS.FIELD_INSTAGRAM_URL_PLACEHOLDER}
              disabled={isLoading}
            />
          </FormField>

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
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isLoading ? STORE_SETTINGS_TEXTS.SAVING_BUTTON : STORE_SETTINGS_TEXTS.BUTTON_SAVE}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
