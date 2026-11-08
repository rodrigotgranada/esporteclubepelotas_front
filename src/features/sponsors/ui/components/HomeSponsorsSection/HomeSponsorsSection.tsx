'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { useHomeSponsorsSection } from './useHomeSponsorsSection';
import { HOME_SPONSORS_SECTION_TEXTS } from './HomeSponsorsSection.constants';
import { ExternalLink, Sparkles } from 'lucide-react';

export const HomeSponsorsSection = () => {
  const { sponsors, isLoading, handleSponsorClick } = useHomeSponsorsSection();

  if (isLoading && sponsors.length === 0) {
    return null;
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <LayoutContainer
      as="section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex flex-col gap-8 sm:gap-10 border-t border-border/40 bg-transparent"
    >
      {/* Cabeçalho da Seção */}
      <LayoutContainer className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2">
        <LayoutContainer className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
          <Sparkles size={13} className="text-primary" />
          <Text as="span">{HOME_SPONSORS_SECTION_TEXTS.BADGE}</Text>
        </LayoutContainer>

        <Title
          level="h2"
          className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight"
        >
          {HOME_SPONSORS_SECTION_TEXTS.TITLE_PREFIX}{' '}
          <Text as="span" className="text-primary">
            {HOME_SPONSORS_SECTION_TEXTS.TITLE_HIGHLIGHT}
          </Text>
        </Title>

        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {HOME_SPONSORS_SECTION_TEXTS.SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Grid de 5 colunas com os parceiros */}
      <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {sponsors.map((sponsor) => {
          const isClickable = Boolean(sponsor.websiteUrl);

          return (
            <LayoutContainer
              key={sponsor.id}
              onClick={() => handleSponsorClick(sponsor)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              title={sponsor.name}
              className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                sponsor.isFeatured
                  ? 'border-primary/40 bg-surface/80 shadow-xs hover:border-primary hover:shadow-md'
                  : 'border-border/60 bg-surface/50 hover:border-primary/40 hover:bg-surface/80'
              } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {/* Badge de Destaque no topo do card se isFeatured for true */}
              {sponsor.isFeatured && (
                <LayoutContainer className="absolute top-2.5 right-2.5">
                  <Badge variant="primary" size="sm" className="text-[10px] py-0.5 px-1.5 font-bold">
                    {HOME_SPONSORS_SECTION_TEXTS.FEATURED_BADGE}
                  </Badge>
                </LayoutContainer>
              )}

              {/* Logo do Patrocinador */}
              <LayoutContainer className="relative h-14 sm:h-16 w-full max-w-[140px] flex items-center justify-center my-2">
                <SafeImage
                  src={sponsor.logoUrl}
                  alt={HOME_SPONSORS_SECTION_TEXTS.LOGO_ALT(sponsor.name)}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                  fallbackSrc="/images/pelotas-logo.png"
                />
              </LayoutContainer>

              {/* Nome e Indicador de Link */}
              <LayoutContainer className="flex items-center gap-1.5 mt-2 text-center">
                <Text
                  as="span"
                  className="text-xs sm:text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1"
                >
                  {sponsor.name}
                </Text>
                {isClickable && (
                  <ExternalLink
                    size={12}
                    className="text-text-secondary/60 group-hover:text-primary transition-colors shrink-0"
                  />
                )}
              </LayoutContainer>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
