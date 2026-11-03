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
  FooterNavigationItem,
  OpeningHourItem,
} from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
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

const DEFAULT_MAPS_URL =
  'https://maps.google.com/maps?q=Est%C3%A1dio+Boca+do+Lobo,+Pelotas+-+RS&t=&z=16&ie=UTF8&iwloc=&output=embed';

export const ContactsSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);

  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);
  const [phones, setPhones] = useState<ContactPhoneItem[]>([]);
  const [emails, setEmails] = useState<ContactEmailItem[]>([]);
  const [navigationLinks, setNavigationLinks] = useState<FooterNavigationItem[]>([]);
  const [stadiumName, setStadiumName] = useState('');
  const [stadiumAddress, setStadiumAddress] = useState('');
  const [googleMapsEmbedUrl, setGoogleMapsEmbedUrl] = useState('');
  const [copyrightText, setCopyrightText] = useState('');

  useEffect(() => {
    if (settings) {
      setOpeningHours(
        settings.openingHours && settings.openingHours.length > 0
          ? settings.openingHours
          : [
              { department: 'Secretaria Geral', schedule: 'Seg a Sex, das 09h às 18h' },
              { department: 'Loja Oficial Lobo Mania', schedule: 'Seg a Sex: 09h às 19h | Sáb: 09h às 13h' },
              { department: 'Central de Sócios', schedule: 'Seg a Sex: 09h às 18h | Sáb: 09h às 12h' },
            ]
      );

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

      setNavigationLinks(
        settings.footerNavigationLinks && settings.footerNavigationLinks.length > 0
          ? settings.footerNavigationLinks
          : [
              { label: 'Início', url: '/', isVisible: true, isExternal: false },
              { label: 'Notícias do Lobo', url: '/noticias', isVisible: true, isExternal: false },
              { label: 'Quadro Social (Seja Sócio)', url: '/socio', isVisible: true, isExternal: false },
              { label: 'Ingressos e Jogos', url: '/ingressos', isVisible: true, isExternal: false },
              { label: 'Área do Sócio / Perfil', url: '/profile', isVisible: true, isExternal: false },
              { label: 'Portal Administrativo', url: '/gestao', isVisible: false, isExternal: false },
            ]
      );

      setStadiumName(settings.stadiumName || 'Estádio Boca do Lobo');
      setStadiumAddress(
        settings.stadiumAddress ||
          'Av. Bento Gonçalves esquina Parque Dom Antônio Zattera - Pelotas/RS, CEP 96015-140'
      );
      setGoogleMapsEmbedUrl(settings.googleMapsEmbedUrl || DEFAULT_MAPS_URL);
      setCopyrightText(
        settings.copyrightText ||
          '© 2026 Esporte Clube Pelotas - Fundado em 11 de Outubro de 1908. Todos os direitos reservados.'
      );
    }
  }, [settings]);

  // Opening Hours handlers
  const handleHourChange = (
    index: number,
    field: keyof OpeningHourItem,
    value: string
  ) => {
    setOpeningHours((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddHour = () => {
    setOpeningHours((prev) => [...prev, { department: '', schedule: '' }]);
  };

  const handleRemoveHour = (index: number) => {
    setOpeningHours((prev) => prev.filter((_, i) => i !== index));
  };

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
    setPhones((prev) => [...prev, { label: '', number: '', isWhatsapp: false }]);
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

  // Navigation Links handlers
  const handleNavChange = (
    index: number,
    field: keyof FooterNavigationItem,
    value: string | boolean
  ) => {
    setNavigationLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddNav = () => {
    setNavigationLinks((prev) => [
      ...prev,
      { label: '', url: '', isVisible: true, isExternal: false },
    ]);
  };

  const handleRemoveNav = (index: number) => {
    setNavigationLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Save all settings
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const cleanedHours = openingHours
        .map((h) => ({
          department: h.department.trim(),
          schedule: h.schedule.trim(),
        }))
        .filter((h) => h.department !== '' && h.schedule !== '');

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

      const cleanedNav = navigationLinks
        .map((n) => ({
          label: n.label.trim(),
          url: n.url.trim(),
          isVisible: n.isVisible !== false,
          isExternal: !!n.isExternal,
        }))
        .filter((n) => n.label !== '' && n.url !== '');

      const payload = {
        openingHours: cleanedHours,
        contactPhones: cleanedPhones,
        contactEmails: cleanedEmails,
        footerNavigationLinks: cleanedNav,
        stadiumName: stadiumName.trim(),
        stadiumAddress: stadiumAddress.trim(),
        googleMapsEmbedUrl: googleMapsEmbedUrl.trim(),
        copyrightText: copyrightText.trim(),
      };

      const updated = await settingsApi.updateSettings(payload);
      updateSettings({
        openingHours: updated.openingHours,
        contactPhones: updated.contactPhones,
        contactEmails: updated.contactEmails,
        footerNavigationLinks: updated.footerNavigationLinks,
        stadiumName: updated.stadiumName,
        stadiumAddress: updated.stadiumAddress,
        googleMapsEmbedUrl: updated.googleMapsEmbedUrl,
        copyrightText: updated.copyrightText,
      });

      setOpeningHours(updated.openingHours || []);
      setPhones(updated.contactPhones || []);
      setEmails(updated.contactEmails || []);
      setNavigationLinks(updated.footerNavigationLinks || []);
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
