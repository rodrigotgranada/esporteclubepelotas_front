import React from 'react';
import { Flag, Palette, Sparkles, ZoomIn } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { ClubSymbol } from '../../types/symbols.types';
import { SYMBOLS_TEXTS } from '../../constants/symbols.constants';

export interface FlagAndColorsSectionProps {
  officialFlag: ClubSymbol | null;
  colorsSymbol: ClubSymbol | null;
  onOpenLightbox: (imageUrl: string, title: string, subtitle?: string) => void;
}

export const FlagAndColorsSection: React.FC<FlagAndColorsSectionProps> = ({
  officialFlag,
  colorsSymbol,
  onOpenLightbox,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-12 sm:gap-16">
      {/* 1. O Pavilhão Oficial */}
      {officialFlag && (
        <LayoutContainer className="relative overflow-hidden rounded-3xl border border-primary/40 bg-surface/80 backdrop-blur-md p-6 sm:p-12 shadow-xl shadow-primary/5">
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Imagem da Bandeira / Pavilhão */}
            <LayoutContainer className="lg:col-span-5 flex justify-center">
              <LayoutContainer
                onClick={() =>
                  officialFlag.imageUrl &&
                  onOpenLightbox(
                    officialFlag.imageUrl,
                    officialFlag.name,
                    officialFlag.subtitle || undefined
                  )
                }
                className="relative w-64 h-48 sm:w-80 sm:h-56 rounded-3xl border-2 border-primary/30 overflow-hidden bg-background/50 shadow-2xl group cursor-pointer flex items-center justify-center p-4"
              >
                <SafeImage
                  src={officialFlag.imageUrl || '/images/pelotas-logo.png'}
                  alt={officialFlag.name}
                  fill
                  sizes="320px"
                  className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                  fallbackSrc="/images/pelotas-logo.png"
                />
                <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <ZoomIn className="w-5 h-5 text-primary" />
                  <span>Ampliar Pavilhão</span>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Descrição da Bandeira */}
            <LayoutContainer className="lg:col-span-7 flex flex-col gap-4 text-left">
              <LayoutContainer className="flex items-center gap-2">
                <Badge
                  variant="primary"
                  size="sm"
                  className="font-extrabold uppercase text-[10px] tracking-wider px-3 py-1 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Pavilhão Oficial</span>
                </Badge>
              </LayoutContainer>

              <Title level="h2" className="text-2xl sm:text-4xl font-black text-text-primary">
                {officialFlag.name}
              </Title>

              {officialFlag.subtitle && (
                <Text className="text-base sm:text-lg font-bold text-primary">
                  {officialFlag.subtitle}
                </Text>
              )}

              <Text
                as="p"
                className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans mt-2 whitespace-pre-line"
              >
                {officialFlag.description}
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* 2. As Cores Áureo-Cerúleas */}
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
