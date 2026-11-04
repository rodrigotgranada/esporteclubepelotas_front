'use client';

import React, { useState } from 'react';
import {
  X,
  Laptop,
  Smartphone,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  ImageLightboxModal,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { NewsSocialPreview } from './NewsSocialPreview';
import { NewsDesktopPreview } from './NewsDesktopPreview';
import { NewsMobilePreview } from './NewsMobilePreview';
import { getYoutubeEmbedUrl, getYoutubeWatchUrl } from '@/features/news/utils/news.utils';

export interface NewsArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  summary?: string;
  slug?: string;
  categoryName?: string;
  authorName?: string;
  authorAvatar?: string | null;
  reporterName?: string;
  photographerName?: string;
  publishedAt?: string;
  coverImage?: string | null;
  coverCaption?: string;
  content: Record<string, any>;
  gallery?: string[];
  galleryPreviews?: string[];
  youtubeVideoUrl?: string;
  tags?: string[];
}

type PreviewMode = 'desktop' | 'mobile' | 'social';

export const NewsArticlePreviewModal: React.FC<NewsArticlePreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  summary,
  slug,
  categoryName,
  authorName,
  authorAvatar: _authorAvatar,
  reporterName,
  photographerName,
  publishedAt,
  coverImage,
  coverCaption,
  content,
  gallery = [],
  galleryPreviews = [],
  youtubeVideoUrl,
  tags = [],
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;
  const [activeMode, setActiveMode] = useState<PreviewMode>('desktop');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const allGalleryPhotos = [...gallery, ...galleryPreviews];
  const embedUrl = getYoutubeEmbedUrl(youtubeVideoUrl);
  const watchUrl = getYoutubeWatchUrl(youtubeVideoUrl);

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  const authorDisplay = reporterName
    ? `Por ${reporterName}`
    : authorName || texts.PREVIEW_DEFAULT_REDACTION;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="7xl"
      noPadding={true}
      className="overflow-hidden bg-background border border-border w-full h-[92vh] max-h-[92vh] flex flex-col shadow-2xl"
    >
      {/* Top Bar de Controle */}
      <LayoutContainer className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-drawer shrink-0 z-10 gap-3">
        {/* Identificação Esquerda */}
        <LayoutContainer className="flex items-center gap-3 shrink-0">
          <Badge variant="primary" size="sm" className="font-bold text-[10px] uppercase tracking-wider">
            Preview
          </Badge>
          <LayoutContainer className="hidden md:flex flex-col">
            <Title level="h3" className="text-sm font-bold text-text-primary leading-tight">
              {texts.PREVIEW_TITLE}
            </Title>
            <Text className="text-[11px] text-text-secondary">
              {texts.PREVIEW_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Seletor Central Unificado de 3 Modos */}
        <LayoutContainer className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
          <Button
            variant="custom"
            size="none"
            onClick={() => setActiveMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'desktop'
                ? 'bg-primary text-background shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <Text as="span" className="hidden sm:inline">{texts.PREVIEW_TAB_DESKTOP}</Text>
            <Text as="span" className="sm:hidden">{texts.PREVIEW_MODE_DESKTOP}</Text>
          </Button>

          <Button
            variant="custom"
            size="none"
            onClick={() => setActiveMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'mobile'
                ? 'bg-primary text-background shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <Text as="span" className="hidden sm:inline">{texts.PREVIEW_TAB_MOBILE}</Text>
            <Text as="span" className="sm:hidden">{texts.PREVIEW_MODE_MOBILE}</Text>
          </Button>

          <Button
            variant="custom"
            size="none"
            onClick={() => setActiveMode('social')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'social'
                ? 'bg-primary text-background shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <Text as="span">{texts.PREVIEW_TAB_SOCIAL}</Text>
          </Button>
        </LayoutContainer>

        {/* Botões de Ação à Direita */}
        <LayoutContainer className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            className="text-xs font-semibold hidden sm:flex"
          >
            {texts.PREVIEW_CLOSE}
          </Button>
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors border border-border"
            aria-label={texts.PREVIEW_CLOSE}
          >
            <X className="w-4 h-4" />
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Viewport Principal com Scroll Macio */}
      <LayoutContainer className="flex-1 overflow-y-auto bg-black/40 p-4 sm:p-8">
        {/* Modo 1: Redes Sociais & Google SEO */}
        {activeMode === 'social' && (
          <NewsSocialPreview
            title={title}
            summary={summary}
            subtitle={subtitle}
            slug={slug}
            coverImage={coverImage}
            publishedAt={publishedAt}
          />
        )}

        {/* Modo 2: Computador / Desktop */}
        {activeMode === 'desktop' && (
          <NewsDesktopPreview
            title={title}
            subtitle={subtitle}
            categoryName={categoryName}
            authorDisplay={authorDisplay}
            formattedDate={formattedDate}
            coverImage={coverImage}
            photographerName={photographerName}
            coverCaption={coverCaption}
            content={content}
            embedUrl={embedUrl}
            watchUrl={watchUrl}
            allGalleryPhotos={allGalleryPhotos}
            tags={tags}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
          />
        )}

        {/* Modo 3: Celular / Mobile */}
        {activeMode === 'mobile' && (
          <NewsMobilePreview
            title={title}
            subtitle={subtitle}
            categoryName={categoryName}
            authorDisplay={authorDisplay}
            formattedDate={formattedDate}
            coverImage={coverImage}
            photographerName={photographerName}
            coverCaption={coverCaption}
            content={content}
            embedUrl={embedUrl}
            watchUrl={watchUrl}
            allGalleryPhotos={allGalleryPhotos}
            tags={tags}
            onOpenLightbox={(idx) => setLightboxIndex(idx)}
          />
        )}
      </LayoutContainer>

      {/* Lightbox Modal com Carrossel de Fotos no Preview */}
      <ImageLightboxModal
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={allGalleryPhotos}
        initialIndex={lightboxIndex ?? 0}
        title={title}
      />
    </Modal>
  );
};
