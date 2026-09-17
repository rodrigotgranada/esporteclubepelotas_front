'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Phone, MapPin, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Nome muito curto'),
  lastName: z.string().min(2, 'Sobrenome muito curto'),
  cpf: z.string().min(11, 'CPF inválido'),
  birthDate: z.string().min(10, 'Data inválida'),
  email: z.string().email('E-mail inválido'),
  phones: z.array(
    z.object({
      number: z.string().min(10, 'Telefone inválido'),
      isWhatsapp: z.boolean().default(false),
      isPrimary: z.boolean().default(true),
    })
  ).min(1),
  addresses: z.array(
    z.object({
      zipCode: z.string().min(8, 'CEP inválido'),
      street: z.string().min(3, 'Rua inválida'),
      number: z.string().min(1, 'Número obrigatório'),
      complement: z.string().optional(),
      neighborhood: z.string().min(2, 'Bairro inválido'),
      city: z.string().min(2, 'Cidade inválida'),
      state: z.string().min(2, 'Estado inválido'),
      isPrimary: z.boolean().default(true),
    })
  ).min(1),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const STEPS = [
  { id: 1, title: 'Dados Pessoais', icon: User },
  { id: 2, title: 'Contato', icon: Phone },
  { id: 3, title: 'Endereço', icon: MapPin },
  { id: 4, title: 'Segurança', icon: Lock },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phones: [{ number: '', isWhatsapp: false, isPrimary: true }],
      addresses: [{ zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', isPrimary: true }],
    }
  });

  // Funcao basica de ViaCEP para facilitar a UX
  const fetchAddress = async (zipCode: string) => {
    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('addresses.0.street', data.logradouro);
          setValue('addresses.0.neighborhood', data.bairro);
          setValue('addresses.0.city', data.localidade);
          setValue('addresses.0.state', data.uf);
        }
      } catch (e) {
        // ignora
      }
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['firstName', 'lastName', 'cpf', 'birthDate'];
    if (currentStep === 2) fieldsToValidate = ['email', 'phones'];
    if (currentStep === 3) fieldsToValidate = ['addresses'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setErrorMsg('');
    try {
      // Ajusta data para formato Date
      const payload = {
        ...data,
        birthDate: new Date(data.birthDate).toISOString(),
      };
      
      await api.post('/users/register', payload);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Ocorreu um erro ao realizar o cadastro.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#111111] text-white p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Cadastro Concluído!</h2>
          <p className="text-gray-400 mb-8">
            Seja muito bem-vindo ao portal do Esporte Clube Pelotas.
          </p>
          <p className="text-sm text-yellow-400 animate-pulse">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#111111] text-white">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex w-1/3 bg-blue-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <div className="z-20 relative">
          <h1 className="text-3xl font-black text-yellow-400 mb-2 tracking-tighter">E.C. PELOTAS</h1>
          <p className="text-gray-300 font-light">Cadastro de Torcedor</p>
        </div>

        <div className="z-20 relative space-y-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-yellow-400 text-blue-950 scale-110 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : isCompleted ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wider ${isActive ? 'text-yellow-400' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                    Passo {step.id}
                  </p>
                  <p className={`font-medium ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-xl">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-black text-yellow-400">E.C. PELOTAS</h1>
            <p className="text-gray-400 text-sm mt-1">Passo {currentStep} de 4: {STEPS[currentStep - 1].title}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">{STEPS[currentStep - 1].title}</h2>
            <p className="text-gray-400 mb-8">Preencha as informações abaixo para prosseguir.</p>

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* PASSO 1: DADOS PESSOAIS */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                      <input {...register('firstName')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="João" />
                      {errors.firstName && <span className="text-red-400 text-xs mt-1 block">{errors.firstName.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sobrenome</label>
                      <input {...register('lastName')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Silva" />
                      {errors.lastName && <span className="text-red-400 text-xs mt-1 block">{errors.lastName.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CPF</label>
                      <input {...register('cpf')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="000.000.000-00" />
                      {errors.cpf && <span className="text-red-400 text-xs mt-1 block">{errors.cpf.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Data de Nascimento</label>
                      <input {...register('birthDate')} type="date" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white [color-scheme:dark]" />
                      {errors.birthDate && <span className="text-red-400 text-xs mt-1 block">{errors.birthDate.message}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 2: CONTATO */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">E-mail de Acesso</label>
                    <input {...register('email')} type="email" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="torcedor@email.com" />
                    {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telefone Principal</label>
                    <input {...register('phones.0.number')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="(53) 99999-9999" />
                    {errors.phones?.[0]?.number && <span className="text-red-400 text-xs mt-1 block">{errors.phones[0].number.message}</span>}
                    
                    <label className="flex items-center gap-2 mt-3 cursor-pointer group">
                      <input type="checkbox" {...register('phones.0.isWhatsapp')} className="w-5 h-5 rounded border-white/20 bg-black/50 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-900" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Este número é WhatsApp</span>
                    </label>
                  </div>
                </div>
              )}

              {/* PASSO 3: ENDEREÇO */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">CEP</label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Logradouro (Rua)</label>
                      <input {...register('addresses.0.street')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Rua das Tropas" />
                      {errors.addresses?.[0]?.street && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].street.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Número</label>
                      <input {...register('addresses.0.number')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="123" />
                      {errors.addresses?.[0]?.number && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].number.message}</span>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bairro</label>
                      <input {...register('addresses.0.neighborhood')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Centro" />
                      {errors.addresses?.[0]?.neighborhood && <span className="text-red-400 text-xs mt-1 block">{errors.addresses[0].neighborhood.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
                      <input {...register('addresses.0.city')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="Pelotas" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Estado (UF)</label>
                      <input {...register('addresses.0.state')} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="RS" />
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 4: SENHA */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Criar Senha</label>
                    <input {...register('password')} type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="••••••••" />
                    {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha</label>
                    <input {...register('confirmPassword')} type="password" className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-white" placeholder="••••••••" />
                    {errors.confirmPassword && <span className="text-red-400 text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                {currentStep > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-3 transition-colors">
                    <ArrowLeft size={18} />
                    Voltar
                  </button>
                ) : (
                  <div /> // Spacer
                )}

                {currentStep < 4 ? (
                  <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all">
                    Próximo
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Finalizar Cadastro'}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
