'use client';

import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { LayoutContainer, Input, Select, Option, Button } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';

export interface IdolFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onNewIdol: () => void;
}

export const IdolFilterBar: React.FC<IdolFilterBarProps> = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onNewIdol,
}) => {
  return (
    <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border shadow-xs">
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search Input */}
        <LayoutContainer className="relative flex-1 min-w-[200px]">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={ADMIN_IDOLS_TEXTS.FILTER_SEARCH_PLACEHOLDER}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </LayoutContainer>

        {/* Category Filter */}
        <LayoutContainer className="w-full sm:w-56 shrink-0">
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <Option value="">{ADMIN_IDOLS_TEXTS.CATEGORIES.ALL}</Option>
            <Option value="PLAYER">{ADMIN_IDOLS_TEXTS.CATEGORIES.PLAYER}</Option>
            <Option value="COACH">{ADMIN_IDOLS_TEXTS.CATEGORIES.COACH}</Option>
            <Option value="STAFF">{ADMIN_IDOLS_TEXTS.CATEGORIES.STAFF}</Option>
            <Option value="FAN">{ADMIN_IDOLS_TEXTS.CATEGORIES.FAN}</Option>
          </Select>
        </LayoutContainer>
      </LayoutContainer>

      {/* New Idol Button */}
      <Button
        type="button"
        variant="primary"
        onClick={onNewIdol}
        leftIcon={<Plus className="w-4 h-4" />}
        className="font-bold rounded-xl shrink-0"
      >
        {ADMIN_IDOLS_TEXTS.BTN_NEW_IDOL}
      </Button>
    </LayoutContainer>
  );
};

