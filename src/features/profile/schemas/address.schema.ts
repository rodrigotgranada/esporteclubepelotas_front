import { z } from 'zod';

export const addressSchema = z.object({
  zipCode: z.string().min(8, 'CEP inválido.'),
  street: z.string().min(2, 'O logradouro é obrigatório.'),
  number: z.string().min(1, 'O número é obrigatório.'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'O bairro é obrigatório.'),
  city: z.string().min(2, 'A cidade é obrigatória.'),
  state: z.string().min(2, 'O estado é obrigatório.'),
  isPrimary: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

