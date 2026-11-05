'use client';

import React from 'react';
import { Target, BookOpen, HeartHandshake, TrendingUp } from 'lucide-react';
import { LayoutContainer, Title, Text } from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';

const ICONS = [Target, TrendingUp, BookOpen, HeartHandshake];

export const YouthMethodologySection: React.FC = () => {
  const texts = YOUTH_CONSTANTS.METHODOLOGY;

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

      {/* Grid dos 4 Pilares */}
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {texts.PILLARS.map((pillar, idx) => {
          const IconComp = ICONS[idx] || Target;
          return (
            <LayoutContainer
              key={pillar.number}
              className="p-5 rounded-2xl bg-surface-secondary/70 border border-border/80 flex flex-col gap-3 relative overflow-hidden group hover:border-primary/40 transition-colors"
            >
              <LayoutContainer className="flex items-center justify-between">
                <LayoutContainer className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <IconComp className="w-5 h-5" />
                </LayoutContainer>
                <Text as="span" className="font-mono text-2xl font-black text-text-muted/30">
                  {pillar.number}
                </Text>
              </LayoutContainer>

              <Title level="h3" className="text-sm font-bold text-text-primary mt-1">
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

