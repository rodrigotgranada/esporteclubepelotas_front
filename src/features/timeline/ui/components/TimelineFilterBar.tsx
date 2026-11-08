'use client';

import React from 'react';
import {
  LayoutContainer,
  Input,
  Button,
  Text,
} from '@/shared/ui/components';
import { TimelineCategoryData } from '../../services/timeline.service';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import {
  Search,
  X,
  Filter,
  Trophy,
  Landmark,
  Star,
  Flag,
  Sparkles,
  Medal,
  Shield,
  Heart,
} from 'lucide-react';

interface TimelineFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: TimelineCategoryData[];
  categoryCounts: Record<string, number>;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
  totalEventsCount: number;
  filteredEventsCount: number;
}

const getCategoryIcon = (iconName?: string) => {
  const normalized = (iconName || '').toLowerCase();
  switch (normalized) {
    case 'trophy':
    case 'title':
    case 'titulos':
      return <Trophy className="w-3.5 h-3.5" />;
    case 'landmark':
    case 'stadium':
    case 'estadio':
      return <Landmark className="w-3.5 h-3.5" />;
    case 'star':
    case 'glory':
    case 'glorias':
      return <Star className="w-3.5 h-3.5" />;
    case 'medal':
    case 'homenagens':
      return <Medal className="w-3.5 h-3.5" />;
    case 'shield':
    case 'simbolos':
      return <Shield className="w-3.5 h-3.5" />;
    case 'heart':
    case 'torcida':
      return <Heart className="w-3.5 h-3.5" />;
    case 'sparkles':
    case 'milestone':
    case 'marcos':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'flag':
    case 'foundation':
    case 'fundacao':
    default:
      return <Flag className="w-3.5 h-3.5" />;
  }
};

export const TimelineFilterBar: React.FC<TimelineFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  totalEventsCount,
  filteredEventsCount,
}) => {
  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory);

  return (
    <LayoutContainer className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-8 flex flex-col gap-4">
      {/* Barra de Busca Textual */}
      <LayoutContainer className="relative w-full">
        <LayoutContainer className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
          <Search className="w-4 h-4 text-primary" />
        </LayoutContainer>

        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={TIMELINE_CONSTANTS.SEARCH_PLACEHOLDER}
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-surface/80 border border-border focus:border-primary text-sm placeholder:text-text-secondary/70 backdrop-blur-md shadow-xs transition-all"
        />

        {searchQuery && (
          <Button
            type="button"
            size="none"
            variant="custom"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-primary transition-colors cursor-pointer"
            title={TIMELINE_CONSTANTS.CLEAR_SEARCH_TOOLTIP}
            aria-label={TIMELINE_CONSTANTS.CLEAR_SEARCH_TOOLTIP}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </LayoutContainer>

      {/* Pílulas de Categorias */}
      {categories.length > 0 && (
        <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* Chip 'Todos' */}
          <Button
            type="button"
            size="none"
            variant="custom"
            onClick={() => onSelectCategory(null)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              selectedCategory === null
                ? 'bg-primary text-black ring-2 ring-primary/40'
                : 'bg-surface/80 hover:bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <Text as="span">{TIMELINE_CONSTANTS.ALL_CATEGORIES_LABEL}</Text>
            <Text
              as="span"
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedCategory === null
                  ? 'bg-black/20 text-black'
                  : 'bg-border/60 text-text-secondary'
              }`}
            >
              {totalEventsCount}
            </Text>
          </Button>

          {/* Chips das Categorias Dinâmicas */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const count = categoryCounts[cat.slug] || 0;
            return (
              <Button
                type="button"
                key={cat.id || cat.slug}
                size="none"
                variant="custom"
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  isSelected
                    ? 'bg-primary text-black ring-2 ring-primary/40'
                    : 'bg-surface/80 hover:bg-surface border border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <Text as="span">{cat.name}</Text>
                <Text
                  as="span"
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-black/20 text-black'
                      : 'bg-border/60 text-text-secondary'
                  }`}
                >
                  {count}
                </Text>
              </Button>
            );
          })}
        </LayoutContainer>
      )}

      {/* Indicador de Resultados Filtrados */}
      {hasActiveFilters && (
        <LayoutContainer className="flex items-center justify-between text-xs text-text-secondary px-1">
          <Text as="span">
            Exibindo <strong className="text-primary">{filteredEventsCount}</strong> de{' '}
            {totalEventsCount} {TIMELINE_CONSTANTS.FILTER_RESULTS_COUNT}
          </Text>

          <Button
            type="button"
            size="none"
            variant="custom"
            onClick={() => {
              onSearchChange('');
              onSelectCategory(null);
            }}
            className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <Text as="span">{TIMELINE_CONSTANTS.BTN_CLEAR_FILTERS}</Text>
          </Button>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
