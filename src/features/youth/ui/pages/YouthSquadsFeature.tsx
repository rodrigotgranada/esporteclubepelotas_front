'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  MembershipCtaCard,
} from '@/shared/ui/components';
import { useYouthSquads } from '../../hooks/useYouthSquads';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { YouthSquadFilterBar } from '../components/YouthSquadFilterBar';
import { YouthSquadSection } from '../components/YouthSquadSection';

export const YouthSquadsFeature: React.FC = () => {
  const {
    championships,
    selectedChampionship,
    handleSelectChampionship,
    availableCategories,
    selectedCategory,
    handleSelectCategory,
    squad,
    organizedSectors,
    isLoading,
    search,
    setSearch,
    hasActiveSearch,
  } = useYouthSquads();

  const texts = YOUTH_CONSTANTS.PAGE_ELENCOS;

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botão Voltar para o Hub da Base */}
      <LayoutContainer className="mb-6">
        <Link href="/base" className="inline-block">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-xs font-bold text-text-secondary hover:text-primary transition-colors"
          >
            {texts.BACK}
          </Button>
        </Link>
      </LayoutContainer>

      {/* Header Institucional da Página de Elencos da Base */}
      <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-background border border-border p-6 sm:p-10 mb-8 shadow-sm">
        <LayoutContainer className="relative z-10 flex flex-col gap-2 max-w-2xl">
          <LayoutContainer className="inline-flex items-center gap-2">
            <Badge variant="primary" className="px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Users className="w-3.5 h-3.5" />
              <Text as="span">{texts.BADGE}</Text>
            </Badge>
          </LayoutContainer>

          <Title level="h1" className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
            {texts.TITLE}
          </Title>
          <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed">
            {texts.SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Barra de Seleção Encadeada: Campeonato -> Categorias do Campeonato + Busca */}
      {!isLoading && championships.length > 0 && (
        <YouthSquadFilterBar
          championships={championships}
          selectedChampionship={selectedChampionship}
          onSelectChampionship={handleSelectChampionship}
          availableCategories={availableCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {/* Seção Completa do Plantel da Categoria Ativa no Campeonato Selecionado */}
      <YouthSquadSection
        squad={squad}
        hasAnyChampionship={championships.length > 0}
        isLoading={isLoading}
        hasActiveSearch={hasActiveSearch}
        organizedSectors={organizedSectors}
      />

      {/* Convite para o Quadro Social */}
      <MembershipCtaCard
        title={texts.CTA_TITLE}
        description={texts.CTA_DESC}
        buttonText={texts.CTA_BTN}
        className="mt-14"
      />
    </LayoutContainer>
  );
};
