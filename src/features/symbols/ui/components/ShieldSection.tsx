import React from 'react';
import { Shield, Calendar, Sparkles, ZoomIn, History, BookOpen } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { ClubSymbol, ClubSymbolOverview } from '../../types/symbols.types';
import { SYMBOLS_TEXTS } from '../../constants/symbols.constants';

export interface ShieldSectionProps {
  overview: ClubSymbolOverview;
  officialShield: ClubSymbol | null;
  historicalShields: ClubSymbol[];
  onOpenLightbox: (imageUrl: string, title: string, subtitle?: string) => void;
}

export const ShieldSection: React.FC<ShieldSectionProps> = ({
  overview,
  officialShield,
  historicalShields,
  onOpenLightbox,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-10 sm:gap-14">
      {/* 1. O Escudo Oficial Ativo Centenário (Foco Principal no Topo) */}
      {officialShield && (
        <LayoutContainer className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-surface to-background p-6 sm:p-10 shadow-xl shadow-primary/5">
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Brasão Atual */}
            <LayoutContainer className="lg:col-span-5 flex justify-center">
              <LayoutContainer
                onClick={() =>
                  officialShield.imageUrl &&
                  onOpenLightbox(
                    officialShield.imageUrl,
                    officialShield.name || 'Distintivo Centenário',
                    officialShield.subtitle || (officialShield.yearStart ? `Desde ${officialShield.yearStart}` : undefined)
                  )
                }
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-primary/40 overflow-hidden bg-background/60 shadow-2xl group cursor-pointer flex items-center justify-center p-6"
              >
                <SafeImage
                  src={officialShield.imageUrl || '/images/pelotas-logo.png'}
                  alt={officialShield.name || 'Escudo Oficial'}
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                  fallbackSrc="/images/pelotas-logo.png"
                />
                <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <ZoomIn className="w-5 h-5 text-primary" />
                  <Text as="span">Ampliar Escudo</Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Informações do Escudo Atual */}
            <LayoutContainer className="lg:col-span-7 flex flex-col gap-3 text-left">
              <LayoutContainer className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="primary"
                  size="sm"
                  className="font-extrabold uppercase text-[10px] tracking-wider px-3 py-1 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <Text as="span">{SYMBOLS_TEXTS.SHIELD_OFFICIAL_BADGE}</Text>
                </Badge>
                {officialShield.yearStart && (
                  <Badge variant="default" size="sm" className="text-[11px] font-bold">
                    <Calendar className="w-3 h-3 mr-1" />
                    <Text as="span">{`Desde ${officialShield.yearStart}`}</Text>
                  </Badge>
                )}
              </LayoutContainer>

              <Title level="h3" className="text-2xl sm:text-4xl font-black text-text-primary">
                {officialShield.name || 'Distintivo Oficial Centenário'}
              </Title>

              {officialShield.subtitle && (
                <Text className="text-base sm:text-lg font-bold text-primary">
                  {officialShield.subtitle}
                </Text>
              )}
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* 2. Narrativa Geral do Distintivo (História Geral da Seção no Meio) */}
      <LayoutContainer className="rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md p-6 sm:p-10 shadow-lg text-left flex flex-col gap-4">
        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Badge
              variant="primary"
              size="sm"
              className="font-extrabold uppercase text-[10px] tracking-wider px-2.5 py-0.5 inline-flex items-center gap-1.5 shadow-xs w-fit mb-1"
            >
              <Sparkles className="w-3 h-3" />
              <Text as="span">História & Significado</Text>
            </Badge>
            <Title level="h2" className="text-xl sm:text-3xl font-black text-text-primary">
              {overview.title}
            </Title>
          </LayoutContainer>
        </LayoutContainer>

        <Text
          as="p"
          className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans whitespace-pre-line pt-2 border-t border-border/50"
        >
          {overview.description}
        </Text>
      </LayoutContainer>

      {/* 3. Evolução dos Escudos Antigos por Ordem Cronológica de Período */}
      <LayoutContainer className="flex flex-col gap-6">
        <LayoutContainer className="flex items-center gap-3 pb-3 border-b border-border/60">
          <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col text-left">
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {SYMBOLS_TEXTS.SHIELD_EVOLUTION_TITLE}
            </Title>
            <Text className="text-xs sm:text-sm text-text-secondary">
              {SYMBOLS_TEXTS.SHIELD_EVOLUTION_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {historicalShields.length === 0 ? (
          <LayoutContainer className="p-8 rounded-2xl bg-surface/50 border border-border text-center">
            <Text className="text-sm text-text-secondary italic">
              {SYMBOLS_TEXTS.SHIELD_EVOLUTION_EMPTY}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalShields.map((shield) => (
              <LayoutContainer
                key={shield.id}
                className="rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-xs p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-md group text-left"
              >
                <LayoutContainer className="flex flex-col gap-3">
                  {/* Foto do Escudo Antigo */}
                  <LayoutContainer
                    onClick={() =>
                      shield.imageUrl &&
                      onOpenLightbox(
                        shield.imageUrl,
                        shield.name || (shield.yearStart ? `Escudo (${shield.yearStart}` : 'Escudo Histórico'),
                        shield.subtitle || undefined
                      )
                    }
                    className="relative w-full h-48 rounded-xl overflow-hidden bg-background/50 border border-border/60 cursor-pointer flex items-center justify-center p-4"
                  >
                    <SafeImage
                      src={shield.imageUrl || '/images/pelotas-logo.png'}
                      alt={shield.name || 'Escudo'}
                      fill
                      sizes="300px"
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                    <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                      <ZoomIn className="w-4 h-4 text-primary" />
                      <Text as="span">Ampliar</Text>
                    </LayoutContainer>
                  </LayoutContainer>

                  {/* Período em Destaque */}
                  <LayoutContainer className="flex items-center gap-2 pt-1">
                    <Badge variant="primary" size="sm" className="text-[11px] font-bold">
                      <Calendar className="w-3 h-3 mr-1" />
                      <Text as="span">
                        {shield.yearStart && shield.yearEnd
                          ? `${shield.yearStart} – ${shield.yearEnd}`
                          : shield.yearStart
                          ? `Ano ${shield.yearStart}`
                          : 'Registro Histórico'}
                      </Text>
                    </Badge>
                  </LayoutContainer>

                  {/* Nome Opcional */}
                  {shield.name && (
                    <Title level="h4" className="text-base font-black text-text-primary leading-snug">
                      {shield.name}
                    </Title>
                  )}

                  {shield.subtitle && (
                    <Text className="text-xs font-semibold text-primary">
                      {shield.subtitle}
                    </Text>
                  )}
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
