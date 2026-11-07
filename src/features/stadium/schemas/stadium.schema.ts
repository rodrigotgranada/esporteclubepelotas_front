import { z } from 'zod';

export const stadiumGalleryImageSchema = z.object({
  url: z.string().min(1, 'A URL da imagem é obrigatória'),
  caption: z.string(),
  order: z.number().int(),
});

export const stadiumFactSchema = z.object({
  year: z.string().min(1, 'O ano é obrigatório').max(20, 'Máximo 20 caracteres'),
  title: z.string().min(1, 'O título do marco é obrigatório').max(150, 'Máximo 150 caracteres'),
  description: z.string().min(1, 'A descrição do marco é obrigatória'),
});

export const updateStadiumSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(255, 'O título não pode ultrapassar 255 caracteres'),
  subtitle: z.string().max(500, 'O subtítulo não pode ultrapassar 500 caracteres'),
  coverImageUrl: z.string(),
  inaugurationDate: z.string().max(100, 'A data de inauguração não pode ultrapassar 100 caracteres'),
  capacity: z.string().max(100, 'A capacidade não pode ultrapassar 100 caracteres'),
  pitchDimensions: z.string().max(100, 'As dimensões do gramado não podem ultrapassar 100 caracteres'),
  address: z.string().max(255, 'O endereço não pode ultrapassar 255 caracteres'),
  mapsDirectUrl: z.string(),
  mapsEmbedUrl: z.string(),
  contentHtml: z.string().min(10, 'A história do estádio deve ter pelo menos 10 caracteres'),
  gallery: z.array(stadiumGalleryImageSchema),
  facts: z.array(stadiumFactSchema),
  isActive: z.boolean(),
});

export type UpdateStadiumFormData = z.infer<typeof updateStadiumSchema>;
