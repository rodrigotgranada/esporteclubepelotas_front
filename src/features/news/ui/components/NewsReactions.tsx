'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LayoutContainer, Text, Button } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { newsService, ReactionType } from '../../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';

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
  const { user } = useAuthStore();
  const [reactions, setReactions] = useState({
    wolf: initialReactions?.wolf || 0,
    fire: initialReactions?.fire || 0,
    clap: initialReactions?.clap || 0,
    heart: initialReactions?.heart || 0,
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincroniza a reação do usuário com o backend caso esteja logado
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setUserReaction(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`pelotas_reaction_${slug}`);
      }
      return;
    }

    newsService
      .getMyReaction(slug)
      .then((res) => {
        if (isMounted) {
          const current = res?.userReaction ?? null;
          setUserReaction(current);
          if (typeof window !== 'undefined') {
            if (current) {
              localStorage.setItem(`pelotas_reaction_${slug}`, current);
            } else {
              localStorage.removeItem(`pelotas_reaction_${slug}`);
            }
          }
        }
      })
      .catch(() => {
        // Fallback local se a rota ainda não respondeu
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(`pelotas_reaction_${slug}`);
          if (stored && ['wolf', 'fire', 'clap', 'heart'].includes(stored)) {
            setUserReaction(stored as ReactionType);
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, user]);

  const handleReact = async (type: ReactionType) => {
    // 1. Apenas usuários logados podem reagir
    if (!user) {
      toast(PUBLIC_NEWS_TEXTS.REACTION_LOGIN_REQUIRED, { icon: '🐺' });
      return;
    }

    // 2. A conta do usuário tem que estar ativa (confirmada)
    if (user.status !== 'ACTIVE' || user.isActive === false) {
      toast.error(PUBLIC_NEWS_TEXTS.REACTION_INACTIVE_ACCOUNT);
      return;
    }

    if (isSubmitting) return;

    // 3. Atualização otimista sem duplicações infinitas
    const previousReaction = userReaction;
    const isTogglingOff = previousReaction === type;
    const nextReaction: ReactionType | null = isTogglingOff ? null : type;

    setReactions((prev) => {
      const updated = { ...prev };
      if (previousReaction) {
        updated[previousReaction] = Math.max(0, updated[previousReaction] - 1);
      }
      if (nextReaction) {
        updated[nextReaction] = (updated[nextReaction] || 0) + 1;
      }
      return updated;
    });
    setUserReaction(nextReaction);

    if (typeof window !== 'undefined') {
      if (nextReaction) {
        localStorage.setItem(`pelotas_reaction_${slug}`, nextReaction);
      } else {
        localStorage.removeItem(`pelotas_reaction_${slug}`);
        toast(PUBLIC_NEWS_TEXTS.REACTION_TOGGLED_OFF, { icon: '🐺' });
      }
    }

    // 4. Chamada autoritativa ao Backend
    try {
      setIsSubmitting(true);
      const res = await newsService.reactToNews(slug, type);
      if (res?.reactions) {
        setReactions(res.reactions);
      }
      setUserReaction(res?.userReaction ?? null);
      if (typeof window !== 'undefined') {
        if (res?.userReaction) {
          localStorage.setItem(`pelotas_reaction_${slug}`, res.userReaction);
        } else {
          localStorage.removeItem(`pelotas_reaction_${slug}`);
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao registrar reação.';
      toast.error(msg);
      // Reversão em caso de erro
      setUserReaction(previousReaction);
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
