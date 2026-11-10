'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components/atoms';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { SearchableSelect, SearchableSelectOption } from '@/shared/ui/components/molecules';
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

  // Opções para o Combobox Pesquisável de Competições
  const championshipOptions: SearchableSelectOption[] = useMemo(() => {
    const list = championships.map((champ) => ({
      value: champ.id,
      label: `${champ.name} ${champ.seasonYear}`,
      badge: String(champ.seasonYear),
    }));
    return [{ value: 'ALL', label: 'Todas as Competições' }, ...list];
  }, [championships]);

  return (
    <LayoutContainer className="space-y-8 mt-10">
      {/* Seletor de Campeonatos (Combobox Pesquisável) */}
      {championships.length > 0 && (
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-md">
          <LayoutContainer className="space-y-1.5 w-full">
            <Text className="text-xs md:text-sm font-semibold uppercase tracking-wider text-text-muted">
              {CALENDAR.CHAMPIONSHIP_SELECTOR_LABEL}
            </Text>
            <SearchableSelect
              options={championshipOptions}
              value={selectedChampionshipId || 'ALL'}
              onChange={(val) => onSelectChampionship(val === 'ALL' ? null : val)}
              placeholder="Todas as Competições"
              searchPlaceholder="Digite para buscar competição..."
            />
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
                  className="rounded-2xl border border-border/60 bg-surface-card p-5 space-y-4 hover:border-secondary/40 transition-colors shadow-sm"
                >
                  <LayoutContainer className="flex items-center justify-between text-xs text-text-muted border-b border-border/40 pb-2">
                    <Badge variant="default" className="text-[11px] font-semibold border-secondary/40 text-secondary bg-secondary/10">
                      {match.roundName}
                    </Badge>
                    <span>
                      {formatDate(match.matchDate)} às {formatTime(match.matchDate)}
                    </span>
                  </LayoutContainer>

                  {/* Confronto */}
                  <LayoutContainer className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2">
                    {/* Mandante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <LayoutContainer className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-xs">
                        <SafeImage
                          src={isPelotasHome ? pelotasLogo : opponentLogo}
                          alt={isPelotasHome ? 'Pelotas' : match.opponentName}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </LayoutContainer>
                      <Text className="text-xs font-bold text-text-primary">
                        {isPelotasHome ? 'Pelotas' : match.opponentName}
                      </Text>
                    </LayoutContainer>

                    {/* Divisor VS e Estádio */}
                    <LayoutContainer className="flex flex-col items-center space-y-1 text-center px-2">
                      <span className="text-xs font-black text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border/60">
                        VS
                      </span>
                      <Text className="text-[10px] text-text-muted line-clamp-1 max-w-[120px]">
                        {match.stadiumName}
                      </Text>
                    </LayoutContainer>

                    {/* Visitante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <LayoutContainer className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-xs">
                        <SafeImage
                          src={isPelotasHome ? opponentLogo : pelotasLogo}
                          alt={isPelotasHome ? match.opponentName : 'Pelotas'}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </LayoutContainer>
                      <Text className="text-xs font-bold text-text-primary">
                        {isPelotasHome ? match.opponentName : 'Pelotas'}
                      </Text>
                    </LayoutContainer>
                  </LayoutContainer>

                  {/* Ações da Partida */}
                  <LayoutContainer className="pt-2 border-t border-border/40 flex items-center justify-center gap-3">
                    {match.hasLiveCoverage && (
                      <Link href={`/jogos/${match.slug || match.id}/ao-vivo`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-bold text-secondary hover:text-secondary-hover flex items-center gap-1 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                          Lance a Lance
                        </Button>
                      </Link>
                    )}
                    {match.transmissionUrl && (
                      <a
                        href={match.transmissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-text-muted hover:text-secondary flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Transmissão ↗
                      </a>
                    )}
                  </LayoutContainer>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Resultados Anteriores */}
      <LayoutContainer className="space-y-4">
        <Title level="h2" className="text-xl md:text-2xl font-bold text-text-primary flex items-center space-x-2">
          <span>🏆</span>
          <span>{CALENDAR.PAST_MATCHES}</span>
        </Title>

        {pastMatches.length === 0 ? (
          <LayoutContainer className="p-8 text-center rounded-2xl bg-surface-card border border-border/50">
            <Text className="text-sm text-text-muted">Nenhum resultado registrado para esta competição.</Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastMatches.map((match) => {
              const isPelotasHome = match.homeAway === 'HOME';
              const opponentLogo = match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE;
              const pelotasScore = match.pelotasScore ?? 0;
              const opponentScore = match.opponentScore ?? 0;

              const isPelotasWinner = pelotasScore > opponentScore;
              const isDraw = pelotasScore === opponentScore;

              return (
                <LayoutContainer
                  key={match.id}
                  className="rounded-2xl border border-border/60 bg-surface-card p-5 space-y-4 shadow-sm"
                >
                  <LayoutContainer className="flex items-center justify-between text-xs text-text-muted border-b border-border/40 pb-2">
                    <Badge variant="default" className="text-[11px] font-semibold border-border">
                      {match.roundName}
                    </Badge>
                    <span>{formatDate(match.matchDate)}</span>
                  </LayoutContainer>

                  {/* Confronto e Placar Final */}
                  <LayoutContainer className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2">
                    {/* Mandante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <LayoutContainer className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-xs">
                        <SafeImage
                          src={isPelotasHome ? pelotasLogo : opponentLogo}
                          alt={isPelotasHome ? 'Pelotas' : match.opponentName}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </LayoutContainer>
                      <Text className="text-xs font-bold text-text-primary">
                        {isPelotasHome ? 'Pelotas' : match.opponentName}
                      </Text>
                      <span className="text-2xl font-black text-text-primary">
                        {isPelotasHome ? pelotasScore : opponentScore}
                      </span>
                    </LayoutContainer>

                    {/* Badge de Resultado */}
                    <LayoutContainer className="flex flex-col items-center space-y-1 text-center px-2">
                      <Badge
                        variant="default"
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isDraw
                            ? 'bg-surface border-border text-text-muted'
                            : isPelotasWinner
                            ? 'bg-secondary/15 text-secondary border-secondary/40'
                            : 'bg-surface text-text-muted border-border'
                        }`}
                      >
                        {isDraw ? 'Empate' : isPelotasWinner ? 'Vitória' : 'Derrota'}
                      </Badge>
                      <Text className="text-[10px] text-text-muted line-clamp-1 max-w-[120px]">
                        {match.stadiumName}
                      </Text>
                    </LayoutContainer>

                    {/* Visitante */}
                    <LayoutContainer className="flex flex-col items-center text-center space-y-1">
                      <LayoutContainer className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-xs">
                        <SafeImage
                          src={isPelotasHome ? opponentLogo : pelotasLogo}
                          alt={isPelotasHome ? match.opponentName : 'Pelotas'}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </LayoutContainer>
                      <Text className="text-xs font-bold text-text-primary">
                        {isPelotasHome ? match.opponentName : 'Pelotas'}
                      </Text>
                      <span className="text-2xl font-black text-text-primary">
                        {isPelotasHome ? opponentScore : pelotasScore}
                      </span>
                    </LayoutContainer>
                  </LayoutContainer>

                  {/* Ações pós-jogo */}
                  {match.hasLiveCoverage && (
                    <LayoutContainer className="pt-2 border-t border-border/40 flex items-center justify-center">
                      <Link href={`/jogos/${match.slug || match.id}/ao-vivo`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-secondary hover:text-secondary-hover cursor-pointer"
                        >
                          Ver Resumo dos Lances ➔
                        </Button>
                      </Link>
                    </LayoutContainer>
                  )}
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
