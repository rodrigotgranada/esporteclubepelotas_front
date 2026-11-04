'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ChevronLeft, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { IDOLS_CONSTANTS } from '../../constants/idols.constants';
import { useIdolsList } from '../../hooks/useIdolsList';
import { IdolHero } from '../components/IdolHero';
import { IdolsFilterBar } from '../components/IdolsFilterBar';
import { IdolCard } from '../components/IdolCard';

export const IdolsFeature: React.FC = () => {
  const {
    idols,
    total,
    page,
    totalPages,
    isLoading,
    isModuleActive,
    category,
    setCategory,
    search,
    setSearch,
    setPage,
  } = useIdolsList();

  // If module is disabled in System Modules
  if (!isLoading && !isModuleActive) {
    return (
      <LayoutContainer className="max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300">
        <LayoutContainer className="p-5 rounded-3xl bg-surface border border-border shadow-xs text-text-muted mb-2">
          <AlertCircle className="w-12 h-12 text-primary" />
        </LayoutContainer>
        <Title level="h2" className="text-2xl font-black text-text-primary">
          {IDOLS_CONSTANTS.MODULE_DISABLED.TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm max-w-md leading-relaxed">
          {IDOLS_CONSTANTS.MODULE_DISABLED.DESC}
        </Text>
        <Link href="/" className="mt-4">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />} className="font-bold">
            {IDOLS_CONSTANTS.MODULE_DISABLED.BTN_HOME}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Memorial Hero */}
      <IdolHero />

      {/* Filter and Search Bar */}
      <IdolsFilterBar
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Loading State */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center py-24 bg-surface/30 border border-border rounded-3xl">
          <Spinner className="w-10 h-10 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium text-sm">
            Carregando lendas da Boca do Lobo...
          </Text>
        </LayoutContainer>
      ) : idols.length === 0 ? (
        /* Empty State */
        <LayoutContainer className="flex flex-col items-center justify-center p-14 text-center bg-surface border border-dashed border-border rounded-3xl">
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border text-primary/60 mb-3 shadow-xs">
            <Trophy className="w-10 h-10" />
          </LayoutContainer>
          <Title level="h3" className="text-lg font-bold text-text-primary mb-1">
            {IDOLS_CONSTANTS.EMPTY_STATE.TITLE}
          </Title>
          <Text as="p" className="text-sm text-text-secondary max-w-md leading-relaxed mb-5">
            {IDOLS_CONSTANTS.EMPTY_STATE.DESC}
          </Text>
          {(category || search) && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setCategory('');
                setSearch('');
              }}
              className="font-bold"
            >
              {IDOLS_CONSTANTS.EMPTY_STATE.BTN_RESET}
            </Button>
          )}
        </LayoutContainer>
      ) : (
        /* Idols Grid */
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {idols.map((idol) => (
            <IdolCard key={idol._id || idol.id} idol={idol} />
          ))}
        </LayoutContainer>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <LayoutContainer className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border">
          <Text as="span" className="text-xs text-text-secondary font-medium">
            Página {page} de {totalPages} • Total de {total} ídolo(s)
          </Text>
          <LayoutContainer className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Próxima
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

