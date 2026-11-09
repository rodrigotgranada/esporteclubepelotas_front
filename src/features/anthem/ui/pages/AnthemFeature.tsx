'use client';

import React, { useRef } from 'react';
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
import { AnthemParallelVersionsAccordion } from '../components/AnthemParallelVersionsAccordion';

export const AnthemFeature: React.FC = () => {
  const {
    currentAnthem,
    allVersions,
    isLoading,
  } = useAnthem();

  const parallelRef = useRef<HTMLDivElement | null>(null);

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

  // A versão oficial é sempre a principal exibida na tela
  const officialAnthem =
    currentAnthem?.isOfficial
      ? currentAnthem
      : allVersions.find((v) => v.isOfficial) || currentAnthem || allVersions[0] || null;

  // As outras versões ativas compõem o accordion histórico abaixo
  const parallelVersions = allVersions.filter(
    (v) => v.id !== officialAnthem?.id && v.isActive
  );

  const handleScrollToParallel = () => {
    parallelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LayoutContainer as="main" className="w-full min-h-screen bg-background pb-20">
      {/* 1. Hero do Hino Oficial com Distintivo, Título e Autoria */}
      <AnthemHero
        anthem={officialAnthem}
        onScrollToParallelVersions={handleScrollToParallel}
        hasMultipleVersions={parallelVersions.length > 0}
      />

      <LayoutContainer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 flex flex-col gap-8 sm:gap-10">
        {/* 2. Player de Áudio Oficial (renderizado somente se houver áudio e sem erros) */}
        <AnthemAudioPlayer anthem={officialAnthem} />

        {/* 3. Letra do Hino Oficial com dados do Autor e Botão de Cópia */}
        {officialAnthem?.lyrics && (
          <AnthemLyricsCard
            lyrics={officialAnthem.lyrics}
            authorLyrics={officialAnthem.authorLyrics}
            authorMusic={officialAnthem.authorMusic}
            compositionYear={officialAnthem.compositionYear}
          />
        )}

        {/* 4. Vídeo Oficial do Hino (caso cadastrado) */}
        {officialAnthem?.videoUrl && (
          <AnthemVideoSection videoUrl={officialAnthem.videoUrl} />
        )}

        {/* 5. Versões Históricas & Paralelas em Accordion (abaixo da versão oficial) */}
        {parallelVersions.length > 0 && (
          <LayoutContainer ref={parallelRef} className="pt-4">
            <AnthemParallelVersionsAccordion versions={parallelVersions} />
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
