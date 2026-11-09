import React, { useState, useMemo } from 'react';
import { History, ZoomIn, Trophy, Shield, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  Select,
  Option,
  SafeImage,
} from '@/shared/ui/components';
import { ClubKit, ClubKitCompetitionItem } from '../../types/kits.types';
import { KITS_TEXTS } from '../../constants/kits.constants';
import { getKitTypeBadgeVariant, getKitDisplayTitle } from '../../utils/kits.utils';

export interface HistoricalKitsSectionProps {
  competitions: ClubKitCompetitionItem[];
  selectedCompetition: string | null;
  kits: ClubKit[];
  isLoading: boolean;
  hasHistoricalKits: boolean;
  onSelectCompetition: (competition: string) => void;
  onOpenLightbox: (index: number) => void;
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
  const [filterQuery, setFilterQuery] = useState('');

  // Filtro de competições para o dropdown
  const filteredCompetitions = useMemo(() => {
    if (!filterQuery.trim()) return competitions;
    const q = filterQuery.toLowerCase().trim();
    return competitions.filter(
      (c) =>
        c.competition.toLowerCase().includes(q) ||
        c.seasonYear.toString().includes(q) ||
        c.label.toLowerCase().includes(q),
    );
  }, [competitions, filterQuery]);

  // Regra de ouro: se não houver mantos históricos ou competições passadas, não exibe nada
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

      {/* Seletor de Torneios Anteriores: Dropdown com Input de Filtro */}
      <LayoutContainer className="mb-10 p-4 sm:p-5 rounded-2xl bg-surface/70 border border-border/80 shadow-sm max-w-2xl">
        <LayoutContainer className="flex flex-col gap-3">
          <LayoutContainer className="flex items-center justify-between gap-2 flex-wrap">
            <LayoutContainer className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary shrink-0" />
              <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wider">
                {KITS_TEXTS.HISTORICAL_SELECTOR_LABEL}
              </Text>
            </LayoutContainer>
            <Text as="span" className="text-[11px] text-text-muted">
              {competitions.length} {competitions.length === 1 ? 'competição' : 'competições'} no acervo
            </Text>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Input de filtro para torneios */}
            <LayoutContainer className="sm:col-span-6 relative">
              <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </LayoutContainer>
              <Input
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filtrar torneio ou ano..."
                className="pl-8 text-xs sm:text-sm h-10 w-full"
              />
            </LayoutContainer>

            {/* Dropdown Select com os torneios filtrados */}
            <LayoutContainer className="sm:col-span-6">
              <Select
                value={selectedCompetition || ''}
                onChange={(e) => onSelectCompetition(e.target.value)}
                className="w-full text-xs sm:text-sm h-10 font-bold"
              >
                {filteredCompetitions.map((comp) => (
                  <Option
                    key={`${comp.competition}-${comp.seasonYear}`}
                    value={comp.competition}
                  >
                    {comp.label}
                  </Option>
                ))}
              </Select>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Grid de Uniformes Anteriores: 1 ao lado do outro */}
      {isLoading ? (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <LayoutContainer
              key={i}
              className="h-80 rounded-2xl bg-surface/50 border border-border/60 animate-pulse"
            />
          ))}
        </LayoutContainer>
      ) : kits.length > 0 ? (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {kits.map((kit, index) => {
            const displayTitle = getKitDisplayTitle(kit);
            const badgeVariant = getKitTypeBadgeVariant(kit.kitType);
            const isSpecial = kit.kitType === 'SPECIAL';

            return (
              <LayoutContainer
                key={kit.id}
                onClick={() => onOpenLightbox(index)}
                className="flex flex-col bg-surface/80 hover:bg-surface border border-border/70 hover:border-primary/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                {/* Imagem do Manto com Zoom */}
                <LayoutContainer className="relative w-full h-60 sm:h-64 bg-background/50 flex items-center justify-center p-4 overflow-hidden border-b border-border/60">
                  <SafeImage
                    src={kit.imageUrl}
                    alt={displayTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    fallbackSrc="/images/pelotas-logo.png"
                  />

                  <LayoutContainer className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                    <Badge variant={badgeVariant} size="sm" className="font-bold text-[11px] shadow-sm">
                      <Text as="span">
                        {isSpecial ? KITS_TEXTS.TYPE_SPECIAL : displayTitle}
                      </Text>
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
                        onOpenLightbox(index);
                      }}
                      className="text-xs font-bold shadow-md"
                    >
                      {KITS_TEXTS.CARD_ZOOM_BTN}
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Conteúdo Simplificado do Card */}
                <LayoutContainer className="p-4 flex flex-col flex-1 text-center items-center justify-between gap-2">
                  <LayoutContainer className="flex flex-col items-center">
                    <Title level="h4" className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                      {displayTitle}
                    </Title>
                    <Text as="span" className="text-xs text-text-muted mt-0.5">
                      {kit.competition} • {kit.seasonYear}
                    </Text>
                  </LayoutContainer>

                  {/* Fornecedor Opcional */}
                  {kit.manufacturer && (
                    <LayoutContainer className="flex items-center gap-1 pt-2 border-t border-border/50 text-xs text-text-muted w-full justify-center">
                      <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                      <Text as="span" className="font-semibold text-text-secondary">{kit.manufacturer}</Text>
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
