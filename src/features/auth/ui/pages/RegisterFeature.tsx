'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, User, Phone, MapPin, Lock, Mail } from 'lucide-react';
import { useRegister } from '../../hooks';
import { AUTH_TEXTS } from '../../constants';
import { Stepper, StepItem } from '@/shared/ui/components/Stepper';
import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Title } from '@/shared/ui/components/Title';
import { Text } from '@/shared/ui/components/Text';
import { Form } from '@/shared/ui/components/Form';
import { Button } from '@/shared/ui/components/Button';
import { RegisterStep1 } from '../components/RegisterStep1';
import { RegisterStep2 } from '../components/RegisterStep2';
import { RegisterStep3 } from '../components/RegisterStep3';
import { RegisterStep4 } from '../components/RegisterStep4';

const STEPS: StepItem[] = [
  { id: 1, title: AUTH_TEXTS.REGISTER_STEP_1_TITLE, icon: User },
  { id: 2, title: AUTH_TEXTS.REGISTER_STEP_2_TITLE, icon: Phone },
  { id: 3, title: AUTH_TEXTS.REGISTER_STEP_3_TITLE, icon: MapPin },
  { id: 4, title: AUTH_TEXTS.REGISTER_STEP_4_TITLE, icon: Lock },
];

export const RegisterFeature = () => {
  const router = useRouter();
  const {
    form,
    phonesArray,
    addressesArray,
    currentStep,
    success,
    setAvatarBlob,
    fetchAddress,
    removePhone,
    removeAddress,
    nextStep,
    prevStep,
    onSubmit,
  } = useRegister();

  const { register, formState: { errors, isSubmitting } } = form;

  if (success) {
    return (
      <LayoutContainer className="min-h-screen w-full flex items-center justify-center bg-[#111111] text-white p-4">
        <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl">
          <LayoutContainer className="w-20 h-20 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={40} />
          </LayoutContainer>
          <Title level="h2" className="text-3xl font-bold mb-4">{AUTH_TEXTS.REGISTER_SUCCESS_TITLE}</Title>
          <Text className="text-gray-400 mb-8">
            {AUTH_TEXTS.REGISTER_SUCCESS_SUBTITLE}
          </Text>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3.5 px-4 rounded-xl transition-all"
          >
            {AUTH_TEXTS.REGISTER_LOGIN_LINK}
            <ArrowRight size={18} />
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="min-h-screen w-full flex bg-[#111111] text-white">
      <LayoutContainer className="hidden lg:flex w-1/3 bg-blue-900 relative overflow-hidden flex-col justify-between p-12">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <LayoutContainer className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <LayoutContainer className="z-20 relative">
          <Title level="h1" className="text-3xl font-black text-yellow-400 mb-2 tracking-tighter">{AUTH_TEXTS.REGISTER_BRANDING_TITLE}</Title>
          <Text className="text-gray-300 font-light">{AUTH_TEXTS.REGISTER_TITLE}</Text>
        </LayoutContainer>

        <Stepper currentStep={currentStep} steps={STEPS} />
      </LayoutContainer>

      <LayoutContainer className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <LayoutContainer className="w-full max-w-xl">
          <LayoutContainer className="lg:hidden mb-8 text-center">
            <Title level="h1" className="text-2xl font-black text-yellow-400">{AUTH_TEXTS.REGISTER_BRANDING_TITLE}</Title>
            <Text className="text-gray-400 text-sm mt-1">Passo {currentStep} de 4: {STEPS[currentStep - 1].title}</Text>
          </LayoutContainer>

          <LayoutContainer className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <Title level="h2" className="text-3xl font-bold mb-2">{STEPS[currentStep - 1].title}</Title>
            <Text className="text-gray-400 mb-8">{AUTH_TEXTS.REGISTER_SUBTITLE}</Text>

            <Form onSubmit={onSubmit} className="space-y-6">
              
              {currentStep === 1 && (
                <RegisterStep1 form={form} setAvatarBlob={setAvatarBlob} />
              )}

              {currentStep === 2 && (
                <RegisterStep2 form={form} phonesArray={phonesArray} removePhone={removePhone} />
              )}

              {currentStep === 3 && (
                <RegisterStep3 form={form} addressesArray={addressesArray} fetchAddress={fetchAddress} removeAddress={removeAddress} />
              )}

              {currentStep === 4 && (
                <RegisterStep4 form={form} />
              )}

              <LayoutContainer className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                {currentStep > 1 ? (
                  <Button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-3 transition-colors">
                    <ArrowLeft size={18} />
                    {AUTH_TEXTS.REGISTER_BUTTON_PREV}
                  </Button>
                ) : (
                  <LayoutContainer />
                )}

                {currentStep < 4 ? (
                  <Button onClick={nextStep} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all">
                    {AUTH_TEXTS.REGISTER_BUTTON_NEXT}
                    <ArrowRight size={18} />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : AUTH_TEXTS.REGISTER_BUTTON_SUBMIT}
                  </Button>
                )}
              </LayoutContainer>
            </Form>

            <LayoutContainer className="mt-8 text-center text-sm text-gray-400">
              {AUTH_TEXTS.REGISTER_ALREADY_HAVE_ACCOUNT}{' '}
              <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                {AUTH_TEXTS.REGISTER_LOGIN_LINK}
              </Link>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
