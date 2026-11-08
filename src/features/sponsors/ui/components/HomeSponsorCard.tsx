'use client';

import React from 'react';
import { LayoutContainer, Text, SafeImage } from '@/shared/ui/components';
import { ExternalLink } from 'lucide-react';
import { Sponsor } from '../../types/sponsors.types';
import { HOME_SPONSORS_SECTION_TEXTS } from '../../constants/home-sponsors-section.constants';
import { resolveSponsorLogo } from '../../utils/sponsor-logo.util';
import { useIsDarkTheme } from '@/shared/hooks/useIsDarkTheme';

export interface HomeSponsorCardProps {
  sponsor: Sponsor;
  onClick: (sponsor: Sponsor) => void;
}

export const HomeSponsorCard: React.FC<HomeSponsorCardProps> = ({ sponsor, onClick }) => {
  const isDark = useIsDarkTheme();
  const isClickable = Boolean(sponsor.websiteUrl);
  const logoSrc = resolveSponsorLogo(sponsor, isDark);

  return (
    <LayoutContainer
      onClick={() => onClick(sponsor)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={sponsor.name}
      className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-surface/60 hover:bg-surface border border-border/80 hover:border-primary/60 shadow-xs hover:shadow-md transition-all duration-300 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Logotipo da Marca conforme o Tema Ativo */}
      <LayoutContainer className="relative h-14 sm:h-16 w-full max-w-[140px] flex items-center justify-center my-2">
        <SafeImage
          src={logoSrc}
          alt={HOME_SPONSORS_SECTION_TEXTS.LOGO_ALT(sponsor.name)}
          fill
          sizes="(max-width: 768px) 120px, 160px"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          fallbackSrc="/images/pelotas-logo.png"
        />
      </LayoutContainer>

      {/* Nome da Marca e Ícone de Link Oficial */}
      <LayoutContainer className="flex items-center gap-1.5 mt-2 text-center">
        <Text
          as="span"
          className="text-xs sm:text-sm font-bold text-text-secondary group-hover:text-primary transition-colors line-clamp-1"
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
};
