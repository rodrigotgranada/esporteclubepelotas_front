'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
  Button,
} from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';

export interface YouthNewsSectionProps {
  news: NewsArticleData[];
  isLoading: boolean;
}

export const YouthNewsSection: React.FC<YouthNewsSectionProps> = ({ news, isLoading }) => {
  const texts = YOUTH_CONSTANTS.NEWS;

  return (
    <LayoutContainer className="flex flex-col gap-6 my-10">
      {/* Header da Seção */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
        <LayoutContainer className="flex flex-col gap-1">
          <LayoutContainer className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              {texts.SECTION_TITLE}
            </Title>
          </LayoutContainer>
          <Text as="p" className="text-xs sm:text-sm text-text-secondary">
            {texts.SECTION_SUBTITLE}
          </Text>
        </LayoutContainer>

        <Link href="/noticias">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="font-bold text-xs">
            {texts.VIEW_ALL}
          </Button>
        </Link>
      </LayoutContainer>

      {/* Conteúdo de Notícias */}
      {isLoading ? (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <LayoutContainer key={i} className="h-64 rounded-2xl bg-surface border border-border" />
          ))}
        </LayoutContainer>
      ) : news.length === 0 ? (
        <LayoutContainer className="p-8 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-2 shadow-xs">
          <AlertCircle className="w-8 h-8 text-text-muted" />
          <Title level="h4" className="text-sm font-bold text-text-primary">
            {texts.EMPTY_TITLE}
          </Title>
          <Text as="p" className="text-xs text-text-secondary max-w-sm">
            {texts.EMPTY_DESC}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {news.map((item) => {
            const formattedDate = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })
              : '';

            return (
              <Link
                key={item._id || item.id}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col rounded-2xl bg-surface border border-border overflow-hidden hover:border-primary/50 transition-all shadow-xs hover:shadow-md"
              >
                {/* Imagem de Capa 16:9 */}
                <LayoutContainer className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
                  {item.coverImage ? (
                    <SafeImage
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <LayoutContainer className="w-full h-full flex items-center justify-center text-text-muted">
                      <Newspaper className="w-8 h-8 opacity-40" />
                    </LayoutContainer>
                  )}
                  {formattedDate && (
                    <LayoutContainer className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-surface/90 backdrop-blur-xs text-[10px] font-bold text-text-primary flex items-center gap-1 border border-border">
                      <Calendar className="w-3 h-3 text-primary" />
                      <Text as="span">{formattedDate}</Text>
                    </LayoutContainer>
                  )}
                </LayoutContainer>

                {/* Conteúdo Textual */}
                <LayoutContainer className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <LayoutContainer className="flex flex-col gap-1.5">
                    <Title level="h3" className="text-sm font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </Title>
                    {item.summary && (
                      <Text as="p" className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {item.summary}
                      </Text>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <Text as="span">{texts.READ_MORE}</Text>
                    <ArrowRight className="w-3 h-3" />
                  </LayoutContainer>
                </LayoutContainer>
              </Link>
            );
          })}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

