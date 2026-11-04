'use client';

import React from 'react';
import { User, Calendar, Video, ExternalLink, Images, Tag as TagIcon } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  SafeImage,
} from '@/shared/ui/components';
import { NewsRenderer } from '@/features/news/ui/components/NewsRenderer';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsDesktopPreviewProps {
  title: string;
  subtitle?: string;
  categoryName?: string;
  authorDisplay: string;
  formattedDate: string;
  coverImage?: string | null;
  photographerName?: string;
  coverCaption?: string;
  content: Record<string, any>;
  embedUrl?: string | null;
  watchUrl?: string | null;
  allGalleryPhotos: string[];
  tags: string[];
  onOpenLightbox: (index: number) => void;
}

export const NewsDesktopPreview: React.FC<NewsDesktopPreviewProps> = ({
  title,
  subtitle,
  categoryName,
  authorDisplay,
  formattedDate,
  coverImage,
  photographerName,
  coverCaption,
  content,
  embedUrl,
  watchUrl,
  allGalleryPhotos,
  tags,
  onOpenLightbox,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="w-full max-w-4xl mx-auto bg-surface border border-border/80 rounded-2xl shadow-xl p-6 sm:p-12 mb-12">
      {/* Header da Notícia */}
      <LayoutContainer className="flex flex-col gap-3 pb-6 border-b border-border/60">
        {categoryName && (
          <Badge variant="primary" size="sm" className="w-fit font-bold text-xs">
            {categoryName}
          </Badge>
        )}

        <Title
          level="h1"
          className="font-black text-text-primary tracking-tight leading-tight text-3xl sm:text-4xl"
        >
          {title || texts.PREVIEW_EMPTY_TITLE}
        </Title>

        {subtitle && (
          <Text as="p" className="text-text-secondary leading-relaxed text-lg">
            {subtitle}
          </Text>
        )}

        {/* Barra de Autor e Data */}
        <LayoutContainer className="flex items-center gap-5 text-xs text-text-secondary pt-2">
          <LayoutContainer className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-primary" />
            <Text as="span">{authorDisplay}</Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <Text as="span">{formattedDate}</Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Imagem de Capa */}
      {coverImage && (
        <LayoutContainer className="my-6 flex flex-col gap-2">
          <LayoutContainer className="relative w-full aspect-video rounded-2xl overflow-hidden bg-drawer border border-border shadow-md">
            <SafeImage
              src={coverImage}
              alt={title || 'Capa'}
              fill
              sizes="900px"
              className="object-cover"
            />
          </LayoutContainer>
          {(photographerName || coverCaption) && (
            <Text className="text-xs text-text-secondary italic text-center">
              {photographerName && coverCaption
                ? `${coverCaption} (Foto: ${photographerName})`
                : photographerName
                ? `Foto: ${photographerName}`
                : coverCaption}
            </Text>
          )}
        </LayoutContainer>
      )}

      {/* Conteúdo Rico Renderizado via NewsRenderer */}
      <LayoutContainer className="my-6">
        <NewsRenderer content={content} />
      </LayoutContainer>

      {/* Vídeo do YouTube posicionado após o conteúdo */}
      {embedUrl && (
        <LayoutContainer className="my-8 flex flex-col gap-3 p-6 rounded-2xl bg-drawer border border-border shadow-md">
          <LayoutContainer className="flex items-center justify-between">
            <Title level="h3" className="text-base font-bold text-text-primary flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              {texts.PREVIEW_VIDEO_TITLE}
            </Title>
            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <Text as="span">Assistir no YouTube</Text>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </LayoutContainer>
          <LayoutContainer className="relative w-full aspect-video rounded-xl overflow-hidden border border-border shadow-xs">
            <iframe
              src={embedUrl}
              title={texts.PREVIEW_VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Galeria de Fotos Interativa */}
      {allGalleryPhotos.length > 0 && (
        <LayoutContainer className="my-8 flex flex-col gap-3 pt-6 border-t border-border">
          <LayoutContainer className="flex items-center justify-between">
            <Text className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Images className="w-4 h-4 text-primary" />
              {texts.PREVIEW_GALLERY_TITLE(allGalleryPhotos.length)}
            </Text>
            <Text className="text-xs text-text-secondary">
              Clique em qualquer foto para abrir o carrossel
            </Text>
          </LayoutContainer>
          <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allGalleryPhotos.map((photoUrl, idx) => (
              <Button
                key={idx}
                type="button"
                variant="custom"
                size="none"
                onClick={() => onOpenLightbox(idx)}
                className="group relative aspect-video rounded-xl overflow-hidden border border-border bg-drawer shadow-xs hover:border-primary transition-all cursor-pointer"
                aria-label={`Ampliar foto ${idx + 1}`}
              >
                <SafeImage
                  src={photoUrl}
                  alt={`Foto da galeria ${idx + 1}`}
                  fill
                  sizes="300px"
                  className="object-cover transition-transform group-hover:scale-105 duration-300"
                />
              </Button>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Tags da Matéria */}
      {tags.length > 0 && (
        <LayoutContainer className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-2">
          <TagIcon className="w-3.5 h-3.5 text-primary" />
          {tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="default"
              size="sm"
              className="text-xs bg-drawer text-text-secondary border border-border font-medium"
            >
              #{tag.replace(/^#/, '')}
            </Badge>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

