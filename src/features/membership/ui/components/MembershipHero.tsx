'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components';
import { MEMBERSHIP_TEXTS } from '../../constants/membership.constants';
import { ShieldCheck, Sparkles, Trophy, ChevronDown } from 'lucide-react';

export interface MembershipHeroProps {
  onScrollToPlans: () => void;
}

export const MembershipHero: React.FC<MembershipHeroProps> = ({
  onScrollToPlans,
}) => {
  return (
    <LayoutContainer className="relative w-full pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-border/60 bg-surface/30">
      <LayoutContainer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Badge do Quadro Social */}
        <Badge
          variant="primary"
          size="md"
          className="font-extrabold uppercase tracking-widest px-4 py-1.5 shadow-xs mb-6 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{MEMBERSHIP_TEXTS.HERO_BADGE}</span>
        </Badge>

        {/* Título Principal */}
        <Title
          level="h1"
          className="text-3xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-tight max-w-4xl mb-6"
        >
          {MEMBERSHIP_TEXTS.HERO_TITLE}
        </Title>

        {/* Subtítulo Inspirador */}
        <Text
          as="p"
          className="text-text-secondary text-base sm:text-xl font-normal max-w-2xl leading-relaxed mb-10"
        >
          {MEMBERSHIP_TEXTS.HERO_SUBTITLE}
        </Text>

        {/* Botão de rolagem para os planos */}
        <LayoutContainer className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <Button
            variant="primary"
            size="lg"
            onClick={onScrollToPlans}
            className="font-black uppercase tracking-wider px-8 py-3.5 shadow-md hover:shadow-lg inline-flex items-center gap-2 text-sm"
          >
            <span>{MEMBERSHIP_TEXTS.HERO_CTA_SCROLL}</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </Button>
        </LayoutContainer>

        {/* Pilares & Destaques de Vantagem */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-8 border-t border-border/50">
          <LayoutContainer className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-surface/50 border border-border/40">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <Text as="span" className="text-xs sm:text-sm font-semibold text-text-primary">
              {MEMBERSHIP_TEXTS.HERO_STATS_MATCHES}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-surface/50 border border-border/40">
            <Trophy className="w-5 h-5 text-primary shrink-0" />
            <Text as="span" className="text-xs sm:text-sm font-semibold text-text-primary">
              {MEMBERSHIP_TEXTS.HERO_STATS_DISCOUNT}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-surface/50 border border-border/40">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <Text as="span" className="text-xs sm:text-sm font-semibold text-text-primary">
              {MEMBERSHIP_TEXTS.HERO_STATS_TRADITION}
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

