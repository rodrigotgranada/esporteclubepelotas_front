'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { LayoutContainer, Text } from '@/shared/ui/components';
import { useSymbols } from '../../hooks/useSymbols';
import { SymbolsHero } from '../components/SymbolsHero';
import { MascotSection } from '../components/MascotSection';
import { ShieldSection } from '../components/ShieldSection';
import { FlagAndColorsSection } from '../components/FlagAndColorsSection';
import { SymbolLightboxModal } from '../components/SymbolLightboxModal';

export const SymbolsFeature: React.FC = () => {
  const {
    isLoading,
    activeTab,
    setActiveTab,
    mascotOverview,
    shieldOverview,
    flagColorsOverview,
    officialMascot,
    historicalMascots,
    officialShield,
    historicalShields,
    officialFlag,
    historicalFlags,
    colorsSymbol,
    lightbox,
    openLightbox,
    closeLightbox,
  } = useSymbols();

  return (
    <LayoutContainer className="min-h-screen bg-background flex flex-col">
      {/* 1. Hero com Distintivo Oficial e Seletor de Abas */}
      <SymbolsHero activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Conteúdo Centralizado */}
      <LayoutContainer className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {isLoading ? (
          <LayoutContainer className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <Text className="text-sm font-bold text-text-secondary">
              Carregando acervo e símbolos oficiais...
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer>
            {activeTab === 'MASCOT' && (
              <MascotSection
                overview={mascotOverview}
                officialMascot={officialMascot}
                historicalMascots={historicalMascots}
                onOpenLightbox={openLightbox}
              />
            )}

            {activeTab === 'SHIELD' && (
              <ShieldSection
                overview={shieldOverview}
                officialShield={officialShield}
                historicalShields={historicalShields}
                onOpenLightbox={openLightbox}
              />
            )}

            {activeTab === 'FLAG_COLORS' && (
              <FlagAndColorsSection
                overview={flagColorsOverview}
                officialFlag={officialFlag}
                historicalFlags={historicalFlags}
                colorsSymbol={colorsSymbol}
                onOpenLightbox={openLightbox}
              />
            )}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* 3. Modal de Lightbox para Fotografias e Escudos em Alta Resolução */}
      <SymbolLightboxModal
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        imageUrl={lightbox.imageUrl}
        title={lightbox.title}
        subtitle={lightbox.subtitle}
      />
    </LayoutContainer>
  );
};
