'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      const { accessToken, user } = response.data;
      setAuth(accessToken, user);
      router.push('/dashboard'); // Or home, or whatever authenticated route
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMsg('E-mail ou senha incorretos.');
      } else {
        setErrorMsg('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#111111] text-white">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden flex-col justify-center items-center">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-overlay z-0 opacity-40" />
        
        <div className="z-20 text-center px-12">
          <h1 className="text-5xl font-black text-yellow-400 mb-6 tracking-tighter">
            ESPORTE CLUBE PELOTAS
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            Bem-vindo ao portal oficial. Acesso exclusivo para sócios, torcedores e administração.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-3xl font-black text-yellow-400">E.C. PELOTAS</h1>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">Entrar</h2>
            <p className="text-gray-400 mb-8">Digite suas credenciais para acessar a plataforma.</p>

            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none text-white placeholder-gray-600"
                    placeholder="torcedor@email.com"
                  />
                </div>
                {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none text-white placeholder-gray-600"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Acessar Portal
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
