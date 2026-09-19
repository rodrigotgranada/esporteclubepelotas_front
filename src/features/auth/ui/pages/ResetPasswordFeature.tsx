'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { resetPasswordSchema, ResetPasswordForm } from '../../schemas';
import { authRepository } from '../../repositories';
import { Toast } from '@/shared/ui/components/Toast';

import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Title } from '@/shared/ui/components/Title';
import { Text } from '@/shared/ui/components/Text';
import { Form } from '@/shared/ui/components/Form';
import { PasswordInput } from '@/shared/ui/components/PasswordInput';
import { Button } from '@/shared/ui/components/Button';

export const ResetPasswordFeature = () => {
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
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

  if (!token) {
    return null; // ou um loader de tela cheia
  }

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-[#111111] text-white">
      <LayoutContainer className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 text-center px-12">
          <Title level="h1" className="text-5xl font-black text-yellow-400 mb-6 tracking-tighter">
            {AUTH_TEXTS.RESET_PASSWORD_HERO_TITLE}
          </Title>
          <Text className="text-xl text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            {AUTH_TEXTS.RESET_PASSWORD_HERO_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <LayoutContainer className="w-full max-w-md">
          <LayoutContainer className="lg:hidden mb-10 text-center">
            <Title level="h1" className="text-3xl font-black text-yellow-400">
              {AUTH_TEXTS.RESET_PASSWORD_HERO_TITLE}
            </Title>
          </LayoutContainer>

          <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <Title level="h2" className="text-3xl font-bold mb-2">
              {AUTH_TEXTS.RESET_PASSWORD_TITLE}
            </Title>
            <Text className="text-gray-400 mb-8">
              {AUTH_TEXTS.RESET_PASSWORD_SUBTITLE}
            </Text>

            <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <PasswordInput
                label={AUTH_TEXTS.RESET_PASSWORD_NEW_LABEL}
                placeholder={AUTH_TEXTS.RESET_PASSWORD_NEW_PLACEHOLDER}
                {...register('password')}
                error={errors.password?.message}
              />

              <PasswordInput
                label={AUTH_TEXTS.RESET_PASSWORD_CONFIRM_LABEL}
                placeholder={AUTH_TEXTS.RESET_PASSWORD_CONFIRM_PLACEHOLDER}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    {AUTH_TEXTS.RESET_PASSWORD_SUBMIT_BUTTON}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </Form>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
