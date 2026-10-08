import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordForm } from '../schemas';
import { authRepository } from '../repositories';
import { Toast } from '@/shared/ui/components';

export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get('token');
    if (t) {
      setToken(t);
    } else {
      Toast.error('Token de recuperação não encontrado.');
      router.push('/login');
    }
  }, [searchParams, router]);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    try {
      await authRepository.resetPassword({ token, newPassword: data.password });
      Toast.success('Senha redefinida com sucesso! Você já pode fazer login.');
      router.push('/login');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      if (err.response?.status === 400 && err.response?.data?.message === 'Token de redefinição inválido ou expirado') {
        Toast.error('Este link expirou ou é inválido. Solicite um novo envio.');
        router.push('/forgot-password');
      } else {
        Toast.error('Ocorreu um erro ao redefinir a senha. Tente novamente.');
      }
    }
  };

  return {
    form,
    onSubmit,
    token,
  };
};
