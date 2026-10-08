import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { loginSchema, LoginForm } from '../schemas';
import { authRepository } from '../repositories';
import { Toast } from '@/shared/ui/components';

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setPendingVerificationEmail = useAuthStore((state) => state.setPendingVerificationEmail);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const cleanCpf = data.cpf.replace(/\D/g, '');
    try {
      const response = await authRepository.login({ ...data, cpf: cleanCpf });
      const { accessToken, user } = response;
      setAuth(accessToken, user);
      
      startTransition(() => {
        if (user.status === 'PENDING') {
          setPendingVerificationEmail(user.email);
          const currentReturnUrl = searchParams.get('returnUrl');
          if (currentReturnUrl) {
            router.push(`/verify-email?returnUrl=${encodeURIComponent(currentReturnUrl)}`);
          } else {
            router.push('/verify-email');
          }
        } else {
          const returnUrl = searchParams.get('returnUrl') || '/';
          router.push(returnUrl);
        }
      });
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string, email?: string } } };
      
      if (err.response?.status === 401) {
        Toast.error('CPF ou senha incorretos.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        Toast.error(err.response.data.message as string);
      } else {
        Toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    }
  };

  return {
    form,
    onSubmit,
  };
};
