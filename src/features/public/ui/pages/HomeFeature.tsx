'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  ShieldPlaceholder,
} from '@/shared/ui/components';
import { HOME_FEATURE_TEXTS } from './HomeFeature.constants';
import { useSettingsStore } from '@/store/useSettingsStore';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { NewsBentoHero } from '@/features/news/ui/components/NewsBentoHero';
import { NewsCard } from '@/features/news/ui/components/NewsCard';



export const HomeFeature = () => {
  const { settings } = useSettingsStore();
  const [featuredNews, setFeaturedNews] = useState<NewsArticleData[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticleData[]>([]);


  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const [featuredResult, feedResult] = await Promise.allSettled([
          newsService.getFeaturedNews(3),
          newsService.getNews({ limit: 6 }),
        ]);

        if (!isMounted) return;

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
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <LayoutContainer className="flex flex-col">
      {/* Hero Principal do Clube */}
      <LayoutContainer className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <LayoutContainer className="absolute inset-0 bg-background z-0">
          <LayoutContainer className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </LayoutContainer>

        <LayoutContainer className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
          <LayoutContainer className="mb-8 animate-in zoom-in duration-1000 delay-150">
            {settings?.clubLogoUrl ? (
              <Image
                src={settings.clubLogoUrl}
                alt="Logo"
                width={140}
                height={140}
                className="object-contain drop-shadow-2xl"
              />
            ) : (
              <ShieldPlaceholder size={140} className="drop-shadow-2xl opacity-80" />
            )}
          </LayoutContainer>

          <LayoutContainer className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6 uppercase tracking-wider">
            {HOME_FEATURE_TEXTS.BADGE}
          </LayoutContainer>
          <Title
            level="h1"
            className="text-5xl sm:text-7xl font-black text-text-primary tracking-tighter mb-6 leading-tight"
          >
            {HOME_FEATURE_TEXTS.TITLE_PREFIX}{' '}
            <span className="text-primary">{HOME_FEATURE_TEXTS.TITLE_HIGHLIGHT}</span>
          </Title>
          <Text className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            {HOME_FEATURE_TEXTS.DESCRIPTION}
          </Text>
          <LayoutContainer className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 font-bold">
                {HOME_FEATURE_TEXTS.BUTTON_REGISTER}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 font-bold">
                {HOME_FEATURE_TEXTS.BUTTON_LOGIN}
              </Button>
            </Link>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Seção Editorial de Notícias (Bento Hero Grid + Últimas Notícias) */}
      {(featuredNews.length > 0 || latestNews.length > 0) && (
        <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col gap-10">
          <LayoutContainer className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <LayoutContainer className="flex flex-col gap-1">
              <LayoutContainer className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider w-fit">
                {HOME_FEATURE_TEXTS.SECTION_NEWS_BADGE}
              </LayoutContainer>
              <Title
                level="h2"
                className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
              >
                {HOME_FEATURE_TEXTS.SECTION_NEWS_TITLE}
              </Title>
              <Text className="text-text-secondary text-sm sm:text-base max-w-xl">
                {HOME_FEATURE_TEXTS.SECTION_NEWS_SUBTITLE}
              </Text>
            </LayoutContainer>

            <Link href="/noticias">
              <Button variant="outline" size="sm" className="font-bold text-xs whitespace-nowrap">
                {HOME_FEATURE_TEXTS.BUTTON_ALL_NEWS}
              </Button>
            </Link>
          </LayoutContainer>

          {/* Mosaico Bento Hero Grid (Destaques) */}
          {featuredNews.length > 0 && <NewsBentoHero articles={featuredNews} />}

          {/* Grid de Notícias Mais Recentes */}
          {latestNews.length > 0 && (
            <LayoutContainer className="flex flex-col gap-6 pt-6 border-t border-border/60">
              <Title level="h3" className="text-xl sm:text-2xl font-bold text-text-primary">
                {HOME_FEATURE_TEXTS.LATEST_NEWS_TITLE}
              </Title>
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

      {/* Outras Seções Institucionais */}
      <LayoutContainer className="max-w-7xl mx-auto px-4 py-16 w-full">
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LayoutContainer className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <Title level="h3" className="text-2xl font-bold text-text-primary mb-4">
              {HOME_FEATURE_TEXTS.SECTION_MATCH_TITLE}
            </Title>
            <Text className="text-text-secondary">{HOME_FEATURE_TEXTS.SECTION_MATCH_DESC}</Text>
          </LayoutContainer>
          <LayoutContainer className="bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <Title level="h3" className="text-2xl font-bold text-text-primary mb-4">
              {HOME_FEATURE_TEXTS.SECTION_STORE_TITLE}
            </Title>
            <Text className="text-text-secondary">{HOME_FEATURE_TEXTS.SECTION_STORE_DESC}</Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
