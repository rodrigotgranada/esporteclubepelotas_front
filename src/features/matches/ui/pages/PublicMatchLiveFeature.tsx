'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components/atoms';
import {
  Radio,
  Clock,
  ArrowLeft,
  Repeat,
  AlertCircle,
  MessageSquare,
  Tv,
  MapPin,
  Calendar,
} from 'lucide-react';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../../constants/matches.constants';
import { usePublicMatchLive } from '../../hooks/usePublicMatchLive';
import { MatchEventType, MatchEvent } from '../../types/matches.types';

export interface PublicMatchLiveFeatureProps {
  slugOrId: string;
}

export const PublicMatchLiveFeature: React.FC<PublicMatchLiveFeatureProps> = ({ slugOrId }) => {
  const { PUBLIC_LIVE, NARRATOR_PANEL } = MATCHES_CONSTANTS.ADMIN;

  const {
    match,
    events,
    currentPeriod,
    isTimerRunning,
    elapsedDisplayMinute,
    isLoading,
  } = usePublicMatchLive({ slugOrId });

  if (isLoading) {
    return (
      <LayoutContainer className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <LayoutContainer className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        <Text className="text-sm text-text-muted">Conectando à cobertura ao vivo...</Text>
      </LayoutContainer>
    );
  }

  if (!match) {
    return (
      <LayoutContainer className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Title level="h2" className="text-2xl font-bold text-text-primary">
          Partida não encontrada
        </Title>
        <Text className="text-sm text-text-muted">
          Não localizamos nenhuma cobertura ao vivo para esta partida.
        </Text>
        <Link href="/jogos">
          <Button variant="outline" size="sm" className="mt-2">
            {PUBLIC_LIVE.BACK_TO_MATCHES}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  const isPelotasHome = match.homeAway === 'HOME';
  const pelotasLogo = '/images/pelotas-logo.png';
  const opponentLogo = match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE;

  const getStatusBadge = () => {
    switch (match.status) {
      case 'IN_PROGRESS':
        return (
          <Badge
            variant="default"
            className="bg-secondary text-primary font-black px-3 py-1 text-xs uppercase animate-pulse border-secondary shadow-md"
          >
            ● {PUBLIC_LIVE.STATUS_LIVE}
          </Badge>
        );
      case 'FINISHED':
        return (
          <Badge
            variant="default"
            className="bg-surface border border-secondary/40 text-secondary font-black px-3 py-1 text-xs uppercase"
          >
            {PUBLIC_LIVE.STATUS_FIN}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="default"
            className="border-border text-text-muted px-3 py-1 text-xs font-semibold uppercase"
          >
            Agendado
          </Badge>
        );
    }
  };

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
        return <span className="text-base sm:text-lg">⚽</span>;
      case 'YELLOW_CARD':
        return <span className="text-base sm:text-lg">🟨</span>;
      case 'RED_CARD':
        return <span className="text-base sm:text-lg">🟥</span>;
      case 'SUBSTITUTION':
        return <Repeat size={18} className="text-secondary" />;
      case 'DANGEROUS_ATTACK':
        return <AlertCircle size={18} className="text-orange-400" />;
      default:
        return <MessageSquare size={18} className="text-text-muted" />;
    }
  };

  // Helper para extrair embed do YouTube se aplicável
  const getYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1]?.split('&')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.includes('youtube.com/live/')) {
        const id = url.split('youtube.com/live/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(match.transmissionUrl);

  return (
    <LayoutContainer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Voltar e Header da Competição */}
      <LayoutContainer className="flex items-center justify-between gap-3">
        <Link href="/jogos">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            {PUBLIC_LIVE.BACK_TO_MATCHES}
          </Button>
        </Link>

        <LayoutContainer className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-xs font-bold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border/60">
            {getPeriodLabel(currentPeriod)}
          </span>
        </LayoutContainer>
      </LayoutContainer>

      {/* Card Monumental do Placar Ao Vivo */}
      <LayoutContainer className="p-6 sm:p-10 rounded-3xl bg-surface/80 border border-secondary/40 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
        <LayoutContainer className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />

        {/* Cronômetro e Cabeçalho do Confronto */}
        <LayoutContainer className="flex flex-col items-center justify-center text-center space-y-1">
          <Text className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-secondary">
            {match.championshipName || 'Campeonato Oficial'} • {match.roundName}
          </Text>

          <LayoutContainer className="flex items-center gap-2 pt-1">
            <Clock size={18} className={isTimerRunning ? 'text-secondary animate-spin' : 'text-text-muted'} />
            <span className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight font-mono">
              {match.status === 'IN_PROGRESS' ? `${elapsedDisplayMinute}'` : match.status === 'FINISHED' ? 'Fim de Jogo' : 'Em Breve'}
            </span>
          </LayoutContainer>
        </LayoutContainer>

        {/* Placar Oficial com Escudos Grandes */}
        <LayoutContainer className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10 max-w-2xl mx-auto">
          {/* Mandante (ou Pelotas) */}
          <LayoutContainer className="flex flex-col items-center text-center space-y-2">
            <LayoutContainer className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-surface border border-border flex items-center justify-center p-3 shadow-lg">
              <SafeImage
                src={isPelotasHome ? pelotasLogo : opponentLogo}
                alt={isPelotasHome ? 'Pelotas' : match.opponentName}
                width={80}
                height={80}
                className="object-contain max-h-16 sm:max-h-20"
              />
            </LayoutContainer>
            <Text className="text-sm sm:text-lg font-black text-text-primary">
              {isPelotasHome ? 'Pelotas' : match.opponentName}
            </Text>
            <span className="text-5xl sm:text-7xl font-black text-secondary">
              {isPelotasHome ? (match.pelotasScore ?? 0) : (match.opponentScore ?? 0)}
            </span>
          </LayoutContainer>

          {/* Divisor X */}
          <LayoutContainer className="flex flex-col items-center justify-center pt-8">
            <span className="text-2xl sm:text-3xl font-black text-text-muted tracking-widest bg-surface px-3 py-1 rounded-full border border-border/40">
              VS
            </span>
          </LayoutContainer>

          {/* Visitante */}
          <LayoutContainer className="flex flex-col items-center text-center space-y-2">
            <LayoutContainer className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-surface border border-border flex items-center justify-center p-3 shadow-lg">
              <SafeImage
                src={isPelotasHome ? opponentLogo : pelotasLogo}
                alt={isPelotasHome ? match.opponentName : 'Pelotas'}
                width={80}
                height={80}
                className="object-contain max-h-16 sm:max-h-20"
              />
            </LayoutContainer>
            <Text className="text-sm sm:text-lg font-black text-text-primary">
              {isPelotasHome ? match.opponentName : 'Pelotas'}
            </Text>
            <span className="text-5xl sm:text-7xl font-black text-secondary">
              {isPelotasHome ? (match.opponentScore ?? 0) : (match.pelotasScore ?? 0)}
            </span>
          </LayoutContainer>
        </LayoutContainer>

        {/* Informações de Local e Estádio */}
        <LayoutContainer className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
          <LayoutContainer className="flex items-center gap-1.5">
            <MapPin size={15} className="text-secondary" />
            <span>{match.stadiumName} {match.city ? `(${match.city})` : ''}</span>
          </LayoutContainer>
          <LayoutContainer className="flex items-center gap-1.5">
            <Calendar size={15} className="text-secondary" />
            <span>{new Date(match.matchDate).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</span>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Transmissão Oficial Ao Vivo (Embed do YouTube ou Link) */}
      {match.transmissionUrl && (
        <LayoutContainer className="p-6 rounded-3xl bg-surface/50 border border-border/70 space-y-4">
          <LayoutContainer className="flex items-center justify-between">
            <Title level="h3" className="text-base font-bold text-text-primary flex items-center gap-2">
              <Tv size={18} className="text-secondary" />
              {PUBLIC_LIVE.TRANSMISSION_TITLE}
            </Title>
            <a
              href={match.transmissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-secondary hover:text-secondary-hover font-bold"
            >
              Abrir no YouTube ↗
            </a>
          </LayoutContainer>

          {youtubeEmbedUrl ? (
            <LayoutContainer className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-lg">
              <iframe
                src={youtubeEmbedUrl}
                title="Transmissão Ao Vivo"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </LayoutContainer>
          ) : (
            <LayoutContainer className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
              <Text className="text-sm text-text-secondary">
                Acompanhe a transmissão oficial ao vivo pelo canal oficial.
              </Text>
              <a
                href={match.transmissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-secondary text-primary font-bold px-4 py-2 rounded-xl text-xs"
              >
                Assistir Transmissão ↗
              </a>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}

      {/* Linha do Tempo: Lance a Lance em Tempo Real */}
      <LayoutContainer className="space-y-4">
        <LayoutContainer className="flex items-center justify-between border-b border-border/60 pb-3">
          <LayoutContainer className="flex items-center gap-2">
            <Radio size={18} className="text-secondary animate-pulse" />
            <Title level="h3" className="text-lg font-black text-text-primary">
              {PUBLIC_LIVE.TIMELINE_TITLE}
            </Title>
          </LayoutContainer>
          <Badge variant="default" className="text-xs border-secondary/40 text-secondary">
            {events.length} lance(s)
          </Badge>
        </LayoutContainer>

        {events.length === 0 ? (
          <LayoutContainer className="p-10 rounded-2xl bg-surface/30 border border-border/60 text-center space-y-2">
            <Text className="text-sm text-text-muted">
              {PUBLIC_LIVE.EMPTY_TIMELINE}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="space-y-3">
            {events.map((event: MatchEvent) => {
              const isPelotasGoal = event.eventType === 'GOAL_PELOTAS';

              return (
                <LayoutContainer
                  key={event.id}
                  className={`p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-1 duration-300 flex items-start gap-4 ${
                    isPelotasGoal
                      ? 'bg-secondary/15 border-secondary/60 shadow-md ring-1 ring-secondary/30'
                      : 'bg-surface/70 border-border/70 hover:border-border'
                  }`}
                >
                  {/* Minuto do Lance */}
                  <LayoutContainer className="px-2.5 py-1 rounded-xl bg-surface border border-border font-mono font-black text-xs text-secondary shrink-0 shadow-2xs">
                    {event.formattedMinute}
                  </LayoutContainer>

                  {/* Ícone */}
                  <LayoutContainer className="pt-0.5 shrink-0">
                    {getEventIcon(event.eventType)}
                  </LayoutContainer>

                  {/* Conteúdo do Lance */}
                  <LayoutContainer className="min-w-0 space-y-1">
                    <LayoutContainer className="flex items-center gap-2 flex-wrap">
                      <Text
                        className={`text-sm font-black ${
                          isPelotasGoal ? 'text-secondary' : 'text-text-primary'
                        }`}
                      >
                        {event.title}
                      </Text>

                      {event.scorePelotasMoment !== null && event.scoreOpponentMoment !== null && (
                        <Badge
                          variant="default"
                          className="text-[10px] font-bold bg-surface border-border text-text-secondary px-1.5 py-0"
                        >
                          Placar: {event.scorePelotasMoment} x {event.scoreOpponentMoment}
                        </Badge>
                      )}
                    </LayoutContainer>

                    {event.description && (
                      <Text className="text-xs text-text-secondary leading-relaxed">
                        {event.description}
                      </Text>
                    )}

                    {event.playerName && (
                      <Text className="text-[11px] text-text-muted">
                        Atleta: <span className="font-semibold text-text-secondary">{event.playerName}</span>
                      </Text>
                    )}
                  </LayoutContainer>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
