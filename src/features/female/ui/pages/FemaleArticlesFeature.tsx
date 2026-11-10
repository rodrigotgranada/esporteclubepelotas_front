'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Calendar, ArrowRight, AlertCircle, Crown, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  SafeImage,
  Spinner,
  MembershipCtaCard,
} from '@/shared/ui/components';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { FEMALE_CONSTANTS } from '../../constants/female.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const FemaleArticlesFeature: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const texts = FEMALE_CONSTANTS.PAGE_NEWS;

  const loadArticles = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const res = await newsService.getNews({ isFemale: true, limit: 40 });
      const rawList = res.data || [];

      const filtered = rawList.filter((art) => {
        const catName =
          typeof art.category === 'object' && art.category
            ? art.category.name?.toLowerCase() || ''
            : '';
        const hasFemaleCategory = catName.includes('fem') || catName.includes('loba');
        const hasFemaleTag = (art.tags || []).some((t) => t.toLowerCase().includes('fem') || t.toLowerCase().includes('loba'));
        return art.isFemale || hasFemaleCategory || hasFemaleTag;
      });

      setArticles(filtered.length > 0 ? filtered : rawList);
    } catch (err) {
      console.warn('Erro ao carregar matérias das Lobas:', err);
      if (!options?.silent) {
        setArticles([]);
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useRealtimeEvents('news', () => {
    loadArticles({ silent: true });
  });

  const displayedArticles = articles.filter((a) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const titleMatch = a.title?.toLowerCase().includes(term);
    const summaryMatch = a.summary?.toLowerCase().includes(term);
    return titleMatch || summaryMatch;
  });

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botão Voltar */}
      <LayoutContainer className="mb-6">
        <Link href="/feminino" className="inline-block">
          <Text as="span" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {texts.BACK}
          </Text>
        </Link>
      </LayoutContainer>

      {/* Header */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <LayoutContainer className="flex flex-col gap-2">
          <LayoutContainer className="inline-flex items-center gap-2">
            <Badge variant="primary" size="sm" className="font-extrabold uppercase">
              <Crown className="w-3.5 h-3.5 mr-1" />
              {texts.BADGE}
            </Badge>
          </LayoutContainer>
          <Title level="h1" className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            {texts.TITLE}
          </Title>
          <Text as="p" className="text-sm sm:text-base text-text-secondary max-w-2xl">
            {texts.SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Input de Busca */}
        <LayoutContainer className="relative w-full sm:w-72 shrink-0">
          <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <Search className="w-4 h-4" />
          </LayoutContainer>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={texts.SEARCH_PLACEHOLDER}
            className="pl-9 w-full"
          />
        </LayoutContainer>
      </LayoutContainer>

      {/* Lista de Notícias */}
      {isLoading ? (
        <LayoutContainer className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size={32} />
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LOADING}
          </Text>
        </LayoutContainer>
      ) : displayedArticles.length === 0 ? (
        <LayoutContainer className="p-12 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-3 my-6 shadow-xs">
          <AlertCircle className="w-8 h-8 text-text-muted" />
          <Title level="h3" className="text-base font-bold text-text-primary">
            {texts.EMPTY_TITLE}
          </Title>
          <Text as="p" className="text-xs text-text-secondary max-w-sm">
            {search.trim() ? texts.EMPTY_SEARCH_DESC : texts.EMPTY_DEFAULT_DESC}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((item) => {
            const dateStr = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : '';

            return (
              <Link
                key={item._id || item.id}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col rounded-3xl bg-surface border border-border hover:border-primary/50 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 focus:outline-none"
              >
                <LayoutContainer className="relative aspect-[16/9] w-full bg-surface-secondary overflow-hidden">
                  <SafeImage
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <LayoutContainer className="absolute top-3 left-3">
                    <Badge variant="primary" size="sm" className="font-extrabold uppercase text-[10px]">
                      👑 As Lobas
                    </Badge>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <LayoutContainer className="flex flex-col gap-2">
                    {dateStr && (
                      <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <Text as="span">{dateStr}</Text>
                      </LayoutContainer>
                    )}
                    <Title level="h3" className="text-base font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </Title>
                    {item.summary && (
                      <Text as="p" className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                        {item.summary}
                      </Text>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center text-xs font-bold text-primary gap-1 pt-2 border-t border-border/40">
                    <Text as="span">{texts.READ_MORE}</Text>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </LayoutContainer>
                </LayoutContainer>
              </Link>
            );
          })}
        </LayoutContainer>
      )}

      {/* CTA */}
      <LayoutContainer className="my-14">
        <MembershipCtaCard
          title={texts.CTA_TITLE}
          description={texts.CTA_DESC}
          buttonText={texts.CTA_BTN}
          buttonLink="/planos"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
