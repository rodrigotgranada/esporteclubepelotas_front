import { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSettingsStore,
  Settings,
} from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { CONTACTS_SETTINGS_TEXTS } from '../../ui/components/settings/contacts/ContactsSettingsTab.constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';
import {
  contactsSettingsSchema,
  ContactsSettingsFormData,
} from '../../schemas/settings/contacts-settings.schema';

const DEFAULT_MAPS_URL =
  'https://maps.google.com/maps?q=Est%C3%A1dio+Boca+do+Lobo,+Pelotas+-+RS&t=&z=16&ie=UTF8&iwloc=&output=embed';

const defaultContactsValues: ContactsSettingsFormData = {
  stadiumName: 'Estádio Boca do Lobo',
  stadiumAddress: 'Av. Bento Gonçalves esquina Parque Dom Antônio Zattera - Pelotas/RS, CEP 96015-140',
  googleMapsEmbedUrl: DEFAULT_MAPS_URL,
  copyrightText: '© 2026 Esporte Clube Pelotas. Todos os direitos reservados.',
  openingHours: [
    { department: 'Secretaria Geral', schedule: 'Seg a Sex, das 09h às 18h' },
    { department: 'Loja Oficial Lobo Mania', schedule: 'Seg a Sex: 09h às 19h | Sáb: 09h às 13h' },
    { department: 'Central de Sócios', schedule: 'Seg a Sex: 09h às 18h | Sáb: 09h às 12h' },
  ],
  contactPhones: [
    { label: 'Secretaria Geral', number: '(53) 3305-1908', isWhatsapp: false },
    { label: 'Central de Sócios', number: '(53) 98408-1908', isWhatsapp: true },
  ],
  contactEmails: [
    { label: 'Secretaria', email: 'secretaria@ecpelotas.com.br' },
    { label: 'Imprensa', email: 'imprensa@ecpelotas.com.br' },
  ],
  footerNavigationLinks: [
    { label: 'Início', url: '/', isVisible: true, isExternal: false },
    { label: 'Notícias do Lobo', url: '/noticias', isVisible: true, isExternal: false },
    { label: 'Quadro Social (Seja Sócio)', url: '/socio', isVisible: true, isExternal: false },
    { label: 'Ingressos e Jogos', url: '/ingressos', isVisible: true, isExternal: false },
    { label: 'Área do Sócio / Perfil', url: '/profile', isVisible: true, isExternal: false },
    { label: 'Portal Administrativo', url: '/gestao', isVisible: false, isExternal: false },
  ],
};

export const useContactsSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { isSaving: isLoading, runTransactionalSave } = useTransactionalSave();

  const form = useForm<ContactsSettingsFormData>({
    resolver: zodResolver(contactsSettingsSchema),
    defaultValues: defaultContactsValues,
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        stadiumName: settings.stadiumName || defaultContactsValues.stadiumName,
        stadiumAddress: settings.stadiumAddress || defaultContactsValues.stadiumAddress,
        googleMapsEmbedUrl: settings.googleMapsEmbedUrl || defaultContactsValues.googleMapsEmbedUrl,
        copyrightText: settings.copyrightText || defaultContactsValues.copyrightText,
        openingHours:
          settings.openingHours && settings.openingHours.length > 0
            ? settings.openingHours
            : defaultContactsValues.openingHours,
        contactPhones:
          settings.contactPhones && settings.contactPhones.length > 0
            ? settings.contactPhones
            : defaultContactsValues.contactPhones,
        contactEmails:
          settings.contactEmails && settings.contactEmails.length > 0
            ? settings.contactEmails
            : defaultContactsValues.contactEmails,
        footerNavigationLinks:
          settings.footerNavigationLinks && settings.footerNavigationLinks.length > 0
            ? settings.footerNavigationLinks
            : defaultContactsValues.footerNavigationLinks,
      });
    }
  }, [settings, form]);

  const addOpeningHour = () => {
    const current = form.getValues('openingHours') || [];
    form.setValue('openingHours', [...current, { department: '', schedule: '' }]);
  };

  const removeOpeningHour = (idx: number) => {
    const current = form.getValues('openingHours') || [];
    form.setValue(
      'openingHours',
      current.filter((_, i) => i !== idx),
    );
  };

  const addPhone = () => {
    const current = form.getValues('contactPhones') || [];
    form.setValue('contactPhones', [...current, { label: '', number: '', isWhatsapp: false }]);
  };

  const removePhone = (idx: number) => {
    const current = form.getValues('contactPhones') || [];
    form.setValue(
      'contactPhones',
      current.filter((_, i) => i !== idx),
    );
  };

  const addEmail = () => {
    const current = form.getValues('contactEmails') || [];
    form.setValue('contactEmails', [...current, { label: '', email: '' }]);
  };

  const removeEmail = (idx: number) => {
    const current = form.getValues('contactEmails') || [];
    form.setValue(
      'contactEmails',
      current.filter((_, i) => i !== idx),
    );
  };

  const addNavigationLink = () => {
    const current = form.getValues('footerNavigationLinks') || [];
    form.setValue('footerNavigationLinks', [
      ...current,
      { label: '', url: '', isVisible: true, isExternal: false },
    ]);
  };

  const removeNavigationLink = (idx: number) => {
    const current = form.getValues('footerNavigationLinks') || [];
    form.setValue(
      'footerNavigationLinks',
      current.filter((_, i) => i !== idx),
    );
  };

  const handleSave = form.handleSubmit(async (data: ContactsSettingsFormData) => {
    await runTransactionalSave<void, Settings>({
      hasPendingMedia: false,
      saveToDb: async () =>
        settingsApi.updateSettings({
          stadiumName: data.stadiumName.trim(),
          stadiumAddress: data.stadiumAddress.trim(),
          googleMapsEmbedUrl: data.googleMapsEmbedUrl.trim(),
          copyrightText: data.copyrightText.trim(),
          openingHours: data.openingHours || [],
          contactPhones: data.contactPhones || [],
          contactEmails: data.contactEmails || [],
          footerNavigationLinks: data.footerNavigationLinks || [],
        }),
      onConfirmed: (updated) => {
        updateSettings(updated);
        toast.success(CONTACTS_SETTINGS_TEXTS.TOAST_SUCCESS);
      },
      onError: (err: any) => {
        console.error('Error saving contacts settings:', err);
        toast.error(err?.response?.data?.message || CONTACTS_SETTINGS_TEXTS.TOAST_ERROR);
      },
    });
  });

  return {
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
  };
};
