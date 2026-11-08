'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button, ScrollReadingProgressBar } from '@/shared/ui/components';
import { useStadium } from '../../hooks/useStadium';
import { STADIUM_TEXTS } from '../../constants/stadium.constants';
import { StadiumHero } from '../components/StadiumHero';
import { StadiumQuickFacts } from '../components/StadiumQuickFacts';
import { StadiumStorySection } from '../components/StadiumStorySection';
import { StadiumGallery } from '../components/StadiumGallery';
import { StadiumLocation } from '../components/StadiumLocation';
import { PublicSponsorsStrip } from '@/features/sponsors';
import { Loader2, RefreshCw } from 'lucide-react';

export const StadiumFeature: React.FC = () => {
  const { stadium, isLoading, error, refresh } = useStadium();

  // Estado de carregamento obrigatório (Regra 11)
  if (isLoading && !stadium) {
    return (
      <LayoutContainer className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <Text className="text-text-secondary text-base font-medium">
          {STADIUM_TEXTS.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  // Tratamento de erro com fallback amigável
  if (error && !stadium) {
    return (
      <LayoutContainer className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
        <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
          {STADIUM_TEXTS.ERROR}
        </Title>
        <Button
          variant="primary"
          onClick={refresh}
          className="flex items-center gap-2 cursor-pointer font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          <Text as="span">Tentar Novamente</Text>
        </Button>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer as="main" className="w-full min-h-screen bg-background">
      {/* Barra de Progresso de Leitura Fixa no Topo */}
      <ScrollReadingProgressBar />

      {/* 1. Hero Monumental (Capa, Título e Olho Editorial) */}
      <StadiumHero
        title={stadium?.title}
        subtitle={stadium?.subtitle}
        coverImageUrl={stadium?.coverImageUrl}
      />

      {/* 2. Ficha Técnica da Boca do Lobo (Badges e Dados do Estádio) */}
      <StadiumQuickFacts
        quickFacts={stadium?.quickFacts}
        inaugurationDate={stadium?.inaugurationDate}
        capacity={stadium?.capacity}
        pitchDimensions={stadium?.pitchDimensions}
        address={stadium?.address}
      />

      {/* 3. A Grande Reportagem (A História Viva da Boca do Lobo + Linha do Tempo) */}
      <StadiumStorySection
        storyTitle={stadium?.storyTitle}
        storySubtitle={stadium?.storySubtitle}
        contentHtml={stadium?.contentHtml}
        facts={stadium?.facts}
      />

      {/* 4. Galeria de Fotos com Lightbox Unificado */}
      {stadium?.gallery && stadium.gallery.length > 0 && (
        <StadiumGallery gallery={stadium.gallery} />
      )}

      {/* 5. Localização e Como Chegar (Visite o Templo) */}
      <StadiumLocation
        address={stadium?.address}
        mapsDirectUrl={stadium?.mapsDirectUrl}
        mapsEmbedUrl={stadium?.mapsEmbedUrl}
      />

      {/* 6. Marcas que apoiam o Esporte Clube Pelotas e o Estádio Boca do Lobo */}
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <PublicSponsorsStrip title="Parceiros Oficiais do Lobo & Estádio Boca do Lobo" />
      </LayoutContainer>
    </LayoutContainer>
  );
};
