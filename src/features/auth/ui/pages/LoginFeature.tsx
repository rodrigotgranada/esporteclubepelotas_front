'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { useLogin } from '../../hooks/useLogin';
import { LayoutContainer, Title, Text, Form, CpfInput, PasswordInput, Button } from '@/shared/ui/components';

export const LoginFeature = () => {
  const { form, onSubmit } = useLogin();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-background text-text-primary">
      <LayoutContainer className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 text-center px-12">
          <Title level="h1" className="text-5xl font-black text-primary mb-6 tracking-tighter">
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
            <Title level="h1" className="text-3xl font-black text-primary">
              {AUTH_TEXTS.REGISTER_BRANDING_TITLE}
            </Title>
          </LayoutContainer>

          <LayoutContainer className="bg-surface backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
            <Title level="h2" className="text-3xl font-bold mb-2">
              {AUTH_TEXTS.LOGIN_TITLE}
            </Title>
            <Text className="text-text-secondary mb-8">
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
                <Link href="/forgot-password" className="text-sm text-primary hover:text-secondary transition-colors">
                  {AUTH_TEXTS.LOGIN_FORGOT_PASSWORD}
                </Link>
              </LayoutContainer>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight size={18} />}
                className="w-full"
              >
                {AUTH_TEXTS.LOGIN_SUBMIT_BUTTON}
              </Button>
            </Form>

            <LayoutContainer className="mt-8 text-center text-sm text-text-secondary">
              {AUTH_TEXTS.LOGIN_NO_ACCOUNT}{' '}
              <Link href="/register" className="text-primary hover:text-secondary font-semibold transition-colors">
                {AUTH_TEXTS.LOGIN_REGISTER_LINK}
              </Link>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
