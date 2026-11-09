'use client';

import React from 'react';
import {
  LayoutContainer,
  Spinner,
  Text,
} from '@/shared/ui/components';
import { useAnthem } from '../../hooks/useAnthem';
import { AnthemHero } from '../components/AnthemHero';
import { AnthemAudioPlayer } from '../components/AnthemAudioPlayer';
import { AnthemLyricsCard } from '../components/AnthemLyricsCard';
import { AnthemVideoSection } from '../components/AnthemVideoSection';
import { AnthemVersionsModal } from '../components/AnthemVersionsModal';

export const AnthemFeature: React.FC = () => {
  const {
    currentAnthem,
    allVersions,
    isLoading,
    isVersionsModalOpen,
    handleSelectVersion,
    handleOpenVersionsModal,
    handleCloseVersionsModal,
  } = useAnthem();

  if (isLoading) {
    return (
      <LayoutContainer className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Spinner size={36} />
        <Text className="text-sm font-semibold text-text-secondary">
          Carregando hino oficial...
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer as="main" className="w-full min-h-screen bg-background pb-20">
      {/* 1. Hero do Hino com Distintivo, Título e Subtítulo */}
      <AnthemHero
        anthem={currentAnthem}
        onOpenVersionsModal={handleOpenVersionsModal}
        hasMultipleVersions={allVersions.length > 1}
      />

      <LayoutContainer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 flex flex-col gap-8 sm:gap-10">
        {/* 2. Player de Áudio Oficial (renderizado somente quando houver áudio) */}
        <AnthemAudioPlayer anthem={currentAnthem} />

        {/* 3. Letra do Hino com dados do Autor e Ação de Cópia */}
        {currentAnthem?.lyrics && (
          <AnthemLyricsCard
            lyrics={currentAnthem.lyrics}
            authorLyrics={currentAnthem.authorLyrics}
            authorMusic={currentAnthem.authorMusic}
            compositionYear={currentAnthem.compositionYear}
          />
        )}

        {/* 4. Vídeo Oficial do Hino (caso cadastrado) */}
        {currentAnthem?.videoUrl && (
          <AnthemVideoSection videoUrl={currentAnthem.videoUrl} />
        )}
      </LayoutContainer>

      {/* Modal de Versões Alternativas (se houver mais de uma versão) */}
      <AnthemVersionsModal
        isOpen={isVersionsModalOpen}
        onClose={handleCloseVersionsModal}
        versions={allVersions}
        currentAnthemId={currentAnthem?.id}
        onSelectVersion={handleSelectVersion}
      />
    </LayoutContainer>
  );
};
