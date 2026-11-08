'use client';

import React, { useState } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
  ImageLightboxModal,
  DEFAULT_NEWS_COVER,
} from '@/shared/ui/components';
import { TimelineEventData } from '../../services/timeline.service';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import {
  Calendar,
  Trophy,
  Landmark,
  Flag,
  Star,
  Sparkles,
  Medal,
  Shield,
  Heart,
  Camera,
  Maximize2,
} from 'lucide-react';

interface TimelineCardProps {
  event: TimelineEventData;
  isEven: boolean; // true = left in desktop, false = right in desktop
}

const getCategoryIcon = (categorySlugOrIcon?: string) => {
  const normalized = (categorySlugOrIcon || '').toLowerCase();
  switch (normalized) {
    case 'trophy':
    case 'title':
    case 'titulos':
      return <Trophy className="w-3.5 h-3.5 text-primary" />;
    case 'landmark':
    case 'stadium':
    case 'estadio':
      return <Landmark className="w-3.5 h-3.5 text-primary" />;
    case 'star':
    case 'glory':
    case 'glorias':
      return <Star className="w-3.5 h-3.5 text-primary" />;
    case 'medal':
    case 'homenagens':
      return <Medal className="w-3.5 h-3.5 text-primary" />;
    case 'shield':
    case 'simbolos':
      return <Shield className="w-3.5 h-3.5 text-primary" />;
    case 'heart':
    case 'torcida':
      return <Heart className="w-3.5 h-3.5 text-primary" />;
    case 'sparkles':
    case 'milestone':
    case 'marcos':
      return <Sparkles className="w-3.5 h-3.5 text-primary" />;
    case 'flag':
    case 'foundation':
    case 'fundacao':
    default:
      return <Flag className="w-3.5 h-3.5 text-primary" />;
  }
};

const getCategoryLabel = (event: TimelineEventData) => {
  if (event.categoryName && event.categoryName.trim()) {
    return event.categoryName;
  }
  const slugKey = (event.category || '').toUpperCase();
  return (
    TIMELINE_CONSTANTS.CATEGORIES[
    slugKey as keyof typeof TIMELINE_CONSTANTS.CATEGORIES
    ] || event.category || 'Marco Histórico'
  );
};

export const TimelineCard: React.FC<TimelineCardProps> = ({ event, isEven }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Coleta todas as imagens do marco (capa principal + mini-galeria de fotos históricas)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (event.imageUrl && event.imageUrl.trim()) {
      list.push(event.imageUrl.trim());
    }
    if (Array.isArray(event.galleryUrls)) {
      event.galleryUrls.forEach((url) => {
        if (url && url.trim() && !list.includes(url.trim())) {
          list.push(url.trim());
        }
      });
    }
    return list;
  }, [event.imageUrl, event.galleryUrls]);

  const hasAdditionalPhotos = allImages.length > 1;

  return (
    <LayoutContainer
      className={`relative rounded-2xl bg-surface/90 border backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:shadow-xl ${event.isHighlighted
          ? 'border-primary/60 shadow-md shadow-primary/10'
          : 'border-border/80 hover:border-primary/40'
        }`}
    >
      {/* Highlight Ribbon */}
      {event.isHighlighted && (
        <LayoutContainer className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase mb-3">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span>{TIMELINE_CONSTANTS.HIGHLIGHTED_BADGE}</span>
        </LayoutContainer>
      )}

      {/* Header Info */}
      <LayoutContainer className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <LayoutContainer className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-semibold text-text-secondary">
          {getCategoryIcon(event.categoryIcon || event.category)}
          <span>{getCategoryLabel(event)}</span>
        </LayoutContainer>

        {(event.dateFormatted || event.eventDate) && (
          <LayoutContainer className="inline-flex items-center gap-1 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{event.dateFormatted || event.eventDate}</span>
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Title */}
      <Title
        level="h3"
        className="text-lg sm:text-xl font-black text-text-primary mt-1 mb-3 leading-snug group-hover:text-primary transition-colors"
      >
        {event.title}
      </Title>

      {/* Imagem Principal do Marco */}
      {event.imageUrl && (
        <LayoutContainer
          onClick={() => setLightboxIndex(0)}
          className="group/img relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-3 bg-background border border-border/60 cursor-pointer"
          title={TIMELINE_CONSTANTS.VIEW_FULL_PHOTO}
        >
          <SafeImage
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-500 group-hover/img:scale-105"
            fallbackSrc={DEFAULT_NEWS_COVER}
            loading="eager"
            unoptimized={Boolean(event.imageUrl && event.imageUrl.startsWith('http'))}
          />
          <LayoutContainer className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
            <LayoutContainer className="w-9 h-9 rounded-full bg-surface/90 text-text-primary border border-border flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg">
              <Maximize2 className="w-4 h-4 text-primary" />
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Mini-Galeria de Imagens Adicionais do Marco */}
      {hasAdditionalPhotos && (
        <LayoutContainer className="flex flex-col gap-2 mb-4">
          <LayoutContainer className="flex items-center justify-between">
            <Text className="text-xs font-bold text-text-secondary flex items-center gap-1.5 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-primary" />
              {TIMELINE_CONSTANTS.GALLERY_BADGE} ({allImages.length})
            </Text>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {allImages.map((imgUrl, imgIdx) => (
              <LayoutContainer
                key={imgIdx}
                onClick={() => setLightboxIndex(imgIdx)}
                className={`relative h-14 sm:h-16 rounded-lg overflow-hidden border bg-background cursor-pointer group/thumb transition-all ${imgIdx === 0
                    ? 'border-primary/60 ring-1 ring-primary/40'
                    : 'border-border/80 hover:border-primary'
                  }`}
                title={`${TIMELINE_CONSTANTS.VIEW_FULL_PHOTO} (${imgIdx + 1}/${allImages.length})`}
              >
                <SafeImage
                  src={imgUrl}
                  alt={`${event.title} - Foto ${imgIdx + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                />
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Description */}
      <Text
        as="p"
        className="text-text-secondary text-sm sm:text-base leading-relaxed text-justify sm:text-left"
      >
        {event.description}
      </Text>

      {/* Modal de Lightbox para exibição ampliada das fotos do marco */}
      {lightboxIndex !== null && allImages.length > 0 && (
        <ImageLightboxModal
          isOpen={lightboxIndex !== null}
          images={allImages}
          initialIndex={lightboxIndex}
          title={`${event.year} — ${event.title}`}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </LayoutContainer>
  );
};
