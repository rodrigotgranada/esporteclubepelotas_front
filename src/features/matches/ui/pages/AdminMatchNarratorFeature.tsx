'use client';

import React from 'react';
import Link from 'next/link';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Button,
  Badge,
} from '@/shared/ui/components/atoms';
import {
  Trophy,
  Play,
  Pause,
  Square,
  Clock,
  ArrowLeft,
  Trash2,
  Radio,
  Repeat,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../../constants/matches.constants';
import { useAdminMatchNarrator } from '../../hooks/useAdminMatchNarrator';
import { AdminMatchEventModal } from '../components/admin/AdminMatchEventModal';
import { MatchEventType, MatchEvent } from '../../types/matches.types';

export interface AdminMatchNarratorFeatureProps {
  matchId: string;
}

export const AdminMatchNarratorFeature: React.FC<AdminMatchNarratorFeatureProps> = ({ matchId }) => {
  const { NARRATOR_PANEL } = MATCHES_CONSTANTS.ADMIN;

  const {
    match,
    events,
    currentPeriod,
    isTimerRunning,
    elapsedDisplayMinute,
    isLoading,
    isActionLoading,
    isEventModalOpen,
    activeEventType,
    isSavingEvent,
    handleOpenAddEvent,
    handleCloseAddEvent,
    handleSubmitEvent,
    eventToDelete,
    setEventToDelete,
    isDeletingEvent,
    handleConfirmDeleteEvent,
    handleExecuteAction,
  } = useAdminMatchNarrator({ matchId });

  if (isLoading) {
    return (
      <LayoutContainer className="p-8 text-center space-y-3">
        <LayoutContainer className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        <Text className="text-sm text-text-muted">Carregando Painel do Narrador...</Text>
      </LayoutContainer>
    );
  }

  if (!match) {
    return (
      <LayoutContainer className="p-8 text-center space-y-4">
        <Title level="h3" className="text-xl font-bold text-text-primary">
          Partida não encontrada
        </Title>
        <Link href="/gestao/jogos">
          <Button variant="outline" size="sm">
            {NARRATOR_PANEL.BTN_BACK_MATCHES}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  const isPelotasHome = match.homeAway === 'HOME';
  const pelotasLogo = '/images/pelotas-logo.png';
  const opponentLogo = match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE;

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'FIRST_HALF':
        return NARRATOR_PANEL.PERIOD_FIRST_HALF;
      case 'HALF_TIME':
        return NARRATOR_PANEL.PERIOD_HALF_TIME;
      case 'SECOND_HALF':
        return NARRATOR_PANEL.PERIOD_SECOND_HALF;
      case 'FINISHED':
        return NARRATOR_PANEL.PERIOD_FINISHED;
      default:
        return NARRATOR_PANEL.PERIOD_PRE_MATCH;
    }
  };

  const getEventIcon = (type: MatchEventType) => {
    switch (type) {
      case 'GOAL_PELOTAS':
      case 'GOAL_OPPONENT':
        return <span className="text-base">⚽</span>;
      case 'YELLOW_CARD':
        return <span className="text-base">🟨</span>;
      case 'RED_CARD':
        return <span className="text-base">🟥</span>;
      case 'SUBSTITUTION':
        return <Repeat size={16} className="text-secondary" />;
      case 'DANGEROUS_ATTACK':
        return <AlertCircle size={16} className="text-orange-400" />;
      default:
        return <MessageSquare size={16} className="text-text-muted" />;
    }
  };

  return (
    <LayoutContainer className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Barra de Topo com Navegação */}
      <LayoutContainer className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <LayoutContainer className="flex items-center gap-3">
          <Link href="/gestao/jogos">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              Partidas
            </Button>
          </Link>
          <LayoutContainer>
            <Title level="h2" className="text-xl font-black text-text-primary flex items-center gap-2">
              <Radio size={20} className="text-secondary animate-pulse" />
              {NARRATOR_PANEL.TITLE}
            </Title>
            <Text className="text-xs text-text-muted">
              {match.championshipName || 'Campeonato'} • {match.roundName}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <Badge
          variant="default"
          className="bg-secondary/15 text-secondary border border-secondary/40 text-xs font-bold px-3 py-1"
        >
          {getPeriodLabel(currentPeriod)}
        </Badge>
      </LayoutContainer>

      {/* Card Monumental do Placar & Cronômetro */}
      <LayoutContainer className="p-6 rounded-2xl bg-surface/70 border border-secondary/30 shadow-xl space-y-6">
        {/* Cronômetro e Período Central */}
        <LayoutContainer className="flex flex-col items-center justify-center text-center space-y-1.5">
          <LayoutContainer className="flex items-center gap-2">
            <Clock size={16} className={isTimerRunning ? 'text-secondary animate-spin' : 'text-text-muted'} />
            <Text className="text-xs font-extrabold uppercase tracking-widest text-text-secondary">
              {getPeriodLabel(currentPeriod)}
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-center">
            <span className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight font-mono">
              {elapsedDisplayMinute}&apos;
            </span>
          </LayoutContainer>
        </LayoutContainer>

        {/* Placar Oficial em Números Gigantes */}
        <LayoutContainer className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 max-w-2xl mx-auto">
          {/* Lado Esquerdo: Pelotas */}
          <LayoutContainer className="flex flex-col items-center text-center space-y-2">
            <LayoutContainer className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface border border-border flex items-center justify-center p-2 shadow-md">
              <SafeImage
                src={pelotasLogo}
                alt="Pelotas"
                width={56}
                height={56}
                className="object-contain max-h-14 max-w-14"
              />
            </LayoutContainer>
            <Text className="text-sm sm:text-base font-black text-text-primary">
              Pelotas
            </Text>
            <span className="text-4xl sm:text-6xl font-black text-secondary">
              {match.pelotasScore ?? 0}
            </span>
          </LayoutContainer>

          {/* Divisor X */}
          <LayoutContainer className="flex flex-col items-center justify-center pt-8">
            <span className="text-xl sm:text-2xl font-black text-text-muted">
              X
            </span>
            <Text className="text-[11px] text-text-muted mt-2">
              {match.stadiumName}
            </Text>
          </LayoutContainer>

          {/* Lado Direito: Adversário */}
          <LayoutContainer className="flex flex-col items-center text-center space-y-2">
            <LayoutContainer className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface border border-border flex items-center justify-center p-2 shadow-md">
              <SafeImage
                src={opponentLogo}
                alt={match.opponentName}
                width={56}
                height={56}
                className="object-contain max-h-14 max-w-14"
              />
            </LayoutContainer>
            <Text className="text-sm sm:text-base font-black text-text-primary line-clamp-1">
              {match.opponentName}
            </Text>
            <span className="text-4xl sm:text-6xl font-black text-secondary">
              {match.opponentScore ?? 0}
            </span>
          </LayoutContainer>
        </LayoutContainer>

        {/* Botões de Ação de Ciclo de Partida */}
        <LayoutContainer className="pt-4 border-t border-border/50 flex flex-wrap items-center justify-center gap-3">
          {currentPeriod === 'PRE_MATCH' && (
            <Button
              type="button"
              variant="primary"
              disabled={isActionLoading}
              onClick={() => handleExecuteAction('START_FIRST_HALF')}
              className="bg-secondary text-primary hover:bg-secondary-hover font-black px-6 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-2"
            >
              <Play size={16} />
              {NARRATOR_PANEL.ACTION_START_1H}
            </Button>
          )}

          {currentPeriod === 'FIRST_HALF' && (
            <Button
              type="button"
              variant="outline"
              disabled={isActionLoading}
              onClick={() => handleExecuteAction('END_FIRST_HALF')}
              className="border-secondary/60 text-secondary hover:bg-secondary/15 font-bold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-2"
            >
              <Pause size={16} />
              {NARRATOR_PANEL.ACTION_END_1H}
            </Button>
          )}

          {currentPeriod === 'HALF_TIME' && (
            <Button
              type="button"
              variant="primary"
              disabled={isActionLoading}
              onClick={() => handleExecuteAction('START_SECOND_HALF')}
              className="bg-secondary text-primary hover:bg-secondary-hover font-black px-6 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-2"
            >
              <Play size={16} />
              {NARRATOR_PANEL.ACTION_START_2H}
            </Button>
          )}

          {currentPeriod === 'SECOND_HALF' && (
            <Button
              type="button"
              variant="custom"
              size="none"
              disabled={isActionLoading}
              onClick={() => handleExecuteAction('FINISH_MATCH')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-2 text-sm"
            >
              <Square size={16} />
              {NARRATOR_PANEL.ACTION_FINISH_MATCH}
            </Button>
          )}

          {currentPeriod === 'FINISHED' && (
            <Badge
              variant="default"
              className="bg-secondary text-primary font-black px-4 py-1.5 rounded-full text-xs uppercase shadow-sm"
            >
              Partida Finalizada
            </Badge>
          )}
        </LayoutContainer>
      </LayoutContainer>

      {/* Botões de Lance Rápido (Simplificados conforme orientação) */}
      <LayoutContainer className="p-5 rounded-2xl bg-surface/40 border border-border/70 space-y-3">
        <LayoutContainer className="flex items-center justify-between">
          <Text className="text-xs font-black uppercase tracking-wider text-text-secondary">
            {NARRATOR_PANEL.QUICK_ACTIONS_TITLE}
          </Text>
          <Text className="text-[11px] text-text-muted">
            Clique no lance para abrir e lançar
          </Text>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Gol do Pelotas */}
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => handleOpenAddEvent('GOAL_PELOTAS')}
            className="p-3 rounded-xl bg-secondary text-primary hover:bg-secondary-hover font-black text-xs text-center cursor-pointer shadow-sm transition-transform active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg">⚽</span>
            <span>Gol do Pelotas</span>
          </Button>

          {/* Gol do Adversário */}
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => handleOpenAddEvent('GOAL_OPPONENT')}
            className="p-3 rounded-xl bg-surface border border-border hover:border-secondary/60 text-text-primary font-bold text-xs text-center cursor-pointer shadow-2xs transition-transform active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg">⚽</span>
            <span className="line-clamp-1">Gol {match.opponentName}</span>
          </Button>

          {/* Cartão Amarelo */}
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => handleOpenAddEvent('YELLOW_CARD')}
            className="p-3 rounded-xl bg-surface border border-yellow-500/40 hover:bg-yellow-500/10 text-text-primary font-bold text-xs text-center cursor-pointer transition-transform active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg">🟨</span>
            <span>Cartão Amarelo</span>
          </Button>

          {/* Cartão Vermelho */}
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => handleOpenAddEvent('RED_CARD')}
            className="p-3 rounded-xl bg-surface border border-orange-500/40 hover:bg-orange-500/10 text-text-primary font-bold text-xs text-center cursor-pointer transition-transform active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <span className="text-lg">🟥</span>
            <span>Cartão Vermelho</span>
          </Button>

          {/* Substituição */}
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => handleOpenAddEvent('SUBSTITUTION')}
            className="p-3 rounded-xl bg-surface border border-secondary/40 hover:bg-secondary/10 text-text-primary font-bold text-xs text-center cursor-pointer transition-transform active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <Repeat size={18} className="text-secondary" />
            <span>Substituição</span>
          </Button>

          {/* Comentário Geral */}
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => handleOpenAddEvent('GENERAL_TEXT')}
            className="p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover text-text-secondary font-bold text-xs text-center cursor-pointer transition-transform active:scale-95 flex flex-col items-center justify-center gap-1"
          >
            <MessageSquare size={18} className="text-text-muted" />
            <span>Comentário</span>
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Linha do Tempo dos Lances Já Narrados */}
      <LayoutContainer className="space-y-4">
        <LayoutContainer className="flex items-center justify-between border-b border-border/60 pb-2">
          <Title level="h3" className="text-sm font-black uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Trophy size={16} className="text-secondary" />
            {NARRATOR_PANEL.TIMELINE_TITLE} ({events.length})
          </Title>
        </LayoutContainer>

        {events.length === 0 ? (
          <LayoutContainer className="p-8 text-center rounded-2xl bg-surface/30 border border-border/50 space-y-2">
            <Text className="text-xs text-text-muted">
              {NARRATOR_PANEL.EMPTY_EVENTS}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="space-y-2.5">
            {events.map((event: MatchEvent) => (
              <LayoutContainer
                key={event.id}
                className="p-3.5 rounded-xl bg-surface/60 border border-border/70 flex items-start justify-between gap-3 hover:border-secondary/40 transition-colors shadow-2xs"
              >
                <LayoutContainer className="flex items-start gap-3 min-w-0">
                  {/* Minuto Badge */}
                  <LayoutContainer className="px-2 py-1 rounded-lg bg-surface-hover border border-border font-mono font-black text-xs text-secondary shrink-0">
                    {event.formattedMinute}
                  </LayoutContainer>

                  {/* Ícone */}
                  <LayoutContainer className="pt-0.5 shrink-0">
                    {getEventIcon(event.eventType)}
                  </LayoutContainer>

                  {/* Detalhes do Lance */}
                  <LayoutContainer className="min-w-0 space-y-0.5">
                    <Text className="text-xs font-bold text-text-primary line-clamp-1">
                      {event.title}
                    </Text>

                    {event.description && (
                      <Text className="text-xs text-text-secondary line-clamp-2">
                        {event.description}
                      </Text>
                    )}

                    {event.playerName && (
                      <LayoutContainer className="flex items-center gap-1.5 pt-0.5">
                        {event.playerPhotoUrl && (
                          <SafeImage
                            src={event.playerPhotoUrl}
                            alt={event.playerName}
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full object-cover border border-secondary/30"
                          />
                        )}
                        <Text className="text-[11px] text-text-muted">
                          Atleta: <span className="font-semibold text-text-secondary">{event.playerName}</span>
                        </Text>
                      </LayoutContainer>
                    )}
                  </LayoutContainer>
                </LayoutContainer>

                {/* Botão de Excluir Lance */}
                <Button
                  type="button"
                  variant="ghost"
                  size="none"
                  onClick={() => setEventToDelete(event)}
                  className="p-1.5 text-text-muted hover:text-orange-500 hover:bg-orange-500/10 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Excluir lance"
                >
                  <Trash2 size={15} />
                </Button>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Modal de Lançamento de Lance */}
      {isEventModalOpen && (
        <AdminMatchEventModal
          isOpen={isEventModalOpen}
          match={match}
          eventType={activeEventType}
          defaultMinute={elapsedDisplayMinute}
          onClose={handleCloseAddEvent}
          onSubmit={handleSubmitEvent}
          isSaving={isSavingEvent}
        />
      )}

      {/* Modal de Confirmação de Exclusão de Lance */}
      {eventToDelete && (
        <Modal isOpen={Boolean(eventToDelete)} onClose={() => setEventToDelete(null)} size="sm">
          <LayoutContainer className="space-y-4 pt-1">
            <Title level="h3" className="text-lg font-bold text-text-primary">
              {NARRATOR_PANEL.DELETE_EVENT_TITLE}
            </Title>
            <Text className="text-sm text-text-muted">
              {NARRATOR_PANEL.DELETE_EVENT_CONFIRM}
            </Text>
            <LayoutContainer className="flex items-center justify-end space-x-2 pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEventToDelete(null)}
                disabled={isDeletingEvent}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmDeleteEvent}
                disabled={isDeletingEvent}
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-4 cursor-pointer"
              >
                {isDeletingEvent ? 'Excluindo...' : 'Sim, Excluir Lance'}
              </Button>
            </LayoutContainer>
          </LayoutContainer>
        </Modal>
      )}
    </LayoutContainer>
  );
};
