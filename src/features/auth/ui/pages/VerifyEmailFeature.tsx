'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { useVerifyEmail, maskEmail } from '../../hooks/useVerifyEmail';

import { LayoutContainer, Title, Text, Form, Button, Input } from '@/shared/ui/components';

export const VerifyEmailFeature = () => {
  const {
    email,
    code,
    setCode,
    isSubmitting,
    isResending,
    onSubmit,
    handleResendCode,
  } = useVerifyEmail();

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
                variant="primary"
                size="lg"
                disabled={code.length !== 6}
                isLoading={isSubmitting}
                rightIcon={<ArrowRight size={18} />}
                className="w-full"
              >
                {AUTH_TEXTS.VERIFY_EMAIL_SUBMIT_BUTTON}
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
