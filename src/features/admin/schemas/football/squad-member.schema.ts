import { z } from 'zod';

export const squadMemberSchema = z.object({
  athleteId: z.string().min(1, 'Selecione um profissional do banco.'),
  jerseyNumber: z.string().optional().default(''),
  sector: z.enum(['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'STAFF']).default('FORWARD'),
  role: z.enum(['STARTER', 'RESERVE', 'CAPTAIN', 'COACH', 'ASSISTANT', 'PHYSICAL_TRAINER', 'STAFF']).default('STARTER'),
});

export type SquadMemberFormData = z.infer<typeof squadMemberSchema>;

