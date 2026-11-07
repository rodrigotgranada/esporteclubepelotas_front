'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  LayoutContainer,
  Text,
  Title,
  Button,
  Input,
  Checkbox,
  FormField,
} from '@/shared/ui/components';
import {
  Phone,
  Mail,
  Plus,
  Trash2,
  Building2,
  Clock,
  Navigation,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { CONTACTS_SETTINGS_TEXTS } from './ContactsSettingsTab.constants';
import { useContactsSettingsTab } from '@/features/admin/hooks/settings/useContactsSettingsTab';

export const ContactsSettingsTab = () => {
  const {
    form,
    isLoading,
    addOpeningHour,
    removeOpeningHour,
    addPhone,
    removePhone,
    addEmail,
    removeEmail,
    addNavigationLink,
    removeNavigationLink,
    handleSave,
  } = useContactsSettingsTab();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const openingHours = watch('openingHours') || [];
  const contactPhones = watch('contactPhones') || [];
  const contactEmails = watch('contactEmails') || [];
  const footerNavigationLinks = watch('footerNavigationLinks') || [];

  return (
    <LayoutContainer className="max-w-4xl bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-8">
      {/* Header */}
      <LayoutContainer className="pb-4 border-b border-border">
        <Title level="h2" className="text-xl font-bold text-text-primary">
          {CONTACTS_SETTINGS_TEXTS.TITLE}
        </Title>
        <Text as="p" className="text-sm text-text-secondary mt-1">
          {CONTACTS_SETTINGS_TEXTS.DESCRIPTION}
        </Text>
      </LayoutContainer>

      {/* Section 1: Opening Hours */}
      <LayoutContainer className="flex flex-col gap-4">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <LayoutContainer className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {CONTACTS_SETTINGS_TEXTS.SECTION_HOURS_TITLE}
            </Title>
          </LayoutContainer>

          <Button
            variant="outline"
            size="sm"
            onClick={addOpeningHour}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_HOUR}
          </Button>
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_HOURS_DESC}
        </Text>

        {openingHours.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text as="p" className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_HOURS}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {openingHours.map((_, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <LayoutContainer className="w-full sm:w-1/3">
                  <FormField error={errors.openingHours?.[idx]?.department?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_HOUR_DEPT_PLACEHOLDER}
                      {...register(`openingHours.${idx}.department` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="flex-1">
                  <FormField error={errors.openingHours?.[idx]?.schedule?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_HOUR_SCHEDULE_PLACEHOLDER}
                      {...register(`openingHours.${idx}.schedule` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#ea580c] hover:bg-[#ea580c]/10 p-2 h-auto self-end sm:self-center"
                  onClick={() => removeOpeningHour(idx)}
                  title={CONTACTS_SETTINGS_TEXTS.BTN_REMOVE}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Section 2: Phones */}
      <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <LayoutContainer className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {CONTACTS_SETTINGS_TEXTS.SECTION_PHONES_TITLE}
            </Title>
          </LayoutContainer>

          <Button
            variant="outline"
            size="sm"
            onClick={addPhone}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_PHONE}
          </Button>
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_PHONES_DESC}
        </Text>

        {contactPhones.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text as="p" className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_PHONES}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {contactPhones.map((_, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <LayoutContainer className="w-full sm:w-1/3">
                  <FormField error={errors.contactPhones?.[idx]?.label?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_PHONE_LABEL_PLACEHOLDER}
                      {...register(`contactPhones.${idx}.label` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="w-full sm:w-1/3">
                  <FormField error={errors.contactPhones?.[idx]?.number?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_PHONE_NUMBER_PLACEHOLDER}
                      {...register(`contactPhones.${idx}.number` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="flex items-center justify-between sm:justify-start gap-4 flex-1">
                  <LayoutContainer className="flex items-center gap-2">
                    <FaWhatsapp className="w-4 h-4 text-emerald-500" />
                    <Controller
                      control={control}
                      name={`contactPhones.${idx}.isWhatsapp` as const}
                      render={({ field }) => (
                        <Checkbox
                          label={CONTACTS_SETTINGS_TEXTS.FIELD_IS_WHATSAPP}
                          checked={Boolean(field.value)}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </LayoutContainer>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#ea580c] hover:bg-[#ea580c]/10 p-2 h-auto ml-auto"
                    onClick={() => removePhone(idx)}
                    title={CONTACTS_SETTINGS_TEXTS.BTN_REMOVE}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Section 3: Emails */}
      <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <LayoutContainer className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {CONTACTS_SETTINGS_TEXTS.SECTION_EMAILS_TITLE}
            </Title>
          </LayoutContainer>

          <Button
            variant="outline"
            size="sm"
            onClick={addEmail}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_EMAIL}
          </Button>
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_EMAILS_DESC}
        </Text>

        {contactEmails.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text as="p" className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_EMAILS}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {contactEmails.map((_, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <LayoutContainer className="w-full sm:w-1/3">
                  <FormField error={errors.contactEmails?.[idx]?.label?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_EMAIL_LABEL_PLACEHOLDER}
                      {...register(`contactEmails.${idx}.label` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="flex-1">
                  <FormField error={errors.contactEmails?.[idx]?.email?.message}>
                    <Input
                      type="email"
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_EMAIL_PLACEHOLDER}
                      {...register(`contactEmails.${idx}.email` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#ea580c] hover:bg-[#ea580c]/10 p-2 h-auto self-end sm:self-center"
                  onClick={() => removeEmail(idx)}
                  title={CONTACTS_SETTINGS_TEXTS.BTN_REMOVE}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Section 4: Footer Navigation Links */}
      <LayoutContainer className="flex flex-col gap-4 pt-4 border-t border-border">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <LayoutContainer className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            <Title level="h3" className="text-base font-bold text-text-primary">
              {CONTACTS_SETTINGS_TEXTS.SECTION_NAV_TITLE}
            </Title>
          </LayoutContainer>

          <Button
            variant="outline"
            size="sm"
            onClick={addNavigationLink}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_NAV}
          </Button>
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_NAV_DESC}
        </Text>

        {footerNavigationLinks.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text as="p" className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_NAV}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {footerNavigationLinks.map((_, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all"
              >
                <LayoutContainer className="w-full md:w-1/3">
                  <FormField error={errors.footerNavigationLinks?.[idx]?.label?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_LABEL_PLACEHOLDER}
                      {...register(`footerNavigationLinks.${idx}.label` as const)}
                      className="text-sm"
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="w-full md:w-1/3">
                  <FormField error={errors.footerNavigationLinks?.[idx]?.url?.message}>
                    <Input
                      placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_URL_PLACEHOLDER}
                      {...register(`footerNavigationLinks.${idx}.url` as const)}
                      className="text-sm font-mono"
                    />
                  </FormField>
                </LayoutContainer>

                <LayoutContainer className="flex items-center gap-4 flex-1">
                  <Controller
                    control={control}
                    name={`footerNavigationLinks.${idx}.isVisible` as const}
                    render={({ field }) => (
                      <Checkbox
                        label={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_IS_VISIBLE}
                        checked={field.value !== false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`footerNavigationLinks.${idx}.isExternal` as const}
                    render={({ field }) => (
                      <Checkbox
                        label={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_IS_EXTERNAL}
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#ea580c] hover:bg-[#ea580c]/10 p-2 h-auto ml-auto"
                    onClick={() => removeNavigationLink(idx)}
                    title={CONTACTS_SETTINGS_TEXTS.BTN_REMOVE}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Section 5: Stadium and Legal */}
      <LayoutContainer className="flex flex-col gap-5 pt-4 border-t border-border">
        <LayoutContainer className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <Title level="h3" className="text-base font-bold text-text-primary">
            {CONTACTS_SETTINGS_TEXTS.SECTION_STADIUM_TITLE}
          </Title>
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_STADIUM_DESC}
        </Text>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_NAME}
            error={errors.stadiumName?.message}
          >
            <Input
              placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_NAME_PLACEHOLDER}
              {...register('stadiumName')}
              className="text-sm"
            />
          </FormField>

          <FormField
            label={CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_ADDRESS}
            error={errors.stadiumAddress?.message}
          >
            <Input
              placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_ADDRESS_PLACEHOLDER}
              {...register('stadiumAddress')}
              className="text-sm"
            />
          </FormField>
        </LayoutContainer>

        <FormField
          label={CONTACTS_SETTINGS_TEXTS.FIELD_MAPS_EMBED}
          description={CONTACTS_SETTINGS_TEXTS.FIELD_MAPS_EMBED_HINT}
          error={errors.googleMapsEmbedUrl?.message}
        >
          <Input
            placeholder="https://maps.google.com/maps?q=..."
            {...register('googleMapsEmbedUrl')}
            className="text-sm font-mono"
          />
        </FormField>

        <FormField
          label={CONTACTS_SETTINGS_TEXTS.FIELD_COPYRIGHT}
          error={errors.copyrightText?.message}
        >
          <Input
            placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_COPYRIGHT_PLACEHOLDER}
            {...register('copyrightText')}
            className="text-sm"
          />
        </FormField>
      </LayoutContainer>

      {/* Save Button */}
      <LayoutContainer className="pt-4 border-t border-border flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isLoading}
          className="min-w-[220px]"
        >
          {isLoading ? CONTACTS_SETTINGS_TEXTS.SAVING_BUTTON : CONTACTS_SETTINGS_TEXTS.SAVE_BUTTON}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
