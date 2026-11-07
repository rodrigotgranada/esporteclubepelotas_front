import { z } from 'zod';

export const roleAdminSchema = z.object({
  name: z
    .string({ required_error: 'O identificador do cargo é obrigatório.' })
    .trim()
    .min(2, 'O identificador deve ter no mínimo 2 caracteres.')
    .max(50, 'O identificador deve ter no máximo 50 caracteres.'),
  label: z
    .string({ required_error: 'O nome de exibição é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(80, 'O nome deve ter no máximo 80 caracteres.'),
  description: z.string().trim().max(200, 'A descrição deve ter no máximo 200 caracteres.').optional(),
  permissions: z.array(z.string()),
});

export type RoleAdminFormData = z.infer<typeof roleAdminSchema>;
