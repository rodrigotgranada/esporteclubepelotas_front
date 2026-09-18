'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AUTH_TEXTS } from '../../constants';
import { loginSchema, LoginForm } from '../../schemas';
import { authRepository } from '../../repositories';

import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Title } from '@/shared/ui/components/Title';
import { Text } from '@/shared/ui/components/Text';
import { Form } from '@/shared/ui/components/Form';
import { EmailInput } from '@/shared/ui/components/EmailInput';
import { PasswordInput } from '@/shared/ui/components/PasswordInput';
import { Button } from '@/shared/ui/components/Button';

export const LoginFeature = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMsg('');
    try {
      const response = await authRepository.login(data);
      const { accessToken, user } = response;
      setAuth(accessToken, user);
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        setErrorMsg('E-mail ou senha incorretos.');
      } else {
        setErrorMsg('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-[#111111] text-white">
      <LayoutContainer className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 text-center px-12">
          <Title level="h1" className="text-5xl font-black text-yellow-400 mb-6 tracking-tighter">
            {AUTH_TEXTS.REGISTER_BRANDING_TITLE}
          </Title>
          <Text className="text-xl text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            {AUTH_TEXTS.LOGIN_WELCOME_TEXT}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <LayoutContainer className="w-full max-w-md">
          <LayoutContainer className="lg:hidden mb-10 text-center">
            <Title level="h1" className="text-3xl font-black text-yellow-400">
              {AUTH_TEXTS.REGISTER_BRANDING_TITLE}
            </Title>
          </LayoutContainer>

          <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <Title level="h2" className="text-3xl font-bold mb-2">
              {AUTH_TEXTS.LOGIN_TITLE}
            </Title>
            <Text className="text-gray-400 mb-8">
              {AUTH_TEXTS.LOGIN_SUBTITLE}
            </Text>

            {errorMsg && (
              <LayoutContainer className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                {errorMsg}
              </LayoutContainer>
            )}

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <EmailInput
                label={AUTH_TEXTS.LOGIN_EMAIL_LABEL}
                placeholder={AUTH_TEXTS.LOGIN_EMAIL_PLACEHOLDER}
                {...register('email')}
                error={errors.email?.message}
              />

              <PasswordInput
                label={AUTH_TEXTS.LOGIN_PASSWORD_LABEL}
                placeholder={AUTH_TEXTS.LOGIN_PASSWORD_PLACEHOLDER}
                {...register('password')}
                error={errors.password?.message}
              />

              <LayoutContainer className="flex items-center justify-end">
                <a href="#" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                  {AUTH_TEXTS.LOGIN_FORGOT_PASSWORD}
                </a>
              </LayoutContainer>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    {AUTH_TEXTS.LOGIN_SUBMIT_BUTTON}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Form>

            <LayoutContainer className="mt-8 text-center text-sm text-gray-400">
              {AUTH_TEXTS.LOGIN_NO_ACCOUNT}{' '}
              <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                {AUTH_TEXTS.LOGIN_REGISTER_LINK}
              </Link>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
