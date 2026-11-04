'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';

export const NewsSocioBanner: React.FC = () => {
  return (
    <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-surface to-surface border border-primary/30 p-6 sm:p-8 shadow-md">
      {/* Elemento Decorativo de Fundo */}
      <LayoutContainer className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <LayoutContainer className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <LayoutContainer className="flex-1 flex flex-col gap-2.5">
          <LayoutContainer className="flex items-center gap-2">
            <Badge variant="primary" size="sm" className="font-black text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 mr-1" />
              {PUBLIC_NEWS_TEXTS.SOCIO_BANNER_BADGE}
            </Badge>
          </LayoutContainer>

          <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary leading-tight tracking-tight">
            {PUBLIC_NEWS_TEXTS.SOCIO_BANNER_TITLE}
          </Title>

          <Text as="p" className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl">
            {PUBLIC_NEWS_TEXTS.SOCIO_BANNER_SUB}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="shrink-0 w-full sm:w-auto">
          <Link href="/planos" className="w-full sm:w-auto block">
            <Button
              variant="primary"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold shadow-md hover:scale-102 transition-transform"
            >
              {PUBLIC_NEWS_TEXTS.SOCIO_BANNER_BTN}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
