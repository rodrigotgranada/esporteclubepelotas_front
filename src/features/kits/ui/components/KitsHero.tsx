import React from 'react';
import { Sparkles, Shirt } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { KITS_TEXTS } from '../../constants/kits.constants';

export const KitsHero: React.FC = () => {
  return (
    <LayoutContainer className="relative w-full overflow-hidden bg-gradient-to-b from-primary/15 via-surface/60 to-background border-b border-border/70 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Glow Dourado de Fundo */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      <LayoutContainer className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Distintivo Oficial */}
        <LayoutContainer className="relative w-24 h-24 sm:w-28 sm:h-28 mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
          <SafeImage
            src="/images/pelotas-logo.png"
            alt="Esporte Clube Pelotas"
            fill
            sizes="112px"
            className="object-contain"
            fallbackSrc="/images/pelotas-logo.png"
          />
        </LayoutContainer>

        {/* Badge */}
        <Badge
          variant="primary"
          size="sm"
          className="font-extrabold uppercase tracking-widest px-3 py-1 text-[11px] inline-flex items-center gap-1.5 shadow-xs mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <Text as="span">{KITS_TEXTS.HERO_BADGE}</Text>
        </Badge>

        {/* Título Monumental */}
        <Title
          level="h1"
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight mb-3 sm:mb-4 flex items-center justify-center gap-3"
        >
          <Shirt className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
          <Text as="span">{KITS_TEXTS.HERO_TITLE}</Text>
        </Title>

        {/* Subtítulo */}
        <Text
          as="p"
          className="text-base sm:text-xl font-medium text-text-secondary max-w-2xl leading-relaxed"
        >
          {KITS_TEXTS.HERO_SUBTITLE}
        </Text>
      </LayoutContainer>
    </LayoutContainer>
  );
};

