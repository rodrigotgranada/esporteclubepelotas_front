'use client';

import Link from 'next/link';
import { ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { LayoutContainer, Title, Text, Form, CpfInput, Button } from '@/shared/ui/components';

export const ForgotPasswordFeature = () => {
  const { form, isSuccess, maskedEmailOutput, onSubmit, router } = useForgotPassword();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-[#111111] text-white">
      <LayoutContainer className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 text-center px-12">
          <Title level="h1" className="text-5xl font-black text-yellow-400 mb-6 tracking-tighter">
            {AUTH_TEXTS.FORGOT_PASSWORD_HERO_TITLE}
          </Title>
          <Text className="text-xl text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            {AUTH_TEXTS.FORGOT_PASSWORD_HERO_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <LayoutContainer className="w-full max-w-md">
          <LayoutContainer className="lg:hidden mb-10 text-center">
            <Title level="h1" className="text-3xl font-black text-yellow-400">
              {AUTH_TEXTS.FORGOT_PASSWORD_HERO_TITLE}
            </Title>
          </LayoutContainer>

          <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
            <Link href="/login" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>

            <LayoutContainer className="pt-8">
              {isSuccess ? (
                <LayoutContainer className="text-center">
                  <LayoutContainer className="w-16 h-16 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MailCheck size={32} />
                  </LayoutContainer>
                  
                  <Title level="h2" className="text-3xl font-bold mb-4">
                    {AUTH_TEXTS.FORGOT_PASSWORD_SUCCESS_TITLE}
                  </Title>
                  <Text className="text-gray-400 mb-8 leading-relaxed">
                    {AUTH_TEXTS.FORGOT_PASSWORD_SUCCESS_SUBTITLE_1}
                    <br />
                    <strong className="text-white text-lg mt-2 inline-block">{maskedEmailOutput || 'cadastrado'}</strong>
                  </Text>
                  
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => router.push('/login')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {AUTH_TEXTS.FORGOT_PASSWORD_SUCCESS_BACK_BUTTON}
                  </Button>
                </LayoutContainer>
              ) : (
                <>
                  <Title level="h2" className="text-3xl font-bold mb-2">
                    {AUTH_TEXTS.FORGOT_PASSWORD_TITLE}
                  </Title>
                  <Text className="text-gray-400 mb-8">
                    {AUTH_TEXTS.FORGOT_PASSWORD_SUBTITLE}
                  </Text>

                  <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <CpfInput
                      label={AUTH_TEXTS.FORGOT_PASSWORD_CPF_LABEL}
                      {...register('cpf')}
                      error={errors.cpf?.message}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      rightIcon={<ArrowRight size={18} />}
                      className="w-full"
                    >
                      {AUTH_TEXTS.FORGOT_PASSWORD_SUBMIT_BUTTON}
                    </Button>
                  </Form>
                </>
              )}
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
