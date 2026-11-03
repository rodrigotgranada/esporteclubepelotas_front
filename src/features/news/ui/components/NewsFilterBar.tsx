'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { LayoutContainer, Input, Button } from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { NewsCategoryData } from '@/features/admin/services/admin-news.service';

export interface NewsFilterBarProps {
  categories: NewsCategoryData[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  search: string;
  onSearchChange: (query: string) => void;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
}) => {
  return (
    <LayoutContainer className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Category Tabs */}
      <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-1">
        <Button
          type="button"
          variant={selectedCategory === '' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onSelectCategory('')}
          className="whitespace-nowrap rounded-full text-xs font-bold"
        >
          {PUBLIC_NEWS_TEXTS.CATEGORY_ALL}
        </Button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <Button
              key={cat._id || cat.slug}
              type="button"
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onSelectCategory(cat.slug)}
              className="whitespace-nowrap rounded-full text-xs font-semibold"
            >
              {cat.name}
            </Button>
          );
        })}
      </LayoutContainer>

      {/* Search Input */}
      <LayoutContainer className="relative w-full md:w-72 shrink-0">
        <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
          <Search className="w-4 h-4" />
        </LayoutContainer>
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={PUBLIC_NEWS_TEXTS.SEARCH_PLACEHOLDER}
          className="rounded-full pl-9 pr-8"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto text-text-secondary hover:text-text-primary rounded-full z-10"
            aria-label="Limpar pesquisa"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
