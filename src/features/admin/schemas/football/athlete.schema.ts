import { z } from 'zod';

export const athleteSchema = z
  .object({
    gender: z.enum(['MALE', 'FEMALE']),
    athleteType: z.enum(['PROFESSIONAL', 'YOUTH', 'STAFF']),
    youthCategory: z.string(),
    entryYear: z.string(),
    staffRole: z.string(),
    name: z.string().min(2, 'O nome completo é obrigatório.'),
    nickname: z.string(),
    birthDate: z.string(),
    birthPlace: z.string(),
    height: z.string(),
    weight: z.string(),
    preferredFoot: z.enum(['RIGHT', 'LEFT', 'BOTH']),
    primaryPosition: z.string(),
    secondaryPositionsText: z.string(),
    pastClubsText: z.string(),
    biography: z.string(),
    instagram: z.string(),
    isRetired: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.athleteType === 'STAFF') {
        return Boolean(data.staffRole && data.staffRole.trim().length > 0);
      }
      return Boolean(data.primaryPosition && data.primaryPosition.trim().length > 0);
    },
    {
      message: 'Preencha a posição principal ou cargo na comissão.',
      path: ['primaryPosition'],
    },
  );

export type AthleteFormData = z.infer<typeof athleteSchema>;
