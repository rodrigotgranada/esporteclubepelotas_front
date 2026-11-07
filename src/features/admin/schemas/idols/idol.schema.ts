import { z } from 'zod';
import { IdolCategory } from '@/features/idols/services/idols.service';

export const idolPeriodSchema = z.object({
  startYear: z.coerce.number().int().min(1900).max(2100),
  endYear: z.coerce.number().int().min(1900).max(2100).nullable().optional(),
  label: z.string().optional(),
});

export const idolGalleryItemSchema = z.object({
  url: z.string(),
  caption: z.string().optional(),
});

export const idolSchema = z
  .object({
    name: z
      .string({ required_error: 'O nome completo do ídolo é obrigatório.' })
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres.')
      .max(120, 'O nome deve ter no máximo 120 caracteres.'),
    nickname: z.string().trim().max(80).optional(),
    slug: z.string().trim().optional(),
    category: z.enum(['PLAYER', 'COACH', 'STAFF', 'FAN'] as const, {
      required_error: 'A categoria do ídolo é obrigatória.',
    }),
    photoUrl: z.string().nullable().optional(),
    startYear: z
      .union([
        z.coerce.number().int().min(1900, 'Ano deve ser maior que 1900').max(2100, 'Ano inválido'),
        z.literal(''),
      ])
      .optional(),
    endYear: z
      .union([
        z.coerce.number().int().min(1900, 'Ano deve ser maior que 1900').max(2100, 'Ano inválido'),
        z.literal(''),
      ])
      .optional(),
    periods: z.array(idolPeriodSchema).optional(),
    galleryItems: z.array(idolGalleryItemSchema).optional(),
    isActiveInClub: z.boolean(),
    birthDate: z.string().optional(),
    deathDate: z.string().optional(),
    birthPlace: z.string().trim().optional(),
    quote: z.string().trim().optional(),
    biography: z
      .string({ required_error: 'A biografia ou história do ídolo é obrigatória.' })
      .trim()
      .min(5, 'A biografia deve ter no mínimo 5 caracteres.'),
    isFeatured: z.boolean(),
    order: z.coerce.number().int().optional(),

    // Jogador
    position: z.string().trim().optional(),
    preferredFoot: z.string().trim().optional(),
    historicJerseyNumber: z.union([z.coerce.number().int().min(1).max(999), z.literal('')]).optional(),
    matchesCount: z.union([z.coerce.number().int().min(0), z.literal('')]).optional(),
    goalsCount: z.union([z.coerce.number().int().min(0), z.literal('')]).optional(),
    titlesText: z.string().optional(),
    memorableMatch: z.string().trim().optional(),

    // Técnico
    coachMatches: z.union([z.coerce.number().int().min(0), z.literal('')]).optional(),
    coachWins: z.union([z.coerce.number().int().min(0), z.literal('')]).optional(),
    coachDraws: z.union([z.coerce.number().int().min(0), z.literal('')]).optional(),
    coachLosses: z.union([z.coerce.number().int().min(0), z.literal('')]).optional(),
    coachTitlesText: z.string().optional(),
    tacticalStyle: z.string().trim().optional(),

    // Membro de Apoio (Staff)
    roleName: z.string().trim().optional(),
    yearsOfDedication: z.string().trim().optional(),
    backstageStory: z.string().trim().optional(),

    // Torcedor Símbolo
    stadiumSector: z.string().trim().optional(),
    trademark: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      const hasPeriods = data.periods && data.periods.length > 0;
      const hasStartYear = typeof data.startYear === 'number' && data.startYear >= 1900;
      return hasPeriods || hasStartYear;
    },
    {
      message: 'Informe o ano inicial de chegada ou adicione ao menos um período de atuação.',
      path: ['startYear'],
    },
  );

export type IdolFormData = z.infer<typeof idolSchema>;

