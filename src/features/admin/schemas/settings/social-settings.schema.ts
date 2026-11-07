import { z } from 'zod';

export const socialLinkItemSchema = z.object({
  platform: z.enum([
    'instagram',
    'facebook',
    'x',
    'threads',
    'youtube',
    'tiktok',
    'linkedin',
  ] as const),
  label: z.string().trim().min(1, 'Informe o rótulo do perfil.'),
  url: z.string().trim().url('Informe uma URL válida (ex: https://...).'),
});

export const socialSettingsSchema = z.object({
  socialLinks: z.array(socialLinkItemSchema),
});

export type SocialSettingsFormData = z.infer<typeof socialSettingsSchema>;

