import { z } from 'zod';

export const personalDataSchema = z.object({
  firstName: z
    .string()
    .min(2, 'O nome deve ter no mínimo 2 caracteres.')
    .max(50, 'O nome deve ter no máximo 50 caracteres.'),
  lastName: z
    .string()
    .min(2, 'O sobrenome deve ter no mínimo 2 caracteres.')
    .max(50, 'O sobrenome deve ter no máximo 50 caracteres.'),
});

export type PersonalDataFormData = z.infer<typeof personalDataSchema>;

