import { z } from 'zod';

export const youthPillarItemSchema = z.object({
  title: z.string().min(2, 'O título do pilar é obrigatório.').max(60, 'Máximo 60 caracteres.'),
  description: z.string().min(5, 'A descrição do pilar é obrigatória.').max(220, 'Máximo 220 caracteres.'),
});

export const youthPortalSchema = z.object({
  contactTitle: z.string().min(2, 'O título do contato é obrigatório.').max(100, 'Máximo 100 caracteres.'),
  contactDescription: z.string().max(350, 'Máximo 350 caracteres.'),
  contactEmail: z.string().email('E-mail inválido.').or(z.literal('')),
  contactPhone: z.string().max(30, 'Máximo 30 caracteres.'),
  pillars: z.array(youthPillarItemSchema).max(4, 'Máximo de 4 pilares permitidos.'),
  peneirasCriteria: z.array(z.string().max(300, 'Critério com no máximo 300 caracteres.')),
});

export type YouthPortalFormData = z.infer<typeof youthPortalSchema>;
