'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { useAuthStore } from '@/store/useAuthStore';
import { Toast } from '@/shared/ui/components/Toast';
import { authRepository } from '../../repositories';

import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Title } from '@/shared/ui/components/Title';
import { Text } from '@/shared/ui/components/Text';
import { Form } from '@/shared/ui/components/Form';
import { Button } from '@/shared/ui/components/Button';
import { Input } from '@/shared/ui/components/Input';

function clearPendingVerificationCookie() {
  if (typeof window !== 'undefined') {
    window.document.cookie = 'pendingVerificationEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

function maskEmail(email: string) {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  if (user.length <= 3) return `${user[0]}***@${domain}`;
  return `${user.substring(0, 3)}***@${domain}`;
}

export const VerifyEmailFeature = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const pendingVerificationEmail = useAuthStore((state) => state.pendingVerificationEmail);
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // O Next.js Middleware já garante que só entramos aqui se o cookie existir.
    // O Zustand pode perder estado num F5, então pegamos do cookie como fallback se necessário,
    // mas por agora o Zustand hidratado ou a navegação do router seguram a onda.
    if (pendingVerificationEmail) {
      // eslint-disable-next-line
      setEmail(pendingVerificationEmail);
    } else if (typeof window !== 'undefined') {
      // Tenta ler do cookie caso o Zustand tenha perdido estado num reload
      const match = window.document.cookie.match(new RegExp('(^| )pendingVerificationEmail=([^;]+)'));
      if (match) {
        setEmail(decodeURIComponent(match[2]));
      }
    }
  }, [pendingVerificationEmail]);

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
      
      // Limpa o cookie e o estado
      clearPendingVerificationCookie();
      setAuth(accessToken, user);
      
      Toast.success('E-mail verificado com sucesso!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      if (err.response?.data?.message === 'Invalid confirmation code' || err.response?.data?.message === 'Invalid or expired confirmation code') {
        Toast.error('Código inválido ou expirado. Verifique o e-mail enviado.');
      } else if (err.response?.data?.message === 'User is already verified') {
        Toast.warning('Este usuário já foi verificado. Faça login normalmente.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        // Erros de bloqueio do backend
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

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-[#111111] text-white">
      <LayoutContainer className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 text-center px-12">
          <Title level="h1" className="text-5xl font-black text-yellow-400 mb-6 tracking-tighter">
            {AUTH_TEXTS.VERIFY_EMAIL_HERO_TITLE}
          </Title>
          <Text className="text-xl text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            {AUTH_TEXTS.VERIFY_EMAIL_HERO_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <LayoutContainer className="w-full max-w-md">
          <LayoutContainer className="lg:hidden mb-10 text-center">
            <Title level="h1" className="text-3xl font-black text-yellow-400">
              {AUTH_TEXTS.VERIFY_EMAIL_HERO_TITLE}
            </Title>
          </LayoutContainer>

          <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <LayoutContainer className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </LayoutContainer>
            
            <Title level="h2" className="text-3xl font-bold mb-2">
              {AUTH_TEXTS.VERIFY_EMAIL_TITLE}
            </Title>
            <Text className="text-gray-400 mb-8">
              {AUTH_TEXTS.VERIFY_EMAIL_SUBTITLE_PART_1} <strong className="text-white">{maskEmail(email) || 'seu e-mail'}</strong>{AUTH_TEXTS.VERIFY_EMAIL_SUBTITLE_PART_2}
            </Text>

            <Form onSubmit={onSubmit} className="space-y-6">
              <Input
                label={AUTH_TEXTS.VERIFY_EMAIL_CODE_LABEL}
                placeholder={AUTH_TEXTS.VERIFY_EMAIL_CODE_PLACEHOLDER}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-bold"
                required
              />

              <Button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    {AUTH_TEXTS.VERIFY_EMAIL_SUBMIT_BUTTON}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Form>
            
            <LayoutContainer className="mt-8 text-center text-sm text-gray-400">
              {AUTH_TEXTS.VERIFY_EMAIL_NOT_RECEIVED}
              <button 
                type="button" 
                onClick={handleResendCode}
                disabled={isResending}
                className="text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? AUTH_TEXTS.VERIFY_EMAIL_RESENDING_BUTTON : AUTH_TEXTS.VERIFY_EMAIL_RESEND_BUTTON}
              </button>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
