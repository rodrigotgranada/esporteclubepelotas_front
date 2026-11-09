import React from 'react';
import { Sparkles, ZoomIn, Shield } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  SafeImage,
} from '@/shared/ui/components';
import { ClubKit } from '../../types/kits.types';
import { KITS_TEXTS } from '../../constants/kits.constants';
import { getKitTypeBadgeVariant, getKitDisplayTitle } from '../../utils/kits.utils';

export interface CurrentKitsSectionProps {
  kits: ClubKit[];
  isLoading: boolean;
  onOpenLightbox: (index: number) => void;
}

export const CurrentKitsSection: React.FC<CurrentKitsSectionProps> = ({
  kits,
  isLoading,
  onOpenLightbox,
}) => {
  if (isLoading) {
    return (
      <LayoutContainer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LayoutContainer className="h-8 w-64 bg-surface/80 rounded-lg animate-pulse mb-6" />
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <LayoutContainer
              key={i}
              className="h-80 rounded-2xl bg-surface/50 border border-border/60 animate-pulse"
            />
          ))}
        </LayoutContainer>
      </LayoutContainer>
    );
  }

  if (kits.length === 0) {
    return null;
  }

  return (
    <LayoutContainer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Cabeçalho da Seção */}
      <LayoutContainer className="flex flex-col items-center sm:items-start text-center sm:text-left mb-8">
        <Badge
          variant="primary"
          size="sm"
          className="font-extrabold uppercase tracking-widest px-3 py-1 text-[11px] inline-flex items-center gap-1.5 shadow-xs mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <Text as="span">{KITS_TEXTS.CURRENT_SECTION_BADGE}</Text>
        </Badge>
        <Title
          level="h2"
          className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight mb-2"
        >
          {KITS_TEXTS.CURRENT_SECTION_TITLE}
        </Title>
        <Text as="p" className="text-sm sm:text-base text-text-secondary max-w-xl">
          {KITS_TEXTS.CURRENT_SECTION_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Grid de Uniformes Atuais: 1 ao lado do outro */}
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kits.map((kit, index) => {
          const displayTitle = getKitDisplayTitle(kit);
          const badgeVariant = getKitTypeBadgeVariant(kit.kitType);
          const isSpecial = kit.kitType === 'SPECIAL';

          return (
            <LayoutContainer
              key={kit.id}
              onClick={() => onOpenLightbox(index)}
              className="flex flex-col bg-surface/90 hover:bg-surface border border-border/80 hover:border-primary/50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              {/* Imagem do Manto em Foco */}
              <LayoutContainer className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-background/30 to-surface/90 flex items-center justify-center p-4 overflow-hidden border-b border-border/60">
                <SafeImage
                  src={kit.imageUrl}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                  fallbackSrc="/images/pelotas-logo.png"
                />

                {/* Badge Flutuante do Tipo */}
                <LayoutContainer className="absolute top-3 left-3 z-10">
                  <Badge variant={badgeVariant} size="sm" className="font-bold text-[11px] shadow-md">
                    <Text as="span">
                      {isSpecial ? KITS_TEXTS.TYPE_SPECIAL : displayTitle}
                    </Text>
                  </Badge>
                </LayoutContainer>

                {/* Botão Hover de Zoom */}
                <LayoutContainer className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<ZoomIn className="w-3.5 h-3.5" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(index);
                    }}
                    className="shadow-lg text-xs font-bold"
                  >
                    {KITS_TEXTS.CARD_ZOOM_BTN}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>

              {/* Informações Simplificadas do Card */}
              <LayoutContainer className="p-4 flex flex-col flex-1 text-center items-center justify-between gap-2">
                <LayoutContainer className="flex flex-col items-center">
                  <Title
                    level="h3"
                    className="text-base sm:text-lg font-black text-text-primary tracking-tight"
                  >
                    {displayTitle}
                  </Title>
                  <Text as="span" className="text-xs text-text-muted mt-0.5">
                    {kit.competition} • {kit.seasonYear}
                  </Text>
                </LayoutContainer>

                {/* Fornecedor Esportivo Opcional */}
                {kit.manufacturer && (
                  <LayoutContainer className="flex items-center gap-1.5 pt-2 border-t border-border/50 text-xs text-text-muted w-full justify-center">
                    <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                    <Text as="span" className="font-semibold text-text-secondary">
                      {kit.manufacturer}
                    </Text>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
