'use client';

import { ArrowRight } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { useResetPassword } from '../../hooks/useResetPassword';

import { LayoutContainer, Title, Text, Form, PasswordInput, Button } from '@/shared/ui/components';

export const ResetPasswordFeature = () => {
  const { form, onSubmit, token } = useResetPassword();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

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
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight size={18} />}
                className="w-full"
              >
                {AUTH_TEXTS.RESET_PASSWORD_SUBMIT_BUTTON}
              </Button>
            </Form>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
