'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { STADIUM_TEXTS } from '../../constants/stadium.constants';
import { StadiumFact } from '../../types/stadium.types';
import { BookOpen, Clock, History, Award, ArrowRight } from 'lucide-react';

interface StadiumStorySectionProps {
  contentHtml?: string;
  facts?: StadiumFact[];
}

export const StadiumStorySection: React.FC<StadiumStorySectionProps> = ({
  contentHtml,
  facts = [],
}) => {
  return (
    <LayoutContainer as="section" className="w-full py-12 sm:py-16 bg-background">
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção de Reportagem */}
        <LayoutContainer className="max-w-3xl mb-10 sm:mb-14 flex flex-col gap-3">
          <LayoutContainer className="flex items-center gap-3">
            <Badge
              variant="default"
              size="md"
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 font-bold px-3 py-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              {STADIUM_TEXTS.STORY_SECTION.BADGE}
            </Badge>

            <LayoutContainer className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Clock className="w-3.5 h-3.5" />
              <Text as="span">{STADIUM_TEXTS.STORY_SECTION.READ_TIME}</Text>
            </LayoutContainer>
          </LayoutContainer>

          <Title level="h2" className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight">
            {STADIUM_TEXTS.STORY_SECTION.TITLE}
          </Title>

          <Text className="text-base sm:text-lg text-text-secondary leading-relaxed">
            {STADIUM_TEXTS.STORY_SECTION.SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Layout Dividido: Matéria Principal + Barra Lateral com Marcos Cronológicos */}
        <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Coluna Principal: O Corpo da Matéria Grandona (8 colunas) */}
          <LayoutContainer className="lg:col-span-8">
            <LayoutContainer
              as="article"
              className="stadium-article-content max-w-none 
                [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-extrabold [&>h2]:text-text-primary [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:border-border/60 [&>h2]:pb-3
                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-text-primary [&>h3]:mt-6 [&>h3]:mb-3
                [&>p]:text-text-secondary [&>p]:text-base [&>p]:sm:text-lg [&>p]:leading-relaxed [&>p]:mb-6
                [&>blockquote]:p-6 [&>blockquote]:sm:p-8 [&>blockquote]:rounded-2xl [&>blockquote]:bg-surface [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:text-text-primary [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:my-8 [&>blockquote]:text-lg [&>blockquote]:sm:text-xl [&>blockquote]:shadow-sm
                [&>strong]:text-text-primary [&>strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: contentHtml || '' }}
            />
          </LayoutContainer>

          {/* Coluna Lateral: Linha do Tempo de Destaques & CTA Sócio (4 colunas) */}
          <LayoutContainer className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
            {/* Box Linha do Tempo da Boca */}
            {facts && facts.length > 0 && (
              <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-5">
                <LayoutContainer className="flex items-center gap-2 border-b border-border/80 pb-3">
                  <History className="w-5 h-5 text-primary" />
                  <LayoutContainer className="flex flex-col">
                    <Title level="h3" className="text-base font-bold text-text-primary">
                      {STADIUM_TEXTS.TIMELINE_FACTS.TITLE}
                    </Title>
                    <Text className="text-xs text-text-secondary">
                      {STADIUM_TEXTS.TIMELINE_FACTS.SUBTITLE}
                    </Text>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="flex flex-col gap-4">
                  {facts.map((fact, index) => (
                    <LayoutContainer
                      key={index}
                      className="flex gap-3 items-start group"
                    >
                      <LayoutContainer className="flex flex-col items-center shrink-0">
                        <Badge
                          variant="default"
                          size="sm"
                          className="font-mono font-bold bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 text-xs group-hover:scale-105 transition-transform"
                        >
                          {fact.year}
                        </Badge>
                        {index < facts.length - 1 && (
                          <LayoutContainer className="w-0.5 h-full bg-border my-1 min-h-[20px]" />
                        )}
                      </LayoutContainer>

                      <LayoutContainer className="flex flex-col pb-2">
                        <Text as="span" className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                          {fact.title}
                        </Text>
                        <Text as="span" className="text-xs text-text-secondary leading-relaxed mt-0.5">
                          {fact.description}
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>
                  ))}
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Box CTA de Conversão Sócio */}
            <LayoutContainer className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 via-surface to-surface border border-primary/30 shadow-md flex flex-col gap-4">
              <LayoutContainer className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-primary" />
                <Text as="span">O Caldeirão Centenário</Text>
              </LayoutContainer>

              <Title level="h3" className="text-lg font-black text-text-primary leading-snug">
                {STADIUM_TEXTS.MEMBERSHIP_CTA.TITLE}
              </Title>

              <Text className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {STADIUM_TEXTS.MEMBERSHIP_CTA.SUBTITLE}
              </Text>

              <Link href="/socio" className="w-full">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
                >
                  <Text as="span">{STADIUM_TEXTS.MEMBERSHIP_CTA.BUTTON_TEXT}</Text>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
