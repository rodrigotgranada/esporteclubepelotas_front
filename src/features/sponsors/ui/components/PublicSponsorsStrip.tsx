'use client';

import React from 'react';
import { LayoutContainer, Title, SafeImage } from '@/shared/ui/components';
import { Sparkles } from 'lucide-react';
import { useHomeSponsorsSection } from '../../hooks';
import { resolveSponsorLogo } from '../../utils/sponsor-logo.util';
import { useIsDarkTheme } from '@/shared/hooks/useIsDarkTheme';

export interface PublicSponsorsStripProps {
  title?: string;
  className?: string;
}

export const PublicSponsorsStrip: React.FC<PublicSponsorsStripProps> = ({
  title = 'Patrocinadores & Parceiros Oficiais',
  className = '',
}) => {
  const { sponsors, isLoading, handleSponsorClick } = useHomeSponsorsSection();
  const isDark = useIsDarkTheme();

  if (isLoading || sponsors.length === 0) {
    return null;
  }

  return (
    <LayoutContainer
      as="section"
      aria-label="Patrocinadores Oficiais"
      className={`w-full py-8 sm:py-10 border-t border-border/40 bg-surface/30 rounded-3xl p-6 sm:p-8 my-6 ${className}`}
    >
      <LayoutContainer className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Título Institucional da Régua */}
        <LayoutContainer className="flex items-center gap-2 text-center">
          <Sparkles size={14} className="text-primary" />
          <Title
            level="h4"
            className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-text-secondary"
          >
            {title}
          </Title>
        </LayoutContainer>

        {/* Grid de Marcas em Destaque */}
        <LayoutContainer className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {sponsors.map((sponsor) => {
            const logoSrc = resolveSponsorLogo(sponsor, isDark);
            const isClickable = Boolean(sponsor.websiteUrl);

            return (
              <LayoutContainer
                key={sponsor.id}
                onClick={() => handleSponsorClick(sponsor)}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                title={sponsor.name}
                className={`group flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  isClickable
                    ? 'cursor-pointer hover:bg-surface/80 hover:shadow-xs'
                    : 'cursor-default opacity-85'
                }`}
              >
                <LayoutContainer className="relative h-7 sm:h-9 w-24 sm:w-32 flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105">
                  <SafeImage
                    src={logoSrc}
                    alt={sponsor.name}
                    fill
                    sizes="128px"
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
  );
};
