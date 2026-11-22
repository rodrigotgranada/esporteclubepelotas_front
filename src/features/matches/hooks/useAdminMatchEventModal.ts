'use client';

import { useState, useEffect } from 'react';
import { Match, MatchEventType, MatchEventTeam, MatchEventFormData } from '../types/matches.types';
import { AthleteData, footballService } from '@/features/football/services/football.service';

export interface UseAdminMatchEventModalOptions {
  isOpen: boolean;
  match: Match;
  eventType: MatchEventType | null;
  defaultMinute: number;
  onClose: () => void;
  onSubmit: (data: MatchEventFormData) => Promise<void>;
}

export const useAdminMatchEventModal = ({
  isOpen,
  match,
  eventType,
  defaultMinute,
  onClose,
  onSubmit,
}: UseAdminMatchEventModalOptions) => {
  const [athletes, setAthletes] = useState<AthleteData[]>([]);
  const [playerAthleteId, setPlayerAthleteId] = useState<string>('');
  const [playerOutAthleteId, setPlayerOutAthleteId] = useState<string>('');
  const [minute, setMinute] = useState<number>(defaultMinute || 0);
  const [minuteExtra, setMinuteExtra] = useState<string>('');
  const [team, setTeam] = useState<MatchEventTeam>('PELOTAS');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerOutName, setPlayerOutName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && athletes.length === 0) {
      footballService
        .getAthletes({ athleteType: 'PROFESSIONAL', limit: 50 })
        .then((res) => setAthletes(res.data || []))
        .catch((err) => console.error('Erro ao carregar atletas para súmula:', err));
    }
  }, [isOpen, athletes.length]);

  useEffect(() => {
    if (isOpen && eventType) {
      setError(null);
      setMinute(defaultMinute || 0);
      setMinuteExtra('');
      setPlayerAthleteId('');
      setPlayerOutAthleteId('');
      setPlayerName('');
      setPlayerOutName('');
      setCommentText('');

      if (eventType === 'GOAL_OPPONENT') {
        setTeam('OPPONENT');
      } else {
        setTeam('PELOTAS');
      }
    }
  }, [isOpen, eventType, defaultMinute]);

  const handleSelectAthlete = (id: string) => {
    setPlayerAthleteId(id);
    if (id) {
      const found = athletes.find((a) => a.id === id || a._id === id);
      if (found) {
        setPlayerName(found.nickname || found.name);
      }
    }
  };

  const handleSelectOutAthlete = (id: string) => {
    setPlayerOutAthleteId(id);
    if (id) {
      const found = athletes.find((a) => a.id === id || a._id === id);
      if (found) {
        setPlayerOutName(found.nickname || found.name);
      }
    }
  };

  const getEventTitle = () => {
    switch (eventType) {
      case 'GOAL_PELOTAS':
        return '⚽ Lançar Gol do Pelotas';
      case 'GOAL_OPPONENT':
        return `⚽ Lançar Gol do ${match.opponentName}`;
      case 'YELLOW_CARD':
        return '🟨 Aplicar Cartão Amarelo';
      case 'RED_CARD':
        return '🟥 Aplicar Cartão Vermelho';
      case 'SUBSTITUTION':
        return '🔄 Registrar Substituição';
      default:
        return '💬 Lançar Comentário / Lance';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType) return;
    if (minute < 0) {
      setError('O minuto deve ser maior ou igual a 0.');
      return;
    }

    const payload: MatchEventFormData = {
      minute: Number(minute),
      minuteExtra: minuteExtra.trim() ? Number(minuteExtra) : undefined,
      eventType,
      team,
      playerAthleteId: team === 'PELOTAS' && playerAthleteId ? playerAthleteId : undefined,
      playerOutAthleteId: team === 'PELOTAS' && playerOutAthleteId ? playerOutAthleteId : undefined,
      playerName: playerName.trim() || undefined,
      playerOutName: playerOutName.trim() || undefined,
      description: commentText.trim() || undefined,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch {
      setError('Erro ao salvar lance. Tente novamente.');
    }
  };

  return {
    athletes,
    playerAthleteId,
    playerOutAthleteId,
    minute,
    setMinute,
    minuteExtra,
    setMinuteExtra,
    team,
    setTeam,
    playerName,
    setPlayerName,
    playerOutName,
    setPlayerOutName,
    commentText,
    setCommentText,
    error,
    handleSelectAthlete,
    handleSelectOutAthlete,
    getEventTitle,
    handleSubmit,
  };
};

