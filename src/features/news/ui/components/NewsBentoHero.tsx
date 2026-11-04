'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  Video,
  Image as ImageIcon,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, SafeImage } from '@/shared/ui/components';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import {
  calculateReadingTime,
  formatNewsDate,
  getCategoryName,
} from '../../utils/news.utils';
import { NEWS_BENTO_HERO_TEXTS } from './NewsBentoHero.constants';

export interface NewsBentoHeroProps {
  articles: NewsArticleData[];
  className?: string;
}

export const NewsBentoHero: React.FC<NewsBentoHeroProps> = ({
  articles,
  className = '',
}) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  const mainArticle =
    articles.find((a) => a.featuredSlot === 'MAIN') ||
    articles.find((a) => a.isFeatured && a.featuredSlot !== 'SECONDARY') ||
    articles[0];
  const mainId = mainArticle._id || (mainArticle as any).id;
  const subArticles = articles.filter((a) => (a._id || (a as any).id) !== mainId).slice(0, 2);
  const hasSubArticles = subArticles.length > 0;

  return (
    <LayoutContainer className={`w-full ${className}`}>
      <LayoutContainer
        className={`grid grid-cols-1 ${
          hasSubArticles ? 'lg:grid-cols-12' : ''
        } gap-4 sm:gap-6 items-stretch`}
      >
        {/* 1. Manchetão Principal */}
        <LayoutContainer
          className={hasSubArticles ? 'lg:col-span-7 xl:col-span-8 flex' : 'w-full flex'}
        >
          <Link
            href={`/noticias/${mainArticle.slug}`}
            className="group block focus:outline-none w-full h-full"
          >
            <LayoutContainer className="relative w-full h-full min-h-[380px] sm:min-h-[440px] md:min-h-[500px] rounded-3xl overflow-hidden bg-drawer border border-border shadow-md flex flex-col justify-end p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-primary/50">
              {/* Background Cover Image with Zoom Effect */}
              <SafeImage
                src={mainArticle.coverImage}
                alt={mainArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for Readability */}
              <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25" />

              {/* Hero Content */}
              <LayoutContainer className="relative z-10 max-w-3xl flex flex-col gap-3.5">
                {/* Badges Row */}
                <LayoutContainer className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="md" className="font-extrabold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {NEWS_BENTO_HERO_TEXTS.BADGE_FEATURED}
                  </Badge>

                  <Badge
                    variant="default"
                    size="md"
                    className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold"
                  >
                    {getCategoryName(mainArticle.category)}
                  </Badge>

                  {mainArticle.youtubeVideoUrl && (
                    <Badge
                      variant="default"
                      size="md"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold flex items-center gap-1"
                    >
                      <Video className="w-3 h-3 text-primary" />
                      {NEWS_BENTO_HERO_TEXTS.BADGE_VIDEO}
                    </Badge>
                  )}

                  {mainArticle.gallery && mainArticle.gallery.length > 0 && (
                    <Badge
                      variant="default"
                      size="md"
                      className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3 text-primary" />
                      {NEWS_BENTO_HERO_TEXTS.BADGE_GALLERY}
                    </Badge>
                  )}
                </LayoutContainer>

                {/* Title */}
                <Title
                  level="h2"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm group-hover:text-primary transition-colors"
                >
                  {mainArticle.title}
                </Title>

                {/* Subtitle / Summary */}
                {(mainArticle.subtitle || mainArticle.summary) && (
                  <Text
                    as="p"
                    className="text-sm sm:text-base text-white/80 line-clamp-2 leading-relaxed"
                  >
                    {mainArticle.subtitle || mainArticle.summary}
                  </Text>
                )}

                {/* Metadata & CTA */}
                <LayoutContainer className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/20 mt-1">
                  <LayoutContainer className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/70">
                    {mainArticle.publishedAt && (
                      <LayoutContainer className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <Text as="span">{formatNewsDate(mainArticle.publishedAt)}</Text>
                      </LayoutContainer>
                    )}

                    <LayoutContainer className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <Text as="span">{calculateReadingTime(mainArticle)}</Text>
                    </LayoutContainer>

                    {mainArticle.viewsCount !== undefined && (
                      <LayoutContainer className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <Text as="span">{mainArticle.viewsCount} views</Text>
                      </LayoutContainer>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="inline-flex items-center gap-1.5 text-primary font-bold text-xs sm:text-sm group-hover:translate-x-1 transition-transform">
                    <span>{NEWS_BENTO_HERO_TEXTS.CTA_READ_MORE}</span>
                    <ArrowRight className="w-4 h-4" />
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          </Link>
        </LayoutContainer>

        {/* 2. Sub-Destaques Laterais Empilhados */}
        {hasSubArticles && (
          <LayoutContainer className="lg:col-span-5 xl:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 justify-between">
            {subArticles.map((subArticle, idx) => (
              <Link
                key={subArticle.slug || (typeof subArticle._id === 'string' ? subArticle._id : subArticle.id) || `sub-${idx}`}
                href={`/noticias/${subArticle.slug}`}
                className="group block focus:outline-none flex-1"
              >
                <LayoutContainer className="relative w-full h-full min-h-[220px] lg:min-h-[240px] rounded-3xl overflow-hidden bg-drawer border border-border shadow-xs flex flex-col justify-end p-5 transition-all duration-300 hover:border-primary/50">
                  {/* Background Cover Image */}
                  <SafeImage
                    src={subArticle.coverImage}
                    alt={subArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                  {/* Content */}
                  <LayoutContainer className="relative z-10 flex flex-col gap-2.5">
                    {/* Badges */}
                    <LayoutContainer className="flex items-center gap-2">
                      <Badge variant="primary" size="sm" className="font-bold">
                        {getCategoryName(subArticle.category)}
                      </Badge>

                      {subArticle.youtubeVideoUrl && (
                        <Badge
                          variant="default"
                          size="sm"
                          className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold flex items-center gap-1"
                        >
                          <Video className="w-3 h-3 text-primary" />
                          {NEWS_BENTO_HERO_TEXTS.BADGE_VIDEO}
                        </Badge>
                      )}

                      {subArticle.gallery && subArticle.gallery.length > 0 && (
                        <Badge
                          variant="default"
                          size="sm"
                          className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3 text-primary" />
                          {NEWS_BENTO_HERO_TEXTS.BADGE_GALLERY}
                        </Badge>
                      )}
                    </LayoutContainer>

                    {/* Title */}
                    <Title
                      level="h3"
                      className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors"
                    >
                      {subArticle.title}
                    </Title>

                    {/* Metadata */}
                    <LayoutContainer className="flex items-center justify-between text-xs text-white/70 pt-2 border-t border-white/15">
                      <LayoutContainer className="flex items-center gap-2">
                        {subArticle.publishedAt && (
                          <LayoutContainer className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-primary" />
                            <Text as="span">{formatNewsDate(subArticle.publishedAt)}</Text>
                          </LayoutContainer>
                        )}
                        <Text as="span">•</Text>
                        <LayoutContainer className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          <Text as="span">{calculateReadingTime(subArticle)}</Text>
                        </LayoutContainer>
                      </LayoutContainer>

                      <Text as="span" className="text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                        {NEWS_BENTO_HERO_TEXTS.CTA_READ_MORE_SHORT}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>
              </Link>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};

