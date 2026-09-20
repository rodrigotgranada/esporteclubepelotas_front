'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AUTH_TEXTS } from '../../constants';
import { loginSchema, LoginForm } from '../../schemas';
import { authRepository } from '../../repositories';
import { Toast  } from '@/shared/ui/components';

import { LayoutContainer  } from '@/shared/ui/components';
import { Title  } from '@/shared/ui/components';
import { Text  } from '@/shared/ui/components';
import { Form  } from '@/shared/ui/components';
import { CpfInput  } from '@/shared/ui/components';
import { PasswordInput  } from '@/shared/ui/components';
import { Button  } from '@/shared/ui/components';

function setPendingVerificationCookie(email: string) {
  if (typeof window !== 'undefined') {
    window.document.cookie = `pendingVerificationEmail=${encodeURIComponent(email)}; path=/; max-age=3600; samesite=strict`;
  }
}

export const LoginFeature = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setPendingVerificationEmail = useAuthStore((state) => state.setPendingVerificationEmail);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const cleanCpf = data.cpf.replace(/\D/g, '');
    try {
      const response = await authRepository.login({ ...data, cpf: cleanCpf });
      const { accessToken, user } = response;
      setAuth(accessToken, user);
      Toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string, email?: string } } };
      
      // Captura o erro customizado PENDING_VERIFICATION enviado pelo AuthService
      if (err.response?.status === 401 && err.response?.data?.message === 'PENDING_VERIFICATION') {
        const pendingEmail = err.response.data.email;
        if (pendingEmail) {
          setPendingVerificationEmail(pendingEmail);
          setPendingVerificationCookie(pendingEmail);
        }
        
        router.push('/verify-email');
        return;
      }

      if (err.response?.status === 401) {
        Toast.error('CPF ou senha incorretos.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        // Erros de bloqueio (ex: "Conta temporariamente bloqueada...")
        Toast.error(err.response.data.message as string);
      } else {
        Toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
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

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <CpfInput
                {...register('cpf')}
                error={errors.cpf?.message}
              />

              <PasswordInput
                label={AUTH_TEXTS.LOGIN_PASSWORD_LABEL}
                placeholder={AUTH_TEXTS.LOGIN_PASSWORD_PLACEHOLDER}
                {...register('password')}
                error={errors.password?.message}
              />

              <LayoutContainer className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                  {AUTH_TEXTS.LOGIN_FORGOT_PASSWORD}
                </Link>
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
