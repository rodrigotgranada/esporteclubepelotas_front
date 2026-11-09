import React from 'react';
import { History, Award, BookOpen, Quote } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
} from '@/shared/ui/components';
import { ClubAnthem } from '../../types/anthem.types';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';

export interface AnthemHistorySectionProps {
  anthem: ClubAnthem | null;
}

export const AnthemHistorySection: React.FC<AnthemHistorySectionProps> = ({ anthem }) => {
  const historyTitle = anthem?.historyTitle || 'A Poesia Imortal de Valmúrio';
  const historyText =
    anthem?.historyText ||
    'Composto pelo saudoso músico, radialista e torcedor apaixonado José Walter de Oliveira, eternizado pelo pseudônimo Valmúrio, o hino do Esporte Clube Pelotas é uma das obras mais emblemáticas do futebol brasileiro. Seus versos tocam a alma de cada torcedor áureo-cerúleo, exaltando a tradição azul e amarela e a vibração inigualável da Boca do Lobo.';

  const author = anthem?.authorLyrics || anthem?.authorMusic || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR;
  const year = anthem?.compositionYear || ANTHEM_TEXTS.HISTORY_DEFAULT_YEAR;

  return (
    <LayoutContainer className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-surface via-surface to-primary/5 p-6 sm:p-10 shadow-lg overflow-hidden">
      {/* Detalhe de Fundo */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      <LayoutContainer className="relative z-10 flex flex-col gap-6">
        <LayoutContainer className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border/60">
          <LayoutContainer className="flex items-center gap-3">
            <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary">
                {ANTHEM_TEXTS.HISTORY_SECTION_TITLE}
              </Title>
              <Text className="text-xs sm:text-sm text-text-secondary">
                {ANTHEM_TEXTS.BADGE_HISTORY}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex items-center gap-2">
            <Badge variant="primary" size="sm" className="font-bold text-xs uppercase px-3 py-1">
              <Award className="w-3.5 h-3.5 mr-1" />
              {`Ano ${year}`}
            </Badge>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Card dos Autores */}
          <LayoutContainer className="p-6 rounded-2xl bg-background/60 border border-border/70 flex flex-col gap-4">
            <LayoutContainer className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{ANTHEM_TEXTS.HISTORY_AUTHOR_LABEL}</span>
            </LayoutContainer>

            <Title level="h4" className="text-lg font-black text-text-primary">
              {author}
            </Title>

            <Text className="text-xs text-text-secondary leading-relaxed">
              Compositor histórico de Pelotas, cuja obra perpetuou a alma, as cores e a paixão da torcida áureo-cerúlea.
            </Text>
          </LayoutContainer>

          {/* Texto Histórico Completo */}
          <LayoutContainer className="lg:col-span-2 flex flex-col gap-4">
            <LayoutContainer className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary shrink-0" />
              <Title level="h3" className="text-lg sm:text-xl font-bold text-text-primary">
                {historyTitle}
              </Title>
            </LayoutContainer>

            <Text
              as="p"
              className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line"
            >
              {historyText}
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

