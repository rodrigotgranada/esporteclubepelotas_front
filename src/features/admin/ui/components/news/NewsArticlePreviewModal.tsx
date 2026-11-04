'use client';

import React, { useState } from 'react';
import {
  X,
  Laptop,
  Smartphone,
  Calendar,
  User,
  Tag as TagIcon,
  Images,
  ArrowLeft,
  Wifi,
  Battery,
  Share2,
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
import { NewsSocialPreview } from './NewsSocialPreview';

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

        {/* Modo 2: Computador / Desktop (Largura Real do Portal de Notícias) */}
        {activeMode === 'desktop' && (
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
                <Text
                  as="p"
                  className="text-text-secondary leading-relaxed text-lg"
                >
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

            {/* Vídeo do YouTube se configurado */}
            {embedUrl && (
              <LayoutContainer className="my-6 rounded-2xl overflow-hidden aspect-video border border-border shadow-md">
                <iframe
                  src={embedUrl}
                  title={texts.PREVIEW_VIDEO_TITLE}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </LayoutContainer>
            )}

            {/* Conteúdo Rico Renderizado via NewsRenderer */}
            <LayoutContainer className="my-6">
              <NewsRenderer content={content} />
            </LayoutContainer>

            {/* Galeria de Fotos */}
            {allGalleryPhotos.length > 0 && (
              <LayoutContainer className="my-8 flex flex-col gap-3 pt-6 border-t border-border">
                <Text className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                  <Images className="w-4 h-4 text-primary" />
                  {texts.PREVIEW_GALLERY_TITLE(allGalleryPhotos.length)}
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
        )}

        {/* Modo 3: Celular / Mobile (Moldura de Smartphone 390px com scroll interno) */}
        {activeMode === 'mobile' && (
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

                {/* Vídeo Mobile */}
                {embedUrl && (
                  <LayoutContainer className="mb-4 rounded-xl overflow-hidden aspect-video border border-border">
                    <iframe
                      src={embedUrl}
                      title={texts.PREVIEW_VIDEO_TITLE}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </LayoutContainer>
                )}

                {/* Conteúdo Rico Mobile */}
                <LayoutContainer className="mb-4 text-sm">
                  <NewsRenderer content={content} />
                </LayoutContainer>

                {/* Galeria Mobile */}
                {allGalleryPhotos.length > 0 && (
                  <LayoutContainer className="my-4 flex flex-col gap-2 pt-4 border-t border-border">
                    <Text className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-primary" />
                      {texts.PREVIEW_GALLERY_TITLE(allGalleryPhotos.length)}
                    </Text>
                    <LayoutContainer className="grid grid-cols-2 gap-2">
                      {allGalleryPhotos.map((photoUrl, idx) => (
                        <LayoutContainer
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-border bg-drawer"
                        >
                          <SafeImage
                            src={photoUrl}
                            alt={`Foto ${idx + 1}`}
                            fill
                            sizes="180px"
                            className="object-cover"
                          />
                        </LayoutContainer>
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
        )}
      </LayoutContainer>
    </Modal>
  );
};
