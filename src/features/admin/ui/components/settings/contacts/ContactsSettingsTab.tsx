'use client';

import React from 'react';
import {
  LayoutContainer,
  Text,
  Title,
  Button,
  Input,
  Checkbox,
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
    isLoading,
    openingHours,
    phones,
    emails,
    navigationLinks,
    stadiumName,
    setStadiumName,
    stadiumAddress,
    setStadiumAddress,
    googleMapsEmbedUrl,
    setGoogleMapsEmbedUrl,
    copyrightText,
    setCopyrightText,
    handleHourChange,
    handleAddHour,
    handleRemoveHour,
    handlePhoneChange,
    handleAddPhone,
    handleRemovePhone,
    handleEmailChange,
    handleAddEmail,
    handleRemoveEmail,
    handleNavChange,
    handleAddNav,
    handleRemoveNav,
    handleSave,
  } = useContactsSettingsTab();

  return (
    <LayoutContainer className="max-w-4xl bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-8">
      {/* Header */}
      <LayoutContainer className="pb-4 border-b border-border">
        <Title level="h2" className="text-xl font-bold text-text-primary">
          {CONTACTS_SETTINGS_TEXTS.TITLE}
        </Title>
        <Text className="text-sm text-text-secondary mt-1">
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
            onClick={handleAddHour}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_HOUR}
          </Button>
        </LayoutContainer>

        <Text className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_HOURS_DESC}
        </Text>

        {openingHours.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_HOURS}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {openingHours.map((item, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <LayoutContainer className="w-full sm:w-1/3">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_HOUR_DEPT_PLACEHOLDER}
                    value={item.department}
                    onChange={(e) => handleHourChange(idx, 'department', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <LayoutContainer className="flex-1">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_HOUR_SCHEDULE_PLACEHOLDER}
                    value={item.schedule}
                    onChange={(e) => handleHourChange(idx, 'schedule', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error hover:bg-error/10 p-2 h-auto self-end sm:self-center"
                  onClick={() => handleRemoveHour(idx)}
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
            onClick={handleAddPhone}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_PHONE}
          </Button>
        </LayoutContainer>

        <Text className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_PHONES_DESC}
        </Text>

        {phones.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_PHONES}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {phones.map((phone, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <LayoutContainer className="w-full sm:w-1/3">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_PHONE_LABEL_PLACEHOLDER}
                    value={phone.label}
                    onChange={(e) => handlePhoneChange(idx, 'label', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <LayoutContainer className="w-full sm:w-1/3">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_PHONE_NUMBER_PLACEHOLDER}
                    value={phone.number}
                    onChange={(e) => handlePhoneChange(idx, 'number', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <LayoutContainer className="flex items-center justify-between sm:justify-start gap-4 flex-1">
                  <LayoutContainer className="flex items-center gap-2">
                    <FaWhatsapp className="w-4 h-4 text-emerald-500" />
                    <Checkbox
                      label={CONTACTS_SETTINGS_TEXTS.FIELD_IS_WHATSAPP}
                      checked={!!phone.isWhatsapp}
                      onChange={(e) => handlePhoneChange(idx, 'isWhatsapp', e.target.checked)}
                    />
                  </LayoutContainer>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error/10 p-2 h-auto ml-auto"
                    onClick={() => handleRemovePhone(idx)}
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
            onClick={handleAddEmail}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_EMAIL}
          </Button>
        </LayoutContainer>

        <Text className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_EMAILS_DESC}
        </Text>

        {emails.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_EMAILS}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {emails.map((emailItem, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <LayoutContainer className="w-full sm:w-1/3">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_EMAIL_LABEL_PLACEHOLDER}
                    value={emailItem.label}
                    onChange={(e) => handleEmailChange(idx, 'label', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <LayoutContainer className="flex-1">
                  <Input
                    type="email"
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_EMAIL_PLACEHOLDER}
                    value={emailItem.email}
                    onChange={(e) => handleEmailChange(idx, 'email', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error hover:bg-error/10 p-2 h-auto self-end sm:self-center"
                  onClick={() => handleRemoveEmail(idx)}
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
            onClick={handleAddNav}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0"
          >
            {CONTACTS_SETTINGS_TEXTS.BTN_ADD_NAV}
          </Button>
        </LayoutContainer>

        <Text className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_NAV_DESC}
        </Text>

        {navigationLinks.length === 0 ? (
          <LayoutContainer className="p-6 text-center border border-dashed border-border rounded-xl">
            <Text className="text-sm text-text-secondary">
              {CONTACTS_SETTINGS_TEXTS.EMPTY_NAV}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-3">
            {navigationLinks.map((navItem, idx) => (
              <LayoutContainer
                key={idx}
                className="bg-background border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all"
              >
                <LayoutContainer className="w-full md:w-1/3">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_LABEL_PLACEHOLDER}
                    value={navItem.label}
                    onChange={(e) => handleNavChange(idx, 'label', e.target.value)}
                    className="text-sm"
                  />
                </LayoutContainer>

                <LayoutContainer className="w-full md:w-1/3">
                  <Input
                    placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_URL_PLACEHOLDER}
                    value={navItem.url}
                    onChange={(e) => handleNavChange(idx, 'url', e.target.value)}
                    className="text-sm font-mono"
                  />
                </LayoutContainer>

                <LayoutContainer className="flex items-center gap-4 flex-1">
                  <Checkbox
                    label={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_IS_VISIBLE}
                    checked={navItem.isVisible !== false}
                    onChange={(e) => handleNavChange(idx, 'isVisible', e.target.checked)}
                  />

                  <Checkbox
                    label={CONTACTS_SETTINGS_TEXTS.FIELD_NAV_IS_EXTERNAL}
                    checked={!!navItem.isExternal}
                    onChange={(e) => handleNavChange(idx, 'isExternal', e.target.checked)}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error/10 p-2 h-auto ml-auto"
                    onClick={() => handleRemoveNav(idx)}
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

        <Text className="text-xs text-text-secondary">
          {CONTACTS_SETTINGS_TEXTS.SECTION_STADIUM_DESC}
        </Text>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text className="text-xs font-bold text-text-primary">
              {CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_NAME}
            </Text>
            <Input
              placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_NAME_PLACEHOLDER}
              value={stadiumName}
              onChange={(e) => setStadiumName(e.target.value)}
              className="text-sm"
            />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text className="text-xs font-bold text-text-primary">
              {CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_ADDRESS}
            </Text>
            <Input
              placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_STADIUM_ADDRESS_PLACEHOLDER}
              value={stadiumAddress}
              onChange={(e) => setStadiumAddress(e.target.value)}
              className="text-sm"
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text className="text-xs font-bold text-text-primary">
            {CONTACTS_SETTINGS_TEXTS.FIELD_MAPS_EMBED}
          </Text>
          <Input
            placeholder="https://maps.google.com/maps?q=..."
            value={googleMapsEmbedUrl}
            onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
            className="text-sm font-mono"
          />
          <Text className="text-[11px] text-text-secondary">
            {CONTACTS_SETTINGS_TEXTS.FIELD_MAPS_EMBED_HINT}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text className="text-xs font-bold text-text-primary">
            {CONTACTS_SETTINGS_TEXTS.FIELD_COPYRIGHT}
          </Text>
          <Input
            placeholder={CONTACTS_SETTINGS_TEXTS.FIELD_COPYRIGHT_PLACEHOLDER}
            value={copyrightText}
            onChange={(e) => setCopyrightText(e.target.value)}
            className="text-sm"
          />
        </LayoutContainer>
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
