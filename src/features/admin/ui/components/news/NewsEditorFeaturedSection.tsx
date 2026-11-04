'use client';

import React from 'react';
import { Sparkles, Pin, LayoutGrid, Star } from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Badge,
  Checkbox,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsEditorFeaturedSectionProps {
  featuredSlot: 'MAIN' | 'SECONDARY' | 'NONE';
  setFeaturedSlot: (slot: 'MAIN' | 'SECONDARY' | 'NONE') => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

export const NewsEditorFeaturedSection: React.FC<NewsEditorFeaturedSectionProps> = ({
  featuredSlot,
  setFeaturedSlot,
  isPinned,
  setIsPinned,
}) => {
  const { DRAWER: texts, TABLE: tableTexts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs">
      <LayoutContainer className="flex items-center justify-between">
        <LayoutContainer className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            {texts.LABEL_FEATURED_SECTION}
          </Text>
        </LayoutContainer>
        {featuredSlot === 'MAIN' && (
          <Badge variant="primary" size="sm">
            {tableTexts.BADGE_MAIN}
          </Badge>
        )}
        {featuredSlot === 'SECONDARY' && (
          <Badge variant="warning" size="sm">
            {tableTexts.BADGE_SECONDARY}
          </Badge>
        )}
      </LayoutContainer>

      {/* Grid de seleção dos slots */}
      <LayoutContainer className="flex flex-col gap-2">
        <Text as="span" className="text-xs font-medium text-text-secondary">
          {texts.LABEL_FEATURED_SLOT}
        </Text>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Opção 1: Sem Destaque */}
          <LayoutContainer
            role="button"
            tabIndex={0}
            onClick={() => setFeaturedSlot('NONE')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFeaturedSlot('NONE')}
            className={`flex flex-col gap-1 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              featuredSlot === 'NONE'
                ? 'border-primary bg-primary/5 shadow-xs'
                : 'border-border bg-background/50 hover:border-border/80 hover:bg-surface-hover'
            }`}
          >
            <LayoutContainer className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-text-secondary" />
              <Text as="span" className="text-xs font-semibold text-text-primary">
                {texts.SLOT_NONE}
              </Text>
            </LayoutContainer>
            <Text as="span" className="text-[11px] text-text-secondary line-clamp-2">
              {texts.SLOT_NONE_HINT}
            </Text>
          </LayoutContainer>

          {/* Opção 2: Manchetão Principal */}
          <LayoutContainer
            role="button"
            tabIndex={0}
            onClick={() => setFeaturedSlot('MAIN')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFeaturedSlot('MAIN')}
            className={`flex flex-col gap-1 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              featuredSlot === 'MAIN'
                ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                : 'border-border bg-background/50 hover:border-border/80 hover:bg-surface-hover'
            }`}
          >
            <LayoutContainer className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-primary fill-primary/30" />
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.SLOT_MAIN}
              </Text>
            </LayoutContainer>
            <Text as="span" className="text-[11px] text-text-secondary line-clamp-2">
              {texts.SLOT_MAIN_HINT}
            </Text>
          </LayoutContainer>

          {/* Opção 3: Destaque Secundário */}
          <LayoutContainer
            role="button"
            tabIndex={0}
            onClick={() => setFeaturedSlot('SECONDARY')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFeaturedSlot('SECONDARY')}
            className={`flex flex-col gap-1 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
              featuredSlot === 'SECONDARY'
                ? 'border-warning bg-warning/10 shadow-xs ring-1 ring-warning/30'
                : 'border-border bg-background/50 hover:border-border/80 hover:bg-surface-hover'
            }`}
          >
            <LayoutContainer className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-warning" />
              <Text as="span" className="text-xs font-semibold text-text-primary">
                {texts.SLOT_SECONDARY}
              </Text>
            </LayoutContainer>
            <Text as="span" className="text-[11px] text-text-secondary line-clamp-2">
              {texts.SLOT_SECONDARY_HINT}
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Opção de Fixar Matéria no Topo (Pin) */}
      <LayoutContainer className="pt-2 border-t border-border/70">
        <Checkbox
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          label={
            <span className="flex items-center gap-1.5 font-bold text-text-primary text-xs">
              <Pin className="w-3.5 h-3.5 text-primary" />
              {texts.LABEL_PINNED}
            </span>
          }
          description={texts.PINNED_HINT}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
