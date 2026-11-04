'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LayoutContainer, Text, Button } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { newsService } from '../../services/news.service';

export interface NewsReactionsProps {
  slug: string;
  initialReactions?: {
    wolf?: number;
    fire?: number;
    clap?: number;
    heart?: number;
  };
}

type ReactionType = 'wolf' | 'fire' | 'clap' | 'heart';

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
  const [reactions, setReactions] = useState({
    wolf: initialReactions?.wolf || 0,
    fire: initialReactions?.fire || 0,
    clap: initialReactions?.clap || 0,
    heart: initialReactions?.heart || 0,
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`pelotas_reaction_${slug}`);
      if (stored && ['wolf', 'fire', 'clap', 'heart'].includes(stored)) {
        setUserReaction(stored as ReactionType);
      }
    }
  }, [slug]);

  const handleReact = async (type: ReactionType) => {
    if (userReaction === type) {
      toast('Você já reagiu a esta matéria!', { icon: '🐺' });
      return;
    }

    if (isSubmitting) return;

    // Atualização otimista
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
    setUserReaction(type);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`pelotas_reaction_${slug}`, type);
    }

    try {
      setIsSubmitting(true);
      const res = await newsService.reactToNews(slug, type);
      if (res?.reactions) {
        setReactions(res.reactions);
      }
    } catch {
      // Reversão silenciosa caso haja erro de rede
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary/15 border-primary shadow-xs scale-102 font-black text-text-primary'
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
