import { z } from 'zod';

export const squadStaffItemSchema = z.object({
  role: z.string().min(1, 'O cargo é obrigatório.'),
  name: z.string().min(2, 'O nome é obrigatório.'),
});

export const squadSchema = z.object({
  year: z.coerce.number().min(1908, 'Ano deve ser igual ou superior a 1908.'),
  category: z.enum(['PROFESSIONAL', 'FEMININE', 'SUB_20', 'SUB_17', 'SUB_15']),
  seasonName: z.string().min(2, 'O nome da temporada/competição é obrigatório.'),
  coachName: z.string(),
  isCurrent: z.boolean(),
  staff: z.array(squadStaffItemSchema),
});

export type SquadFormData = z.infer<typeof squadSchema>;
export type SquadStaffItemFormData = z.infer<typeof squadStaffItemSchema>;
