import React from 'react';
import { LayoutContainer, Title, Text, Badge } from '@/shared/ui/components/atoms';
import { MATCHES_CONSTANTS } from '../../constants/matches.constants';

export const MatchesHero: React.FC = () => {
  const { HERO } = MATCHES_CONSTANTS.PUBLIC;

  return (
    <LayoutContainer className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-surface-card to-secondary/10 border border-primary/20 p-6 md:p-10 mb-8 shadow-lg">
      <LayoutContainer className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="default" className="text-secondary border-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          {HERO.BADGE}
        </Badge>

        <Title level="h1" className="text-2xl md:text-4xl font-black text-text-primary uppercase tracking-tight">
          {HERO.TITLE}
        </Title>

        <Text className="text-text-muted text-sm md:text-base max-w-2xl">
          {HERO.SUBTITLE}
        </Text>
      </LayoutContainer>
    </LayoutContainer>
  );
};
