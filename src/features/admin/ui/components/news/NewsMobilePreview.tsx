'use client';

import React from 'react';
import { Wifi, Battery, User, Calendar, Video, ExternalLink, Images } from 'lucide-react';
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

export interface NewsMobilePreviewProps {
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

export const NewsMobilePreview: React.FC<NewsMobilePreviewProps> = ({
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
    <LayoutContainer className="flex flex-col items-center justify-start pb-8">
      {/* Dica de usabilidade */}
      <LayoutContainer className="mb-3 px-4 py-1.5 rounded-full bg-surface border border-border text-center">
        <Text className="text-xs text-text-secondary">
          {texts.PREVIEW_MOBILE_HINT}
        </Text>
      </LayoutContainer>

      {/* Carcaça do Smartphone */}
      <LayoutContainer className="relative w-[390px] max-w-full bg-neutral-950 border-[8px] border-neutral-800 rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col shrink-0">
        {/* Barra de Status */}
        <LayoutContainer className="h-9 bg-neutral-950 flex items-center justify-between px-6 pt-1 select-none shrink-0 border-b border-neutral-900/50">
          <Text className="text-[11px] font-bold text-neutral-400">19:08</Text>
          <LayoutContainer className="w-20 h-4 bg-black rounded-full border border-neutral-800 flex items-center justify-center">
            <LayoutContainer className="w-2 h-2 bg-neutral-900 rounded-full ml-auto mr-1.5" />
          </LayoutContainer>
          <LayoutContainer className="flex items-center gap-1.5 text-neutral-400">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </LayoutContainer>
        </LayoutContainer>

        {/* Barra de Navegação Fake do Portal Pelotas */}
        <LayoutContainer className="px-4 py-2 bg-surface border-b border-border/60 flex items-center justify-between shrink-0">
          <LayoutContainer className="flex items-center gap-2">
            <LayoutContainer className="w-5 h-5 rounded-full bg-primary flex items-center justify-center font-black text-[9px] text-background">
              P
            </LayoutContainer>
            <Text className="text-xs font-bold text-text-primary tracking-tight">E.C. Pelotas</Text>
          </LayoutContainer>
          <Text className="text-[10px] text-text-secondary bg-drawer px-2 py-0.5 rounded-full border border-border font-mono">
            ecpelotas.com.br
          </Text>
        </LayoutContainer>

        {/* Área de Leitura Mobile com Scroll Suave Próprio */}
        <LayoutContainer className="h-[620px] overflow-y-auto p-4 bg-surface flex flex-col">
          {/* Categoria */}
          {categoryName && (
            <Badge variant="primary" size="sm" className="w-fit font-bold text-[11px] mb-2">
              {categoryName}
            </Badge>
          )}

          {/* Título Mobile */}
          <Title
            level="h1"
            className="font-black text-text-primary leading-snug tracking-tight text-xl mb-2"
          >
            {title || texts.PREVIEW_EMPTY_TITLE}
          </Title>

          {/* Subtítulo Mobile */}
          {subtitle && (
            <Text
              as="p"
              className="text-xs text-text-secondary leading-relaxed mb-3"
            >
              {subtitle}
            </Text>
          )}

          {/* Metadados Mobile */}
          <LayoutContainer className="flex flex-col gap-1 text-[11px] text-text-secondary pb-3 mb-3 border-b border-border/60">
            <LayoutContainer className="flex items-center gap-1.5 font-medium">
              <User className="w-3 h-3 text-primary" />
              <Text as="span">{authorDisplay}</Text>
            </LayoutContainer>

            <LayoutContainer className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-primary" />
              <Text as="span">{formattedDate}</Text>
            </LayoutContainer>
          </LayoutContainer>

          {/* Capa Mobile */}
          {coverImage && (
            <LayoutContainer className="mb-4 flex flex-col gap-1.5">
              <LayoutContainer className="relative w-full aspect-video rounded-xl overflow-hidden bg-drawer border border-border">
                <SafeImage
                  src={coverImage}
                  alt={title || 'Capa'}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
              </LayoutContainer>
              {(photographerName || coverCaption) && (
                <Text className="text-[10px] text-text-secondary italic text-center">
                  {photographerName && coverCaption
                    ? `${coverCaption} (${photographerName})`
                    : photographerName || coverCaption}
                </Text>
              )}
            </LayoutContainer>
          )}

          {/* Conteúdo Rico Mobile */}
          <LayoutContainer className="mb-4 text-sm">
            <NewsRenderer content={content} />
          </LayoutContainer>

          {/* Vídeo Mobile posicionado após o conteúdo */}
          {embedUrl && (
            <LayoutContainer className="mb-6 flex flex-col gap-2 p-3.5 rounded-xl bg-drawer border border-border shadow-xs">
              <LayoutContainer className="flex items-center justify-between">
                <Title level="h3" className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-primary" />
                  {texts.PREVIEW_VIDEO_TITLE}
                </Title>
                {watchUrl && (
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-text-secondary hover:text-primary transition-colors font-medium"
                  >
                    <Text as="span">YouTube</Text>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </LayoutContainer>
              <LayoutContainer className="rounded-lg overflow-hidden aspect-video border border-border shadow-xs">
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

          {/* Galeria Mobile Interativa */}
          {allGalleryPhotos.length > 0 && (
            <LayoutContainer className="my-4 flex flex-col gap-2 pt-4 border-t border-border">
              <Text className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Images className="w-3.5 h-3.5 text-primary" />
                {texts.PREVIEW_GALLERY_TITLE(allGalleryPhotos.length)}
              </Text>
              <LayoutContainer className="grid grid-cols-2 gap-2">
                {allGalleryPhotos.map((photoUrl, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant="custom"
                    size="none"
                    onClick={() => onOpenLightbox(idx)}
                    className="group relative aspect-video rounded-lg overflow-hidden border border-border bg-drawer hover:border-primary transition-all cursor-pointer"
                    aria-label={`Ampliar foto ${idx + 1}`}
                  >
                    <SafeImage
                      src={photoUrl}
                      alt={`Foto ${idx + 1}`}
                      fill
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Button>
                ))}
              </LayoutContainer>
            </LayoutContainer>
          )}

          {/* Tags Mobile */}
          {tags.length > 0 && (
            <LayoutContainer className="mt-4 pt-4 border-t border-border flex flex-wrap gap-1.5 pb-6">
              {tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  size="sm"
                  className="text-[10px] bg-drawer text-text-secondary border border-border"
                >
                  #{tag.replace(/^#/, '')}
                </Badge>
              ))}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Home Indicator na Base do Smartphone */}
        <LayoutContainer className="h-5 bg-surface flex items-center justify-center pb-1 shrink-0 border-t border-border/40">
          <LayoutContainer className="w-28 h-1 bg-neutral-500/40 rounded-full" />
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

