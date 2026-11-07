'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Badge, SafeImage } from '@/shared/ui/components';
import { STADIUM_TEXTS } from '../../constants/stadium.constants';
import { Shield, Sparkles } from 'lucide-react';

interface StadiumHeroProps {
  title?: string;
  subtitle?: string;
  coverImageUrl?: string;
}

export const StadiumHero: React.FC<StadiumHeroProps> = ({
  title,
  subtitle,
  coverImageUrl,
}) => {
  const displayTitle = title || STADIUM_TEXTS.TITLE_DEFAULT;
  const displaySubtitle = subtitle || STADIUM_TEXTS.SUBTITLE_DEFAULT;
  const displayCover =
    coverImageUrl ||
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=85';

  return (
    <LayoutContainer className="relative w-full overflow-hidden bg-background border-b border-border">
      {/* Background Cover Image com overlay áureo-cerúleo profundo */}
      <LayoutContainer className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[600px]">
        <SafeImage
          src={displayCover}
          alt={displayTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Gradientes múltiplos para leitura de alto contraste em qualquer tema */}
        <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <LayoutContainer className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        {/* Overlay áureo sutil no topo */}
        <LayoutContainer className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

        {/* Conteúdo Centralizado / Alinhado */}
        <LayoutContainer className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10 sm:pb-14">
          <LayoutContainer className="max-w-3xl flex flex-col gap-3 sm:gap-4">
            {/* Badge Centenária */}
            <LayoutContainer className="flex items-center gap-2">
              <Badge
                variant="default"
                size="md"
                className="inline-flex items-center gap-1.5 bg-primary/20 text-primary border border-primary/40 font-bold px-3 py-1 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                {STADIUM_TEXTS.BADGE}
              </Badge>
            </LayoutContainer>

            {/* Título Monumental */}
            <Title
              level="h1"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-[1.1] drop-shadow-md"
            >
              {displayTitle}
            </Title>

            {/* Subtítulo / Olho Editorial */}
            <Text className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
              {displaySubtitle}
            </Text>

            {/* Selo Místico Áureo-Cerúleo */}
            <LayoutContainer className="flex items-center gap-2 pt-1 text-xs text-text-secondary">
              <Shield className="w-4 h-4 text-primary" />
              <Text as="span" className="font-semibold text-text-primary">
                {STADIUM_TEXTS.QUICK_FACTS.NICKNAME_DEFAULT}
              </Text>
              <Text as="span" className="text-border">•</Text>
              <Text as="span">Pelotas, RS</Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
