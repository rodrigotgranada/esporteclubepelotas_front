'use client';

import React from 'react';
import { LayoutContainer, Text, SafeImage } from '@/shared/ui/components';
import { ExternalLink } from 'lucide-react';
import { Sponsor } from '../../../types/sponsors.types';
import { useImageLuminance } from '../../../hooks/useImageLuminance';
import { HOME_SPONSORS_SECTION_TEXTS } from './HomeSponsorsSection.constants';

export interface HomeSponsorCardProps {
  sponsor: Sponsor;
  onClick: (sponsor: Sponsor) => void;
}

export const HomeSponsorCard: React.FC<HomeSponsorCardProps> = ({ sponsor, onClick }) => {
  const { isLightAsset } = useImageLuminance(sponsor.logoUrl);
  const isClickable = Boolean(sponsor.websiteUrl);

  return (
    <LayoutContainer
      onClick={() => onClick(sponsor)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={sponsor.name}
      className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      } ${
        isLightAsset
          ? 'border-border/60 bg-surface/70 hover:bg-secondary hover:border-primary hover:shadow-xl dark:border-border/60 dark:bg-surface/50 dark:hover:border-primary/60 dark:hover:bg-surface/80'
          : 'border-border/60 bg-surface/70 hover:border-primary/60 hover:bg-surface/90 hover:shadow-md dark:border-border/60 dark:bg-surface/50 dark:hover:border-primary/60 dark:hover:bg-surface/80'
      }`}
    >
      {/* Logotipo do Patrocinador com Adaptação Inteligente de Contraste */}
      <LayoutContainer className="relative h-14 sm:h-16 w-full max-w-[140px] flex items-center justify-center my-2">
        <SafeImage
          src={sponsor.logoUrl}
          alt={HOME_SPONSORS_SECTION_TEXTS.LOGO_ALT(sponsor.name)}
          fill
          className={`object-contain transition-all duration-300 ${
            isLightAsset
              ? 'dark:filter-none brightness-0 opacity-70 group-hover:brightness-100 group-hover:opacity-100 group-hover:scale-105 dark:group-hover:scale-105'
              : 'filter grayscale group-hover:grayscale-0 group-hover:scale-105'
          }`}
          fallbackSrc="/images/pelotas-logo.png"
        />
      </LayoutContainer>

      {/* Nome e Indicador de Link */}
      <LayoutContainer className="flex items-center gap-1.5 mt-2 text-center">
        <Text
          as="span"
          className={`text-xs sm:text-sm font-bold transition-colors line-clamp-1 ${
            isLightAsset
              ? 'text-text-secondary group-hover:text-white dark:group-hover:text-text-primary'
              : 'text-text-secondary group-hover:text-text-primary'
          }`}
        >
          {sponsor.name}
        </Text>
        {isClickable && (
          <ExternalLink
            size={12}
            className={`transition-colors shrink-0 ${
              isLightAsset
                ? 'text-text-secondary/60 group-hover:text-primary dark:group-hover:text-primary'
                : 'text-text-secondary/60 group-hover:text-primary'
            }`}
          />
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
