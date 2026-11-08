'use client';

import React from 'react';
import { LayoutContainer, Text } from '@/shared/ui/components';
import { useHomeSponsorsTicker } from '../../hooks';
import { HOME_SPONSORS_TICKER_TEXTS } from '../../constants';
import { HomeSponsorTickerItem } from './HomeSponsorTickerItem';

export const HomeSponsorsTicker = () => {
  const { sponsors, isLoading, handleSponsorClick } = useHomeSponsorsTicker();

  if (isLoading || sponsors.length === 0) {
    return null;
  }

  // Duplicamos a lista para criar um loop de marquee contínuo sem cortes
  const marqueeItems = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <LayoutContainer
      as="section"
      aria-label={HOME_SPONSORS_TICKER_TEXTS.ARIA_LABEL}
      className="w-full bg-surface/40 backdrop-blur-md border-b border-border/40 overflow-hidden py-2 sm:py-2.5 select-none transition-colors"
    >
      <LayoutContainer className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Badge / Indicador discreto à esquerda */}
        <LayoutContainer className="hidden md:flex items-center gap-1.5 shrink-0 pr-4 border-r border-border/40">
          <LayoutContainer className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Text
            as="span"
            className="text-[11px] font-black uppercase tracking-widest text-primary"
          >
            {HOME_SPONSORS_TICKER_TEXTS.LABEL_BADGE}
          </Text>
        </LayoutContainer>

        {/* Trilho de rolagem contínua do marquee com pausa no hover */}
        <LayoutContainer className="flex-1 overflow-hidden relative mask-radial">
          <LayoutContainer className="animate-marquee items-center gap-6 sm:gap-10 cursor-pointer">
            {marqueeItems.map((sponsor, index) => (
              <HomeSponsorTickerItem
                key={`${sponsor.id}-${index}`}
                sponsor={sponsor}
                onClick={handleSponsorClick}
              />
            ))}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
