'use client';

import React, { useState } from 'react';
import {
  X,
  Laptop,
  Smartphone,
  Calendar,
  User,
  Tag as TagIcon,
  Video,
  Images,
} from 'lucide-react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  SafeImage,
} from '@/shared/ui/components';
import { NewsRenderer } from '@/features/news/ui/components/NewsRenderer';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  categoryName?: string;
  authorName?: string;
  authorAvatar?: string | null;
  publishedAt?: string;
  coverImage?: string | null;
  coverCaption?: string;
  content: Record<string, any>;
  gallery?: string[];
  galleryPreviews?: string[];
  youtubeVideoUrl?: string;
  tags?: string[];
}

export const NewsArticlePreviewModal: React.FC<NewsArticlePreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  categoryName,
  authorName,
  authorAvatar,
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
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const allGalleryPhotos = [...gallery, ...galleryPreviews];

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeVideoUrl);

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="!p-0 overflow-hidden bg-background border border-border max-w-5xl w-full h-[90vh] flex flex-col"
    >
      {/* Top Bar with Device Switcher & Close Button */}
      <LayoutContainer className="flex items-center justify-between px-6 py-3 border-b border-border bg-drawer shrink-0">
        <LayoutContainer className="flex items-center gap-3">
          <Badge variant="primary" size="sm" className="font-bold text-[10px] uppercase">
            Preview
          </Badge>
          <Text className="text-sm font-bold text-text-primary hidden sm:inline">
            {texts.PREVIEW_TITLE}
          </Text>
        </LayoutContainer>

        {/* Device Switcher (Desktop vs Mobile) */}
        <LayoutContainer className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-primary text-button-primary-text shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>{texts.PREVIEW_MODE_DESKTOP}</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-primary text-button-primary-text shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{texts.PREVIEW_MODE_MOBILE}</span>
          </button>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold"
          >
            {texts.PREVIEW_CLOSE}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-drawer text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Preview Viewport Container */}
      <LayoutContainer className="flex-1 overflow-y-auto bg-drawer/30 p-4 sm:p-8 flex justify-center">
        <LayoutContainer
          className={`transition-all duration-300 bg-surface rounded-2xl shadow-xl overflow-hidden border border-border flex flex-col ${
            deviceMode === 'mobile'
              ? 'w-[390px] border-4 border-neutral-800 rounded-[40px] shadow-2xl p-4 my-auto min-h-[700px]'
              : 'w-full max-w-4xl p-6 sm:p-10'
          }`}
        >
          {/* Header Metadata */}
          <LayoutContainer className="flex flex-col gap-3 pb-6 border-b border-border/60">
            {categoryName && (
              <Badge variant="primary" size="sm" className="w-fit font-bold text-xs">
                {categoryName}
              </Badge>
            )}

            <Title
              level="h1"
              className={`font-black text-text-primary tracking-tight leading-tight ${
                deviceMode === 'mobile' ? 'text-2xl' : 'text-3xl sm:text-4xl'
              }`}
            >
              {title || 'Título da matéria'}
            </Title>

            {subtitle && (
              <Text
                as="p"
                className={`text-text-secondary leading-relaxed ${
                  deviceMode === 'mobile' ? 'text-sm' : 'text-lg'
                }`}
              >
                {subtitle}
              </Text>
            )}

            {/* Author & Date Bar */}
            <LayoutContainer className="flex items-center gap-4 text-xs text-text-secondary pt-2">
              <LayoutContainer className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>{authorName || 'Redação E.C. Pelotas'}</span>
              </LayoutContainer>

              <LayoutContainer className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{formattedDate}</span>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Cover Image */}
          {coverImage && (
            <LayoutContainer className="my-6 flex flex-col gap-2">
              <LayoutContainer className="relative w-full aspect-video rounded-2xl overflow-hidden bg-drawer border border-border shadow-md">
                <SafeImage
                  src={coverImage}
                  alt={title}
                  fill
                  sizes={deviceMode === 'mobile' ? '360px' : '900px'}
                  className="object-cover"
                />
              </LayoutContainer>
              {coverCaption && (
                <Text className="text-xs text-text-secondary italic text-center">
                  {coverCaption}
                </Text>
              )}
            </LayoutContainer>
          )}

          {/* YouTube Video if provided */}
          {embedUrl && (
            <LayoutContainer className="my-6 rounded-2xl overflow-hidden aspect-video border border-border shadow-md">
              <iframe
                src={embedUrl}
                title="Vídeo da Matéria"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </LayoutContainer>
          )}

          {/* Rich Content Rendered via NewsRenderer */}
          <LayoutContainer className="my-6">
            <NewsRenderer content={content} />
          </LayoutContainer>

          {/* Photo Gallery if present */}
          {allGalleryPhotos.length > 0 && (
            <LayoutContainer className="my-8 flex flex-col gap-3 pt-6 border-t border-border">
              <Text className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Images className="w-4 h-4 text-primary" />
                Galeria de Fotos ({allGalleryPhotos.length})
              </Text>
              <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allGalleryPhotos.map((photoUrl, idx) => (
                  <LayoutContainer
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-drawer shadow-xs"
                  >
                    <SafeImage
                      src={photoUrl}
                      alt={`Foto da galeria ${idx + 1}`}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            </LayoutContainer>
          )}

          {/* Tags */}
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
      </LayoutContainer>
    </Modal>
  );
};

