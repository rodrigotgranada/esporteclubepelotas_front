'use client';

import React from 'react';
import { LayoutContainer, Title, Text } from '@/shared/ui/components';
import { Sparkles } from 'lucide-react';
import { useHomeSponsorsSection } from '../../hooks';
import { HOME_SPONSORS_SECTION_TEXTS } from '../../constants';
import { HomeSponsorCard } from './HomeSponsorCard';

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
        {sponsors.map((sponsor) => (
          <HomeSponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            onClick={handleSponsorClick}
          />
        ))}
      </LayoutContainer>
    </LayoutContainer>
  );
};

