import React from 'react';
import { History, ZoomIn, Trophy, Shield, Building2 } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  SafeImage,
} from '@/shared/ui/components';
import { ClubKit, ClubKitCompetitionItem } from '../../types/kits.types';
import { KITS_TEXTS } from '../../constants/kits.constants';
import { getKitTypeLabel, getKitTypeBadgeVariant } from '../../utils/kits.utils';

export interface HistoricalKitsSectionProps {
  competitions: ClubKitCompetitionItem[];
  selectedCompetition: string | null;
  kits: ClubKit[];
  isLoading: boolean;
  hasHistoricalKits: boolean;
  onSelectCompetition: (competition: string) => void;
  onOpenLightbox: (kit: ClubKit, imageIndex?: number) => void;
}

export const HistoricalKitsSection: React.FC<HistoricalKitsSectionProps> = ({
  competitions,
  selectedCompetition,
  kits,
  isLoading,
  hasHistoricalKits,
  onSelectCompetition,
  onOpenLightbox,
}) => {
  // Regra de Ouro: se não houver mantos históricos ou competições passadas, não exibe nada
  if (!hasHistoricalKits || competitions.length === 0) {
    return null;
  }

  return (
    <LayoutContainer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-border/60">
      {/* Cabeçalho da Seção */}
      <LayoutContainer className="flex flex-col items-center sm:items-start text-center sm:text-left mb-8">
        <Badge
          variant="warning"
          size="sm"
          className="font-extrabold uppercase tracking-widest px-3 py-1 text-[11px] inline-flex items-center gap-1.5 shadow-xs mb-3"
        >
          <History className="w-3.5 h-3.5" />
          <Text as="span">{KITS_TEXTS.HISTORICAL_SECTION_BADGE}</Text>
        </Badge>
        <Title
          level="h2"
          className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight mb-2"
        >
          {KITS_TEXTS.HISTORICAL_SECTION_TITLE}
        </Title>
        <Text as="p" className="text-sm sm:text-base text-text-secondary max-w-2xl">
          {KITS_TEXTS.HISTORICAL_SECTION_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Seletor de Competições Mobile First */}
      <LayoutContainer className="mb-10">
        <Text as="span" className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 block">
          {KITS_TEXTS.HISTORICAL_SELECTOR_LABEL}
        </Text>
        <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {competitions.map((comp) => {
            const isSelected = selectedCompetition?.toLowerCase() === comp.competition.toLowerCase();
            return (
              <Button
                key={`${comp.competition}-${comp.seasonYear}`}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onSelectCompetition(comp.competition)}
                leftIcon={<Trophy className="w-4 h-4 shrink-0" />}
                className={`font-bold text-xs sm:text-sm px-4 py-2 shrink-0 rounded-xl transition-all duration-200 ${
                  isSelected ? 'shadow-md scale-102' : 'hover:border-primary/60'
                }`}
              >
                {comp.label}
              </Button>
            );
          })}
        </LayoutContainer>
      </LayoutContainer>

      {/* Loading state dos uniformes da competição */}
      {isLoading ? (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LayoutContainer
              key={i}
              className="h-80 rounded-2xl bg-surface/50 border border-border/60 animate-pulse"
            />
          ))}
        </LayoutContainer>
      ) : kits.length > 0 ? (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => {
            const typeLabel = getKitTypeLabel(kit.kitType);
            const badgeVariant = getKitTypeBadgeVariant(kit.kitType);
            const hasGallery = kit.galleryUrls && kit.galleryUrls.length > 0;

            return (
              <LayoutContainer
                key={kit.id}
                className="flex flex-col bg-surface/80 hover:bg-surface border border-border/70 hover:border-primary/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                {/* Imagem do Manto com Zoom */}
                <LayoutContainer
                  onClick={() => onOpenLightbox(kit, 0)}
                  className="relative w-full h-64 bg-background/50 flex items-center justify-center p-4 cursor-pointer overflow-hidden border-b border-border/60"
                >
                  <SafeImage
                    src={kit.imageUrl}
                    alt={kit.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    fallbackSrc="/images/pelotas-logo.png"
                  />

                  <LayoutContainer className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                    <Badge variant={badgeVariant} size="sm" className="font-bold text-[11px] shadow-sm">
                      <Text as="span">{typeLabel}</Text>
                    </Badge>
                    <Badge variant="default" size="sm" className="text-[11px] bg-surface/80">
                      <Text as="span">{kit.seasonYear}</Text>
                    </Badge>
                  </LayoutContainer>

                  <LayoutContainer className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<ZoomIn className="w-3.5 h-3.5" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLightbox(kit, 0);
                      }}
                      className="text-xs font-bold"
                    >
                      {KITS_TEXTS.CARD_ZOOM_BTN}
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Conteúdo do Card */}
                <LayoutContainer className="flex-1 flex flex-col p-5">
                  <Title level="h4" className="text-lg font-bold text-text-primary tracking-tight mb-1">
                    {kit.name}
                  </Title>
                  <Text as="span" className="text-xs font-semibold text-secondary mb-3">
                    {kit.competition}
                  </Text>

                  {kit.description && (
                    <Text as="p" className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">
                      {kit.description}
                    </Text>
                  )}

                  {/* Fornecedor e Patrocínio */}
                  {(kit.manufacturer || kit.sponsor) && (
                    <LayoutContainer className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/60 mt-auto text-xs text-text-muted">
                      {kit.manufacturer && (
                        <LayoutContainer className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                          <Text as="span" className="font-medium text-text-secondary">{kit.manufacturer}</Text>
                        </LayoutContainer>
                      )}
                      {kit.sponsor && (
                        <LayoutContainer className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          <Text as="span" className="font-medium text-text-secondary">{kit.sponsor}</Text>
                        </LayoutContainer>
                      )}
                    </LayoutContainer>
                  )}

                  {/* Miniaturas de Galeria se existirem */}
                  {hasGallery && (
                    <LayoutContainer className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/60 overflow-x-auto">
                      {kit.galleryUrls.map((gUrl, gIdx) => (
                        <LayoutContainer
                          key={gIdx}
                          onClick={() => onOpenLightbox(kit, gIdx + 1)}
                          className="relative w-10 h-10 rounded-md overflow-hidden border border-border/70 hover:border-primary cursor-pointer shrink-0"
                        >
                          <SafeImage
                            src={gUrl}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                            fallbackSrc="/images/pelotas-logo.png"
                          />
                        </LayoutContainer>
                      ))}
                    </LayoutContainer>
                  )}
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      ) : null}
    </LayoutContainer>
  );
};

