import { z } from 'zod';

export const kitTypeSchema = z.enum(['HOME', 'AWAY', 'THIRD', 'GOALKEEPER', 'SPECIAL'], {
  errorMap: () => ({ message: 'Selecione um tipo de uniforme válido' }),
});

export const kitFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome do uniforme deve ter no mínimo 2 caracteres')
    .max(160, 'O nome deve ter no máximo 160 caracteres'),
  kitType: kitTypeSchema,
  competition: z
    .string()
    .trim()
    .min(2, 'Informe o campeonato / competição do uniforme')
    .max(120, 'O campeonato deve ter no máximo 120 caracteres'),
  seasonYear: z.coerce
    .number()
    .int('O ano deve ser um número inteiro')
    .min(1900, 'Ano deve ser igual ou superior a 1900')
    .max(2100, 'Ano inválido'),
  imageUrl: z
    .string()
    .trim()
    .min(1, 'A foto principal do uniforme é obrigatória'),
  galleryUrls: z.array(z.string().trim()),
  manufacturer: z.string().trim().max(100).optional().nullable(),
  sponsor: z.string().trim().max(120).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
  isCurrent: z.boolean(),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().int().min(0, 'A ordem não pode ser negativa'),
});

export type KitFormSchema = z.infer<typeof kitFormSchema>;
