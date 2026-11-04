'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PUBLIC_NEWS_TEXTS } from '../constants/news.constants';
import { newsService, ReactionType } from '../services/news.service';
import { useAuthStore } from '@/store/useAuthStore';

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

    if (isSubmitting) return;

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
      setUserReaction(previousReaction);
    } finally {
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
