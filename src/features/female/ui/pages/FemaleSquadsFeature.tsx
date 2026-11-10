'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Crown, Users } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Input,
  Select,
  Option,
  MembershipCtaCard,
} from '@/shared/ui/components';
import { useFemaleSquads } from '../../hooks/useFemaleSquads';
import { FEMALE_CONSTANTS } from '../../constants/female.constants';
import { FemaleSquadDetail } from '../components/FemaleSquadDetail';

export const FemaleSquadsFeature: React.FC = () => {
  const {
    championships,
    selectedKey,
    setSelectedKey,
    activeGroup,
    activeSquad,
    isLoading,
    search,
    setSearch,
    filteredGoalkeepers,
    filteredDefenders,
    filteredMidfielders,
    filteredForwards,
    staff,
  } = useFemaleSquads();

  const texts = FEMALE_CONSTANTS.PAGE_ELENCOS;

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botão Voltar ao Hub */}
      <LayoutContainer className="mb-6">
        <Link href="/feminino" className="inline-block">
          <Text as="span" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {texts.BACK}
          </Text>
        </Link>
      </LayoutContainer>

      {/* Header da Página */}
      <LayoutContainer className="flex flex-col gap-2 mb-8">
        <LayoutContainer className="inline-flex items-center gap-2">
          <Badge variant="primary" size="sm" className="font-extrabold uppercase">
            <Crown className="w-3.5 h-3.5 mr-1" />
            {texts.BADGE}
          </Badge>
        </LayoutContainer>
        <Title level="h1" className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          {texts.TITLE}
        </Title>
        <Text as="p" className="text-sm sm:text-base text-text-secondary max-w-2xl">
          {texts.SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Barra de Filtros: Campeonato & Busca */}
      <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 shadow-xs">
        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {championships.length > 0 && (
            <LayoutContainer className="w-full sm:w-72 shrink-0">
              <Select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full font-semibold"
              >
                {championships.map((c) => (
                  <Option key={c.key} value={c.key}>
                    {c.label} {c.isCurrent ? '(Em Disputa)' : `(${c.year})`}
                  </Option>
                ))}
              </Select>
            </LayoutContainer>
          )}

          <LayoutContainer className="relative flex-1 min-w-[200px]">
            <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
              <Search className="w-4 h-4" />
            </LayoutContainer>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogadora por nome ou posição..."
              className="pl-9 w-full"
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Detalhe do Elenco */}
      <FemaleSquadDetail
        squad={activeSquad}
        hasAnyChampionship={championships.length > 0}
        isLoading={isLoading}
        hasActiveSearch={Boolean(search.trim())}
        organizedSectors={{
          goalkeepers: filteredGoalkeepers,
          defenders: filteredDefenders,
          midfielders: filteredMidfielders,
          forwards: filteredForwards,
        }}
        staff={staff}
      />

      {/* CTA de Sócio */}
      <LayoutContainer className="my-12">
        <MembershipCtaCard
          title={texts.CTA_TITLE}
          description={texts.CTA_DESC}
          buttonText={texts.CTA_BTN}
          buttonLink="/planos"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
