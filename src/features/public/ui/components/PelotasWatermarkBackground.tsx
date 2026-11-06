'use client';

import React from 'react';
import Image from 'next/image';
import { LayoutContainer } from '@/shared/ui/components';

/**
 * PelotasWatermarkBackground
 * Marca d'água oficial e artística do distintivo do Esporte Clube Pelotas (ECP 1908)
 * Utiliza o escudo oficial centenário com as 3 estrelas e os raios dourados e azuis.
 * No tema claro: sobre o fundo amarelo bem clarinho (creme / marfim áureo).
 * No tema escuro: sobre o fundo azul marinho noite profundo.
 */
export const PelotasWatermarkBackground: React.FC = () => {
  return (
    <LayoutContainer
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
    >
      {/* Brilho radial muito sutil de atmosfera áureo-cerúlea */}
      <LayoutContainer className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-radial from-primary/5 via-secondary/3 to-transparent blur-3xl opacity-60 dark:opacity-40" />

      {/* Distintivo Oficial Monumental do Pelotas com Transparência Suave */}
      <LayoutContainer className="relative flex items-center justify-center transform -rotate-2">
        <Image
          src="/images/pelotas-logo.png"
          alt="Distintivo Oficial do Pelotas"
          width={640}
          height={750}
          priority
          className="w-[280px] sm:w-[520px] md:w-[620px] h-auto object-contain opacity-[0.055] dark:opacity-[0.06] filter drop-shadow-sm transition-opacity duration-500"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
