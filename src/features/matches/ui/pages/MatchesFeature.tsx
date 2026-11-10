'use client';

import React from 'react';
import { LayoutContainer, Spinner } from '@/shared/ui/components/atoms';
import { useMatches } from '../../hooks/useMatches';
import { MatchesHero } from '../components/MatchesHero';
import { NextMatchCard } from '../components/NextMatchCard';
import { MatchesCalendar } from '../components/MatchesCalendar';
import { MatchesOfficialLinks } from '../components/MatchesOfficialLinks';

export const MatchesFeature: React.FC = () => {
  const {
    nextMatch,
    championships,
    selectedChampionship,
    selectedChampionshipId,
    pastMatches,
    upcomingMatches,
    isLoading,
    handleSelectChampionship,
  } = useMatches();

  if (isLoading && championships.length === 0) {
    return (
      <LayoutContainer className="min-h-[50vh] flex items-center justify-center">
        <Spinner size={40} />
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Institucional */}
      <MatchesHero />

      {/* Próximo Confronto em Destaque (se houver partida futura ou ao vivo) */}
      {nextMatch && (
        <LayoutContainer className="space-y-4">
          <NextMatchCard match={nextMatch} />
        </LayoutContainer>
      )}

      {/* Calendário de Jogos: Seletor, Próximos e Resultados Anteriores */}
      <MatchesCalendar
        championships={championships}
        selectedChampionshipId={selectedChampionshipId}
        onSelectChampionship={handleSelectChampionship}
        pastMatches={pastMatches}
        upcomingMatches={upcomingMatches}
        isLoading={isLoading}
      />

      {/* Tabela Oficial e Regulamentos da Competição Selecionada */}
      {selectedChampionship && (
        <MatchesOfficialLinks championship={selectedChampionship} />
      )}
    </LayoutContainer>
  );
};
