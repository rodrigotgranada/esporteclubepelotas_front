import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { authRepository } from '../repositories';
import { Toast } from '@/shared/ui/components';

export function maskEmail(email: string) {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  if (user.length <= 3) return `${user[0]}***@${domain}`;
  return `${user.substring(0, 3)}***@${domain}`;
}

export const useVerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const pendingVerificationEmail = useAuthStore((state) => state.pendingVerificationEmail);
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    } else if (pendingVerificationEmail) {
      setEmail(pendingVerificationEmail);
    } else if (typeof window !== 'undefined') {
      const match = window.document.cookie.match(new RegExp('(^| )pendingVerificationEmail=([^;]+)'));
      if (match) {
        setEmail(decodeURIComponent(match[2]));
      }
    }
  }, [user, pendingVerificationEmail]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      Toast.warning('O código deve conter 6 dígitos.');
      return;
    }
    if (!email) {
      Toast.error('O e-mail é obrigatório. Por favor, volte ao login.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authRepository.verifyEmail({ email, code });
      const { accessToken, user } = response;
      
      setAuth(accessToken, user);
      
      Toast.success('E-mail verificado com sucesso!');
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      if (err.response?.data?.message === 'Invalid confirmation code' || err.response?.data?.message === 'Invalid or expired confirmation code') {
        Toast.error('Código inválido ou expirado. Verifique o e-mail enviado.');
      } else if (err.response?.data?.message === 'User is already verified') {
        Toast.warning('Este usuário já foi verificado. Faça login normalmente.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        Toast.error(err.response.data.message as string);
      } else {
        Toast.error('Ocorreu um erro ao validar o código. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      Toast.error('O e-mail é obrigatório. Por favor, volte ao login.');
      return;
    }

    setIsResending(true);
    try {
      await authRepository.resendCode(email);
      Toast.success('Um novo código foi enviado para o seu e-mail!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message === 'User is already verified') {
        Toast.warning('Este usuário já foi verificado. Faça login normalmente.');
      } else {
        Toast.error('Ocorreu um erro ao reenviar o código. Tente novamente.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return {
    email,
    code,
    setCode,
    isSubmitting,
    isResending,
    onSubmit,
    handleResendCode,
  };
};
