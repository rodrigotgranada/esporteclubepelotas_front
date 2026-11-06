'use client';

import React from 'react';
import { LayoutContainer } from '@/shared/ui/components';

/**
 * PelotasWatermarkBackground
 * Marca d'água oficial e artística do distintivo do Esporte Clube Pelotas (ECP 1908)
 * Cria uma identidade visual marcante tanto no tema claro (sobre o off-white)
 * quanto no tema escuro (sobre o azul noite profundo).
 */
export const PelotasWatermarkBackground: React.FC = () => {
  return (
    <LayoutContainer
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
    >
      {/* Brilho radial muito sutil de atmosfera áureo-cerúlea */}
      <LayoutContainer className="absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-radial from-primary/4 via-secondary/3 to-transparent blur-3xl opacity-60 dark:opacity-40" />

      {/* SVG Monumental do Distintivo do Lobo com Transparência */}
      <svg
        className="w-[380px] h-[380px] sm:w-[720px] sm:h-[720px] max-w-[90vw] max-h-[90vh] text-primary/10 dark:text-primary/[0.07] transition-opacity duration-500 transform -rotate-3 scale-105"
        viewBox="0 0 400 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente de traçado áureo sutil */}
          <linearGradient id="wm-gold-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.45" />
          </linearGradient>

          {/* Gradiente de traçado cerúleo */}
          <linearGradient id="wm-blue-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.15" />
          </linearGradient>

          {/* Clip path para a faixa transversal do escudo */}
          <clipPath id="wm-shield-clip">
            <path d="M 200,28 L 360,78 C 360,250 305,370 200,432 C 95,370 40,250 40,78 Z" />
          </clipPath>
        </defs>

        {/* 1. Contorno Externo do Escudo */}
        <path
          d="M 200,20 L 372,74 C 372,258 314,385 200,452 C 86,385 28,258 28,74 Z"
          stroke="url(#wm-gold-stroke)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70 dark:opacity-60"
        />

        {/* 2. Contorno Interno do Escudo */}
        <path
          d="M 200,28 L 360,78 C 360,250 305,370 200,432 C 95,370 40,250 40,78 Z"
          stroke="url(#wm-gold-stroke)"
          strokeWidth="1.8"
          strokeOpacity="0.5"
        />

        {/* 3. Faixa Transversal Áureo-Cerúlea (Emblema Tradicional do Pelotas) */}
        <g clipPath="url(#wm-shield-clip)">
          {/* Faixa Secundária */}
          <polygon
            points="10,240 390,100 390,170 10,310"
            fill="var(--color-primary)"
            fillOpacity="0.08"
          />
          {/* Linha guia superior da faixa */}
          <line
            x1="10"
            y1="240"
            x2="390"
            y2="100"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
          {/* Linha guia inferior da faixa */}
          <line
            x1="10"
            y1="310"
            x2="390"
            y2="170"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
        </g>

        {/* 4. Monograma Institucional ECP */}
        <text
          x="200"
          y="200"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="68"
          fill="var(--color-primary)"
          fillOpacity="0.18"
          textAnchor="middle"
          letterSpacing="4"
          className="dark:fill-primary/20"
        >
          ECP
        </text>

        {/* 5. Ano Centenário de Fundação 1908 */}
        <text
          x="200"
          y="285"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="24"
          fill="var(--color-primary)"
          fillOpacity="0.22"
          textAnchor="middle"
          letterSpacing="6"
          className="dark:fill-primary/25"
        >
          1908
        </text>

        {/* 6. Linhas Táticas / Detalhe Heráldico na Ponta */}
        <circle cx="200" cy="350" r="4" fill="var(--color-primary)" fillOpacity="0.25" />
        <line
          x1="170"
          y1="350"
          x2="190"
          y2="350"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <line
          x1="210"
          y1="350"
          x2="230"
          y2="350"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
      </svg>
    </LayoutContainer>
  );
};
