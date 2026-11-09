'use client';

import React from 'react';
import {
  Plus,
  Shirt,
  Sparkles,
  History,
  Trophy,
  Search,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  Select,
  Option,
} from '@/shared/ui/components';
import { KITS_TEXTS } from '../../../constants/kits.constants';
import {
  useAdminKitsList,
  AdminKitTypeFilter,
  AdminKitStatusFilter,
} from '../../../hooks/useAdminKitsList';
import { AdminKitsTable } from './components/AdminKitsTable';
import { AdminKitDrawer } from './components/AdminKitDrawer';
import { AdminKitDeleteModal } from './components/AdminKitDeleteModal';

export const AdminKitsFeature: React.FC = () => {
  const {
    kits,
    metrics,
    isLoading,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isDrawerOpen,
    editingKit,
    isDeleteModalOpen,
    kitToDelete,
    isDeleting,
    handleOpenNew,
    handleEdit,
    handleCloseDrawer,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleConfirmDelete,
    refreshKits,
  } = useAdminKitsList();

  return (
    <LayoutContainer className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* 1. Cabeçalho Administrativo */}
      <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {KITS_TEXTS.ADMIN_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">
            {KITS_TEXTS.ADMIN_SUBTITLE}
          </Text>
        </LayoutContainer>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenNew}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs sm:text-sm shadow-md shrink-0"
        >
          {KITS_TEXTS.ADMIN_BTN_NEW}
        </Button>
      </LayoutContainer>

      {/* 2. Cards de Métricas e Resumo */}
      <LayoutContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Mantos */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Shirt className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-muted uppercase">Total de Mantos</Text>
            <Title level="h3" className="text-xl font-black text-text-primary">{metrics.total}</Title>
          </LayoutContainer>
        </LayoutContainer>

        {/* Mantos Atuais */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-muted uppercase">Temporada Atual</Text>
            <Title level="h3" className="text-xl font-black text-text-primary">{metrics.currentCount}</Title>
          </LayoutContainer>
        </LayoutContainer>

        {/* Mantos Históricos */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <LayoutContainer className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-muted uppercase">Acervo Histórico</Text>
            <Title level="h3" className="text-xl font-black text-text-primary">{metrics.historicalCount}</Title>
          </LayoutContainer>
        </LayoutContainer>

        {/* Total de Competições */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex items-center gap-3 shadow-xs">
          <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-[11px] font-bold text-text-muted uppercase">Competições</Text>
            <Title level="h3" className="text-xl font-black text-text-primary">{metrics.competitionsCount}</Title>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* 3. Barra de Filtros e Busca */}
      <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between bg-surface/50 p-3 rounded-2xl border border-border">
        {/* Campo de Busca */}
        <LayoutContainer className="relative flex-1 min-w-[240px]">
          <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Search className="w-4 h-4" />
          </LayoutContainer>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={KITS_TEXTS.ADMIN_SEARCH_PLACEHOLDER}
            className="pl-9 text-xs sm:text-sm w-full"
          />
        </LayoutContainer>

        {/* Filtros Dropdown */}
        <LayoutContainer className="flex items-center gap-2 flex-wrap">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as AdminKitTypeFilter)}
            className="text-xs sm:text-sm w-36"
          >
            <Option value="ALL">{KITS_TEXTS.ADMIN_FILTER_ALL_TYPES}</Option>
            <Option value="HOME">{KITS_TEXTS.TYPE_HOME}</Option>
            <Option value="AWAY">{KITS_TEXTS.TYPE_AWAY}</Option>
            <Option value="THIRD">{KITS_TEXTS.TYPE_THIRD}</Option>
            <Option value="GOALKEEPER">{KITS_TEXTS.TYPE_GOALKEEPER}</Option>
            <Option value="SPECIAL">{KITS_TEXTS.TYPE_SPECIAL}</Option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminKitStatusFilter)}
            className="text-xs sm:text-sm w-44"
          >
            <Option value="ALL">{KITS_TEXTS.ADMIN_FILTER_ALL_STATUS}</Option>
            <Option value="CURRENT">{KITS_TEXTS.ADMIN_FILTER_CURRENT_ONLY}</Option>
            <Option value="HISTORICAL">{KITS_TEXTS.ADMIN_FILTER_HISTORICAL_ONLY}</Option>
          </Select>
        </LayoutContainer>
      </LayoutContainer>

      {/* 4. Tabela de Listagem */}
      <AdminKitsTable
        kits={kits}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* 5. Drawer de Criação e Edição */}
      <AdminKitDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        kit={editingKit}
        onSuccess={refreshKits}
      />

      {/* 6. Modal de Confirmação de Exclusão */}
      <AdminKitDeleteModal
        isOpen={isDeleteModalOpen}
        kit={kitToDelete}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </LayoutContainer>
  );
};

