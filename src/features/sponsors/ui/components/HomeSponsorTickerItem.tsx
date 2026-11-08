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
      className={`group flex items-center justify-center shrink-0 px-2 sm:px-3 py-1 transition-all duration-300 select-none ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <LayoutContainer className="relative h-6 sm:h-7 w-20 sm:w-28 flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105">
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
