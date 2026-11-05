'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
} from '@/shared/ui/components';
import { useYouthHub } from '../../hooks/useYouthHub';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { YouthHero } from '../components/YouthHero';
import { YouthCategoryTabs } from '../components/YouthCategoryTabs';
import { YouthSquadSection } from '../components/YouthSquadSection';
import { YouthNewsSection } from '../components/YouthNewsSection';
import { YouthMethodologySection } from '../components/YouthMethodologySection';
import { YouthPeneirasSection } from '../components/YouthPeneirasSection';

export const YouthHubFeature: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    squad,
    isLoadingSquad,
    news,
    isLoadingNews,
    organizedSectors,
  } = useYouthHub();

  const texts = YOUTH_CONSTANTS;

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* 1. Hero Institucional */}
      <YouthHero />

      {/* 2. Elencos das Categorias de Base */}
      <LayoutContainer className="flex flex-col gap-4 my-8">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
          <LayoutContainer className="flex flex-col gap-1">
            <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              {texts.SQUADS.SECTION_TITLE}
            </Title>
            <Text as="p" className="text-xs sm:text-sm text-text-secondary">
              {texts.SQUADS.SECTION_SUBTITLE}
            </Text>
          </LayoutContainer>

          {/* Abas Sub-20, Sub-17, Sub-15 */}
          <YouthCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </LayoutContainer>

        {/* Plantel da Categoria Ativa */}
        <YouthSquadSection
          squad={squad}
          isLoading={isLoadingSquad}
          organizedSectors={organizedSectors}
        />
      </LayoutContainer>

      {/* 3. Notícias & Cobertura da Base */}
      <YouthNewsSection news={news} isLoading={isLoadingNews} />

      {/* 4. Metodologia & Pilares de Formação */}
      <YouthMethodologySection />

      {/* 5. Peneiras & Avaliações */}
      <YouthPeneirasSection />
    </LayoutContainer>
  );
};

