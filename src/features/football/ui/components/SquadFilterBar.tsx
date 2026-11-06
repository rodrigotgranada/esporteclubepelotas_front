'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Check } from 'lucide-react';
import { LayoutContainer, Input, Button, Text } from '@/shared/ui/components';
import { FOOTBALL_CONSTANTS } from '../../constants/football.constants';
import { SquadCategory } from '../../services/football.service';

export interface SquadFilterBarProps {
  selectedCategory: SquadCategory;
  onSelectCategory: (cat: SquadCategory) => void;
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
  availableYears: number[];
  availableCategories: SquadCategory[];
  search: string;
  onSearchChange: (val: string) => void;
}

export const SquadFilterBar: React.FC<SquadFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedYear,
  onSelectYear,
  availableYears,
  availableCategories,
  search,
  onSearchChange,
}) => {
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const seasonDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        seasonDropdownRef.current &&
        !seasonDropdownRef.current.contains(target)
      ) {
        setIsSeasonDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSeasonDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hasProfessional = availableCategories.includes('PROFESSIONAL');
  const hasFeminine = availableCategories.includes('FEMININE');

  return (
    <LayoutContainer className="flex flex-col gap-4 mb-8">
      <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Categorias Principais (Masculino e Feminino) */}
        <LayoutContainer className="flex items-center gap-2 overflow-x-visible pb-1 no-scrollbar flex-wrap">
          {hasProfessional && (
            <Button
              type="button"
              variant={selectedCategory === 'PROFESSIONAL' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelectCategory('PROFESSIONAL')}
              className="font-bold text-xs whitespace-nowrap rounded-full transition-all"
            >
              {FOOTBALL_CONSTANTS.CATEGORIES.PROFESSIONAL}
            </Button>
          )}

          {hasFeminine && (
            <Button
              type="button"
              variant={selectedCategory === 'FEMININE' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelectCategory('FEMININE')}
              className="font-bold text-xs whitespace-nowrap rounded-full transition-all"
            >
              {FOOTBALL_CONSTANTS.CATEGORIES.FEMININE}
            </Button>
          )}
        </LayoutContainer>

        {/* Seletor de Temporadas e Busca */}
        <LayoutContainer className="flex items-center gap-3">
          {availableYears.length > 0 && (
            <LayoutContainer className="relative inline-block" ref={seasonDropdownRef}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSeasonDropdownOpen((prev) => !prev)}
                aria-expanded={isSeasonDropdownOpen}
                aria-label={FOOTBALL_CONSTANTS.SELECTION.ARIA_SEASON_BUTTON}
                className="font-bold text-xs whitespace-nowrap rounded-2xl transition-all flex items-center gap-2 py-2 px-3 bg-surface border-border text-text-primary"
              >
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <Text as="span">
                  {FOOTBALL_CONSTANTS.SELECTION.SEASON_PREFIX} {selectedYear}
                </Text>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                    isSeasonDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>

              {isSeasonDropdownOpen && (
                <LayoutContainer className="absolute right-0 top-full mt-2 min-w-[170px] bg-surface border border-border rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {availableYears.map((year) => {
                    const isSelected = selectedYear === year;
                    return (
                      <Button
                        key={year}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onSelectYear(year);
                          setIsSeasonDropdownOpen(false);
                        }}
                        className={`w-full justify-between text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                        }`}
                      >
                        <Text as="span">
                          {FOOTBALL_CONSTANTS.SELECTION.SEASON_PREFIX} {year}
                        </Text>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </Button>
                    );
                  })}
                </LayoutContainer>
              )}
            </LayoutContainer>
          )}

          {/* Busca Rápida no Elenco */}
          <LayoutContainer className="relative min-w-[200px] flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={FOOTBALL_CONSTANTS.SELECTION.SEARCH_PLACEHOLDER}
              className="pl-9 py-2 text-xs rounded-2xl w-full"
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
