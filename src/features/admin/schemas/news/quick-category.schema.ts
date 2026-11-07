import { z } from 'zod';

export const quickCategorySchema = z.object({
  name: z
    .string({ required_error: 'Informe o nome da categoria.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(60, 'O nome deve ter no máximo 60 caracteres.'),
  description: z.string().trim().max(200, 'A descrição deve ter no máximo 200 caracteres.').optional(),
});

export type QuickCategoryFormData = z.infer<typeof quickCategorySchema>;

