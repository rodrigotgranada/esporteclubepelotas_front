'use client';

import React from 'react';
import { Shield, Sparkles, Award } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
} from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';

export const YouthHero: React.FC = () => {
  const texts = YOUTH_CONSTANTS.HERO;

  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-surface-secondary border border-border p-6 sm:p-10 lg:p-12 shadow-sm mb-12">
      {/* Elementos decorativos de fundo */}
      <LayoutContainer className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <LayoutContainer className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <LayoutContainer className="relative z-10 max-w-3xl flex flex-col gap-4">
        {/* Badge Institucional */}
        <LayoutContainer className="inline-flex items-center gap-2">
          <Badge variant="primary" className="px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <Text as="span">{texts.BADGE}</Text>
          </Badge>
        </LayoutContainer>

        {/* Título Principal */}
        <Title level="h1" className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-tight">
          {texts.TITLE} •{' '}
          <Text as="span" className="text-primary underline decoration-secondary decoration-4 underline-offset-8">
            {texts.TITLE_HIGHLIGHT}
          </Text>
        </Title>

        {/* Subtítulo Descritivo */}
        <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl">
          {texts.SUBTITLE}
        </Text>

        {/* Tags de Pilares */}
        <LayoutContainer className="flex items-center gap-2 sm:gap-3 flex-wrap pt-2">
          <Badge variant="default" className="text-xs font-semibold px-3 py-1 bg-surface-secondary/50 border-border">
            <Shield className="w-3.5 h-3.5 mr-1 text-primary" />
            <Text as="span">{texts.TAG_1}</Text>
          </Badge>
          <Badge variant="default" className="text-xs font-semibold px-3 py-1 bg-surface-secondary/50 border-border">
            <Award className="w-3.5 h-3.5 mr-1 text-secondary" />
            <Text as="span">{texts.TAG_2}</Text>
          </Badge>
          <Badge variant="default" className="text-xs font-semibold px-3 py-1 bg-surface-secondary/50 border-border">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
            <Text as="span">{texts.TAG_3}</Text>
          </Badge>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
