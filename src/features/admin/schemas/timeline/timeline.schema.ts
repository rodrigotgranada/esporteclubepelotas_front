import { z } from 'zod';

export const timelineEventSchema = z.object({
  year: z.coerce
    .number({ invalid_type_error: 'Informe um ano numérico válido.' })
    .int('O ano deve ser um número inteiro.')
    .min(1900, 'O ano deve ser a partir de 1900.')
    .max(2100, 'Ano inválido.'),
  title: z
    .string({ required_error: 'O título do marco histórico é obrigatório.' })
    .trim()
    .min(2, 'O título deve ter no mínimo 2 caracteres.')
    .max(150, 'O título deve ter no máximo 150 caracteres.'),
  description: z
    .string({ required_error: 'A descrição do marco histórico é obrigatória.' })
    .trim()
    .min(5, 'A descrição deve ter no mínimo 5 caracteres.'),
  categoryId: z.string().trim().optional(),
  category: z.string().trim().min(1, 'Selecione a categoria do marco histórico.'),
  eventDate: z.string().trim().optional(),
  dateFormatted: z.string().trim().optional(),
  displayOrder: z.coerce.number().int().optional(),
  isHighlighted: z.boolean(),
  isActive: z.boolean(),
  imageUrl: z.string().nullable().optional(),
});

export type TimelineEventFormData = z.infer<typeof timelineEventSchema>;

