'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutContainer,
  Text,
  Title,
  Button,
  Input,
  Checkbox,
} from '@/shared/ui/components';
import {
  useSettingsStore,
  ContactPhoneItem,
  ContactEmailItem,
} from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { Phone, Mail, MapPin, Plus, Trash2, Building2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { CONTACTS_SETTINGS_TEXTS } from './ContactsSettingsTab.constants';

export const ContactsSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);

  const [phones, setPhones] = useState<ContactPhoneItem[]>([]);
  const [emails, setEmails] = useState<ContactEmailItem[]>([]);
  const [stadiumName, setStadiumName] = useState('');
  const [stadiumAddress, setStadiumAddress] = useState('');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');
  const [copyrightText, setCopyrightText] = useState('');

  useEffect(() => {
    if (settings) {
      setPhones(
        settings.contactPhones && settings.contactPhones.length > 0
          ? settings.contactPhones
          : [
              { label: 'Secretaria Geral', number: '(53) 3305-1908', isWhatsapp: false },
              { label: 'Central de Sócios', number: '(53) 98408-1908', isWhatsapp: true },
            ]
      );

      setEmails(
        settings.contactEmails && settings.contactEmails.length > 0
          ? settings.contactEmails
          : [
              { label: 'Secretaria', email: 'secretaria@ecpelotas.com.br' },
              { label: 'Imprensa', email: 'imprensa@ecpelotas.com.br' },
            ]
      );

      setStadiumName(settings.stadiumName || 'Estádio Boca do Lobo');
      setStadiumAddress(
        settings.stadiumAddress ||
          'Av. Bento Gonçalves esquina Parque Dom Antônio Zattera - Pelotas/RS, CEP 96015-140'
      );
      setGoogleMapsEmbedUrl(
        settings.googleMapsEmbedUrl ||
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.2081577457755!2d-52.338274023616654!3d-31.76483561175654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9511b594bce376b5%3A0xeae06c624641dbef!2sEst%C3%A1dio%20Boca%20do%20Lobo%20-%20Pelotas!5e0!3m2!1spt-BR!2sbr!4v1714000000000!5m2!1spt-BR!2sbr'
      );
      setCopyrightText(
        settings.copyrightText ||
          '© 2026 Esporte Clube Pelotas - Fundado em 11 de Outubro de 1908. Todos os direitos reservados.'
      );
    }
  }, [settings]);

  // Phone handlers
  const handlePhoneChange = (
    index: number,
    field: keyof ContactPhoneItem,
    value: string | boolean
  ) => {
    setPhones((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddPhone = () => {
    setPhones((prev) => [
      ...prev,
      { label: '', number: '', isWhatsapp: false },
    ]);
  };

  const handleRemovePhone = (index: number) => {
    setPhones((prev) => prev.filter((_, i) => i !== index));
  };

  // Email handlers
  const handleEmailChange = (
    index: number,
    field: keyof ContactEmailItem,
    value: string
  ) => {
    setEmails((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddEmail = () => {
    setEmails((prev) => [...prev, { label: '', email: '' }]);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  // Save all contacts & stadium settings
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const cleanedPhones = phones
        .map((p) => ({
          label: p.label.trim(),
          number: p.number.trim(),
          isWhatsapp: !!p.isWhatsapp,
        }))
        .filter((p) => p.number !== '');

      const cleanedEmails = emails
        .map((e) => ({
          label: e.label.trim(),
          email: e.email.trim(),
        }))
        .filter((e) => e.email !== '');

      const payload = {
        contactPhones: cleanedPhones,
        contactEmails: cleanedEmails,
        stadiumName: stadiumName.trim(),
        stadiumAddress: stadiumAddress.trim(),
        googleMapsEmbedUrl: googleMapsEmbedUrl.trim(),
        copyrightText: copyrightText.trim(),
      };

      const updated = await settingsApi.updateSettings(payload);
      updateSettings({
        contactPhones: updated.contactPhones,
        contactEmails: updated.contactEmails,
        stadiumName: updated.stadiumName,
        stadiumAddress: updated.stadiumAddress,
        googleMapsEmbedUrl: updated.googleMapsEmbedUrl,
        copyrightText: updated.copyrightText,
      });

      setPhones(updated.contactPhones || []);
      setEmails(updated.contactEmails || []);
      toast.success(CONTACTS_SETTINGS_TEXTS.TOAST_SUCCESS);
    } catch (error) {
      console.error('Error saving contacts settings:', error);
      toast.error(CONTACTS_SETTINGS_TEXTS.TOAST_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Section 1: Phones */}
      <LayoutContainer className="flex flex-col gap-4">
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

      {/* Section 2: Emails */}
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

      {/* Section 3: Stadium and Legal */}
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
            placeholder="https://www.google.com/maps/embed?..."
            value={googleMapsEmbedUrl}
            onChange={(e) => setGoogleMapsEmbedUrl(e.target.value)}
            className="text-sm"
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
          className="min-w-[200px]"
        >
          {isLoading ? CONTACTS_SETTINGS_TEXTS.SAVING_BUTTON : CONTACTS_SETTINGS_TEXTS.SAVE_BUTTON}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
