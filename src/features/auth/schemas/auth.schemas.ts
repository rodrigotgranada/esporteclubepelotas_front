import { z } from 'zod';

export const loginSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Nome muito curto'),
  lastName: z.string().min(2, 'Sobrenome muito curto'),
  cpf: z.string().min(11, 'CPF inválido'),
  birthDate: z.string().min(10, 'Data inválida'),
  email: z.string().email('E-mail inválido'),
  phones: z.array(
    z.object({
      number: z.string().min(10, 'Telefone inválido'),
      isWhatsapp: z.boolean(),
      isPrimary: z.boolean(),
    })
  ).min(1, 'Adicione pelo menos um telefone'),
  addresses: z.array(
    z.object({
      zipCode: z.string().min(8, 'CEP inválido'),
      street: z.string().min(3, 'Rua inválida'),
      number: z.string().min(1, 'Número obrigatório'),
      complement: z.string().optional(),
      neighborhood: z.string().min(2, 'Bairro inválido'),
      city: z.string().min(2, 'Cidade inválida'),
      state: z.string().min(2, 'Estado inválido'),
      isPrimary: z.boolean(),
    })
  ).min(1, 'Adicione pelo menos um endereço'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterForm = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido'),
});

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
