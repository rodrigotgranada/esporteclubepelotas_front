'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { PUBLIC_NEWS_TEXTS } from '../../constants/news.constants';
import { useNewsFeed } from '../../hooks/useNewsFeed';
import { NewsBentoHero } from '../components/NewsBentoHero';
import { NewsFilterBar } from '../components/NewsFilterBar';
import { NewsCard } from '../components/NewsCard';

export const NewsFeedFeature: React.FC = () => {
  const {
    news,
    featuredArticles,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    clearTag,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    isLoading,
  } = useNewsFeed();

  const showBentoHero = !selectedCategory && !selectedTag && !search && featuredArticles.length > 0;

  return (
    <LayoutContainer className="flex flex-col gap-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <LayoutContainer className="flex flex-col gap-2 text-center max-w-2xl mx-auto">
        <Title level="h1" className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight">
          {PUBLIC_NEWS_TEXTS.PAGE_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {PUBLIC_NEWS_TEXTS.PAGE_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Featured Bento Hero Grid quando sem filtro */}
      {showBentoHero && (
        <NewsBentoHero articles={featuredArticles} />
      )}

      {/* Filter and Search Bar */}
      <NewsFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedTag={selectedTag}
        onClearTag={clearTag}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Articles Feed */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-16">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium">
            Carregando notícias...
          </Text>
        </LayoutContainer>
      ) : news.length === 0 ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-16 bg-surface rounded-2xl border border-border text-center">
          <Text as="p" className="text-text-secondary font-medium text-base">
            {PUBLIC_NEWS_TEXTS.EMPTY_STATE}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, idx) => (
            <NewsCard
              key={article.slug || (typeof article._id === 'string' ? article._id : article.id) || `feed-${idx}`}
              article={article}
            />
          ))}
        </LayoutContainer>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <LayoutContainer className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border shadow-xs mt-4">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            Página {page} de {totalPages}
          </Text>
          <LayoutContainer className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="text-xs font-semibold"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="text-xs font-semibold"
            >
              Próxima
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

