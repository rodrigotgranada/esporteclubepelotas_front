import { z } from 'zod';

export const generalSettingsSchema = z.object({
  clubName: z
    .string({ required_error: 'O nome do clube é obrigatório.' })
    .trim()
    .min(2, 'O nome do clube deve ter no mínimo 2 caracteres.')
    .max(100, 'O nome do clube deve ter no máximo 100 caracteres.'),
  clubLogoUrl: z.string().nullable().optional(),
  clubLogoGallery: z.array(z.string()).optional(),
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

