import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Accordion,
} from '@/shared/ui/components';
import { Disc3 } from 'lucide-react';
import { ClubAnthem } from '../../types/anthem.types';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';
import { AnthemAudioPlayer } from './AnthemAudioPlayer';
import { AnthemLyricsCard } from './AnthemLyricsCard';
import { AnthemVideoSection } from './AnthemVideoSection';

export interface AnthemParallelVersionsAccordionProps {
  versions: ClubAnthem[];
}

export const AnthemParallelVersionsAccordion: React.FC<AnthemParallelVersionsAccordionProps> = ({
  versions,
}) => {
  if (!versions || versions.length === 0) {
    return null;
  }

  return (
    <LayoutContainer className="flex flex-col gap-6 mt-4">
      {/* Cabeçalho da Seção de Versões Paralelas */}
      <LayoutContainer className="flex items-center gap-3 pb-3 border-b border-border/60">
        <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Disc3 className="w-5 h-5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
            {ANTHEM_TEXTS.PARALLEL_VERSIONS_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">
            {ANTHEM_TEXTS.PARALLEL_VERSIONS_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Accordion de Versões Paralelas */}
      <LayoutContainer className="flex flex-col gap-3">
        {versions.map((ver) => {
          const author = ver.authorLyrics || ver.authorMusic || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR;
          const year = ver.compositionYear ? ` (${ver.compositionYear})` : '';
          const title = `${ver.title}${year} • ${author}`;

          return (
            <Accordion key={ver.id} title={title}>
              <LayoutContainer className="flex flex-col gap-6 py-2">
                {/* Badge e Metadados */}
                <LayoutContainer className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/40">
                  <Text className="text-xs text-text-secondary">
                    {`Interpretação / Arranjo: ${author}`}
                  </Text>
                  {ver.compositionYear && (
                    <Badge variant="default" size="sm" className="text-[10px] font-bold">
                      {`Ano: ${ver.compositionYear}`}
                    </Badge>
                  )}
                </LayoutContainer>

                {/* Player de Áudio da Versão Paralela (se houver áudio) */}
                {ver.audioUrl && <AnthemAudioPlayer anthem={ver} />}

                {/* Letra da Versão */}
                {ver.lyrics && (
                  <AnthemLyricsCard
                    lyrics={ver.lyrics}
                    authorLyrics={ver.authorLyrics}
                    authorMusic={ver.authorMusic}
                    compositionYear={ver.compositionYear}
                  />
                )}

                {/* Vídeo (se houver) */}
                {ver.videoUrl && <AnthemVideoSection videoUrl={ver.videoUrl} />}
              </LayoutContainer>
            </Accordion>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
