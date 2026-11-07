import { z } from 'zod';

export const userPhoneSchema = z.object({
  number: z.string().trim().min(8, 'Número de telefone inválido.'),
  isWhatsapp: z.boolean(),
  isPrimary: z.boolean(),
});

export const userAddressSchema = z.object({
  zipCode: z.string().trim().min(8, 'CEP inválido.'),
  street: z.string().trim().min(2, 'O logradouro é obrigatório.'),
  number: z.string().trim().min(1, 'O número é obrigatório.'),
  neighborhood: z.string().trim().min(1, 'O bairro é obrigatório.'),
  city: z.string().trim().min(2, 'A cidade é obrigatória.'),
  state: z.string().trim().min(2, 'O estado (UF) é obrigatório.'),
  complement: z.string().trim().optional(),
  isPrimary: z.boolean(),
});

export const userAdminSchema = z
  .object({
    firstName: z
      .string({ required_error: 'O primeiro nome é obrigatório.' })
      .trim()
      .min(2, 'O primeiro nome deve ter no mínimo 2 caracteres.')
      .max(80, 'O primeiro nome deve ter no máximo 80 caracteres.'),
    lastName: z
      .string({ required_error: 'O sobrenome é obrigatório.' })
      .trim()
      .min(2, 'O sobrenome deve ter no mínimo 2 caracteres.')
      .max(80, 'O sobrenome deve ter no máximo 80 caracteres.'),
    email: z
      .string({ required_error: 'O e-mail é obrigatório.' })
      .trim()
      .email('Informe um e-mail válido.'),
    cpf: z
      .string({ required_error: 'O CPF é obrigatório.' })
      .trim()
      .min(11, 'O CPF deve ter pelo menos 11 dígitos.'),
    birthDate: z
      .string({ required_error: 'A data de nascimento é obrigatória.' })
      .trim()
      .min(1, 'A data de nascimento é obrigatória.'),
    role: z
      .string({ required_error: 'Selecione o cargo do usuário.' })
      .trim()
      .min(1, 'Selecione o cargo do usuário.'),
    status: z.enum(['ACTIVE', 'PENDING', 'BLOCKED', 'INACTIVE'] as const),
    phones: z.array(userPhoneSchema).optional(),
    addresses: z.array(userAddressSchema).optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    mustChangePassword: z.boolean(),
    avatarUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'A confirmação de senha não confere.',
      path: ['confirmPassword'],
    },
  );

export type UserAdminFormData = z.infer<typeof userAdminSchema>;
