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
import { AnthemHistorySection } from '../components/AnthemHistorySection';
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
      {/* 1. Hero Monumental com Distintivo e Autores */}
      <AnthemHero
        anthem={currentAnthem}
        onOpenVersionsModal={handleOpenVersionsModal}
        hasMultipleVersions={allVersions.length > 1}
      />

      <LayoutContainer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 flex flex-col gap-10 sm:gap-14">
        {/* 2. Player de Áudio Oficial com Barra Dourada */}
        <AnthemAudioPlayer anthem={currentAnthem} />

        {/* 3. Letra Formatada em Estrofes com Botão de Cópia */}
        {currentAnthem?.lyrics && (
          <AnthemLyricsCard lyrics={currentAnthem.lyrics} />
        )}

        {/* 4. Vídeo do Hino (caso cadastrado) */}
        {currentAnthem?.videoUrl && (
          <AnthemVideoSection videoUrl={currentAnthem.videoUrl} />
        )}

        {/* 5. História de Valmúrio e Compositores */}
        <AnthemHistorySection anthem={currentAnthem} />
      </LayoutContainer>

      {/* Modal de Outras Versões (se houver) */}
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

