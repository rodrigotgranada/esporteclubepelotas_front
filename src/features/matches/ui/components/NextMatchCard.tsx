'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Text, Badge } from '@/shared/ui/components/atoms';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { Match } from '../../types/matches.types';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../../constants/matches.constants';

export interface NextMatchCardProps {
  match: Match | null;
  className?: string;
  isHomeWidget?: boolean;
}

export const NextMatchCard: React.FC<NextMatchCardProps> = ({
  match,
  className = '',
  isHomeWidget = false,
}) => {
  if (!match) {
    return null;
  }

  const { NEXT_MATCH } = MATCHES_CONSTANTS.PUBLIC;
  const isLive = match.status === 'IN_PROGRESS';
  const isPelotasHome = match.homeAway === 'HOME';

  // Formatação de data em pt-BR
  const matchDateTime = new Date(match.matchDate);
  const formattedDate = matchDateTime.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = matchDateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const pelotasLogo = '/images/pelotas-logo.png';
  const opponentLogo = match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE;

  const homeTeam = {
    name: isPelotasHome ? NEXT_MATCH.PELOTAS_NAME : match.opponentName,
    logo: isPelotasHome ? pelotasLogo : opponentLogo,
    score: isPelotasHome ? match.pelotasScore : match.opponentScore,
  };

  const awayTeam = {
    name: isPelotasHome ? match.opponentName : NEXT_MATCH.PELOTAS_NAME,
    logo: isPelotasHome ? opponentLogo : pelotasLogo,
    score: isPelotasHome ? match.opponentScore : match.pelotasScore,
  };

  return (
    <LayoutContainer
      className={`relative overflow-hidden rounded-2xl bg-surface-card border border-primary/25 shadow-xl transition-all hover:border-primary/45 p-6 md:p-8 ${className}`}
    >
      {/* Topo do Card: Badge de Status e Nome da Competição */}
      <LayoutContainer className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/50">
        <LayoutContainer className="flex items-center space-x-2">
          {isLive ? (
            <Badge variant="default" className="bg-secondary text-primary font-bold px-3 py-1 text-xs uppercase animate-pulse border-secondary">
              ● {NEXT_MATCH.LIVE_NOW}
            </Badge>
          ) : (
            <Badge variant="default" className="border-secondary/50 text-secondary px-3 py-1 text-xs font-semibold uppercase">
              {NEXT_MATCH.SCHEDULED}
            </Badge>
          )}
          <Text className="text-xs md:text-sm font-semibold text-text-muted">
            {match.championshipName || 'Campeonato Oficial'} • {match.roundName}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center space-x-2 text-xs md:text-sm text-text-muted">
          <Text className="font-medium text-text-primary">
            {formattedDate} às {formattedTime}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Confronto Central: Mandante vs Visitante */}
      <LayoutContainer className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-8">
        {/* Mandante */}
        <LayoutContainer className="flex flex-col items-center text-center space-y-3">
          <LayoutContainer className="w-20 h-20 md:w-24 md:h-24 relative p-2 rounded-2xl bg-surface-hover/50 border border-border/60 flex items-center justify-center shadow-inner">
            <SafeImage
              src={homeTeam.logo}
              alt={homeTeam.name}
              width={80}
              height={80}
              className="object-contain max-h-16 max-w-16 md:max-h-20 md:max-w-20"
            />
          </LayoutContainer>
          <Text className="text-base md:text-lg font-bold text-text-primary tracking-tight">
            {homeTeam.name}
          </Text>
          <Badge variant="default" className="text-[10px] px-2 py-0.5 border-border/60 text-text-muted">
            Mandante
          </Badge>
        </LayoutContainer>

        {/* Centro: Placar ou VS + Local */}
        <LayoutContainer className="flex flex-col items-center justify-center text-center space-y-2">
          {isLive || match.status === 'FINISHED' ? (
            <LayoutContainer className="flex items-center space-x-4">
              <span className="text-3xl md:text-5xl font-black text-secondary">
                {homeTeam.score ?? 0}
              </span>
              <span className="text-xl md:text-2xl font-bold text-text-muted">x</span>
              <span className="text-3xl md:text-5xl font-black text-secondary">
                {awayTeam.score ?? 0}
              </span>
            </LayoutContainer>
          ) : (
            <LayoutContainer className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-md">
              <span className="text-sm font-black text-secondary uppercase tracking-widest">
                {NEXT_MATCH.VS}
              </span>
            </LayoutContainer>
          )}

          <Text className="text-xs md:text-sm font-semibold text-text-muted text-center pt-2">
            📍 {match.stadiumName} {match.city ? `• ${match.city}` : ''}
          </Text>

          {match.broadcastChannel && (
            <span className="text-[11px] md:text-xs text-text-muted/80 bg-surface-hover px-2.5 py-1 rounded-md border border-border/40">
              📺 {match.broadcastChannel}
            </span>
          )}
        </LayoutContainer>

        {/* Visitante */}
        <LayoutContainer className="flex flex-col items-center text-center space-y-3">
          <LayoutContainer className="w-20 h-20 md:w-24 md:h-24 relative p-2 rounded-2xl bg-surface-hover/50 border border-border/60 flex items-center justify-center shadow-inner">
            <SafeImage
              src={awayTeam.logo}
              alt={awayTeam.name}
              width={80}
              height={80}
              className="object-contain max-h-16 max-w-16 md:max-h-20 md:max-w-20"
            />
          </LayoutContainer>
          <Text className="text-base md:text-lg font-bold text-text-primary tracking-tight">
            {awayTeam.name}
          </Text>
          <Badge variant="default" className="text-[10px] px-2 py-0.5 border-border/60 text-text-muted">
            Visitante
          </Badge>
        </LayoutContainer>
      </LayoutContainer>

      {/* Rodapé do Card: Ações (Lance a Lance e Transmissão) */}
      <LayoutContainer className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/50">
        {match.hasLiveCoverage && (
          <Link
            href={`/jogos/${match.slug || match.id}/ao-vivo`}
            className="inline-flex items-center justify-center bg-secondary text-primary hover:bg-secondary-hover font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer text-sm"
          >
            🔴 Acompanhar Lance a Lance
          </Link>
        )}

        {match.transmissionUrl && (
          <a
            href={match.transmissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-primary/40 text-text-primary hover:bg-primary/20 font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            📺 {NEXT_MATCH.TRANSMISSION_BUTTON}
          </a>
        )}

        {isHomeWidget && (
          <Link
            href="/jogos"
            className="inline-flex items-center text-secondary hover:text-secondary-hover text-sm font-semibold transition-colors px-3 py-2"
          >
            Ver Calendário Completo →
          </Link>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
