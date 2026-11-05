'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Users } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { FOOTBALL_CONSTANTS } from '../../constants/football.constants';
import { useSquad } from '../../hooks/useSquad';
import { SquadHero } from '../components/SquadHero';
import { SquadFilterBar } from '../components/SquadFilterBar';
import { SquadSectorSection } from '../components/SquadSectorSection';

export const SquadFeature: React.FC = () => {
  const {
    selectedCategory,
    handleSelectCategory,
    selectedYear,
    handleSelectYear,
    availableYears,
    availableCategories,
    squad,
    sectors,
    isLoading,
    isModuleActive,
    search,
    setSearch,
  } = useSquad();

  // Módulo desativado
  if (!isLoading && !isModuleActive) {
    return (
      <LayoutContainer className="max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300">
        <LayoutContainer className="p-5 rounded-3xl bg-surface border border-border shadow-xs text-text-muted mb-2">
          <AlertCircle className="w-12 h-12 text-primary" />
        </LayoutContainer>
        <Title level="h2" className="text-2xl font-black text-text-primary">
          {FOOTBALL_CONSTANTS.MODULE_DISABLED.TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm max-w-md leading-relaxed">
          {FOOTBALL_CONSTANTS.MODULE_DISABLED.DESC}
        </Text>
        <Link href="/" className="mt-4">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />} className="font-bold">
            {FOOTBALL_CONSTANTS.MODULE_DISABLED.BTN_HOME}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero do Elenco */}
      <SquadHero squad={squad} selectedCategory={selectedCategory} />

      {/* Barra de Filtros (Categorias Dinâmicas, Temporadas, Busca) */}
      <SquadFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        selectedYear={selectedYear}
        onSelectYear={handleSelectYear}
        availableYears={availableYears}
        availableCategories={availableCategories}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Loading State */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center py-24 gap-3">
          <Spinner size={32} />
          <Text as="p" className="text-sm font-semibold text-text-muted">
            {FOOTBALL_CONSTANTS.LOADING_TEXT}
          </Text>
        </LayoutContainer>
      ) : !squad ? (
        /* Empty State */
        <LayoutContainer className="p-12 sm:p-16 rounded-3xl bg-surface border border-border text-center flex flex-col items-center justify-center gap-3 animate-in fade-in">
          <LayoutContainer className="p-4 rounded-2xl bg-background border border-border shadow-xs text-primary mb-1">
            <Users className="w-8 h-8 opacity-40 text-primary" />
          </LayoutContainer>
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {FOOTBALL_CONSTANTS.EMPTY.TITLE}
          </Title>
          <Text as="p" className="text-sm text-text-muted max-w-sm">
            {FOOTBALL_CONSTANTS.EMPTY.DESCRIPTION}
          </Text>
        </LayoutContainer>
      ) : (
        /* Setores Táticos */
        <LayoutContainer className="flex flex-col animate-in fade-in duration-300">
          <SquadSectorSection
            title={FOOTBALL_CONSTANTS.SECTORS.GOALKEEPER}
            icon="🧤"
            members={sectors.goalkeepers}
          />

          <SquadSectorSection
            title={FOOTBALL_CONSTANTS.SECTORS.DEFENDER}
            icon="🛡️"
            members={sectors.defenders}
          />

          <SquadSectorSection
            title={FOOTBALL_CONSTANTS.SECTORS.MIDFIELDER}
            icon="⚙️"
            members={sectors.midfielders}
          />

          <SquadSectorSection
            title={FOOTBALL_CONSTANTS.SECTORS.FORWARD}
            icon="⚡"
            members={sectors.forwards}
          />

          {sectors.staff && sectors.staff.length > 0 && (
            <SquadSectorSection
              title={FOOTBALL_CONSTANTS.SECTORS.STAFF}
              icon="📋"
              staff={sectors.staff}
            />
          )}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
