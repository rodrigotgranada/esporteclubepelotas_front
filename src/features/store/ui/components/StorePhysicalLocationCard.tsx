'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Badge, Button } from '@/shared/ui/components';
import { MapPin, Clock, Building2, ExternalLink } from 'lucide-react';
import { STORE_TEXTS } from '../../constants/store.constants';

interface StorePhysicalLocationCardProps {
  address: string;
  openingHours: string;
  mapsUrl: string;
}

export const StorePhysicalLocationCard: React.FC<StorePhysicalLocationCardProps> = ({
  address,
  openingHours,
  mapsUrl,
}) => {
  return (
    <LayoutContainer className="bg-surface border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-md">
      {/* Header */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-0.5">
            <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
              {STORE_TEXTS.LOCATION_CARD_TITLE}
            </Title>
            <Text as="p" className="text-xs sm:text-sm text-text-secondary">
              {STORE_TEXTS.LOCATION_CARD_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <Badge variant="default" className="self-start sm:self-auto font-medium text-xs">
          {STORE_TEXTS.LOCATION_BADGE_STADIUM}
        </Badge>
      </LayoutContainer>

      {/* Grid: Address and Hours */}
      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address */}
        <LayoutContainer className="bg-surface-elevated/40 border border-border/80 rounded-xl p-5 flex flex-col justify-between gap-4">
          <LayoutContainer className="flex flex-col gap-2">
            <LayoutContainer className="flex items-center gap-2 text-primary">
              <MapPin className="w-5 h-5 shrink-0" />
              <Title level="h3" className="text-sm font-bold text-text-primary uppercase tracking-wide">
                {STORE_TEXTS.LOCATION_LABEL_ADDRESS}
              </Title>
            </LayoutContainer>

            <Text as="p" className="text-sm text-text-secondary leading-relaxed pl-7">
              {address || STORE_TEXTS.FALLBACK_ADDRESS}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="pt-2 pl-7">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                {STORE_TEXTS.LOCATION_BTN_MAPS}
              </Button>
            </a>
          </LayoutContainer>
        </LayoutContainer>

        {/* Opening Hours */}
        <LayoutContainer className="bg-surface-elevated/40 border border-border/80 rounded-xl p-5 flex flex-col gap-3">
          <LayoutContainer className="flex items-center gap-2 text-primary">
            <Clock className="w-5 h-5 shrink-0" />
            <Title level="h3" className="text-sm font-bold text-text-primary uppercase tracking-wide">
              {STORE_TEXTS.LOCATION_LABEL_HOURS}
            </Title>
          </LayoutContainer>

          <Text as="p" className="text-sm text-text-secondary leading-relaxed pl-7 whitespace-pre-line">
            {openingHours || STORE_TEXTS.FALLBACK_HOURS}
          </Text>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
