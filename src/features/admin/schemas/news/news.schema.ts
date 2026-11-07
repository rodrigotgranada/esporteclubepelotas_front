import { z } from 'zod';

export const newsArticleSchema = z.object({
  title: z
    .string({ required_error: 'O título da matéria é obrigatório.' })
    .trim()
    .min(3, 'O título deve ter no mínimo 3 caracteres.')
    .max(180, 'O título deve ter no máximo 180 caracteres.'),
  subtitle: z.string().trim().max(250, 'O subtítulo deve ter no máximo 250 caracteres.').optional(),
  slug: z.string().trim().optional(),
  summary: z.string().trim().max(350, 'O resumo deve ter no máximo 350 caracteres.').optional(),
  categoryId: z
    .string({ required_error: 'Selecione a categoria da matéria.' })
    .trim()
    .min(1, 'Selecione a categoria da matéria.'),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().nullable().optional(),
  coverCaption: z.string().trim().optional(),
  gallery: z.array(z.string()).optional(),
  content: z.record(z.any()).optional(),
  youtubeVideoUrl: z.string().trim().optional(),
  isFeatured: z.boolean(),
  featuredSlot: z.enum(['MAIN', 'SECONDARY', 'NONE'] as const),
  isPinned: z.boolean(),
  isYouth: z.boolean(),
  showOnHomepage: z.boolean(),
  reporterName: z.string().trim().optional(),
  photographerName: z.string().trim().optional(),
  allowReactions: z.boolean(),
  allowComments: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'] as const),
  publishedAt: z.string().optional(),
});

export type NewsArticleFormData = z.infer<typeof newsArticleSchema>;

