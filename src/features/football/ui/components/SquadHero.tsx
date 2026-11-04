'use client';

import React from 'react';
import { Users, Shield, Trophy } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge } from '@/shared/ui/components';
import { FOOTBALL_CONSTANTS } from '../../constants/football.constants';
import { SquadData } from '../../services/football.service';

export interface SquadHeroProps {
  squad: SquadData | null;
  selectedCategory: string;
}

export const SquadHero: React.FC<SquadHeroProps> = ({ squad, selectedCategory }) => {
  const categoryLabel =
    (FOOTBALL_CONSTANTS.CATEGORIES as any)[selectedCategory] || selectedCategory;

  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 sm:p-10 mb-8 shadow-xs">
      {/* Decorative Aura Background */}
      <LayoutContainer className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <LayoutContainer className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <LayoutContainer className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <LayoutContainer className="flex flex-col gap-3 max-w-2xl">
          <LayoutContainer className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm" className="font-extrabold uppercase text-xs px-3 py-1 tracking-wider shadow-xs">
              <Trophy className="w-3.5 h-3.5 mr-1" />
              {squad?.year ? `${squad.year} • ${categoryLabel}` : categoryLabel}
            </Badge>

            {squad?.isCurrent && (
              <Badge variant="warning" size="sm" className="font-extrabold uppercase text-[10px] tracking-wider px-2 py-0.5 shadow-xs">
                {FOOTBALL_CONSTANTS.CURRENT_BADGE}
              </Badge>
            )}
          </LayoutContainer>

          <Title level="h1" className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            {squad?.seasonName || FOOTBALL_CONSTANTS.PAGE_TITLE}
          </Title>

          <Text as="p" className="text-text-secondary text-sm sm:text-base leading-relaxed">
            {FOOTBALL_CONSTANTS.PAGE_SUBTITLE}
          </Text>

          {squad?.coachName && (
            <LayoutContainer className="inline-flex items-center gap-2 mt-2 pt-2 border-t border-border/60 text-xs font-semibold text-text-primary">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span className="text-text-muted">{FOOTBALL_CONSTANTS.COACH_LABEL}:</span>
              <span className="text-primary font-bold">{squad.coachName}</span>
            </LayoutContainer>
          )}
        </LayoutContainer>

        {squad?.members && (
          <LayoutContainer className="flex items-center gap-4 bg-background/80 backdrop-blur-xs border border-border p-4 rounded-2xl shrink-0">
            <LayoutContainer className="p-3 rounded-xl bg-primary/15 text-primary">
              <Users className="w-6 h-6" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <Text as="span" className="text-2xl font-black text-text-primary leading-none">
                {squad.members.length}
              </Text>
              <Text as="span" className="text-xs text-text-muted font-medium mt-1">
                Atletas no Elenco
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};

