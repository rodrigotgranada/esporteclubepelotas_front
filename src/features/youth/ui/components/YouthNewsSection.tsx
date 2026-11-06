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
  viewAllHref?: string;
}

export const YouthNewsSection: React.FC<YouthNewsSectionProps> = ({
  news,
  isLoading,
  viewAllHref = '/base/materias',
}) => {
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

        <Link href={viewAllHref}>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="font-bold text-xs hover:border-primary/50"
          >
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
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {news.map((item) => {
            const dateStr = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '';

            return (
              <Link
                key={item._id || item.id}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col rounded-2xl bg-surface border border-border/80 hover:border-primary/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 focus:outline-none"
              >
                {/* Imagem de Capa */}
                <LayoutContainer className="relative h-44 w-full bg-surface-secondary overflow-hidden">
                  <SafeImage
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <LayoutContainer className="absolute top-2 left-2">
                    <Badge variant="primary" className="text-[10px] font-bold py-0.5 px-2">
                      Base
                    </Badge>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Textos */}
                <LayoutContainer className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <LayoutContainer className="flex flex-col gap-1.5">
                    <LayoutContainer className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                      <Calendar className="w-3.5 h-3.5" />
                      <Text as="span">{dateStr}</Text>
                    </LayoutContainer>

                    <Title
                      level="h3"
                      className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Title>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center text-xs font-semibold text-primary pt-1 border-t border-border/40">
                    <Text as="span">{texts.READ_MORE}</Text>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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
