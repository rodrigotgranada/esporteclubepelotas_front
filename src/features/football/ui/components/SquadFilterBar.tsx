'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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

const YOUTH_CATEGORY_KEYS: SquadCategory[] = ['SUB_20', 'SUB_17', 'SUB_15'];

const isYouthCategory = (cat: string): boolean => {
  return YOUTH_CATEGORY_KEYS.includes(cat as SquadCategory) || cat.startsWith('SUB_');
};

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
  const [isYouthDropdownOpen, setIsYouthDropdownOpen] = useState(false);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

  const youthDropdownRef = useRef<HTMLDivElement>(null);
  const seasonDropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdowns em cliques externos ou tecla Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        youthDropdownRef.current &&
        !youthDropdownRef.current.contains(target)
      ) {
        setIsYouthDropdownOpen(false);
      }
      if (
        seasonDropdownRef.current &&
        !seasonDropdownRef.current.contains(target)
      ) {
        setIsSeasonDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsYouthDropdownOpen(false);
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

  // Categorias disponíveis no ano selecionado
  const hasProfessional = availableCategories.includes('PROFESSIONAL');
  const hasFeminine = availableCategories.includes('FEMININE');

  const youthCategories = useMemo(() => {
    return availableCategories.filter((cat) => isYouthCategory(cat));
  }, [availableCategories]);

  const isYouthSelected = isYouthCategory(selectedCategory);

  // Label ativa da categoria de base selecionada
  const selectedYouthLabel = useMemo(() => {
    if (!isYouthSelected) return null;
    return (
      FOOTBALL_CONSTANTS.CATEGORIES[
        selectedCategory as keyof typeof FOOTBALL_CONSTANTS.CATEGORIES
      ] || selectedCategory
    );
  }, [isYouthSelected, selectedCategory]);

  return (
    <LayoutContainer className="flex flex-col gap-4 mb-8">
      <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Categorias Dinâmicas (Profissional, Feminino, Dropdown de Base) */}
        <LayoutContainer className="flex items-center gap-2 overflow-x-visible pb-1 no-scrollbar flex-wrap">
          {/* Botão: Profissional */}
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

          {/* Botão: Feminino */}
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

          {/* Dropdown: Categorias de Base (somente se houver categorias de base no ano) */}
          {youthCategories.length > 0 && (
            <LayoutContainer className="relative inline-block" ref={youthDropdownRef}>
              <Button
                type="button"
                variant={isYouthSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsYouthDropdownOpen((prev) => !prev)}
                aria-expanded={isYouthDropdownOpen}
                aria-label={FOOTBALL_CONSTANTS.YOUTH_DROPDOWN.ARIA_BUTTON}
                className="font-bold text-xs whitespace-nowrap rounded-full transition-all flex items-center gap-1.5"
              >
                <Text as="span">
                  {isYouthSelected && selectedYouthLabel
                    ? `${FOOTBALL_CONSTANTS.YOUTH_DROPDOWN.PREFIX_LABEL} ${selectedYouthLabel}`
                    : FOOTBALL_CONSTANTS.YOUTH_DROPDOWN.DEFAULT_LABEL}
                </Text>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isYouthDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>

              {/* Menu Flutuante de Categorias de Base */}
              {isYouthDropdownOpen && (
                <LayoutContainer className="absolute left-0 top-full mt-2 min-w-[210px] bg-surface border border-border rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {youthCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const fullKey = `${cat}_FULL` as keyof typeof FOOTBALL_CONSTANTS.CATEGORIES;
                    const fullLabel =
                      FOOTBALL_CONSTANTS.CATEGORIES[fullKey] ||
                      FOOTBALL_CONSTANTS.CATEGORIES[
                        cat as keyof typeof FOOTBALL_CONSTANTS.CATEGORIES
                      ] ||
                      cat;

                    return (
                      <Button
                        key={cat}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onSelectCategory(cat);
                          setIsYouthDropdownOpen(false);
                        }}
                        className={`w-full justify-between text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                        }`}
                      >
                        <Text as="span">{fullLabel}</Text>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </Button>
                    );
                  })}
                </LayoutContainer>
              )}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Seletor de Temporadas e Busca */}
        <LayoutContainer className="flex items-center gap-3">
          {/* Seletor Customizado de Temporadas */}
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

              {/* Menu Flutuante de Temporadas */}
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
