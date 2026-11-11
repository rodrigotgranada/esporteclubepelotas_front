'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { pollService } from '../services/poll.service';
import { Poll } from '../types/poll.types';
import { POLL_TEXTS } from '../constants/poll.constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export function useClubPoll() {
  const { user, token } = useAuthStore();
  const isAuthenticated = Boolean(token && user);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVoting, setIsVoting] = useState<boolean>(false);

  const fetchActivePoll = useCallback(async () => {
    try {
      setIsLoading(true);
      const activePoll = await pollService.getActivePoll();
      setPoll(activePoll);
      if (activePoll?.userVotedOptionId) {
        setSelectedOptionId(activePoll.userVotedOptionId);
      }
    } catch (err) {
      console.error('Erro ao buscar enquete ativa:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivePoll();
  }, [fetchActivePoll, isAuthenticated]);

  useRealtimeEvents('polls', () => {
    fetchActivePoll();
  });

  // Determinar se o usuário tem privilégio de sócio
  const roleName = (typeof user?.role === 'string' ? user.role : user?.role?.name || '').toUpperCase();
  const isMember =
    roleName.includes('SOCIO') ||
    roleName.includes('ADMIN') ||
    roleName.includes('OWNER') ||
    Boolean(user?.isSocio);

  const handleVote = async () => {
    if (!poll) return;

    if (!selectedOptionId) {
      toast.error(POLL_TEXTS.SELECT_OPTION_WARNING);
      return;
    }

    try {
      setIsVoting(true);
      const updated = await pollService.vote(poll.id, selectedOptionId);
      setPoll(updated);
      toast.success(POLL_TEXTS.VOTE_SUCCESS);
    } catch (err: unknown) {
      console.error('Erro ao votar:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao registrar voto.';
      toast.error(msg);
    } finally {
      setIsVoting(false);
    }
  };

  return {
    poll,
    isLoading,
    isVoting,
    isAuthenticated,
    isMember,
    selectedOptionId,
    setSelectedOptionId,
    handleVote,
  };
}

