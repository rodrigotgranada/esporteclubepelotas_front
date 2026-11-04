'use client';

import React from 'react';
import { LayoutContainer, Text, Button } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { ReactionType } from '../../services/news.service';
import { useNewsReactions } from '../../hooks/useNewsReactions';

export interface NewsReactionsProps {
  slug: string;
  initialReactions?: {
    wolf?: number;
    fire?: number;
    clap?: number;
    heart?: number;
  };
}

interface ReactionConfig {
  type: ReactionType;
  emoji: string;
  label: string;
}

const REACTIONS: ReactionConfig[] = [
  { type: 'wolf', emoji: '🐺', label: PUBLIC_NEWS_TEXTS.REACTION_WOLF },
  { type: 'fire', emoji: '🔥', label: PUBLIC_NEWS_TEXTS.REACTION_FIRE },
  { type: 'clap', emoji: '👏', label: PUBLIC_NEWS_TEXTS.REACTION_CLAP },
  { type: 'heart', emoji: '💙💛', label: PUBLIC_NEWS_TEXTS.REACTION_HEART },
];

export const NewsReactions: React.FC<NewsReactionsProps> = ({ slug, initialReactions }) => {
  const { reactions, userReaction, isSubmitting, handleReact } = useNewsReactions(
    slug,
    initialReactions,
  );

  return (
    <LayoutContainer className="flex flex-col gap-3 py-6 px-4 sm:px-6 rounded-3xl bg-surface border border-border shadow-xs">
      <Text as="p" className="text-xs sm:text-sm font-bold text-text-primary text-center">
        {PUBLIC_NEWS_TEXTS.REACTIONS_TITLE}
      </Text>

      <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {REACTIONS.map((r) => {
          const isSelected = userReaction === r.type;
          const count = reactions[r.type] || 0;

          return (
            <Button
              key={r.type}
              type="button"
              variant="custom"
              size="none"
              onClick={() => handleReact(r.type)}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary/15 border-primary shadow-xs scale-102 font-black text-text-primary ring-1 ring-primary/40'
                  : 'bg-drawer hover:bg-surface-hover border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <Text as="span" className="text-lg select-none">{r.emoji}</Text>
              <LayoutContainer className="flex flex-col text-left">
                <Text as="span" className="text-xs leading-none font-bold">
                  {r.label}
                </Text>
                <Text as="span" className="text-[11px] opacity-75 font-mono">
                  {count}
                </Text>
              </LayoutContainer>
            </Button>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
