import { z } from 'zod';

export const opponentClubSchema = z.object({
  name: z.string().trim().min(2, 'Nome do clube deve ter pelo menos 2 caracteres').max(150),
  shortName: z.string().trim().min(2, 'Apelido/sigla deve ter pelo menos 2 caracteres').max(60),
  city: z.string().trim().min(2, 'Cidade/Estado deve ter pelo menos 2 caracteres').max(100),
  stadiumName: z.string().trim().min(2, 'Nome do estádio deve ter pelo menos 2 caracteres').max(150),
  badgeUrl: z.string().trim().optional(),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().int(),
});

export type OpponentClubSchemaType = z.infer<typeof opponentClubSchema>;
