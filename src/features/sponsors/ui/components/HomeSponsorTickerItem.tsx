'use client';

import React from 'react';
import { LayoutContainer, SafeImage } from '@/shared/ui/components';
import { Sponsor } from '../../types/sponsors.types';
import { HOME_SPONSORS_TICKER_TEXTS } from '../../constants/home-sponsors-ticker.constants';
import { resolveSponsorLogo } from '../../utils/sponsor-logo.util';
import { useIsDarkTheme } from '@/shared/hooks/useIsDarkTheme';

export interface HomeSponsorTickerItemProps {
  sponsor: Sponsor;
  onClick: (sponsor: Sponsor) => void;
}

export const HomeSponsorTickerItem: React.FC<HomeSponsorTickerItemProps> = ({
  sponsor,
  onClick,
}) => {
  const isDark = useIsDarkTheme();
  const isClickable = Boolean(sponsor.websiteUrl);
  const logoSrc = resolveSponsorLogo(sponsor, isDark);

  return (
    <LayoutContainer
      onClick={() => onClick(sponsor)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={sponsor.name}
      className={`flex items-center gap-2 group shrink-0 transition-all duration-200 px-3 py-1 rounded-lg ${
        isClickable
          ? 'cursor-pointer hover:bg-surface hover:shadow-xs hover:border hover:border-border'
          : 'cursor-default opacity-85'
      }`}
    >
      <LayoutContainer className="relative h-6 sm:h-7 w-20 sm:w-28 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <SafeImage
          src={logoSrc}
          alt={HOME_SPONSORS_TICKER_TEXTS.LOGO_ALT(sponsor.name)}
          fill
          sizes="112px"
          className="object-contain"
          fallbackSrc="/images/pelotas-logo.png"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
