'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { AUTH_TEXTS } from '../../constants';
import { forgotPasswordSchema, ForgotPasswordForm } from '../../schemas';
import { authRepository } from '../../repositories';
import { Toast } from '@/shared/ui/components/Toast';

import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Title } from '@/shared/ui/components/Title';
import { Text } from '@/shared/ui/components/Text';
import { Form } from '@/shared/ui/components/Form';
import { MaskedInput } from '@/shared/ui/components/MaskedInput';
import { Button } from '@/shared/ui/components/Button';

function maskEmail(email: string) {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  if (user.length <= 3) return `${user[0]}***@${domain}`;
  return `${user.substring(0, 3)}***@${domain}`;
}

export const ForgotPasswordFeature = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [maskedEmailOutput, setMaskedEmailOutput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    const cleanCpf = data.cpf.replace(/\D/g, '');
    try {
      const response = await authRepository.forgotPassword(cleanCpf);
      if (response.email) {
        setMaskedEmailOutput(maskEmail(response.email));
      }
      setIsSuccess(true);
      Toast.success('E-mail enviado com sucesso!');
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      if (err.response?.status === 400 && err.response?.data?.message === 'Usuário não encontrado') {
        Toast.error('Não encontramos nenhuma conta vinculada a este CPF.');
      } else {
        Toast.error('Ocorreu um erro ao solicitar a recuperação. Tente novamente.');
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
                    onClick={() => router.push('/login')}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3.5 px-4 rounded-xl transition-all"
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
                    <MaskedInput
                      label={AUTH_TEXTS.FORGOT_PASSWORD_CPF_LABEL}
                      mask="000.000.000-00"
                      placeholder={AUTH_TEXTS.FORGOT_PASSWORD_CPF_PLACEHOLDER}
                      {...register('cpf')}
                      error={errors.cpf?.message}
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
                          {AUTH_TEXTS.FORGOT_PASSWORD_SUBMIT_BUTTON}
                          <ArrowRight size={18} />
                        </>
                      )}
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
