'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { Sparkles, Calendar, ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface TimelineHeroProps {
  availableYears: number[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
}

export const TimelineHero: React.FC<TimelineHeroProps> = ({
  availableYears,
  selectedYear,
  onSelectYear,
}) => {
  return (
    <LayoutContainer className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-border/60 bg-gradient-to-b from-primary/10 via-background to-background">
      <LayoutContainer className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Badge */}
        <LayoutContainer className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black tracking-wider uppercase mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{TIMELINE_CONSTANTS.HERO_BADGE}</span>
        </LayoutContainer>

        {/* Title */}
        <Title level="h1" className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight">
          {TIMELINE_CONSTANTS.HERO_TITLE_PREFIX}{' '}
          <span className="text-primary block sm:inline">
            {TIMELINE_CONSTANTS.HERO_TITLE_HIGHLIGHT}
          </span>
        </Title>

        {/* Subtitle */}
        <Text as="p" className="text-text-secondary text-base sm:text-lg max-w-2xl mt-4 leading-relaxed">
          {TIMELINE_CONSTANTS.HERO_DESCRIPTION}
        </Text>

        {/* Quick jump pills */}
        {availableYears.length > 0 && (
          <LayoutContainer className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            <Button
              type="button"
              variant={selectedYear === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelectYear(null)}
              className="text-xs font-bold rounded-full px-4 h-8"
            >
              Todos os Anos ({availableYears.length})
            </Button>
            {availableYears.map((year) => (
              <Button
                key={year}
                type="button"
                variant={selectedYear === year ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onSelectYear(year)}
                className={`text-xs font-bold rounded-full px-3.5 h-8 ${
                  selectedYear === year
                    ? 'shadow-md shadow-primary/20'
                    : 'bg-surface/60 border border-border/80 text-text-secondary hover:text-text-primary hover:border-primary/50'
                }`}
              >
                {year}
              </Button>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
