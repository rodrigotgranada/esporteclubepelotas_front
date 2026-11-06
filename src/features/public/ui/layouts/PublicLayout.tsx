'use client';

import React, { useEffect } from 'react';
import { PublicHeader, PublicFooter, PelotasWatermarkBackground } from '../components';
import { LayoutContainer } from '@/shared/ui/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.status === 'PENDING') {
      router.push('/verify-email');
    }
  }, [user, router]);

  return (
    <LayoutContainer
      className="min-h-screen bg-background text-text-primary flex flex-col relative overflow-x-clip"
      style={{ overflowX: 'clip' }}
    >
      {/* Marca d'água monumental do distintivo do Pelotas estilizado no fundo global */}
      <PelotasWatermarkBackground />

      {/* Cabeçalho do portal */}
      <PublicHeader />

      {/* Container principal transparente para que todas as páginas compartilhem a marca d'água */}
      <LayoutContainer as="main" className="flex-1 relative z-10 bg-transparent flex flex-col">
        {children}
      </LayoutContainer>

      {/* Rodapé do portal */}
      <PublicFooter />
    </LayoutContainer>
  );
};
