'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Badge, SafeImage } from '@/shared/ui/components';
import { TimelineEventData } from '../../services/timeline.service';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { Calendar, Trophy, Landmark, Flag, Star, Sparkles } from 'lucide-react';

interface TimelineCardProps {
  event: TimelineEventData;
  isEven: boolean; // true = left in desktop, false = right in desktop
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'FOUNDATION':
      return <Flag className="w-3.5 h-3.5 text-primary" />;
    case 'TITLE':
      return <Trophy className="w-3.5 h-3.5 text-primary" />;
    case 'STADIUM':
      return <Landmark className="w-3.5 h-3.5 text-primary" />;
    case 'GLORY':
      return <Star className="w-3.5 h-3.5 text-primary" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-primary" />;
  }
};

const getCategoryLabel = (category: string) => {
  return (
    TIMELINE_CONSTANTS.CATEGORIES[
      category as keyof typeof TIMELINE_CONSTANTS.CATEGORIES
    ] || category
  );
};

export const TimelineCard: React.FC<TimelineCardProps> = ({ event, isEven }) => {
  return (
    <LayoutContainer
      className={`relative rounded-2xl bg-surface/90 border backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:shadow-xl ${
        event.isHighlighted
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
          {getCategoryIcon(event.category)}
          <span>{getCategoryLabel(event.category)}</span>
        </LayoutContainer>

        {event.dateFormatted && (
          <LayoutContainer className="inline-flex items-center gap-1 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{event.dateFormatted}</span>
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

      {/* Image if available */}
      {event.imageUrl && (
        <LayoutContainer className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden mb-4 bg-background border border-border/60">
          <SafeImage
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-500 hover:scale-105"
            fallbackSrc="/pelotas-logo.png"
          />
        </LayoutContainer>
      )}

      {/* Description */}
      <Text
        as="p"
        className="text-text-secondary text-sm sm:text-base leading-relaxed text-justify sm:text-left"
      >
        {event.description}
      </Text>
    </LayoutContainer>
  );
};
