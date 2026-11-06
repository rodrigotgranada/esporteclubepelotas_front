'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { Sparkles, ArrowDown } from 'lucide-react';

interface TimelineHeroProps {
  totalMilestones: number;
  onScrollToTimeline: () => void;
}

export const TimelineHero: React.FC<TimelineHeroProps> = ({
  totalMilestones,
  onScrollToTimeline,
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

        {/* Scroll Call to Action */}
        {totalMilestones > 0 && (
          <LayoutContainer className="mt-8 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onScrollToTimeline}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-border/80 hover:border-primary/50 text-xs sm:text-sm font-bold text-text-secondary hover:text-text-primary shadow-xs transition-all cursor-pointer"
            >
              <span>Explorar {totalMilestones} marcos históricos</span>
              <ArrowDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />
            </button>
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
