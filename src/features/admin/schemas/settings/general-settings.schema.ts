import { z } from 'zod';

export const generalSettingsSchema = z
  .object({
    clubName: z
      .string({ required_error: 'O nome do clube é obrigatório.' })
      .trim()
      .min(2, 'O nome do clube deve ter no mínimo 2 caracteres.')
      .max(100, 'O nome do clube deve ter no máximo 100 caracteres.'),
    clubLogoUrl: z.string().nullable().optional(),
    clubLogoGallery: z.array(z.string()).optional(),
    newsletterIsActive: z.boolean().optional(),
    developerCreditEnabled: z.boolean().optional(),
    developerCreditName: z
      .string()
      .trim()
      .max(120, 'O nome de exibição deve ter no máximo 120 caracteres.')
      .optional()
      .or(z.literal('')),
    developerCreditUrl: z
      .string()
      .trim()
      .max(500, 'O link deve ter no máximo 500 caracteres.')
      .refine(
        (val) => !val || /^https?:\/\/[^/\s]+/i.test(val),
        'Informe uma URL válida iniciando com http:// ou https://.',
      )
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.developerCreditEnabled && !data.developerCreditName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['developerCreditName'],
        message: 'Informe o nome de exibição para ativar o crédito no rodapé.',
      });
    }
  });

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

