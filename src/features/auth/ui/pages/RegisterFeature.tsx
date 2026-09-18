'use client';

import Link from 'next/link';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRegister } from '../../hooks';
import { Stepper, STEPS } from '../components/Stepper';
import { AUTH_TEXTS } from '../../constants';

export const RegisterFeature = () => {
  const {
    form,
    currentStep,
    errorMsg,
    success,
    fetchAddress,
    nextStep,
    prevStep,
    onSubmit,
  } = useRegister();

  const { register, formState: { errors, isSubmitting } } = form;

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#111111] text-white p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">{AUTH_TEXTS.REGISTER_SUCCESS_TITLE}</h2>
          <p className="text-gray-400 mb-8">{AUTH_TEXTS.REGISTER_SUCCESS_SUBTITLE}</p>
          <p className="text-sm text-yellow-400 animate-pulse">{AUTH_TEXTS.REGISTER_SUCCESS_REDIRECTING}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#111111] text-white">
      <div className="hidden lg:flex w-1/3 bg-blue-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <div className="z-20 relative">
          <h1 className="text-3xl font-black text-yellow-400 mb-2 tracking-tighter">{AUTH_TEXTS.REGISTER_BRANDING_TITLE}</h1>
          <p className="text-gray-300 font-light">{AUTH_TEXTS.REGISTER_TITLE}</p>
        </div>

        <Stepper currentStep={currentStep} />
      </div>

      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-black text-yellow-400">{AUTH_TEXTS.REGISTER_BRANDING_TITLE}</h1>
            <p className="text-gray-400 text-sm mt-1">Passo {currentStep} de 4: {STEPS[currentStep - 1].title}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">{STEPS[currentStep - 1].title}</h2>
            <p className="text-gray-400 mb-8">{AUTH_TEXTS.REGISTER_SUBTITLE}</p>

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_FIRST_NAME_LABEL}</label>
                      <input {...register('firstName')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="João" />
                      {errors.firstName && <span className="text-red-400 text-xs mt-1 block">{errors.firstName.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_LAST_NAME_LABEL}</label>
                      <input {...register('lastName')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Silva" />
                      {errors.lastName && <span className="text-red-400 text-xs mt-1 block">{errors.lastName.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_CPF_LABEL}</label>
                      <input {...register('cpf')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="000.000.000-00" />
                      {errors.cpf && <span className="text-red-400 text-xs mt-1 block">{errors.cpf.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_BIRTH_DATE_LABEL}</label>
                      <input {...register('birthDate')} type="date" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white [color-scheme:dark]" />
                      {errors.birthDate && <span className="text-red-400 text-xs mt-1 block">{errors.birthDate.message}</span>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_EMAIL_LABEL}</label>
                    <input {...register('email')} type="email" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="torcedor@email.com" />
                    {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_PHONE_LABEL}</label>
                    <input {...register('phones.0.number')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="(53) 99999-9999" />
                    {errors.phones?.[0]?.number && <span className="text-red-400 text-xs mt-1 block">{errors.phones[0].number.message}</span>}
                    
                    <label className="flex items-center gap-2 mt-3 cursor-pointer group">
                      <input type="checkbox" {...register('phones.0.isWhatsapp')} className="w-5 h-5 rounded border-white/20 bg-black/50 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-900" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{AUTH_TEXTS.REGISTER_IS_WHATSAPP}</span>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_ZIP_CODE_LABEL}</label>
                      <input 
                        {...register('addresses.0.zipCode')} 
                        onChange={(e) => {
                          register('addresses.0.zipCode').onChange(e);
                          fetchAddress(e.target.value);
                        }}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" 
                        placeholder="96000-000" 
                      />
                      {errors.addresses?.[0]?.zipCode && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].zipCode.message}</span>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_STREET_LABEL}</label>
                      <input {...register('addresses.0.street')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Rua das Tropas" />
                      {errors.addresses?.[0]?.street && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].street.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_NUMBER_LABEL}</label>
                      <input {...register('addresses.0.number')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="123" />
                      {errors.addresses?.[0]?.number && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].number.message}</span>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_NEIGHBORHOOD_LABEL}</label>
                      <input {...register('addresses.0.neighborhood')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Centro" />
                      {errors.addresses?.[0]?.neighborhood && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].neighborhood.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_CITY_LABEL}</label>
                      <input {...register('addresses.0.city')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Pelotas" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_STATE_LABEL}</label>
                      <input {...register('addresses.0.state')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="RS" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_PASSWORD_LABEL}</label>
                    <input {...register('password')} type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="••••••••" />
                    {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{AUTH_TEXTS.REGISTER_CONFIRM_PASSWORD_LABEL}</label>
                    <input {...register('confirmPassword')} type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="••••••••" />
                    {errors.confirmPassword && <span className="text-red-400 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-3 transition-colors">
                    <ArrowLeft size={18} />
                    {AUTH_TEXTS.REGISTER_BUTTON_PREV}
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all">
                    {AUTH_TEXTS.REGISTER_BUTTON_NEXT}
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : AUTH_TEXTS.REGISTER_BUTTON_SUBMIT}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
              {AUTH_TEXTS.REGISTER_ALREADY_HAVE_ACCOUNT}{' '}
              <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                {AUTH_TEXTS.REGISTER_LOGIN_LINK}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
