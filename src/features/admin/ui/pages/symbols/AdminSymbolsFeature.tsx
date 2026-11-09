'use client';

import React from 'react';
import { Plus, Shield, Dog, Palette, Search, FileText } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
} from '@/shared/ui/components';
import { SYMBOLS_TEXTS, CATEGORY_LABELS } from '@/features/symbols/constants/symbols.constants';
import { useAdminSymbolsList, AdminCategoryFilter } from '@/features/symbols/hooks/useAdminSymbolsList';
import { useAdminSymbolsOverview } from '@/features/symbols/hooks/useAdminSymbolsOverview';
import { AdminSymbolsTable } from './components/AdminSymbolsTable';
import { AdminSymbolDrawer } from './components/AdminSymbolDrawer';
import { AdminSymbolDeleteModal } from './components/AdminSymbolDeleteModal';
import { AdminSymbolsOverviewDrawer } from './components/AdminSymbolsOverviewDrawer';

export const AdminSymbolsFeature: React.FC = () => {
  const {
    symbols,
    totalCount,
    counts,
    isLoading,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    isDrawerOpen,
    editingSymbol,
    isDeleteModalOpen,
    symbolToDelete,
    isDeleting,
    handleOpenNew,
    handleEdit,
    handleCloseDrawer,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleConfirmDelete,
    refreshSymbols,
  } = useAdminSymbolsList();

  const {
    isDrawerOpen: isOverviewDrawerOpen,
    activeCategory: overviewCategory,
    isSaving: isSavingOverview,
    getOverviewForCategory,
    handleOpenDrawer: handleOpenOverviewDrawer,
    handleCloseDrawer: handleCloseOverviewDrawer,
    handleSaveOverview,
  } = useAdminSymbolsOverview();

  const filterTabs: { key: AdminCategoryFilter; label: string; count: number }[] = [
    { key: 'ALL', label: SYMBOLS_TEXTS.ADMIN_FILTER_ALL, count: counts.ALL },
    { key: 'MASCOT', label: CATEGORY_LABELS.MASCOT, count: counts.MASCOT },
    { key: 'SHIELD', label: CATEGORY_LABELS.SHIELD, count: counts.SHIELD },
    { key: 'FLAG', label: CATEGORY_LABELS.FLAG, count: counts.FLAG },
    { key: 'COLORS', label: CATEGORY_LABELS.COLORS, count: counts.COLORS },
  ];

  return (
    <LayoutContainer className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* 1. Cabeçalho Administrativo com Ações */}
      <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {SYMBOLS_TEXTS.ADMIN_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">
            {SYMBOLS_TEXTS.ADMIN_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="md"
            onClick={() => handleOpenOverviewDrawer('MASCOT')}
            leftIcon={<FileText className="w-4 h-4 text-primary" />}
            className="font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer border-primary/40 hover:bg-primary/10"
          >
            {SYMBOLS_TEXTS.ADMIN_BTN_OVERVIEW}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenNew}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
          >
            {SYMBOLS_TEXTS.ADMIN_BTN_NEW}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* 2. Grid de Métricas */}
      <LayoutContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <LayoutContainer className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <LayoutContainer className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Total de Registros
            </Text>
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {totalCount}
            </Title>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <LayoutContainer className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Dog className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Mascotes
            </Text>
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {counts.MASCOT}
            </Title>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <LayoutContainer className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Distintivos
            </Text>
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {counts.SHIELD}
            </Title>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex items-center gap-3.5 shadow-xs">
          <LayoutContainer className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
              Pavilhão & Cores
            </Text>
            <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
              {counts.FLAG + counts.COLORS}
            </Title>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* 3. Filtros por Categoria e Busca Textual */}
      <LayoutContainer className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border">
        {/* Abas de Categoria */}
        <LayoutContainer className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {filterTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={categoryFilter === tab.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCategoryFilter(tab.key)}
              className="text-xs font-bold px-3 py-1.5 h-auto rounded-xl cursor-pointer"
            >
              <Text as="span">{tab.label}</Text>
              <Text as="span" className="ml-1.5 opacity-70 text-[10px]">({tab.count})</Text>
            </Button>
          ))}
        </LayoutContainer>

        {/* Input de Busca */}
        <LayoutContainer className="relative w-full md:w-72">
          <Input
            type="text"
            placeholder={SYMBOLS_TEXTS.ADMIN_SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs py-2 pl-9 pr-3 w-full"
          />
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </LayoutContainer>
      </LayoutContainer>

      {/* 4. Tabela de Símbolos (Apenas Editar e Excluir) */}
      <AdminSymbolsTable
        symbols={symbols}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* 5. Drawer de Cadastro e Edição com Recorte CropModal */}
      <AdminSymbolDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        symbol={editingSymbol}
        onSuccess={refreshSymbols}
      />

      {/* 6. Drawer de Edição de Textos Gerais das Seções */}
      <AdminSymbolsOverviewDrawer
        isOpen={isOverviewDrawerOpen}
        onClose={handleCloseOverviewDrawer}
        initialCategory={overviewCategory}
        getOverviewForCategory={getOverviewForCategory}
        onSave={handleSaveOverview}
        isSaving={isSavingOverview}
      />

      {/* 7. Modal de Exclusão Segura */}
      <AdminSymbolDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        symbol={symbolToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </LayoutContainer>
  );
};
