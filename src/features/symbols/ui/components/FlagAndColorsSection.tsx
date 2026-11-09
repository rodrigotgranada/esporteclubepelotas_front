import React from 'react';
import { Flag, Palette, Sparkles, ZoomIn, BookOpen, Calendar, Image as ImageIcon } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { ClubSymbol, ClubSymbolOverview } from '../../types/symbols.types';
import { SYMBOLS_TEXTS } from '../../constants/symbols.constants';

export interface FlagAndColorsSectionProps {
  overview: ClubSymbolOverview;
  officialFlag: ClubSymbol | null;
  historicalFlags?: ClubSymbol[];
  colorsSymbol: ClubSymbol | null;
  onOpenLightbox: (imageUrl: string, title: string, subtitle?: string) => void;
}

export const FlagAndColorsSection: React.FC<FlagAndColorsSectionProps> = ({
  overview,
  officialFlag,
  historicalFlags = [],
  colorsSymbol,
  onOpenLightbox,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-10 sm:gap-14">
      {/* 1. O Pavilhão Oficial Ativo (Foco Principal no Topo) */}
      {officialFlag && (
        <LayoutContainer className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-surface to-background p-6 sm:p-10 shadow-xl shadow-primary/5">
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Imagem da Bandeira / Pavilhão */}
            <LayoutContainer className="lg:col-span-5 flex justify-center">
              <LayoutContainer
                onClick={() =>
                  officialFlag.imageUrl &&
                  onOpenLightbox(
                    officialFlag.imageUrl,
                    officialFlag.name || 'Pavilhão Oficial',
                    officialFlag.subtitle || undefined
                  )
                }
                className="relative w-64 h-48 sm:w-80 sm:h-56 rounded-3xl border-2 border-primary/40 overflow-hidden bg-background/60 shadow-2xl group cursor-pointer flex items-center justify-center p-4"
              >
                <SafeImage
                  src={officialFlag.imageUrl || '/images/pelotas-logo.png'}
                  alt={officialFlag.name || 'Pavilhão Oficial'}
                  fill
                  sizes="320px"
                  className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                  fallbackSrc="/images/pelotas-logo.png"
                />
                <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <ZoomIn className="w-5 h-5 text-primary" />
                  <Text as="span">Ampliar Pavilhão</Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Informações do Pavilhão Atual */}
            <LayoutContainer className="lg:col-span-7 flex flex-col gap-3 text-left">
              <LayoutContainer className="flex items-center gap-2">
                <Badge
                  variant="primary"
                  size="sm"
                  className="font-extrabold uppercase text-[10px] tracking-wider px-3 py-1 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <Text as="span">{SYMBOLS_TEXTS.FLAG_OFFICIAL_BADGE}</Text>
                </Badge>
                {officialFlag.yearStart && (
                  <Badge variant="default" size="sm" className="text-[11px] font-bold">
                    <Calendar className="w-3 h-3 mr-1" />
                    <Text as="span">{`Desde ${officialFlag.yearStart}`}</Text>
                  </Badge>
                )}
              </LayoutContainer>

              <Title level="h3" className="text-2xl sm:text-4xl font-black text-text-primary">
                {officialFlag.name || 'Pavilhão Oficial Áureo-Cerúleo'}
              </Title>

              {officialFlag.subtitle && (
                <Text className="text-base sm:text-lg font-bold text-primary">
                  {officialFlag.subtitle}
                </Text>
              )}

              {/* Fotos complementares se houver */}
              {officialFlag.galleryUrls && officialFlag.galleryUrls.length > 0 && (
                <LayoutContainer className="pt-3 border-t border-border/60">
                  <Text className="text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    Fotos Complementares do Pavilhão Oficial:
                  </Text>
                  <LayoutContainer className="flex flex-wrap gap-2.5">
                    {officialFlag.galleryUrls.map((url, idx) => (
                      <LayoutContainer
                        key={idx}
                        onClick={() =>
                          onOpenLightbox(
                            url,
                            officialFlag.name || 'Pavilhão Oficial',
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

      {/* 2. Narrativa Geral do Pavilhão & Cores (História Geral da Seção no Meio) */}
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

      {/* 3. Pavilhões & Versões Anteriores por Ordem Cronológica de Período (apenas se houver) */}
      {historicalFlags.length > 0 && (
        <LayoutContainer className="flex flex-col gap-6">
          <LayoutContainer className="flex items-center gap-3 pb-3 border-b border-border/60">
            <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Flag className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col text-left">
              <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
                {SYMBOLS_TEXTS.FLAG_GALLERY_TITLE}
              </Title>
              <Text className="text-xs sm:text-sm text-text-secondary">
                {SYMBOLS_TEXTS.FLAG_GALLERY_SUBTITLE}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalFlags.map((flag) => (
              <LayoutContainer
                key={flag.id}
                className="rounded-2xl border border-border/80 bg-surface/70 backdrop-blur-xs p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-md group text-left"
              >
                <LayoutContainer className="flex flex-col gap-3">
                  <LayoutContainer
                    onClick={() =>
                      flag.imageUrl &&
                      onOpenLightbox(
                        flag.imageUrl,
                        flag.name || 'Pavilhão Histórico',
                        flag.subtitle || undefined
                      )
                    }
                    className="relative w-full h-44 rounded-xl overflow-hidden bg-background/50 border border-border/60 cursor-pointer flex items-center justify-center p-3"
                  >
                    <SafeImage
                      src={flag.imageUrl || '/images/pelotas-logo.png'}
                      alt={flag.name || 'Bandeira'}
                      fill
                      sizes="300px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                    <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                      <ZoomIn className="w-4 h-4 text-primary" />
                      <Text as="span">Ampliar</Text>
                    </LayoutContainer>
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center gap-2 pt-1">
                    <Badge variant="primary" size="sm" className="text-[11px] font-bold">
                      <Calendar className="w-3 h-3 mr-1" />
                      <Text as="span">
                        {flag.yearStart && flag.yearEnd
                          ? `${flag.yearStart} – ${flag.yearEnd}`
                          : flag.yearStart
                          ? `Ano ${flag.yearStart}`
                          : 'Registro Histórico'}
                      </Text>
                    </Badge>
                  </LayoutContainer>

                  {flag.name && (
                    <Title level="h4" className="text-base font-black text-text-primary leading-snug">
                      {flag.name}
                    </Title>
                  )}

                  {flag.subtitle && (
                    <Text className="text-xs font-semibold text-primary">
                      {flag.subtitle}
                    </Text>
                  )}
                </LayoutContainer>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* 4. As Cores Áureo-Cerúleas */}
      <LayoutContainer className="flex flex-col gap-6">
        <LayoutContainer className="flex items-center gap-3 pb-3 border-b border-border/60">
          <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col text-left">
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {SYMBOLS_TEXTS.COLORS_TITLE}
            </Title>
            <Text className="text-xs sm:text-sm text-text-secondary">
              {colorsSymbol?.description ||
                'O significado do Azul Cerúleo e do Amarelo Ouro na história do Pelotas'}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Dois Cards: Amarelo e Azul */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card Amarelo Ouro (Áureo) */}
          <LayoutContainer className="relative rounded-3xl p-8 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface to-background flex flex-col gap-4 text-left shadow-lg overflow-hidden group">
            <LayoutContainer className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-xl shadow-md">
              Á
            </LayoutContainer>

            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {SYMBOLS_TEXTS.COLORS_GOLD_TITLE}
            </Title>

            <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {SYMBOLS_TEXTS.COLORS_GOLD_DESC}
            </Text>

            <LayoutContainer className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <LayoutContainer className="w-4 h-4 rounded-full bg-amber-400 inline-block border border-black/20 shrink-0" />
              <Text className="text-xs font-mono font-bold text-text-secondary">
                Ouro Centenário (#F59E0B)
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          {/* Card Azul Celeste (Cerúleo) */}
          <LayoutContainer className="relative rounded-3xl p-8 border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-surface to-background flex flex-col gap-4 text-left shadow-lg overflow-hidden group">
            <LayoutContainer className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              C
            </LayoutContainer>

            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {SYMBOLS_TEXTS.COLORS_BLUE_TITLE}
            </Title>

            <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {SYMBOLS_TEXTS.COLORS_BLUE_DESC}
            </Text>

            <LayoutContainer className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
              <LayoutContainer className="w-4 h-4 rounded-full bg-sky-500 inline-block border border-black/20 shrink-0" />
              <Text className="text-xs font-mono font-bold text-text-secondary">
                Azul Cerúleo (#0EA5E9)
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
