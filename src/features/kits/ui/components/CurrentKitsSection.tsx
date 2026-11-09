import React from 'react';
import { Sparkles, ZoomIn, Shield, Building2 } from 'lucide-react';
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
import { getKitTypeLabel, getKitTypeBadgeVariant } from '../../utils/kits.utils';

export interface CurrentKitsSectionProps {
  kits: ClubKit[];
  isLoading: boolean;
  onOpenLightbox: (kit: ClubKit, imageIndex?: number) => void;
}

export const CurrentKitsSection: React.FC<CurrentKitsSectionProps> = ({
  kits,
  isLoading,
  onOpenLightbox,
}) => {
  if (isLoading) {
    return (
      <LayoutContainer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LayoutContainer className="h-8 w-64 bg-surface/80 rounded-lg animate-pulse mb-4" />
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LayoutContainer
              key={i}
              className="h-96 rounded-2xl bg-surface/50 border border-border/60 animate-pulse"
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
      <LayoutContainer className="flex flex-col items-center sm:items-start text-center sm:text-left mb-8 sm:mb-10">
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

      {/* Grid de Uniformes Atuais */}
      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
        {kits.map((kit) => {
          const typeLabel = getKitTypeLabel(kit.kitType);
          const badgeVariant = getKitTypeBadgeVariant(kit.kitType);
          const hasGallery = kit.galleryUrls && kit.galleryUrls.length > 0;

          return (
            <LayoutContainer
              key={kit.id}
              className="flex flex-col bg-surface/90 hover:bg-surface border border-border/80 hover:border-primary/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Imagem Principal do Manto */}
              <LayoutContainer
                onClick={() => onOpenLightbox(kit, 0)}
                className="relative w-full h-72 sm:h-84 bg-gradient-to-b from-background/40 to-surface/80 flex items-center justify-center p-6 cursor-pointer overflow-hidden border-b border-border/60"
              >
                <SafeImage
                  src={kit.imageUrl}
                  alt={kit.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                  fallbackSrc="/images/pelotas-logo.png"
                />

                {/* Badge Flutuante do Tipo */}
                <LayoutContainer className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                  <Badge variant={badgeVariant} size="sm" className="font-bold text-xs shadow-md">
                    <Text as="span">{typeLabel}</Text>
                  </Badge>
                  <Badge variant="default" size="sm" className="font-semibold text-xs backdrop-blur-md bg-surface/80 shadow-md">
                    <Text as="span">{kit.competition} • {kit.seasonYear}</Text>
                  </Badge>
                </LayoutContainer>

                {/* Botão Hover de Zoom */}
                <LayoutContainer className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<ZoomIn className="w-4 h-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(kit, 0);
                    }}
                    className="shadow-lg text-xs font-bold"
                  >
                    {KITS_TEXTS.CARD_ZOOM_BTN}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>

              {/* Informações Textuais do Manto */}
              <LayoutContainer className="flex-1 flex flex-col p-6">
                <Title
                  level="h3"
                  className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mb-2"
                >
                  {kit.name}
                </Title>

                {kit.description && (
                  <Text as="p" className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                    {kit.description}
                  </Text>
                )}

                {/* Fornecedor e Patrocínio */}
                <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/60 mt-auto">
                  {kit.manufacturer && (
                    <LayoutContainer className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      <LayoutContainer className="flex flex-col">
                        <Text as="span" className="text-[11px] font-bold text-text-muted uppercase">
                          {KITS_TEXTS.CARD_MANUFACTURER_LABEL}
                        </Text>
                        <Text as="span" className="text-xs font-semibold text-text-primary">
                          {kit.manufacturer}
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>
                  )}

                  {kit.sponsor && (
                    <LayoutContainer className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      <LayoutContainer className="flex flex-col">
                        <Text as="span" className="text-[11px] font-bold text-text-muted uppercase">
                          {KITS_TEXTS.CARD_SPONSOR_LABEL}
                        </Text>
                        <Text as="span" className="text-xs font-semibold text-text-primary">
                          {kit.sponsor}
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>
                  )}
                </LayoutContainer>

                {/* Miniaturas da Galeria Complementar */}
                {hasGallery && (
                  <LayoutContainer className="mt-4 pt-3 border-t border-border/60">
                    <Text as="span" className="text-xs font-bold text-text-secondary mb-2 block">
                      {KITS_TEXTS.COMPLEMENTARY_PHOTOS_TITLE}
                    </Text>
                    <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-1">
                      {kit.galleryUrls.map((galleryUrl, gIndex) => (
                        <LayoutContainer
                          key={gIndex}
                          onClick={() => onOpenLightbox(kit, gIndex + 1)}
                          className="relative w-14 h-14 rounded-lg overflow-hidden border border-border/80 hover:border-primary cursor-pointer shrink-0 transition-transform duration-200 hover:scale-105 bg-background/50"
                        >
                          <SafeImage
                            src={galleryUrl}
                            alt={`${kit.name} - Detalhe ${gIndex + 1}`}
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
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};

