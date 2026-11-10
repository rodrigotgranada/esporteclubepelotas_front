'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Badge } from '@/shared/ui/components';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { STORE_TEXTS } from '../../constants/store.constants';

interface StoreHeroProps {
  storeName: string;
  storeDescription: string;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ storeName, storeDescription }) => {
  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-surface-elevated/70 to-surface border border-border p-8 sm:p-12 shadow-xl">
      <LayoutContainer className="relative z-10 max-w-3xl flex flex-col gap-4">
        <LayoutContainer className="inline-flex items-center gap-2 self-start">
          <Badge variant="primary" className="px-3.5 py-1 text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
            {STORE_TEXTS.HERO_BADGE}
          </Badge>
        </LayoutContainer>

        <Title level="h1" className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
          {storeName || STORE_TEXTS.HERO_TITLE}
        </Title>

        <Text as="p" className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
          {storeDescription || STORE_TEXTS.HERO_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Decorative background watermark */}
      <LayoutContainer className="absolute -right-8 -bottom-8 pointer-events-none opacity-5 text-primary">
        <ShoppingBag className="w-72 h-72" />
      </LayoutContainer>
    </LayoutContainer>
  );
};

