'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import Link from 'next/link';
import { HOME_FEATURE_TEXTS } from './HomeFeature.constants';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ShieldPlaceholder } from '@/shared/ui/components';
import Image from 'next/image';

export const HomeFeature = () => {
  const { settings } = useSettingsStore();

  return (
    <LayoutContainer className="flex flex-col">
      {/* Hero Section */}
      <LayoutContainer className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image (Placeholder) */}
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background"></div>
          {/* Pode colocar uma <Image /> aqui futuramente com a torcida */}
        </div>

        <LayoutContainer className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
          <LayoutContainer className="mb-8 animate-in zoom-in duration-1000 delay-150">
            {settings?.clubLogoUrl ? (
              <Image src={settings.clubLogoUrl} alt="Logo" width={140} height={140} className="object-contain drop-shadow-2xl" />
            ) : (
              <ShieldPlaceholder size={140} className="drop-shadow-2xl opacity-80" />
            )}
          </LayoutContainer>

          <LayoutContainer className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6 uppercase tracking-wider">
            {HOME_FEATURE_TEXTS.BADGE}
          </LayoutContainer>
          <Title level="h1" className="text-5xl sm:text-7xl font-black text-text-primary tracking-tighter mb-6 leading-tight">
            {HOME_FEATURE_TEXTS.TITLE_PREFIX} <span className="text-primary">{HOME_FEATURE_TEXTS.TITLE_HIGHLIGHT}</span>
          </Title>
          <Text className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            {HOME_FEATURE_TEXTS.DESCRIPTION}
          </Text>
          <LayoutContainer className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                {HOME_FEATURE_TEXTS.BUTTON_REGISTER}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                {HOME_FEATURE_TEXTS.BUTTON_LOGIN}
              </Button>
            </Link>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Placeholders for future sections */}
      <LayoutContainer className="max-w-7xl mx-auto px-4 py-24 w-full">
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <LayoutContainer className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <Title level="h3" className="text-2xl font-bold text-text-primary mb-4">{HOME_FEATURE_TEXTS.SECTION_MATCH_TITLE}</Title>
            <Text className="text-text-secondary">{HOME_FEATURE_TEXTS.SECTION_MATCH_DESC}</Text>
          </LayoutContainer>
          <LayoutContainer className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <Title level="h3" className="text-2xl font-bold text-text-primary mb-4">{HOME_FEATURE_TEXTS.SECTION_NEWS_TITLE}</Title>
            <Text className="text-text-secondary">{HOME_FEATURE_TEXTS.SECTION_NEWS_DESC}</Text>
          </LayoutContainer>
          <LayoutContainer className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <Title level="h3" className="text-2xl font-bold text-text-primary mb-4">{HOME_FEATURE_TEXTS.SECTION_STORE_TITLE}</Title>
            <Text className="text-text-secondary">{HOME_FEATURE_TEXTS.SECTION_STORE_DESC}</Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
