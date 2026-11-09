import React from 'react';
import { Sparkles, Music, Calendar, Award } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { ClubAnthem } from '../../types/anthem.types';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';

export interface AnthemHeroProps {
  anthem: ClubAnthem | null;
  onOpenVersionsModal?: () => void;
  hasMultipleVersions?: boolean;
}

export const AnthemHero: React.FC<AnthemHeroProps> = ({
  anthem,
  onOpenVersionsModal,
  hasMultipleVersions = false,
}) => {
  const title = anthem?.title || ANTHEM_TEXTS.DEFAULT_TITLE;
  const subtitle = anthem?.subtitle || ANTHEM_TEXTS.DEFAULT_SUBTITLE;
  const author = anthem?.authorLyrics || anthem?.authorMusic || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR;
  const year = anthem?.compositionYear || ANTHEM_TEXTS.HISTORY_DEFAULT_YEAR;

  return (
    <LayoutContainer className="relative w-full overflow-hidden bg-gradient-to-b from-primary/15 via-surface/60 to-background border-b border-border/70 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Glow Dourado de Fundo */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      <LayoutContainer className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Distintivo Oficial com Animação Suave */}
        <LayoutContainer className="relative w-24 h-24 sm:w-28 sm:h-28 mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
          <SafeImage
            src={anthem?.coverImageUrl || '/images/pelotas-logo.png'}
            alt="Esporte Clube Pelotas"
            fill
            className="object-contain"
            fallbackSrc="/images/pelotas-logo.png"
          />
        </LayoutContainer>

        {/* Badges de Categoria */}
        <LayoutContainer className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <Badge
            variant="primary"
            size="sm"
            className="font-extrabold uppercase tracking-widest px-3 py-1 text-[11px] inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ANTHEM_TEXTS.BADGE_OFFICIAL}</span>
          </Badge>

          {anthem?.isOfficial && (
            <Badge
              variant="default"
              size="sm"
              className="font-bold text-[11px] uppercase tracking-wider px-2.5 py-1 bg-surface border border-primary/40 text-primary"
            >
              <Award className="w-3 h-3 mr-1" />
              <span>{ANTHEM_TEXTS.VERSIONS_OFFICIAL_BADGE}</span>
            </Badge>
          )}
        </LayoutContainer>

        {/* Título Monumental */}
        <Title
          level="h1"
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-tight mb-3 sm:mb-4"
        >
          {title}
        </Title>

        {/* Subtítulo Áureo-Cerúleo */}
        <Text
          as="p"
          className="text-lg sm:text-2xl font-bold text-primary mb-6 max-w-2xl leading-snug"
        >
          {`"${subtitle}"`}
        </Text>

        {/* Metadados: Autor e Ano */}
        <LayoutContainer className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-secondary bg-surface/80 backdrop-blur-xs px-5 py-2.5 rounded-full border border-border/80 shadow-xs">
          <LayoutContainer className="flex items-center gap-1.5 font-semibold text-text-primary">
            <Music className="w-4 h-4 text-primary" />
            <span>{author}</span>
          </LayoutContainer>

          <LayoutContainer className="w-1 h-1 rounded-full bg-border" />

          <LayoutContainer className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{year}</span>
          </LayoutContainer>

          {hasMultipleVersions && onOpenVersionsModal && (
            <>
              <LayoutContainer className="w-1 h-1 rounded-full bg-border" />
              <button
                onClick={onOpenVersionsModal}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                {ANTHEM_TEXTS.BTN_ALL_VERSIONS}
              </button>
            </>
          )}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

