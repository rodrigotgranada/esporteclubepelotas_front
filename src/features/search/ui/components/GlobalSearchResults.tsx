'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Spinner,
  SafeImage,
} from '@/shared/ui/components';
import {
  Newspaper,
  Users,
  Trophy,
  CalendarDays,
  FileText,
  ChevronRight,
  SearchX,
  AlertTriangle,
} from 'lucide-react';
import { sanitizeSafeUrl } from '@/shared/utils';
import {
  GlobalSearchGroupKey,
  GlobalSearchItem,
  GlobalSearchResponse,
} from '../../types/search.types';
import { GLOBAL_SEARCH_TEXTS } from '../../constants/search.constants';

export interface GlobalSearchResultsProps {
  query: string;
  results: GlobalSearchResponse;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onSelectResult: () => void;
  className?: string;
}

const GROUP_ORDER: GlobalSearchGroupKey[] = [
  'news',
  'athletes',
  'matches',
  'idols',
  'transparency',
];

function renderGroupIcon(groupKey: GlobalSearchGroupKey) {
  switch (groupKey) {
    case 'news':
      return <Newspaper className="w-3.5 h-3.5 text-primary" />;
    case 'athletes':
      return <Users className="w-3.5 h-3.5 text-primary" />;
    case 'idols':
      return <Trophy className="w-3.5 h-3.5 text-primary" />;
    case 'matches':
      return <CalendarDays className="w-3.5 h-3.5 text-primary" />;
    case 'transparency':
      return <FileText className="w-3.5 h-3.5 text-primary" />;
  }
}

export const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({
  query,
  results,
  isLoading,
  error,
  hasSearched,
  onSelectResult,
  className = '',
}) => {
  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length === 1) {
    return (
      <LayoutContainer className={`p-5 text-center ${className}`}>
        <Text className="text-xs text-text-secondary">
          {GLOBAL_SEARCH_TEXTS.MIN_CHARS_HINT}
        </Text>
      </LayoutContainer>
    );
  }

  if (isLoading) {
    return (
      <LayoutContainer className={`p-6 flex flex-col items-center justify-center gap-2.5 ${className}`}>
        <Spinner size={24} className="text-primary" />
        <Text className="text-xs font-medium text-text-secondary">
          {GLOBAL_SEARCH_TEXTS.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  if (error) {
    return (
      <LayoutContainer className={`p-5 flex items-center justify-center gap-2.5 text-[#ea580c] ${className}`}>
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <Text className="text-xs font-medium text-[#ea580c]">{error}</Text>
      </LayoutContainer>
    );
  }

  if (hasSearched && results.totalResults === 0) {
    return (
      <LayoutContainer className={`p-6 flex flex-col items-center justify-center text-center gap-2 ${className}`}>
        <LayoutContainer className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-secondary">
          <SearchX className="w-5 h-5" />
        </LayoutContainer>
        <Title level="h4" className="text-sm font-bold text-text-primary">
          {GLOBAL_SEARCH_TEXTS.EMPTY_TITLE}
        </Title>
        <Text className="text-xs text-text-secondary max-w-xs">
          {GLOBAL_SEARCH_TEXTS.EMPTY_DESCRIPTION}
        </Text>
      </LayoutContainer>
    );
  }

  const renderItem = (item: GlobalSearchItem, groupKey: GlobalSearchGroupKey) => {
    const targetUrl = sanitizeSafeUrl(item.url, '/');

    return (
      <Link
        key={`${item.type}-${item.id}`}
        href={targetUrl}
        onClick={onSelectResult}
        className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-background/80 border border-transparent hover:border-border/80 transition-all group"
      >
        <LayoutContainer className="flex items-center gap-3 min-w-0">
          {item.imageUrl ? (
            <LayoutContainer className="relative w-10 h-10 rounded-lg overflow-hidden bg-background border border-border/70 shrink-0">
              <SafeImage
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </LayoutContainer>
          ) : (
            <LayoutContainer className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              {renderGroupIcon(groupKey)}
            </LayoutContainer>
          )}

          <LayoutContainer className="flex flex-col min-w-0">
            <Text className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
              {item.title}
            </Text>
            {item.subtitle && (
              <Text className="text-[11px] text-text-secondary truncate">
                {item.subtitle}
              </Text>
            )}
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2 shrink-0">
          {item.badge && (
            <Badge variant="default" size="sm" className="text-[10px] font-semibold max-w-[110px] truncate">
              {item.badge}
            </Badge>
          )}
          <ChevronRight className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </LayoutContainer>
      </Link>
    );
  };

  return (
    <LayoutContainer className={`flex flex-col gap-4 p-3 sm:p-4 ${className}`}>
      {GROUP_ORDER.map((groupKey) => {
        const items = results[groupKey];
        if (!items || items.length === 0) return null;

        return (
          <LayoutContainer key={groupKey} className="flex flex-col gap-1.5">
            <LayoutContainer className="flex items-center gap-1.5 px-2 pb-1 border-b border-border/60">
              {renderGroupIcon(groupKey)}
              <Text as="span" className="text-[11px] font-extrabold uppercase tracking-wider text-text-secondary">
                {GLOBAL_SEARCH_TEXTS.GROUP_LABELS[groupKey]}
              </Text>
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-0.5">
              {items.map((item) => renderItem(item, groupKey))}
            </LayoutContainer>
          </LayoutContainer>
        );
      })}
    </LayoutContainer>
  );
};

