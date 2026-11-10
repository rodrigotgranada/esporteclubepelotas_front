'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Input,
  Button,
  Badge,
  Select,
  Option,
} from '@/shared/ui/components';
import { Match, MatchEventType, MatchEventTeam, MatchEventFormData } from '../../../types/matches.types';
import { MATCHES_CONSTANTS } from '../../../constants/matches.constants';
import { AthleteData, footballService } from '@/features/football/services/football.service';

export interface AdminMatchEventModalProps {
  isOpen: boolean;
  match: Match;
  eventType: MatchEventType | null;
  defaultMinute: number;
  onClose: () => void;
  onSubmit: (data: MatchEventFormData) => Promise<void>;
  isSaving: boolean;
}

export const AdminMatchEventModal: React.FC<AdminMatchEventModalProps> = ({
  isOpen,
  match,
  eventType,
  defaultMinute,
  onClose,
  onSubmit,
  isSaving,
}) => {
  const { NARRATOR_PANEL } = MATCHES_CONSTANTS.ADMIN;

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
      footballService.getAthletes({ athleteType: 'PROFESSIONAL', limit: 50 })
        .then((res) => setAthletes(res.data || []))
        .catch((err) => console.error('Erro ao carregar atletas para súmula:', err));
    }
  }, [isOpen, athletes.length]);

  // Inicializa o formulário com base no tipo de evento clicado
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

      if (eventType === 'GOAL_PELOTAS') {
        setTeam('PELOTAS');
      } else if (eventType === 'GOAL_OPPONENT') {
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

  if (!isOpen || !eventType) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="space-y-4">
        {/* Cabeçalho */}
        <LayoutContainer className="border-b border-border/60 pb-3 flex items-center justify-between">
          <LayoutContainer>
            <Title level="h3" className="text-lg font-black text-text-primary">
              {getEventTitle()}
            </Title>
            <Text className="text-xs text-text-muted mt-0.5">
              Pelotas vs {match.opponentName}
            </Text>
          </LayoutContainer>
          <Badge
            variant="default"
            className="text-[10px] uppercase font-black bg-secondary text-primary px-2.5 py-0.5 rounded-full border-0"
          >
            Lance Ao Vivo
          </Badge>
        </LayoutContainer>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Minuto e Acréscimo */}
          <LayoutContainer className="grid grid-cols-2 gap-3">
            <LayoutContainer className="space-y-1">
              <Text className="text-xs font-semibold text-text-secondary">
                {NARRATOR_PANEL.LABEL_MINUTE}
              </Text>
              <Input
                type="number"
                min={0}
                max={130}
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                required
              />
            </LayoutContainer>

            <LayoutContainer className="space-y-1">
              <Text className="text-xs font-semibold text-text-secondary">
                {NARRATOR_PANEL.LABEL_EXTRA_MINUTE}
              </Text>
              <Input
                type="number"
                min={1}
                max={20}
                placeholder="Ex: 3"
                value={minuteExtra}
                onChange={(e) => setMinuteExtra(e.target.value)}
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Seleção de Time (para cartões e substituições) */}
          {(eventType === 'YELLOW_CARD' || eventType === 'RED_CARD' || eventType === 'SUBSTITUTION') && (
            <LayoutContainer className="space-y-1.5">
              <Text className="text-xs font-semibold text-text-secondary">
                {NARRATOR_PANEL.LABEL_TEAM}
              </Text>
              <LayoutContainer className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="custom"
                  size="none"
                  onClick={() => setTeam('PELOTAS')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    team === 'PELOTAS'
                      ? 'border-secondary bg-secondary text-primary font-black shadow-xs ring-1 ring-secondary/50'
                      : 'border-border/70 bg-surface/40 text-text-muted hover:bg-surface/80'
                  }`}
                >
                  Pelotas
                </Button>
                <Button
                  type="button"
                  variant="custom"
                  size="none"
                  onClick={() => setTeam('OPPONENT')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    team === 'OPPONENT'
                      ? 'border-secondary bg-secondary text-primary font-black shadow-xs ring-1 ring-secondary/50'
                      : 'border-border/70 bg-surface/40 text-text-muted hover:bg-surface/80'
                  }`}
                >
                  {match.opponentName}
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          )}

          {/* Campos específicos por evento */}
          {(eventType === 'GOAL_PELOTAS' || eventType === 'GOAL_OPPONENT') && (
            <LayoutContainer className="space-y-1.5">
              <Text className="text-xs font-semibold text-text-secondary">
                Autor do Gol (Opcional)
              </Text>
              {eventType === 'GOAL_PELOTAS' && athletes.length > 0 && (
                <Select
                  value={playerAthleteId}
                  onChange={(e) => handleSelectAthlete(e.target.value)}
                  className="w-full text-xs font-semibold mb-1"
                >
                  <Option value="">Selecione atleta do Pelotas...</Option>
                  {athletes.map((a) => (
                    <Option key={a.id || a._id} value={a.id || a._id}>
                      {a.name} {a.nickname ? `(${a.nickname})` : ''} - {a.primaryPosition}
                    </Option>
                  ))}
                </Select>
              )}
              <Input
                placeholder="Ex: Walter, Igor Silva..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                autoFocus
              />
            </LayoutContainer>
          )}

          {(eventType === 'YELLOW_CARD' || eventType === 'RED_CARD') && (
            <LayoutContainer className="space-y-1.5">
              <Text className="text-xs font-semibold text-text-secondary">
                {NARRATOR_PANEL.LABEL_PLAYER}
              </Text>
              {team === 'PELOTAS' && athletes.length > 0 && (
                <Select
                  value={playerAthleteId}
                  onChange={(e) => handleSelectAthlete(e.target.value)}
                  className="w-full text-xs font-semibold mb-1"
                >
                  <Option value="">Selecione atleta do Pelotas...</Option>
                  {athletes.map((a) => (
                    <Option key={a.id || a._id} value={a.id || a._id}>
                      {a.name} {a.nickname ? `(${a.nickname})` : ''} - {a.primaryPosition}
                    </Option>
                  ))}
                </Select>
              )}
              <Input
                placeholder="Ex: Nome do jogador que recebeu o cartão"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                autoFocus
              />
            </LayoutContainer>
          )}

          {eventType === 'SUBSTITUTION' && (
            <LayoutContainer className="space-y-3">
              <LayoutContainer className="space-y-1.5">
                <Text className="text-xs font-semibold text-text-secondary">
                  {NARRATOR_PANEL.LABEL_PLAYER_OUT}
                </Text>
                {team === 'PELOTAS' && athletes.length > 0 && (
                  <Select
                    value={playerOutAthleteId}
                    onChange={(e) => handleSelectOutAthlete(e.target.value)}
                    className="w-full text-xs font-semibold mb-1"
                  >
                    <Option value="">Selecione quem sai...</Option>
                    {athletes.map((a) => (
                      <Option key={a.id || a._id} value={a.id || a._id}>
                        {a.name} {a.nickname ? `(${a.nickname})` : ''} - {a.primaryPosition}
                      </Option>
                    ))}
                  </Select>
                )}
                <Input
                  placeholder="Nome de quem está saindo..."
                  value={playerOutName}
                  onChange={(e) => setPlayerOutName(e.target.value)}
                  autoFocus
                />
              </LayoutContainer>

              <LayoutContainer className="space-y-1.5">
                <Text className="text-xs font-semibold text-text-secondary">
                  {NARRATOR_PANEL.LABEL_PLAYER_IN}
                </Text>
                {team === 'PELOTAS' && athletes.length > 0 && (
                  <Select
                    value={playerAthleteId}
                    onChange={(e) => handleSelectAthlete(e.target.value)}
                    className="w-full text-xs font-semibold mb-1"
                  >
                    <Option value="">Selecione quem entra...</Option>
                    {athletes.map((a) => (
                      <Option key={a.id || a._id} value={a.id || a._id}>
                        {a.name} {a.nickname ? `(${a.nickname})` : ''} - {a.primaryPosition}
                      </Option>
                    ))}
                  </Select>
                )}
                <Input
                  placeholder="Nome de quem está entrando..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </LayoutContainer>
            </LayoutContainer>
          )}

          {/* Comentário / Descrição (Opcional para todos) */}
          <LayoutContainer className="space-y-1">
            <Text className="text-xs font-semibold text-text-secondary">
              {NARRATOR_PANEL.LABEL_COMMENT}
            </Text>
            <Input
              placeholder={
                eventType === 'GENERAL_TEXT'
                  ? 'Descreva o lance que acabou de acontecer...'
                  : 'Detalhes adicionais do lance (opcional)...'
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus={eventType === 'GENERAL_TEXT'}
            />
          </LayoutContainer>

          {/* Erro */}
          {error && (
            <Text className="text-xs text-orange-500 font-semibold block">
              {error}
            </Text>
          )}

          {/* Rodapé com Botões */}
          <LayoutContainer className="flex items-center justify-end space-x-2 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer"
            >
              {NARRATOR_PANEL.BTN_CANCEL}
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-5 cursor-pointer shadow-sm"
            >
              {isSaving ? 'Lançando...' : NARRATOR_PANEL.BTN_CONFIRM_EVENT}
            </Button>
          </LayoutContainer>
        </form>
      </LayoutContainer>
    </Modal>
  );
};

