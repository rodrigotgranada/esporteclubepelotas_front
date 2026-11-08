'use client';

import React from 'react';
import { LayoutContainer, Text, SafeImage } from '@/shared/ui/components';
import { useHomeSponsorsTicker } from './useHomeSponsorsTicker';
import { HOME_SPONSORS_TICKER_TEXTS } from './HomeSponsorsTicker.constants';

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
        <LayoutContainer className="hidden md:flex items-center gap-1.5 shrink-0 pr-4 border-r border-border/50">
          <LayoutContainer className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Text
            as="span"
            className="text-[11px] font-black uppercase tracking-widest text-text-secondary"
          >
            {HOME_SPONSORS_TICKER_TEXTS.LABEL_BADGE}
          </Text>
        </LayoutContainer>

        {/* Trilho de rolagem contínua do marquee com pausa no hover */}
        <LayoutContainer className="flex-1 overflow-hidden relative mask-radial">
          <LayoutContainer className="animate-marquee items-center gap-8 sm:gap-12 cursor-pointer">
            {marqueeItems.map((sponsor, index) => {
              const uniqueKey = `${sponsor.id}-${index}`;
              const isClickable = Boolean(sponsor.websiteUrl);

              return (
                <LayoutContainer
                  key={uniqueKey}
                  onClick={() => handleSponsorClick(sponsor)}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  title={sponsor.name}
                  className={`flex items-center gap-2 group shrink-0 transition-opacity duration-200 ${
                    isClickable ? 'cursor-pointer hover:opacity-100' : 'cursor-default opacity-80'
                  }`}
                >
                  <LayoutContainer className="relative h-6 sm:h-7 w-20 sm:w-28 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                    <SafeImage
                      src={sponsor.logoUrl}
                      alt={HOME_SPONSORS_TICKER_TEXTS.LOGO_ALT(sponsor.name)}
                      fill
                      className="object-contain"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                  </LayoutContainer>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

