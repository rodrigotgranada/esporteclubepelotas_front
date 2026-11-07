import { z } from 'zod';

export const contactOpeningHourSchema = z.object({
  department: z.string().trim().min(1, 'Informe o setor.'),
  schedule: z.string().trim().min(1, 'Informe os horários.'),
});

export const contactPhoneItemSchema = z.object({
  label: z.string().trim().min(1, 'Informe o setor do telefone.'),
  number: z.string().trim().min(8, 'Informe o número do telefone.'),
  isWhatsapp: z.boolean(),
});

export const contactEmailItemSchema = z.object({
  label: z.string().trim().min(1, 'Informe o setor do e-mail.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
});

export const contactFooterNavSchema = z.object({
  label: z.string().trim().min(1, 'Informe o nome do link.'),
  url: z.string().trim().min(1, 'Informe a URL do link.'),
  isVisible: z.boolean(),
  isExternal: z.boolean(),
});

export const contactsSettingsSchema = z.object({
  stadiumName: z.string().trim().min(2, 'O nome do estádio é obrigatório.'),
  stadiumAddress: z.string().trim().min(5, 'O endereço do estádio é obrigatório.'),
  googleMapsEmbedUrl: z.string().trim().min(5, 'A URL do Google Maps é obrigatória.'),
  copyrightText: z.string().trim().min(2, 'O texto de copyright é obrigatório.'),
  openingHours: z.array(contactOpeningHourSchema).optional(),
  contactPhones: z.array(contactPhoneItemSchema).optional(),
  contactEmails: z.array(contactEmailItemSchema).optional(),
  footerNavigationLinks: z.array(contactFooterNavSchema).optional(),
});

export type ContactsSettingsFormData = z.infer<typeof contactsSettingsSchema>;

