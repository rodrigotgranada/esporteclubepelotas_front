'use client';

import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { LayoutContainer, Input, Button, Badge } from '@/shared/ui/components';
import { FOOTBALL_CONSTANTS } from '../../constants/football.constants';
import { SquadCategory } from '../../services/football.service';

export interface SquadFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: SquadCategory) => void;
  selectedYear: number | null;
  onSelectYear: (year: number) => void;
  availableYears: number[];
  search: string;
  onSearchChange: (val: string) => void;
}

const CATEGORY_OPTIONS: Array<{ key: SquadCategory; label: string }> = [
  { key: 'PROFESSIONAL', label: 'Profissional' },
  { key: 'FEMININE', label: 'Feminino' },
  { key: 'SUB_20', label: 'Sub-20' },
  { key: 'SUB_17', label: 'Sub-17' },
  { key: 'SUB_15', label: 'Sub-15' },
];

export const SquadFilterBar: React.FC<SquadFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedYear,
  onSelectYear,
  availableYears,
  search,
  onSearchChange,
}) => {
  return (
    <LayoutContainer className="flex flex-col gap-4 mb-8">
      {/* Category Pills & Season Dropdown */}
      <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Horizontal Buttons */}
        <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <Button
                key={cat.key}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onSelectCategory(cat.key)}
                className="font-bold text-xs whitespace-nowrap rounded-full transition-all"
              >
                {cat.label}
              </Button>
            );
          })}
        </LayoutContainer>

        {/* Year Season Selector & Search */}
        <LayoutContainer className="flex items-center gap-3">
          {/* Season Year Pills */}
          {availableYears.length > 0 && (
            <LayoutContainer className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-2xl">
              <Calendar className="w-4 h-4 text-primary ml-2 shrink-0" />
              <select
                aria-label={FOOTBALL_CONSTANTS.SELECTION.SELECT_SEASON}
                value={selectedYear || ''}
                onChange={(e) => onSelectYear(Number(e.target.value))}
                className="bg-transparent text-text-primary text-xs font-bold py-1.5 px-2 rounded-xl focus:outline-none cursor-pointer"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y} className="bg-surface text-text-primary font-bold">
                    Temporada {y}
                  </option>
                ))}
              </select>
            </LayoutContainer>
          )}

          {/* Quick Search in Squad */}
          <LayoutContainer className="relative min-w-[200px] flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar atleta no time..."
              className="pl-9 py-2 text-xs rounded-2xl w-full"
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
