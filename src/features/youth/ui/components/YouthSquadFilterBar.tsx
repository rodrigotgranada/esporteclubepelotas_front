'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Shield, ChevronDown, Check, Search } from 'lucide-react';
import { LayoutContainer, Button, Text, Badge, Input } from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import {
  YouthCategoryType,
  YouthChampionshipGroup,
} from '../../hooks/useYouthSquads';

export interface YouthSquadFilterBarProps {
  championships: YouthChampionshipGroup[];
  selectedChampionship: YouthChampionshipGroup | null;
  onSelectChampionship: (key: string) => void;
  availableCategories: YouthCategoryType[];
  selectedCategory: YouthCategoryType;
  onSelectCategory: (cat: YouthCategoryType) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export const YouthSquadFilterBar: React.FC<YouthSquadFilterBarProps> = ({
  championships,
  selectedChampionship,
  onSelectChampionship,
  availableCategories,
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
}) => {
  const [isChampDropdownOpen, setIsChampDropdownOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

  const champDropdownRef = useRef<HTMLDivElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);

  const texts = YOUTH_CONSTANTS.FILTER_BAR;
  const categoryLabels = YOUTH_CONSTANTS.CATEGORIES;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (champDropdownRef.current && !champDropdownRef.current.contains(target)) {
        setIsChampDropdownOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(target)) {
        setIsCatDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsChampDropdownOpen(false);
        setIsCatDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (championships.length === 0) return null;

  const activeCategoryLabel =
    categoryLabels[selectedCategory as keyof typeof categoryLabels] || selectedCategory;

  return (
    <LayoutContainer className="p-4 sm:p-5 rounded-3xl bg-surface border border-border shadow-xs mb-8">
      <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Seletores Encadeados: 1) Campeonato -> 2) Categoria disponível naquele Campeonato */}
        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
          {/* 1. Seletor do Campeonato */}
          <LayoutContainer className="relative" ref={champDropdownRef}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsChampDropdownOpen((prev) => !prev);
                setIsCatDropdownOpen(false);
              }}
              aria-expanded={isChampDropdownOpen}
              aria-label={texts.CHAMPIONSHIP_ARIA}
              className="w-full sm:w-auto justify-between sm:justify-start font-bold text-xs rounded-2xl py-2.5 px-4 bg-background border-border hover:border-primary/50 text-text-primary flex items-center gap-2.5"
            >
              <LayoutContainer className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary shrink-0" />
                <Text as="span" className="text-text-secondary font-medium">
                  {texts.CHAMPIONSHIP_LABEL}
                </Text>
                <Text as="span" className="font-extrabold text-text-primary">
                  {selectedChampionship?.label || texts.CHAMPIONSHIP_PLACEHOLDER}
                </Text>
              </LayoutContainer>
              <ChevronDown
                className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
                  isChampDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {isChampDropdownOpen && (
              <LayoutContainer className="absolute left-0 top-full mt-2 min-w-[270px] max-w-[90vw] bg-surface border border-border rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-72 overflow-y-auto">
                {championships.map((champ) => {
                  const isSelected = selectedChampionship?.key === champ.key;
                  const countText =
                    champ.categories.length === 1
                      ? texts.CATEGORIES_COUNT_SINGLE
                      : `${champ.categories.length} ${texts.CATEGORIES_COUNT_PLURAL}`;

                  return (
                    <Button
                      key={champ.key}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onSelectChampionship(champ.key);
                        setIsChampDropdownOpen(false);
                      }}
                      className={`w-full justify-between text-left text-xs py-2.5 px-3 rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background'
                      }`}
                    >
                      <LayoutContainer className="flex flex-col items-start gap-0.5 pr-2">
                        <LayoutContainer className="flex items-center gap-2 flex-wrap">
                          <Text as="span" className="font-bold text-text-primary">
                            {champ.label}
                          </Text>
                          {champ.isCurrent && (
                            <Badge variant="primary" size="sm" className="text-[9px] px-1.5 py-0 font-extrabold uppercase">
                              {texts.CURRENT_BADGE}
                            </Badge>
                          )}
                        </LayoutContainer>
                        <Text as="span" className="text-[10px] text-text-secondary">
                          {champ.year} • {countText}
                        </Text>
                      </LayoutContainer>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </Button>
                  );
                })}
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* 2. Seletor da Categoria (Exibe apenas as categorias existentes no campeonato selecionado) */}
          {availableCategories.length > 0 && (
            <LayoutContainer className="relative" ref={catDropdownRef}>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsCatDropdownOpen((prev) => !prev);
                  setIsChampDropdownOpen(false);
                }}
                aria-expanded={isCatDropdownOpen}
                aria-label={texts.CATEGORY_ARIA}
                className="w-full sm:w-auto justify-between sm:justify-start font-extrabold text-xs rounded-2xl py-2.5 px-4 flex items-center gap-2 shadow-xs"
              >
                <LayoutContainer className="flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  <Text as="span">{texts.CATEGORY_LABEL}</Text>
                  <Text as="span">{activeCategoryLabel}</Text>
                </LayoutContainer>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCatDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>

              {isCatDropdownOpen && (
                <LayoutContainer className="absolute left-0 top-full mt-2 min-w-[220px] bg-surface border border-border rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const label =
                      categoryLabels[cat as keyof typeof categoryLabels] || cat;

                    return (
                      <Button
                        key={cat}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onSelectCategory(cat);
                          setIsCatDropdownOpen(false);
                        }}
                        className={`w-full justify-between text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-background'
                        }`}
                      >
                        <Text as="span">{label}</Text>
                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </Button>
                    );
                  })}
                </LayoutContainer>
              )}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* 3. Busca Rápida no Elenco Selecionado */}
        <LayoutContainer className="relative min-w-[220px] lg:w-72">
          <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
            <Search className="w-4 h-4" />
          </LayoutContainer>
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={texts.SEARCH_PLACEHOLDER}
            className="pl-9 py-2 text-xs rounded-2xl w-full"
          />
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
