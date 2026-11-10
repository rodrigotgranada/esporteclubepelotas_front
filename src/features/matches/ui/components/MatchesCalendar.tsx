'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components/atoms';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { Championship, Match } from '../../types/matches.types';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../../constants/matches.constants';

export interface MatchesCalendarProps {
  championships: Championship[];
  selectedChampionshipId: string | null;
  onSelectChampionship: (id: string | null) => void;
  pastMatches: Match[];
  upcomingMatches: Match[];
  isLoading: boolean;
}

export const MatchesCalendar: React.FC<MatchesCalendarProps> = ({
  championships,
  selectedChampionshipId,
  onSelectChampionship,
  pastMatches,
  upcomingMatches,
}) => {
  const { CALENDAR, NEXT_MATCH } = MATCHES_CONSTANTS.PUBLIC;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pelotasLogo = '/images/pelotas-logo.png';

  return (
    <LayoutContainer className="space-y-8 mt-10">
      {/* Seletor de Campeonatos */}
      {championships.length > 0 && (
        <LayoutContainer className="flex flex-col space-y-3">
          <Text className="text-xs md:text-sm font-semibold uppercase tracking-wider text-text-muted">
            {CALENDAR.CHAMPIONSHIP_SELECTOR_LABEL}
          </Text>

          <LayoutContainer className="flex flex-wrap gap-2">
            {championships.map((champ) => {
              const isSelected = selectedChampionshipId === champ.id;
              return (
                <Button
                  key={champ.id}
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onSelectChampionship(champ.id)}
                  className={`rounded-xl px-4 py-2 text-xs md:text-sm transition-all flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-secondary text-primary hover:bg-secondary-hover shadow-md font-bold'
                      : 'border-border/60 text-text-muted hover:border-primary/40 hover:text-text-primary'
                  }`}
                >
                  {champ.logoUrl && (
                    <SafeImage
                      src={champ.logoUrl}
                      alt={champ.name}
                      width={18}
                      height={18}
                      className="object-contain"
                    />
                  )}
                  <span>{champ.name} {champ.seasonYear}</span>
                </Button>
              );
            })}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Próximas Partidas */}
      <LayoutContainer className="space-y-4">
        <Title level="h2" className="text-xl md:text-2xl font-bold text-text-primary flex items-center space-x-2">
          <span>📅</span>
          <span>{CALENDAR.UPCOMING_MATCHES}</span>
        </Title>

        {upcomingMatches.length === 0 ? (
          <LayoutContainer className="p-8 text-center rounded-2xl bg-surface-card border border-border/50">
            <Text className="text-sm text-text-muted">Nenhuma partida futura agendada para esta competição.</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMatches.map((match) => {
              const isPelotasHome = match.homeAway === 'HOME';
              const opponentLogo = match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE;

              return (
                <LayoutContainer
                  key={match.id}
                  className="rounded-2xl bg-surface-card border border-border/60 hover:border-primary/40 p-5 space-y-4 transition-all shadow-sm"
                >
                  <LayoutContainer className="flex items-center justify-between border-b border-border/40 pb-3">
                    <Badge variant="default" className="border-secondary/40 text-secondary text-[11px] font-semibold">
                      {match.roundName}
                    </Badge>
                    <Text className="text-xs text-text-muted font-medium">
                      {formatDate(match.matchDate)} às {formatTime(match.matchDate)}
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="grid grid-cols-3 items-center gap-2">
                    {/* Time Mandante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <SafeImage
                        src={isPelotasHome ? pelotasLogo : opponentLogo}
                        alt={isPelotasHome ? NEXT_MATCH.PELOTAS_NAME : match.opponentName}
                        width={40}
                        height={40}
                        className="object-contain max-h-10 max-w-10"
                      />
                      <Text className="text-xs md:text-sm font-bold text-text-primary truncate max-w-full">
                        {isPelotasHome ? NEXT_MATCH.PELOTAS_NAME : match.opponentName}
                      </Text>
                    </LayoutContainer>

                    {/* Centro */}
                    <LayoutContainer className="flex flex-col items-center justify-center text-center">
                      <Text className="text-xs font-black text-text-muted uppercase">VS</Text>
                      <Text className="text-[10px] text-text-muted mt-1 truncate max-w-[120px]">
                        {match.stadiumName}
                      </Text>
                    </LayoutContainer>

                    {/* Time Visitante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <SafeImage
                        src={isPelotasHome ? opponentLogo : pelotasLogo}
                        alt={isPelotasHome ? match.opponentName : NEXT_MATCH.PELOTAS_NAME}
                        width={40}
                        height={40}
                        className="object-contain max-h-10 max-w-10"
                      />
                      <Text className="text-xs md:text-sm font-bold text-text-primary truncate max-w-full">
                        {isPelotasHome ? match.opponentName : NEXT_MATCH.PELOTAS_NAME}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>

                  {/* Ações / Transmissão & Minuto a Minuto */}
                  {(match.hasLiveCoverage || match.transmissionUrl) && (
                    <LayoutContainer className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                      {match.hasLiveCoverage && (
                        <Link
                          href={`/jogos/${match.slug || match.id}/ao-vivo`}
                          className="inline-flex items-center text-xs bg-secondary/15 border border-secondary/40 text-secondary hover:bg-secondary/25 py-1 px-3 rounded-lg font-bold transition-colors"
                        >
                          🔴 Lance a Lance
                        </Link>
                      )}
                      {match.transmissionUrl && (
                        <a
                          href={match.transmissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-text-secondary hover:text-text-primary py-1 px-2.5 font-semibold transition-colors"
                        >
                          Transmissão ↗
                        </a>
                      )}
                    </LayoutContainer>
                  )}
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Resultados Anteriores */}
      <LayoutContainer className="space-y-4 pt-6">
        <Title level="h2" className="text-xl md:text-2xl font-bold text-text-primary flex items-center space-x-2">
          <span>🏆</span>
          <span>{CALENDAR.PAST_MATCHES}</span>
        </Title>

        {pastMatches.length === 0 ? (
          <LayoutContainer className="p-8 text-center rounded-2xl bg-surface-card border border-border/50">
            <Text className="text-sm text-text-muted">Nenhum resultado registrado para esta competição até o momento.</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastMatches.map((match) => {
              const isPelotasHome = match.homeAway === 'HOME';
              const opponentLogo = match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE;
              const homeScore = isPelotasHome ? match.pelotasScore : match.opponentScore;
              const awayScore = isPelotasHome ? match.opponentScore : match.pelotasScore;

              return (
                <LayoutContainer
                  key={match.id}
                  className="rounded-2xl bg-surface-card border border-border/60 p-5 space-y-4 shadow-sm"
                >
                  <LayoutContainer className="flex items-center justify-between border-b border-border/40 pb-3">
                    <Badge variant="default" className="border-border text-text-muted text-[11px]">
                      {match.roundName}
                    </Badge>
                    <Text className="text-xs text-text-muted">
                      {formatDate(match.matchDate)} • Encerrado
                    </Text>
                  </LayoutContainer>

                  <LayoutContainer className="grid grid-cols-3 items-center gap-2">
                    {/* Time Mandante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <SafeImage
                        src={isPelotasHome ? pelotasLogo : opponentLogo}
                        alt={isPelotasHome ? NEXT_MATCH.PELOTAS_NAME : match.opponentName}
                        width={36}
                        height={36}
                        className="object-contain max-h-9 max-w-9"
                      />
                      <Text className="text-xs md:text-sm font-bold text-text-primary truncate max-w-full">
                        {isPelotasHome ? NEXT_MATCH.PELOTAS_NAME : match.opponentName}
                      </Text>
                    </LayoutContainer>

                    {/* Placar Central */}
                    <LayoutContainer className="flex flex-col items-center justify-center text-center">
                      <LayoutContainer className="flex items-center space-x-2 text-xl md:text-2xl font-black text-text-primary">
                        <span>{homeScore ?? 0}</span>
                        <span className="text-text-muted text-sm font-normal">x</span>
                        <span>{awayScore ?? 0}</span>
                      </LayoutContainer>

                      {match.penaltyPelotasScore !== null && match.penaltyPelotasScore !== undefined && (
                        <Text className="text-[10px] text-text-muted mt-1">
                          Pen: {isPelotasHome ? match.penaltyPelotasScore : match.penaltyOpponentScore} x {isPelotasHome ? match.penaltyOpponentScore : match.penaltyPelotasScore}
                        </Text>
                      )}

                      <Text className="text-[10px] text-text-muted mt-1 truncate max-w-[120px]">
                        {match.stadiumName}
                      </Text>
                    </LayoutContainer>

                    {/* Time Visitante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <SafeImage
                        src={isPelotasHome ? opponentLogo : pelotasLogo}
                        alt={isPelotasHome ? match.opponentName : NEXT_MATCH.PELOTAS_NAME}
                        width={36}
                        height={36}
                        className="object-contain max-h-9 max-w-9"
                      />
                      <Text className="text-xs md:text-sm font-bold text-text-primary truncate max-w-full">
                        {isPelotasHome ? match.opponentName : NEXT_MATCH.PELOTAS_NAME}
                      </Text>
                    </LayoutContainer>
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
