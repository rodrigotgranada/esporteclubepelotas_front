import { z } from 'zod';

export const sponsorSchema = z
  .object({
    name: z
      .string()
      .min(2, 'O nome deve ter no mínimo 2 caracteres')
      .max(120, 'O nome deve ter no máximo 120 caracteres'),
    logoUrl: z.string().optional().nullable(),
    logoDarkUrl: z.string().optional().nullable(),
    websiteUrl: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine(
        (val) => !val || val === '' || /^https?:\/\/.+/.test(val),
        'A URL deve começar com http:// ou https://',
      ),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
    showOnMain: z.boolean(),
    showOnYouth: z.boolean(),
    showOnFemale: z.boolean(),
    displayOrder: z.coerce.number().int().min(0, 'A ordem não pode ser negativa'),
    contractStartDate: z.string().optional().nullable(),
    contractEndDate: z.string().optional().nullable(),
  })
  .refine(
    (data) => Boolean(data.logoUrl && data.logoUrl.trim().length > 0),
    {
      message: 'O logotipo oficial da marca é obrigatório',
      path: ['logoUrl'],
    },
  )
  .refine(
    (data) => Boolean(data.showOnMain || data.showOnYouth || data.showOnFemale),
    {
      message: 'Selecione ao menos um local de exibição (Principal, Base ou Feminino)',
      path: ['showOnMain'],
    },
  )
  .refine(
    (data) => {
      if (data.contractStartDate && data.contractEndDate) {
        return new Date(data.contractEndDate) >= new Date(data.contractStartDate);
      }
      return true;
    },
    {
      message: 'A data final do contrato deve ser posterior à data de início',
      path: ['contractEndDate'],
    },
  );

export type SponsorFormData = z.infer<typeof sponsorSchema>;
