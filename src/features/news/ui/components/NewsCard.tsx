'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Calendar, Sparkles, Clock, Video, Image as ImageIcon } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, SafeImage } from '@/shared/ui/components';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { calculateReadingTime, formatNewsDate, getCategoryName } from '../../utils/news.utils';

export interface NewsCardProps {
  article: NewsArticleData;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, className = '' }) => {
  const categoryName = getCategoryName(article.category);

  const authorName =
    typeof article.author === 'object' && article.author
      ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
      : 'Redação';

  const formattedDate = formatNewsDate(article.publishedAt);
  const readingTime = calculateReadingTime(article);

  return (
    <Link
      href={`/noticias/${article.slug}`}
      className={`group block focus:outline-none ${className}`}
    >
      <LayoutContainer className="h-full flex flex-col rounded-2xl overflow-hidden bg-surface border border-border shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:border-primary/50 group-hover:-translate-y-1">
        {/* 16:9 Image Container */}
        <LayoutContainer className="relative w-full aspect-video overflow-hidden bg-drawer">
          <SafeImage
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category Badge on top left of image */}
          <LayoutContainer className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <Badge variant="primary" size="sm" className="font-bold shadow-sm">
              {categoryName}
            </Badge>

            {article.youtubeVideoUrl && (
              <Badge variant="default" size="sm" className="bg-black/70 text-white border-white/20 backdrop-blur-xs flex items-center gap-1">
                <Video className="w-3 h-3 text-primary" />
                Vídeo
              </Badge>
            )}

            {article.gallery && article.gallery.length > 0 && (
              <Badge variant="default" size="sm" className="bg-black/70 text-white border-white/20 backdrop-blur-xs flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-primary" />
                Fotos
              </Badge>
            )}
          </LayoutContainer>

          {article.isFeatured && (
            <LayoutContainer className="absolute top-3 right-3 z-10">
              <Badge variant="default" size="sm" className="bg-surface/90 text-primary font-bold border-primary/30 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-primary" />
                Destaque
              </Badge>
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Content Body */}
        <LayoutContainer className="flex-1 p-5 flex flex-col justify-between gap-3">
          <LayoutContainer className="flex flex-col gap-2">
            {/* Date, Reading Time & Views */}
            <LayoutContainer className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
              {formattedDate && (
                <LayoutContainer className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <Text as="span">{formattedDate}</Text>
                </LayoutContainer>
              )}

              <Text as="span">•</Text>

              <LayoutContainer className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <Text as="span">{readingTime}</Text>
              </LayoutContainer>

              {article.viewsCount !== undefined && (
                <>
                  <Text as="span">•</Text>
                  <LayoutContainer className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <Text as="span">{article.viewsCount} views</Text>
                  </LayoutContainer>
                </>
              )}
            </LayoutContainer>

            {/* Title */}
            <Title
              level="h3"
              className="text-base sm:text-lg font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-primary transition-colors"
            >
              {article.title}
            </Title>

            {/* Subtitle / Summary */}
            {(article.subtitle || article.summary) && (
              <Text as="p" className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {article.subtitle || article.summary}
              </Text>
            )}
          </LayoutContainer>

          {/* Footer author */}
          <LayoutContainer className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
            <Text as="span" className="font-medium">
              Por {authorName}
            </Text>
            <Text as="span" className="text-primary font-bold group-hover:translate-x-0.5 transition-transform">
              Ler mais →
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </Link>
  );
};
