'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  ShieldPlaceholder,
  isUnoptimizedImageUrl,
} from '@/shared/ui/components';
import { HOME_FEATURE_TEXTS } from './HomeFeature.constants';
import { useSettingsStore } from '@/store/useSettingsStore';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { NewsBentoHero } from '@/features/news/ui/components/NewsBentoHero';
import { NewsCard } from '@/features/news/ui/components/NewsCard';
import { HomeSponsorsTicker, HomeSponsorsSection } from '@/features/sponsors';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const HomeFeature = () => {
  const { settings } = useSettingsStore();
  const [featuredNews, setFeaturedNews] = useState<NewsArticleData[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticleData[]>([]);

  const loadHomeData = useCallback(async () => {
    try {
      const [featuredResult, feedResult] = await Promise.allSettled([
        newsService.getFeaturedNews(3),
        newsService.getNews({ limit: 6 }),
      ]);

      const featuredArticles =
        featuredResult.status === 'fulfilled' && Array.isArray(featuredResult.value)
          ? featuredResult.value
          : [];

      const feedArticles =
        feedResult.status === 'fulfilled' && Array.isArray(feedResult.value?.data)
          ? feedResult.value.data
          : [];

      setFeaturedNews(featuredArticles);

      const featuredSlugs = new Set(
        featuredArticles.map((f) => f.slug).filter(Boolean),
      );

      const filteredLatest = feedArticles
        .filter((a) => a?.slug && !featuredSlugs.has(a.slug))
        .slice(0, 3);

      setLatestNews(filteredLatest);
    } catch (err) {
      console.warn('Nenhuma notícia carregada para a Home:', err);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  useRealtimeEvents('news', () => {
    loadHomeData();
  });

  return (
    <LayoutContainer className="flex flex-col bg-transparent">
      {/* Ticker / Marquee Contínuo de Patrocinadores em Destaque logo abaixo do Header */}
      <HomeSponsorsTicker />

      {/* 1. Primeira Seção: Vitrine Editorial de Notícias (Destaques & Bento Grid) */}
      {(featuredNews.length > 0 || latestNews.length > 0) && (
        <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8 sm:pb-12 w-full flex flex-col gap-8 sm:gap-10 bg-transparent">
          {featuredNews.length > 0 && <NewsBentoHero articles={featuredNews} />}

          {latestNews.length > 0 && (
            <LayoutContainer
              className={`flex flex-col gap-6 ${
                featuredNews.length > 0 ? 'pt-8 border-t border-border/60' : ''
              }`}
            >
              <LayoutContainer className="flex items-center justify-between gap-4">
                <Title
                  level="h2"
                  className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight"
                >
                  {HOME_FEATURE_TEXTS.SECTION_LATEST_NEWS_TITLE}
                </Title>

                <Link href="/noticias">
                  <Button variant="outline" size="sm" className="font-bold text-xs whitespace-nowrap">
                    {HOME_FEATURE_TEXTS.BUTTON_ALL_NEWS}
                  </Button>
                </Link>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestNews.map((article, idx) => (
                  <NewsCard
                    key={article.slug || (typeof article._id === 'string' ? article._id : article.id) || `latest-${idx}`}
                    article={article}
                  />
                ))}
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}

      {/* 2. Segunda Seção: Hero Institucional do Clube (Sócio Áureo-Cerúleo & Alcatéia) */}
      <LayoutContainer className="relative py-12 sm:py-20 px-4 flex items-center justify-center overflow-hidden border-t border-border/40 bg-transparent">
        <LayoutContainer className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none z-0" />

        <LayoutContainer className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center">
          <LayoutContainer className="mb-4 sm:mb-6 animate-in zoom-in duration-700 delay-150">
            {settings?.clubLogoUrl ? (
              <Image
                src={settings.clubLogoUrl}
                alt={settings.clubName || 'Esporte Clube Pelotas'}
                width={110}
                height={110}
                className="object-contain drop-shadow-2xl w-24 h-24 sm:w-28 sm:h-28"
                unoptimized={isUnoptimizedImageUrl(settings.clubLogoUrl)}
              />
            ) : (
              <ShieldPlaceholder size={100} className="drop-shadow-2xl opacity-80" />
            )}
          </LayoutContainer>

          <LayoutContainer className="inline-block px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider">
            {HOME_FEATURE_TEXTS.BADGE}
          </LayoutContainer>

          <Title
            level="h1"
            className="text-3xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tighter mb-3 sm:mb-4 leading-tight"
          >
            {HOME_FEATURE_TEXTS.TITLE_PREFIX}{' '}
            <Text as="span" className="text-primary">{HOME_FEATURE_TEXTS.TITLE_HIGHLIGHT}</Text>
          </Title>

          <Text className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-6 sm:mb-8 px-2">
            {HOME_FEATURE_TEXTS.DESCRIPTION}
          </Text>

          <LayoutContainer className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4 max-w-xs sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-6 py-3 font-bold text-sm sm:text-base shadow-md">
                {HOME_FEATURE_TEXTS.BUTTON_REGISTER}
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6 py-3 font-bold text-sm sm:text-base">
                {HOME_FEATURE_TEXTS.BUTTON_LOGIN}
              </Button>
            </Link>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* 3. Terceira Seção: Outras Seções Institucionais (Próximo Jogo & Loja) */}
      <LayoutContainer className="max-w-7xl mx-auto px-4 py-12 sm:py-16 w-full bg-transparent">
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <LayoutContainer className="bg-surface/85 backdrop-blur-xs border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors shadow-xs">
            <Title level="h3" className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4">
              {HOME_FEATURE_TEXTS.SECTION_MATCH_TITLE}
            </Title>
            <Text className="text-text-secondary text-sm sm:text-base">{HOME_FEATURE_TEXTS.SECTION_MATCH_DESC}</Text>
          </LayoutContainer>
          <LayoutContainer className="bg-surface/85 backdrop-blur-xs border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors shadow-xs">
            <Title level="h3" className="text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-4">
              {HOME_FEATURE_TEXTS.SECTION_STORE_TITLE}
            </Title>
            <Text className="text-text-secondary text-sm sm:text-base">{HOME_FEATURE_TEXTS.SECTION_STORE_DESC}</Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* 4. Quarta Seção: Patrocinadores e Parceiros Oficiais (Pré-Rodapé em 5 colunas) */}
      <HomeSponsorsSection />
    </LayoutContainer>
  );
};
