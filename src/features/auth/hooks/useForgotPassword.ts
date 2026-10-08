import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema, ForgotPasswordForm } from '../schemas';
import { authRepository } from '../repositories';
import { Toast } from '@/shared/ui/components';

function maskEmail(email: string) {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  if (user.length <= 3) return `${user[0]}***@${domain}`;
  return `${user.substring(0, 3)}***@${domain}`;
}

export const useForgotPassword = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [maskedEmailOutput, setMaskedEmailOutput] = useState('');

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    const cleanCpf = data.cpf.replace(/\D/g, '');
    try {
      const response = await authRepository.forgotPassword(cleanCpf);
      if (response.email) {
        setMaskedEmailOutput(maskEmail(response.email));
      }
      setIsSuccess(true);
      Toast.success('E-mail enviado com sucesso!');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      if (err.response?.status === 400 && err.response?.data?.message === 'Usuário não encontrado') {
        Toast.error('Não encontramos nenhuma conta vinculada a este CPF.');
      } else {
        Toast.error('Ocorreu um erro ao solicitar a recuperação. Tente novamente.');
      }
    }
  };

  return {
    form,
    isSuccess,
    maskedEmailOutput,
    onSubmit,
    router,
  };
};
