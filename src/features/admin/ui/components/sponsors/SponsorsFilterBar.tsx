'use client';

import React from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { LayoutContainer, Input, Select, Option, Button } from '@/shared/ui/components';
import { ADMIN_SPONSORS_TEXTS } from '../../../constants/admin-sponsors.constants';

export interface SponsorsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  featuredFilter: string;
  onFeaturedFilterChange: (value: string) => void;
  scopeFilter?: string;
  onScopeFilterChange?: (value: string) => void;
  onNewSponsor: () => void;
  onExportReport?: () => void;
  isExporting?: boolean;
}

export const SponsorsFilterBar: React.FC<SponsorsFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
  scopeFilter = '',
  onScopeFilterChange,
  onNewSponsor,
  onExportReport,
  isExporting = false,
}) => {
  return (
    <LayoutContainer className="relative z-20 flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface border border-border shadow-xs w-full">
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 flex-1 min-w-0">
        {/* Campo de Busca */}
        <LayoutContainer className="relative min-w-0">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={ADMIN_SPONSORS_TEXTS.FILTERS.SEARCH_PLACEHOLDER}
            className="pl-9 w-full"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </LayoutContainer>

        {/* Filtro por Status Contratual */}
        <LayoutContainer className="min-w-0">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full"
          >
            <Option value="">{ADMIN_SPONSORS_TEXTS.FILTERS.STATUS_ALL}</Option>
            <Option value="ACTIVE">{ADMIN_SPONSORS_TEXTS.FILTERS.STATUS_ACTIVE}</Option>
            <Option value="SCHEDULED">{ADMIN_SPONSORS_TEXTS.FILTERS.STATUS_SCHEDULED}</Option>
            <Option value="EXPIRED">{ADMIN_SPONSORS_TEXTS.FILTERS.STATUS_EXPIRED}</Option>
            <Option value="INACTIVE">{ADMIN_SPONSORS_TEXTS.FILTERS.STATUS_INACTIVE}</Option>
          </Select>
        </LayoutContainer>

        {/* Filtro por Destaque no Ticker */}
        <LayoutContainer className="min-w-0">
          <Select
            value={featuredFilter}
            onChange={(e) => onFeaturedFilterChange(e.target.value)}
            className="w-full"
          >
            <Option value="">{ADMIN_SPONSORS_TEXTS.FILTERS.FEATURED_ALL}</Option>
            <Option value="true">{ADMIN_SPONSORS_TEXTS.FILTERS.FEATURED_ONLY}</Option>
            <Option value="false">{ADMIN_SPONSORS_TEXTS.FILTERS.STANDARD_ONLY}</Option>
          </Select>
        </LayoutContainer>

        {/* Filtro por Modalidade / Onde Apoia */}
        {onScopeFilterChange && (
          <LayoutContainer className="min-w-0">
            <Select
              value={scopeFilter}
              onChange={(e) => onScopeFilterChange(e.target.value)}
              className="w-full"
            >
              <Option value="">{ADMIN_SPONSORS_TEXTS.FILTERS.SCOPE_ALL}</Option>
              <Option value="MAIN">{ADMIN_SPONSORS_TEXTS.FILTERS.SCOPE_MAIN}</Option>
              <Option value="YOUTH">{ADMIN_SPONSORS_TEXTS.FILTERS.SCOPE_YOUTH}</Option>
              <Option value="FEMALE">{ADMIN_SPONSORS_TEXTS.FILTERS.SCOPE_FEMALE}</Option>
            </Select>
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Ações: Exportar Relatório e Novo Patrocinador */}
      <LayoutContainer className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 shrink-0">
        {onExportReport && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportReport}
            isLoading={isExporting}
            disabled={isExporting}
            leftIcon={!isExporting ? <Download className="w-4 h-4" /> : undefined}
            className="font-bold rounded-xl whitespace-nowrap h-10"
            title="Exportar métricas de desempenho em CSV para prestação de contas"
          >
            {ADMIN_SPONSORS_TEXTS.BUTTON_EXPORT_REPORT}
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onNewSponsor}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold rounded-xl whitespace-nowrap h-10"
        >
          {ADMIN_SPONSORS_TEXTS.BUTTON_NEW_SPONSOR}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
