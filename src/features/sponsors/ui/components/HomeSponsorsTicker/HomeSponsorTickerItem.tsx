'use client';

import React from 'react';
import { LayoutContainer, SafeImage } from '@/shared/ui/components';
import { Sponsor } from '../../../types/sponsors.types';
import { useImageLuminance } from '../../../hooks/useImageLuminance';
import { HOME_SPONSORS_TICKER_TEXTS } from './HomeSponsorsTicker.constants';

export interface HomeSponsorTickerItemProps {
  sponsor: Sponsor;
  onClick: (sponsor: Sponsor) => void;
}

export const HomeSponsorTickerItem: React.FC<HomeSponsorTickerItemProps> = ({
  sponsor,
  onClick,
}) => {
  const { isLightAsset } = useImageLuminance(sponsor.logoUrl);
  const isClickable = Boolean(sponsor.websiteUrl);

  return (
    <LayoutContainer
      onClick={() => onClick(sponsor)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={sponsor.name}
      className={`flex items-center gap-2 group shrink-0 transition-all duration-200 px-3 py-1 rounded-xl ${
        isClickable ? 'cursor-pointer hover:opacity-100' : 'cursor-default opacity-85'
      } ${
        isLightAsset
          ? 'hover:bg-secondary hover:border hover:border-primary/50 hover:shadow-sm'
          : 'hover:bg-surface/60'
      }`}
    >
      <LayoutContainer className="relative h-6 sm:h-7 w-20 sm:w-28 flex items-center justify-center transition-all duration-300">
        <SafeImage
          src={sponsor.logoUrl}
          alt={HOME_SPONSORS_TICKER_TEXTS.LOGO_ALT(sponsor.name)}
          fill
          className={`object-contain transition-all duration-300 ${
            isLightAsset
              ? 'dark:filter-none brightness-0 opacity-70 group-hover:brightness-100 group-hover:opacity-100 group-hover:scale-105 dark:group-hover:scale-105'
              : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
          }`}
          fallbackSrc="/images/pelotas-logo.png"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
