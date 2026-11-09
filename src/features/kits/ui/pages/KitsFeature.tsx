'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { LayoutContainer, Text } from '@/shared/ui/components';
import { useKits } from '../../hooks/useKits';
import { KitsHero } from '../components/KitsHero';
import { CurrentKitsSection } from '../components/CurrentKitsSection';
import { HistoricalKitsSection } from '../components/HistoricalKitsSection';
import { KitLightboxModal } from '../components/KitLightboxModal';

export const KitsFeature: React.FC = () => {
  const {
    currentKits,
    competitions,
    selectedCompetition,
    historicalKits,
    isLoading,
    isHistoricalLoading,
    hasHistoricalKits,
    lightbox,
    handleSelectCompetition,
    openLightbox,
    closeLightbox,
  } = useKits();

  return (
    <LayoutContainer className="min-h-screen bg-background flex flex-col">
      {/* 1. Hero Monumental */}
      <KitsHero />

      {/* 2. Conteúdo Dinâmico */}
      <LayoutContainer className="flex-1 w-full">
        {isLoading ? (
          <LayoutContainer className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <Text className="text-sm font-bold text-text-secondary">
              Carregando acervo de mantos sagrados...
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer>
            {/* Seção 1: Uniformes Atuais da Temporada em Destaque */}
            <CurrentKitsSection
              kits={currentKits}
              isLoading={isLoading}
              onOpenLightbox={openLightbox}
            />

            {/* Seção 2: Seletor de Competições e Mantos Anteriores */}
            <HistoricalKitsSection
              competitions={competitions}
              selectedCompetition={selectedCompetition}
              kits={historicalKits}
              isLoading={isHistoricalLoading}
              hasHistoricalKits={hasHistoricalKits}
              onSelectCompetition={handleSelectCompetition}
              onOpenLightbox={openLightbox}
            />
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* 3. Modal de Lightbox para Fotos e Detalhes dos Mantos */}
      <KitLightboxModal lightbox={lightbox} onClose={closeLightbox} />
    </LayoutContainer>
  );
};

