'use client';

import React from 'react';
import { Plus, Search } from 'lucide-react';
import {
  LayoutContainer,
  Input,
  Select,
  Option,
  Button,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { NewsCategoryData } from '../../../services/admin-news.service';

export interface AdminNewsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  featuredFilter: string;
  onFeaturedFilterChange: (value: string) => void;
  categories: NewsCategoryData[];
  onNewArticle: () => void;
}

export const AdminNewsFilterBar: React.FC<AdminNewsFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
  categories,
  onNewArticle,
}) => {
  return (
    <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border shadow-xs">
      {/* Search and Filters */}
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search */}
        <LayoutContainer className="relative flex-1">
          <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
            <Search className="w-4 h-4" />
          </LayoutContainer>
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={ADMIN_NEWS_TEXTS.SEARCH_PLACEHOLDER}
            className="pl-9"
          />
        </LayoutContainer>

        {/* Category Filter */}
        <LayoutContainer className="w-full sm:w-48">
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <Option value="">{ADMIN_NEWS_TEXTS.CATEGORY_FILTER_ALL}</Option>
            {categories.map((c) => (
              <Option key={c._id || c.slug} value={c._id || c.slug}>
                {c.name}
              </Option>
            ))}
          </Select>
        </LayoutContainer>

        {/* Status Filter */}
        <LayoutContainer className="w-full sm:w-44">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <Option value="">{ADMIN_NEWS_TEXTS.STATUS_FILTER_ALL}</Option>
            <Option value="PUBLISHED">{ADMIN_NEWS_TEXTS.STATUS_MAP.PUBLISHED}</Option>
            <Option value="DRAFT">{ADMIN_NEWS_TEXTS.STATUS_MAP.DRAFT}</Option>
            <Option value="SCHEDULED">{ADMIN_NEWS_TEXTS.STATUS_MAP.SCHEDULED}</Option>
            <Option value="ARCHIVED">{ADMIN_NEWS_TEXTS.STATUS_MAP.ARCHIVED}</Option>
          </Select>
        </LayoutContainer>

        {/* Featured Filter */}
        <LayoutContainer className="w-full sm:w-44">
          <Select
            value={featuredFilter}
            onChange={(e) => onFeaturedFilterChange(e.target.value)}
          >
            <Option value="ALL">{ADMIN_NEWS_TEXTS.FEATURED_FILTER_ALL}</Option>
            <Option value="YES">{ADMIN_NEWS_TEXTS.FEATURED_ONLY}</Option>
          </Select>
        </LayoutContainer>
      </LayoutContainer>

      {/* Action Button */}
      <LayoutContainer className="flex items-center gap-2">
        <Button
          variant="primary"
          onClick={onNewArticle}
          leftIcon={<Plus className="w-4 h-4" />}
          className="whitespace-nowrap font-bold"
        >
          {ADMIN_NEWS_TEXTS.BUTTON_NEW_ARTICLE}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
