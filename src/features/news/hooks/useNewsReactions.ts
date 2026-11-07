'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { PUBLIC_NEWS_TEXTS } from '../constants/news.constants';
import { newsService, ReactionType } from '../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useNewsReactions = (
  slug: string,
  initialReactions?: {
    wolf?: number;
    fire?: number;
    clap?: number;
    heart?: number;
  },
) => {
  const { user } = useAuthStore();
  const [reactions, setReactions] = useState({
    wolf: initialReactions?.wolf || 0,
    fire: initialReactions?.fire || 0,
    clap: initialReactions?.clap || 0,
    heart: initialReactions?.heart || 0,
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightRef = useRef(false);

  const syncArticleReactions = useCallback(async () => {
    try {
      const article = await newsService.getNewsBySlug(slug);
      if (article?.reactions) {
        setReactions({
          wolf: article.reactions.wolf || 0,
          fire: article.reactions.fire || 0,
          clap: article.reactions.clap || 0,
          heart: article.reactions.heart || 0,
        });
      }
    } catch {
      // Silencioso em background
    }
  }, [slug]);

  useRealtimeEvents('news-reactions', (event) => {
    if (!event.entityId || event.entityId === slug) {
      syncArticleReactions();
    }
  });

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
    if (!user) {
      toast(PUBLIC_NEWS_TEXTS.REACTION_LOGIN_REQUIRED, { icon: '🐺' });
      return;
    }

    if (user.status !== 'ACTIVE' || user.isActive === false) {
      toast.error(PUBLIC_NEWS_TEXTS.REACTION_INACTIVE_ACCOUNT);
      return;
    }

    if (inFlightRef.current || isSubmitting) return;

    const wasTogglingOff = userReaction === type;
    inFlightRef.current = true;

    try {
      setIsSubmitting(true);
      const res = await newsService.reactToNews(slug, type);
      if (res?.reactions) {
        setReactions(res.reactions);
      }
      const confirmedReaction = res?.userReaction ?? null;
      setUserReaction(confirmedReaction);

      if (typeof window !== 'undefined') {
        if (confirmedReaction) {
          localStorage.setItem(`pelotas_reaction_${slug}`, confirmedReaction);
        } else {
          localStorage.removeItem(`pelotas_reaction_${slug}`);
        }
      }

      if (wasTogglingOff && !confirmedReaction) {
        toast(PUBLIC_NEWS_TEXTS.REACTION_TOGGLED_OFF, { icon: '🐺' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao registrar reação.';
      toast.error(msg);
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    reactions,
    userReaction,
    isSubmitting,
    handleReact,
  };
};
