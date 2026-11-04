'use client';

import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge } from '@/shared/ui/components';
import { IDOLS_CONSTANTS } from '../../constants/idols.constants';

export const IdolHero: React.FC = () => {
  const texts = IDOLS_CONSTANTS.HERO;

  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface/90 to-primary/10 border border-border p-6 sm:p-10 shadow-sm animate-in fade-in duration-300">
      {/* Decorative background glow */}
      <LayoutContainer className="absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <LayoutContainer className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-3">
        <Badge
          variant="primary"
          size="sm"
          className="font-extrabold uppercase tracking-widest px-3 py-1 shadow-sm flex items-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5" />
          {texts.BADGE}
        </Badge>

        <Title
          level="h1"
          className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight mt-1"
        >
          {texts.TITLE}
        </Title>

        <Text as="p" className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-2xl">
          {texts.SUBTITLE}
        </Text>
      </LayoutContainer>
    </LayoutContainer>
  );
};

