import React from 'react';
import { Dog, Calendar, Sparkles, Image as ImageIcon, ZoomIn } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
} from '@/shared/ui/components';
import { ClubSymbol } from '../../types/symbols.types';
import { SYMBOLS_TEXTS } from '../../constants/symbols.constants';

export interface MascotSectionProps {
  officialMascot: ClubSymbol | null;
  historicalMascots: ClubSymbol[];
  onOpenLightbox: (imageUrl: string, title: string, subtitle?: string) => void;
}

export const MascotSection: React.FC<MascotSectionProps> = ({
  officialMascot,
  historicalMascots,
  onOpenLightbox,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-12 sm:gap-16">
      {/* 1. Card Monumental do Mascote Oficial */}
      {officialMascot && (
        <LayoutContainer className="relative overflow-hidden rounded-3xl border border-primary/40 bg-surface/80 backdrop-blur-md p-6 sm:p-12 shadow-xl shadow-primary/5">
          <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Foto do Mascote Oficial em Alta Definição */}
            <LayoutContainer className="lg:col-span-5 flex justify-center">
              <LayoutContainer
                onClick={() =>
                  officialMascot.imageUrl &&
                  onOpenLightbox(
                    officialMascot.imageUrl,
                    officialMascot.name,
                    officialMascot.subtitle || undefined
                  )
                }
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border-2 border-primary/30 overflow-hidden bg-background/50 shadow-2xl group cursor-pointer"
              >
                <SafeImage
                  src={officialMascot.imageUrl || '/images/pelotas-logo.png'}
                  alt={officialMascot.name}
                  fill
                  sizes="320px"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="/images/pelotas-logo.png"
                />
                <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                  <ZoomIn className="w-5 h-5 text-primary" />
                  <Text as="span">Ampliar Imagem</Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* História e Descrição */}
            <LayoutContainer className="lg:col-span-7 flex flex-col gap-4 text-left">
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

              <Title level="h2" className="text-2xl sm:text-4xl font-black text-text-primary">
                {officialMascot.name}
              </Title>

              {officialMascot.subtitle && (
                <Text className="text-base sm:text-lg font-bold text-primary">
                  {officialMascot.subtitle}
                </Text>
              )}

              <Text
                as="p"
                className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans mt-2 whitespace-pre-line"
              >
                {officialMascot.description}
              </Text>

              {/* Mini-galeria complementar do Mascote Oficial (se houver) */}
              {officialMascot.galleryUrls && officialMascot.galleryUrls.length > 0 && (
                <LayoutContainer className="pt-4 border-t border-border/60">
                  <Text className="text-xs font-bold text-text-secondary mb-3 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    Fotos Complementares do Mascote Oficial:
                  </Text>
                  <LayoutContainer className="flex flex-wrap gap-3">
                    {officialMascot.galleryUrls.map((url, idx) => (
                      <LayoutContainer
                        key={idx}
                        onClick={() =>
                          onOpenLightbox(
                            url,
                            officialMascot.name,
                            `Foto ${idx + 1}`
                          )
                        }
                        className="relative w-16 h-16 rounded-xl border border-border overflow-hidden bg-background cursor-pointer hover:border-primary transition-colors"
                      >
                        <SafeImage
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          fill
                          sizes="64px"
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

      {/* 2. Galeria de Mascotes & Versões Históricas */}
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
                <LayoutContainer className="flex flex-col gap-4">
                  {/* Foto da Versão */}
                  <LayoutContainer
                    onClick={() =>
                      mascot.imageUrl &&
                      onOpenLightbox(
                        mascot.imageUrl,
                        mascot.name,
                        mascot.subtitle || undefined
                      )
                    }
                    className="relative w-full h-48 rounded-xl overflow-hidden bg-background/50 border border-border/60 cursor-pointer"
                  >
                    <SafeImage
                      src={mascot.imageUrl || '/images/pelotas-logo.png'}
                      alt={mascot.name}
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

                  {/* Período / Ano */}
                  <LayoutContainer className="flex items-center gap-2">
                    <Badge variant="default" size="sm" className="text-[10px] font-bold">
                      <Calendar className="w-3 h-3 mr-1" />
                      <Text as="span">
                        {mascot.yearStart && mascot.yearEnd
                          ? `${mascot.yearStart} - ${mascot.yearEnd}`
                          : mascot.yearStart
                          ? `Ano ${mascot.yearStart}`
                          : 'Histórico'}
                      </Text>
                    </Badge>
                  </LayoutContainer>

                  <Title level="h4" className="text-lg font-black text-text-primary leading-snug">
                    {mascot.name}
                  </Title>

                  {mascot.subtitle && (
                    <Text className="text-xs font-bold text-primary">
                      {mascot.subtitle}
                    </Text>
                  )}

                  {mascot.description && (
                    <Text as="p" className="text-xs text-text-secondary leading-relaxed font-sans line-clamp-4">
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
