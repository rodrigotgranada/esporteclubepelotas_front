import { z } from 'zod';

export const timelineCategorySchema = z.object({
  name: z
    .string({ required_error: 'O nome da categoria é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(80, 'O nome deve ter no máximo 80 caracteres.'),
  slug: z.string().trim().optional(),
  icon: z.string().trim().min(1, 'Selecione um ícone representativo.'),
  description: z.string().trim().max(250, 'A descrição deve ter no máximo 250 caracteres.').optional(),
  displayOrder: z.coerce.number().int().optional(),
  isActive: z.boolean(),
});

export type TimelineCategoryFormData = z.infer<typeof timelineCategorySchema>;

