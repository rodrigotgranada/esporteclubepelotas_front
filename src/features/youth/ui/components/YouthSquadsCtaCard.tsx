'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight, Trophy, ShieldCheck } from 'lucide-react';
import { LayoutContainer, Title, Text, Button, Badge } from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';

export const YouthSquadsCtaCard: React.FC = () => {
  const texts = YOUTH_CONSTANTS.SQUADS_CTA;

  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface via-surface/95 to-primary/10 p-6 sm:p-10 my-10 shadow-lg shadow-primary/5 transition-all duration-300 hover:border-primary/50 group">
      {/* Brilho decorativo */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      <LayoutContainer className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        <LayoutContainer className="flex flex-col gap-3 max-w-2xl">
          {/* Badge */}
          <LayoutContainer className="inline-flex items-center gap-2">
            <Badge
              variant="primary"
              className="px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
            >
              <Trophy className="w-3.5 h-3.5" />
              <Text as="span">{texts.BADGE}</Text>
            </Badge>
          </LayoutContainer>

          {/* Título */}
          <Title
            level="h3"
            className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight"
          >
            {texts.TITLE}
          </Title>

          {/* Descrição */}
          <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed">
            {texts.DESC}
          </Text>

          {/* Categorias Pills */}
          <LayoutContainer className="flex items-center gap-2 flex-wrap pt-1">
            <LayoutContainer className="px-3 py-1 rounded-full bg-background border border-border text-xs font-semibold text-text-primary flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <Text as="span">Sub-20 (Júnior)</Text>
            </LayoutContainer>
            <LayoutContainer className="px-3 py-1 rounded-full bg-background border border-border text-xs font-semibold text-text-primary flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <Text as="span">Sub-17 (Juvenil)</Text>
            </LayoutContainer>
            <LayoutContainer className="px-3 py-1 rounded-full bg-background border border-border text-xs font-semibold text-text-primary flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <Text as="span">Sub-15 (Infantil)</Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Botão de Ação */}
        <LayoutContainer className="shrink-0 flex items-center">
          <Link href={texts.LINK}>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-black text-blue-950 px-7 py-3.5 shadow-lg shadow-primary/25 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
            >
              {texts.BTN}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

