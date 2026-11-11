'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Badge } from '@/shared/ui/components';
import { ShieldCheck } from 'lucide-react';
import { TRANSPARENCY_TEXTS } from '../../constants/transparency.constants';

export function TransparencyHero() {
  return (
    <LayoutContainer className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-[#0B1B3D] via-[#071126] to-[#040A18] p-8 md:p-12 shadow-xl">
      <LayoutContainer className="relative z-10 max-w-3xl">
        <LayoutContainer className="mb-4 inline-flex items-center gap-2">
          <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} className="mr-1 inline" />
            {TRANSPARENCY_TEXTS.HERO_BADGE}
          </Badge>
        </LayoutContainer>

        <Title level="h1" className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          {TRANSPARENCY_TEXTS.HERO_TITLE}
        </Title>

        <Text className="text-base md:text-lg text-gray-300 leading-relaxed">
          {TRANSPARENCY_TEXTS.HERO_DESCRIPTION}
        </Text>
      </LayoutContainer>
    </LayoutContainer>
  );
}

