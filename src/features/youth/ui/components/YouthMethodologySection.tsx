'use client';

import React from 'react';
import { Target, BookOpen, HeartHandshake, TrendingUp } from 'lucide-react';
import { LayoutContainer, Title, Text, Spinner } from '@/shared/ui/components';
import { YouthPillarItem } from '@/features/football/services/football.service';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';

const ICONS = [Target, TrendingUp, BookOpen, HeartHandshake];

export interface YouthMethodologySectionProps {
  pillars: YouthPillarItem[];
  isLoading?: boolean;
}

export const YouthMethodologySection: React.FC<YouthMethodologySectionProps> = ({
  pillars,
  isLoading = false,
}) => {
  const texts = YOUTH_CONSTANTS.METHODOLOGY;

  if (isLoading) {
    return (
      <LayoutContainer className="p-8 sm:p-10 rounded-3xl bg-surface border border-border flex flex-col items-center justify-center gap-3 my-10 shadow-xs">
        <Spinner size={28} />
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  const visiblePillars = (pillars || []).slice(0, 4);
  if (visiblePillars.length === 0) {
    return null;
  }

  const gridColsClass =
    visiblePillars.length === 1
      ? 'grid-cols-1 max-w-xl'
      : visiblePillars.length === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : visiblePillars.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <LayoutContainer className="p-6 sm:p-10 rounded-3xl bg-surface border border-border flex flex-col gap-8 my-10 shadow-xs">
      {/* Título & Subtítulo */}
      <LayoutContainer className="max-w-2xl flex flex-col gap-1.5">
        <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
          {texts.SECTION_TITLE}
        </Title>
        <Text as="p" className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {texts.SECTION_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Grid Dinâmico dos Pilares (1 a 4 cards, sem número no canto superior direito) */}
      <LayoutContainer className={`grid ${gridColsClass} gap-6`}>
        {visiblePillars.map((pillar, idx) => {
          const IconComp = ICONS[idx % ICONS.length];
          return (
            <LayoutContainer
              key={`${pillar.title}-${idx}`}
              className="p-5 rounded-2xl bg-background/70 border border-border/80 flex flex-col gap-3 relative overflow-hidden group hover:border-primary/40 transition-colors"
            >
              <LayoutContainer className="flex items-center">
                <LayoutContainer className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <IconComp className="w-5 h-5" />
                </LayoutContainer>
              </LayoutContainer>

              <Title level="h3" className="text-sm font-bold text-text-primary mt-1 leading-snug">
                {pillar.title}
              </Title>

              <Text as="p" className="text-xs text-text-secondary leading-relaxed">
                {pillar.description}
              </Text>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
