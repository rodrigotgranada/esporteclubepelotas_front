import { z } from 'zod';

export const themePaletteSchema = z.object({
  primary: z.string().trim().min(3),
  secondary: z.string().trim().min(3),
  buttonSecondary: z.string().trim().min(3),
  background: z.string().trim().min(3),
  surface: z.string().trim().min(3),
  header: z.string().trim().min(3),
  card: z.string().trim().min(3),
  drawer: z.string().trim().min(3),
  table: z.string().trim().min(3),
  textPrimary: z.string().trim().min(3),
  textSecondary: z.string().trim().min(3),
  border: z.string().trim().min(3),
  success: z.string().trim().min(3),
  error: z.string().trim().min(3),
  warning: z.string().trim().min(3),
});

export const themeAdminSchema = z.object({
  name: z
    .string({ required_error: 'O nome do tema é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(80, 'O nome deve ter no máximo 80 caracteres.'),
  isCampaign: z.boolean(),
  campaignColor: z.string().trim(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  light: themePaletteSchema,
  dark: themePaletteSchema,
});

export type ThemeAdminFormData = z.infer<typeof themeAdminSchema>;
