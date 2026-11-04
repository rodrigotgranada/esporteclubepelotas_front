'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Sparkles, Ticket } from 'lucide-react';
import { LayoutContainer, Title, Text, Button, Badge } from '@/shared/ui/components';
import { COMING_SOON_CONSTANTS } from './ComingSoonFeature.constants';

export interface ComingSoonFeatureProps {
  variant: 'socio' | 'ingressos';
}

export const ComingSoonFeature: React.FC<ComingSoonFeatureProps> = ({ variant }) => {
  const content =
    variant === 'socio'
      ? COMING_SOON_CONSTANTS.SOCIO
      : COMING_SOON_CONSTANTS.INGRESSOS;

  const Icon = variant === 'socio' ? Sparkles : Ticket;

  return (
    <LayoutContainer className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center animate-in fade-in duration-300">
      <LayoutContainer className="max-w-xl mx-auto flex flex-col items-center gap-6">
        <LayoutContainer className="p-4 rounded-3xl bg-primary/10 border border-primary/25 text-primary shadow-xs">
          <Icon className="w-10 h-10 text-primary" />
        </LayoutContainer>

        <Badge
          variant="primary"
          size="sm"
          className="font-bold text-xs uppercase tracking-wider px-3 py-1 shadow-xs"
        >
          {content.BADGE}
        </Badge>

        <Title
          level="h1"
          className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight"
        >
          {content.TITLE}
        </Title>

        <Text as="p" className="text-text-secondary text-base leading-relaxed">
          {content.DESCRIPTION}
        </Text>

        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border text-xs text-text-muted leading-relaxed">
          {content.CONTACT_NOTE}
        </LayoutContainer>

        <LayoutContainer className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold text-xs"
            >
              {content.BTN_BACK}
            </Button>
          </Link>

          <Link href="/noticias" className="w-full sm:w-auto">
            <Button
              variant="primary"
              leftIcon={<Newspaper className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold text-xs"
            >
              {content.BTN_NEWS}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
