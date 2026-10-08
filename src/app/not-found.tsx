'use client';

import Link from 'next/link';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <LayoutContainer className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <LayoutContainer className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
      <LayoutContainer className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none" />

      <LayoutContainer className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Distintivo (Shield CSS) */}
        <LayoutContainer className="w-32 h-32 mb-8 relative flex items-center justify-center">
          <LayoutContainer className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rotate-45 rounded-xl animate-pulse shadow-[0_0_40px_rgba(234,179,8,0.4)]" />
          <LayoutContainer className="absolute inset-2 bg-[#0a0a0a] rotate-45 rounded-lg flex items-center justify-center overflow-hidden">
            <LayoutContainer className="w-full h-full bg-gradient-to-t from-blue-950/80 to-transparent" />
          </LayoutContainer>
          <Text className="relative z-10 font-black text-4xl tracking-tighter text-yellow-400 drop-shadow-md">
            ECP
          </Text>
        </LayoutContainer>

        <LayoutContainer className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
          <Title level="h1" className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2">
            404
          </Title>
          <Title level="h2" className="text-2xl font-bold text-white mb-4">
            Página Não Encontrada
          </Title>
          <Text className="text-gray-400 mb-8 max-w-md mx-auto">
            A página que você está procurando foi movida, excluída ou talvez você tenha tentado acessar uma área restrita (impedimento!).
          </Text>

          <LayoutContainer className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto flex items-center gap-2 group">
                <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Voltar ao Início
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto flex items-center gap-2 text-gray-300"
              onClick={() => {
                if (typeof window !== 'undefined') window.history.back();
              }}
            >
              <ArrowLeft size={18} />
              Voltar Página
            </Button>
          </LayoutContainer>
        </LayoutContainer>
        
        <Text className="mt-12 text-sm font-bold text-gray-600 uppercase tracking-widest">
          Esporte Clube Pelotas • O Lobão
        </Text>
      </LayoutContainer>
    </LayoutContainer>
  );
}
