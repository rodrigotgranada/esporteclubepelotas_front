'use client';

import React from 'react';
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
import { Match, MatchEventType, MatchEventFormData } from '../../../types/matches.types';
import { MATCHES_CONSTANTS } from '../../../constants/matches.constants';
import { useAdminMatchEventModal } from '../../../hooks/useAdminMatchEventModal';

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

  const {
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
  } = useAdminMatchEventModal({
    isOpen,
    match,
    eventType,
    defaultMinute,
    onClose,
    onSubmit,
  });

  if (!isOpen || !eventType) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="space-y-4">
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

          {error && (
            <Text className="text-xs text-orange-500 font-semibold block">
              {error}
            </Text>
          )}

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
