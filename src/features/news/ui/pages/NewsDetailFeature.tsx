'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Copy,
  Video,
  Image as ImageIcon,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
  SafeImage,
  ImageLightboxModal,
} from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { useNewsArticle } from '../../hooks/useNewsArticle';
import { NewsRenderer } from '../components/NewsRenderer';
import { NewsCard } from '../components/NewsCard';
import { calculateReadingTime, getYoutubeEmbedUrl, getYoutubeWatchUrl } from '../../utils/news.utils';

export interface NewsDetailFeatureProps {
  slug: string;
}

export const NewsDetailFeature: React.FC<NewsDetailFeatureProps> = ({ slug }) => {
  const router = useRouter();
  const { article, relatedNews, isLoading, error } = useNewsArticle(slug);
  const [copied, setCopied] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  useEffect(() => {
    if (article?._redirectTo && article._redirectTo !== slug) {
      router.replace(`/noticias/${article._redirectTo}`);
    }
  }, [article, slug, router]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copiado com sucesso!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Spinner className="w-10 h-10 text-primary mb-3" />
        <Text as="p" className="text-text-secondary font-medium">
          Carregando matéria...
        </Text>
      </LayoutContainer>
    );
  }

  if (error || !article) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center max-w-lg mx-auto">
        <Title level="h2" className="text-2xl font-bold text-text-primary mb-3">
          Matéria não encontrada
        </Title>
        <Text as="p" className="text-text-secondary text-sm mb-6">
          A notícia que você está procurando pode ter sido removida ou o endereço está incorreto.
        </Text>
        <Link href="/noticias">
          <Button variant="primary">
            {PUBLIC_NEWS_TEXTS.BACK_TO_NEWS}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  const categoryName =
    typeof article.category === 'object' && article.category
      ? article.category.name
      : article.category || 'Geral';

  const authorName =
    typeof article.author === 'object' && article.author
      ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
      : 'Redação';

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const youtubeEmbedUrl = getYoutubeEmbedUrl(article.youtubeVideoUrl);
  const youtubeWatchUrl = getYoutubeWatchUrl(article.youtubeVideoUrl);

  return (
    <LayoutContainer className="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Back button */}
      <LayoutContainer>
        <Link href="/noticias" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{PUBLIC_NEWS_TEXTS.BACK_TO_NEWS}</span>
        </Link>
      </LayoutContainer>

      {/* Article Header */}
      <LayoutContainer className="flex flex-col gap-4">
        {/* Category Badge */}
        <LayoutContainer className="flex items-center gap-2">
          <Badge variant="primary" size="md" className="font-extrabold uppercase">
            {categoryName}
          </Badge>
        </LayoutContainer>

        {/* Title */}
        <Title
          level="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary leading-tight tracking-tight"
        >
          {article.title}
        </Title>

        {/* Subtitle / Linha Fina */}
        {article.subtitle && (
          <Text as="p" className="text-lg sm:text-xl text-text-secondary leading-relaxed font-normal">
            {article.subtitle}
          </Text>
        )}

        {/* Metadata Bar */}
        <LayoutContainer className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border text-xs sm:text-sm text-text-secondary mt-2">
          <LayoutContainer className="flex items-center gap-4">
            <LayoutContainer className="flex items-center gap-1.5">
              <Text as="span" className="font-semibold text-text-primary">
                Por {article.reporterName || authorName}
              </Text>
            </LayoutContainer>

            {formattedDate && (
              <>
                <Text as="span">•</Text>
                <LayoutContainer className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <Text as="span">{formattedDate}</Text>
                </LayoutContainer>
              </>
            )}

            <Text as="span">•</Text>
            <LayoutContainer className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <Text as="span">{calculateReadingTime(article)}</Text>
            </LayoutContainer>

            {article.viewsCount !== undefined && (
              <>
                <Text as="span">•</Text>
                <LayoutContainer className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary" />
                  <Text as="span">{article.viewsCount} visualizações</Text>
                </LayoutContainer>
              </>
            )}
          </LayoutContainer>

          {/* Share Button */}
          <LayoutContainer className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              className="text-xs h-8"
            >
              {copied ? 'Copiado!' : 'Compartilhar'}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Cover Image 16:9 & Caption */}
      <LayoutContainer className="flex flex-col gap-2">
        <LayoutContainer className="relative w-full aspect-video rounded-3xl overflow-hidden bg-drawer border border-border shadow-md">
          <SafeImage
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 896px"
            className="object-cover"
          />
        </LayoutContainer>
        {(article.photographerName || article.coverCaption) && (
          <Text as="p" className="text-xs text-text-secondary text-center italic">
            {article.photographerName && article.coverCaption
              ? `${article.coverCaption} (Foto: ${article.photographerName})`
              : article.photographerName
              ? `Foto: ${article.photographerName}`
              : article.coverCaption}
          </Text>
        )}
      </LayoutContainer>

      {/* Main Content Body */}
      <LayoutContainer className="py-2">
        <NewsRenderer content={article.content} />
      </LayoutContainer>

      {/* Embedded YouTube Video if available */}
      {youtubeEmbedUrl && (
        <LayoutContainer className="flex flex-col gap-3 p-6 rounded-3xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex items-center justify-between">
            <Title level="h3" className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              {PUBLIC_NEWS_TEXTS.VIDEO_TITLE}
            </Title>
            {youtubeWatchUrl && (
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <span>{PUBLIC_NEWS_TEXTS.WATCH_ON_YOUTUBE}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </LayoutContainer>
          <LayoutContainer className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-md">
            <iframe
              src={youtubeEmbedUrl}
              title={article.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Photo Gallery if available */}
      {article.gallery && article.gallery.length > 0 && (
        <LayoutContainer className="flex flex-col gap-4 p-6 rounded-3xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex flex-col gap-1">
            <Title level="h3" className="text-lg font-bold text-text-primary flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              {PUBLIC_NEWS_TEXTS.GALLERY_TITLE}
            </Title>
            <Text as="p" className="text-xs text-text-secondary">
              {PUBLIC_NEWS_TEXTS.GALLERY_CLICK_HINT}
            </Text>
          </LayoutContainer>
          <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {article.gallery.map((imgUrl, idx) => (
              <Button
                key={idx}
                type="button"
                variant="custom"
                size="none"
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-video rounded-xl overflow-hidden bg-drawer border border-border hover:border-primary transition-all cursor-pointer"
                aria-label={`Ampliar foto ${idx + 1}`}
              >
                <SafeImage
                  src={imgUrl}
                  alt={`Galeria foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Button>
            ))}
          </LayoutContainer>

          {/* Lightbox Modal com Carrossel */}
          <ImageLightboxModal
            isOpen={lightboxIndex !== null}
            onClose={() => setLightboxIndex(null)}
            images={article.gallery}
            initialIndex={lightboxIndex ?? 0}
            title={article.title}
          />
        </LayoutContainer>
      )}

      {/* Tags Chips */}
      {article.tags && article.tags.length > 0 && (
        <LayoutContainer className="flex flex-col gap-2.5 pt-4 border-t border-border">
          <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            {PUBLIC_NEWS_TEXTS.TAGS_TITLE}
          </Text>
          <LayoutContainer className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm" className="font-semibold px-3 py-1">
                #{tag}
              </Badge>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <LayoutContainer className="flex flex-col gap-6 pt-10 border-t border-border mt-6">
          <Title level="h2" className="text-2xl font-bold text-text-primary">
            {PUBLIC_NEWS_TEXTS.RELATED_NEWS}
          </Title>
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedNews.map((rel, idx) => (
              <NewsCard
                key={rel.slug || (typeof rel._id === 'string' ? rel._id : rel.id) || `rel-${idx}`}
                article={rel}
              />
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
