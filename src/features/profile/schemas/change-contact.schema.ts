import { z } from 'zod';

export const changeContactSchema = z.object({
  newValue: z.string().min(1, 'O novo valor é obrigatório.'),
  currentPassword: z.string().min(1, 'A senha atual é obrigatória.'),
});

export type ChangeContactFormData = z.infer<typeof changeContactSchema>;

