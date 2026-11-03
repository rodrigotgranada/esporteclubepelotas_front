'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Eye, ArrowRight } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button, SafeImage } from '@/shared/ui/components';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';

export interface NewsFeaturedHeroProps {
  article: NewsArticleData;
}

export const NewsFeaturedHero: React.FC<NewsFeaturedHeroProps> = ({ article }) => {
  const categoryName =
    typeof article.category === 'object' && article.category
      ? article.category.name
      : article.category || 'Geral';

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <Link href={`/noticias/${article.slug}`} className="group block focus:outline-none w-full">
      <LayoutContainer className="relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] rounded-3xl overflow-hidden bg-drawer border border-border shadow-md flex flex-col justify-end p-6 sm:p-8 md:p-12">
        {/* Background Cover Image with Zoom Effect */}
        <SafeImage
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="100vw"
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

        {/* Hero Content */}
        <LayoutContainer className="relative z-10 max-w-3xl flex flex-col gap-4">
          {/* Badges */}
          <LayoutContainer className="flex items-center gap-2">
            <Badge variant="primary" size="md" className="font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {PUBLIC_NEWS_TEXTS.FEATURED_BADGE}
            </Badge>
            <Badge variant="default" size="md" className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold">
              {categoryName}
            </Badge>
          </LayoutContainer>

          {/* Title */}
          <Title
            level="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm group-hover:text-primary transition-colors"
          >
            {article.title}
          </Title>

          {/* Subtitle / Summary */}
          {(article.subtitle || article.summary) && (
            <Text as="p" className="text-sm sm:text-base md:text-lg text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {article.subtitle || article.summary}
            </Text>
          )}

          {/* Metadata & CTA */}
          <LayoutContainer className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/20">
            <LayoutContainer className="flex items-center gap-4 text-xs sm:text-sm text-white/70">
              {formattedDate && (
                <LayoutContainer className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <Text as="span">{formattedDate}</Text>
                </LayoutContainer>
              )}
              {article.viewsCount !== undefined && (
                <LayoutContainer className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary" />
                  <Text as="span">{article.viewsCount} views</Text>
                </LayoutContainer>
              )}
            </LayoutContainer>

            <LayoutContainer className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
              <span>{PUBLIC_NEWS_TEXTS.READ_MORE}</span>
              <ArrowRight className="w-4 h-4" />
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </Link>
  );
};
