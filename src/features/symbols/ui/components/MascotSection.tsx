import React from 'react';
import { Dog, Calendar, Sparkles, Image as ImageIcon, ZoomIn, BookOpen } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { ClubSymbol, ClubSymbolOverview } from '../../types/symbols.types';
import { SYMBOLS_TEXTS } from '../../constants/symbols.constants';

export interface MascotSectionProps {
  overview: ClubSymbolOverview;
  officialMascot: ClubSymbol | null;
  historicalMascots: ClubSymbol[];
  onOpenLightbox: (imageUrl: string, title: string, subtitle?: string) => void;
}

export const MascotSection: React.FC<MascotSectionProps> = ({
  overview,
  officialMascot,
  historicalMascots,
  onOpenLightbox,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-10 sm:gap-14">
      {/* 1. Narrativa Geral do Mascote (História Geral da Seção) */}
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
              <Text as="span">História & Identidade</Text>
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

      {/* 2. O Mascote Oficial Ativo */}
      {officialMascot && (
        <LayoutContainer className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-surface to-background p-6 sm:p-10 shadow-xl shadow-primary/5">
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Foto HD do Mascote Atual */}
            <LayoutContainer className="lg:col-span-5 flex justify-center">
              <LayoutContainer
                onClick={() =>
                  officialMascot.imageUrl &&
                  onOpenLightbox(
                    officialMascot.imageUrl,
                    officialMascot.name || 'Mascote Atual',
                    officialMascot.subtitle || (officialMascot.yearStart ? `Desde ${officialMascot.yearStart}` : undefined)
                  )
                }
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-primary/40 overflow-hidden bg-background/60 shadow-2xl group cursor-pointer"
              >
                <SafeImage
                  src={officialMascot.imageUrl || '/images/pelotas-logo.png'}
                  alt={officialMascot.name || 'Mascote Oficial'}
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="/images/pelotas-logo.png"
                />
                <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <ZoomIn className="w-5 h-5 text-primary" />
                  <Text as="span">Ampliar Foto</Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Informações do Mascote Atual */}
            <LayoutContainer className="lg:col-span-7 flex flex-col gap-3 text-left">
              <LayoutContainer className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="primary"
                  size="sm"
                  className="font-extrabold uppercase text-[10px] tracking-wider px-3 py-1 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <Text as="span">{SYMBOLS_TEXTS.MASCOT_OFFICIAL_BADGE}</Text>
                </Badge>
                {officialMascot.yearStart && (
                  <Badge variant="default" size="sm" className="text-[11px] font-bold">
                    <Calendar className="w-3 h-3 mr-1" />
                    <Text as="span">{`Desde ${officialMascot.yearStart}`}</Text>
                  </Badge>
                )}
              </LayoutContainer>

              <Title level="h3" className="text-2xl sm:text-4xl font-black text-text-primary">
                {officialMascot.name || 'Lobo da Boca do Lobo'}
              </Title>

              {officialMascot.subtitle && (
                <Text className="text-base sm:text-lg font-bold text-primary">
                  {officialMascot.subtitle}
                </Text>
              )}

              {officialMascot.description && (
                <Text
                  as="p"
                  className="text-sm text-text-secondary leading-relaxed font-sans mt-1 whitespace-pre-line"
                >
                  {officialMascot.description}
                </Text>
              )}

              {/* Fotos complementares se houver */}
              {officialMascot.galleryUrls && officialMascot.galleryUrls.length > 0 && (
                <LayoutContainer className="pt-3 border-t border-border/60">
                  <Text className="text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    Fotos Complementares do Mascote Atual:
                  </Text>
                  <LayoutContainer className="flex flex-wrap gap-2.5">
                    {officialMascot.galleryUrls.map((url, idx) => (
                      <LayoutContainer
                        key={idx}
                        onClick={() =>
                          onOpenLightbox(
                            url,
                            officialMascot.name || 'Mascote Atual',
                            `Registro ${idx + 1}`
                          )
                        }
                        className="relative w-14 h-14 rounded-xl border border-border overflow-hidden bg-background cursor-pointer hover:border-primary transition-colors"
                      >
                        <SafeImage
                          src={url}
                          alt={`Registro ${idx + 1}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                          fallbackSrc="/images/pelotas-logo.png"
                        />
                      </LayoutContainer>
                    ))}
                  </LayoutContainer>
                </LayoutContainer>
              )}
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* 3. Mascotes & Versões Anteriores por Ordem Cronológica de Período */}
      <LayoutContainer className="flex flex-col gap-6">
        <LayoutContainer className="flex items-center gap-3 pb-3 border-b border-border/60">
          <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Dog className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col text-left">
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {SYMBOLS_TEXTS.MASCOT_GALLERY_TITLE}
            </Title>
            <Text className="text-xs sm:text-sm text-text-secondary">
              {SYMBOLS_TEXTS.MASCOT_GALLERY_SUBTITLE}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {historicalMascots.length === 0 ? (
          <LayoutContainer className="p-8 rounded-2xl bg-surface/50 border border-border text-center">
            <Text className="text-sm text-text-secondary italic">
              {SYMBOLS_TEXTS.MASCOT_GALLERY_EMPTY}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalMascots.map((mascot) => (
              <LayoutContainer
                key={mascot.id}
                className="rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-xs p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-md group text-left"
              >
                <LayoutContainer className="flex flex-col gap-3">
                  {/* Foto da Versão Antiga */}
                  <LayoutContainer
                    onClick={() =>
                      mascot.imageUrl &&
                      onOpenLightbox(
                        mascot.imageUrl,
                        mascot.name || (mascot.yearStart ? `Período ${mascot.yearStart}` : 'Mascote Histórico'),
                        mascot.subtitle || undefined
                      )
                    }
                    className="relative w-full h-48 rounded-xl overflow-hidden bg-background/50 border border-border/60 cursor-pointer"
                  >
                    <SafeImage
                      src={mascot.imageUrl || '/images/pelotas-logo.png'}
                      alt={mascot.name || 'Mascote'}
                      fill
                      sizes="300px"
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
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
                        {mascot.yearStart && mascot.yearEnd
                          ? `${mascot.yearStart} – ${mascot.yearEnd}`
                          : mascot.yearStart
                          ? `Ano ${mascot.yearStart}`
                          : 'Registro de Época'}
                      </Text>
                    </Badge>
                  </LayoutContainer>

                  {/* Nome Opcional (se houver) */}
                  {mascot.name && (
                    <Title level="h4" className="text-base font-black text-text-primary leading-snug">
                      {mascot.name}
                    </Title>
                  )}

                  {mascot.subtitle && (
                    <Text className="text-xs font-semibold text-primary">
                      {mascot.subtitle}
                    </Text>
                  )}

                  {mascot.description && (
                    <Text as="p" className="text-xs text-text-secondary leading-relaxed font-sans line-clamp-3">
                      {mascot.description}
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
