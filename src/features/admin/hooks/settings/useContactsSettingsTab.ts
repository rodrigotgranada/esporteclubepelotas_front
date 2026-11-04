import { useState, useEffect } from 'react';
import {
  useSettingsStore,
  ContactPhoneItem,
  ContactEmailItem,
  FooterNavigationItem,
  OpeningHourItem,
} from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { CONTACTS_SETTINGS_TEXTS } from '../../ui/components/settings/contacts/ContactsSettingsTab.constants';

const DEFAULT_MAPS_URL =
  'https://maps.google.com/maps?q=Est%C3%A1dio+Boca+do+Lobo,+Pelotas+-+RS&t=&z=16&ie=UTF8&iwloc=&output=embed';

export const useContactsSettingsTab = () => {
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

  return {
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
  };
};
