'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { authRepository } from '../../repositories';

import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Title } from '@/shared/ui/components/Title';
import { Text } from '@/shared/ui/components/Text';
import { Form } from '@/shared/ui/components/Form';
import { Button } from '@/shared/ui/components/Button';
import { Input } from '@/shared/ui/components/Input';

export const VerifyEmailFeature = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setErrorMsg('O código deve conter 6 dígitos.');
      return;
    }
    if (!email) {
      setErrorMsg('O e-mail é obrigatório. Por favor, volte ao login.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await authRepository.verifyEmail({ email, code });
      const { accessToken, user } = response;
      setAuth(accessToken, user);
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      if (err.response?.data?.message === 'Invalid confirmation code') {
        setErrorMsg('Código inválido. Verifique o e-mail enviado.');
      } else if (err.response?.data?.message === 'User is already verified') {
        setErrorMsg('Este usuário já foi verificado. Faça login normalmente.');
      } else {
        setErrorMsg('Ocorreu um erro ao validar o código. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-[#111111] text-white">
      <LayoutContainer className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 text-center px-12">
          <Title level="h1" className="text-5xl font-black text-yellow-400 mb-6 tracking-tighter">
            E.C. Pelotas
          </Title>
          <Text className="text-xl text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            Estamos quase lá! Verifique sua identidade para liberar o seu acesso exclusivo.
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <LayoutContainer className="w-full max-w-md">
          <LayoutContainer className="lg:hidden mb-10 text-center">
            <Title level="h1" className="text-3xl font-black text-yellow-400">
              E.C. Pelotas
            </Title>
          </LayoutContainer>

          <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <LayoutContainer className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </LayoutContainer>
            
            <Title level="h2" className="text-3xl font-bold mb-2">
              Verifique seu e-mail
            </Title>
            <Text className="text-gray-400 mb-8">
              Enviamos um código de 6 dígitos para <strong className="text-white">{email || 'seu e-mail'}</strong>. Digite-o abaixo para confirmar.
            </Text>

            {errorMsg && (
              <LayoutContainer className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                {errorMsg}
              </LayoutContainer>
            )}

            <Form onSubmit={onSubmit} className="space-y-6">
              <Input
                label="Código de Confirmação"
                placeholder="000000"
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
                    Confirmar Conta
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Form>
            
            <LayoutContainer className="mt-8 text-center text-sm text-gray-400">
              Não recebeu? <button type="button" className="text-yellow-400 hover:text-yellow-300 transition-colors cursor-not-allowed">Reenviar código</button>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
