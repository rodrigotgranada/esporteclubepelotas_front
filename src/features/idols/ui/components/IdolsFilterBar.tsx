'use client';

import React from 'react';
import { Search, Trophy, Shield, UserCheck, Heart } from 'lucide-react';
import { LayoutContainer, Input, Button } from '@/shared/ui/components';
import { IDOLS_CONSTANTS } from '../../constants/idols.constants';

export interface IdolsFilterBarProps {
  category: string;
  onCategoryChange: (cat: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export const IdolsFilterBar: React.FC<IdolsFilterBarProps> = ({
  category,
  onCategoryChange,
  search,
  onSearchChange,
}) => {
  const cats = IDOLS_CONSTANTS.CATEGORIES;

  const filterTabs = [
    { key: '', label: cats.ALL, icon: Trophy },
    { key: 'PLAYER', label: cats.PLAYER, icon: Trophy },
    { key: 'COACH', label: cats.COACH, icon: Shield },
    { key: 'STAFF', label: cats.STAFF, icon: UserCheck },
    { key: 'FAN', label: cats.FAN, icon: Heart },
  ];

  return (
    <LayoutContainer className="flex flex-col gap-4 w-full">
      {/* Category Tabs Scrollable */}
      <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = category === tab.key;
          return (
            <Button
              key={tab.key}
              type="button"
              variant={isActive ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onCategoryChange(tab.key)}
              leftIcon={<Icon className="w-3.5 h-3.5" />}
              className={`rounded-xl font-bold text-xs shrink-0 transition-all ${
                isActive ? 'shadow-sm' : 'hover:border-primary/40'
              }`}
            >
              {tab.label}
            </Button>
          );
        })}
      </LayoutContainer>

      {/* Search Bar */}
      <LayoutContainer className="relative w-full">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={IDOLS_CONSTANTS.SEARCH_PLACEHOLDER}
          className="pl-10 rounded-2xl bg-surface border-border shadow-xs text-sm"
        />
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </LayoutContainer>
    </LayoutContainer>
  );
};

