import { z } from 'zod';

export const championshipCategorySchema = z.enum(
  ['PROFESSIONAL_MEN', 'PROFESSIONAL_WOMEN', 'YOUTH_U20', 'YOUTH_U17', 'YOUTH_U15'],
  {
    errorMap: () => ({ message: 'Selecione uma categoria válida' }),
  }
);

export const regulationItemSchema = z.object({
  title: z.string().trim().min(1, 'Título do regulamento obrigatório'),
  url: z.string().trim().url('URL do regulamento inválida'),
});

export const championshipSchema = z.object({
  name: z.string().trim().min(2, 'Nome da competição deve ter pelo menos 2 caracteres'),
  seasonYear: z.coerce.number().int().min(1900, 'Ano inválido').max(2100, 'Ano inválido'),
  category: championshipCategorySchema,
  logoUrl: z.string().trim().optional(),
  tableUrl: z.string().trim().optional(),
  regulations: z.array(regulationItemSchema),
  isActive: z.boolean(),
  displayOrder: z.coerce.number().int(),
});

export const matchStatusSchema = z.enum(
  ['SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'POSTPONED', 'CANCELLED'],
  {
    errorMap: () => ({ message: 'Selecione um status válido' }),
  }
);

export const homeAwaySchema = z.enum(['HOME', 'AWAY'], {
  errorMap: () => ({ message: 'Selecione o mando de campo' }),
});

export const matchSchema = z.object({
  championshipId: z.string().min(1, 'Selecione o campeonato oficial'),
  opponentClubId: z.string().trim().optional(),
  opponentName: z.string().trim().min(2, 'Nome do adversário deve ter pelo menos 2 caracteres'),
  opponentLogoUrl: z.string().trim().optional(),
  homeAway: homeAwaySchema,
  stadiumName: z.string().trim().min(2, 'Informe o nome do estádio/local'),
  city: z.string().trim().optional(),
  matchDate: z.string().min(1, 'Data e hora da partida são obrigatórias'),
  roundName: z.string().trim().min(1, 'Informe a rodada ou fase'),
  slug: z.string().trim().optional(),
  hasLiveCoverage: z.boolean(),
  status: matchStatusSchema,
  pelotasScore: z.coerce.number().int().nullable().optional(),
  opponentScore: z.coerce.number().int().nullable().optional(),
  penaltyPelotasScore: z.coerce.number().int().nullable().optional(),
  penaltyOpponentScore: z.coerce.number().int().nullable().optional(),
  ticketUrl: z.string().trim().optional(),
  broadcastChannel: z.string().trim().optional(),
  transmissionUrl: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  displayOrder: z.coerce.number().int(),
});

export type ChampionshipSchemaType = z.infer<typeof championshipSchema>;
export type MatchSchemaType = z.infer<typeof matchSchema>;
