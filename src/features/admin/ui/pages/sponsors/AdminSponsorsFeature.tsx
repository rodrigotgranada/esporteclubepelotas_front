'use client';

import React from 'react';
import { LayoutContainer, Title, Text, ConfirmModal } from '@/shared/ui/components';
import { ADMIN_SPONSORS_TEXTS } from '../../../constants/admin-sponsors.constants';
import { useAdminSponsorsList } from '../../../hooks/sponsors/useAdminSponsorsList';
import {
  SponsorsFilterBar,
  SponsorsTable,
  SponsorAdminDrawer,
} from '../../components/sponsors';

export const AdminSponsorsFeature = () => {
  const {
    sponsors,
    page,
    totalPages,
    isLoading,
    isReordering,
    isExporting,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    featuredFilter,
    setFeaturedFilter,
    scopeFilter,
    setScopeFilter,
    drawerOpen,
    selectedSponsorId,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleDrawerSuccess,
    deleteModalOpen,
    sponsorToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    handleMoveUp,
    handleMoveDown,
    handleExportReport,
  } = useAdminSponsorsList();

  return (
    <LayoutContainer className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Cabeçalho da Página */}
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {ADMIN_SPONSORS_TEXTS.PAGE_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {ADMIN_SPONSORS_TEXTS.PAGE_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Barra de Filtros, Exportação CSV e Novo Cadastro */}
      <SponsorsFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
        scopeFilter={scopeFilter}
        onScopeFilterChange={setScopeFilter}
        onNewSponsor={openCreateDrawer}
        onExportReport={handleExportReport}
        isExporting={isExporting}
      />

      {/* Tabela de Patrocinadores com Reordenação Rápida */}
      <SponsorsTable
        sponsors={sponsors}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={openEditDrawer}
        onDelete={openDeleteModal}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        isReordering={isReordering}
      />

      {/* Drawer de Cadastro e Edição de Patrocinador */}
      <SponsorAdminDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        sponsorId={selectedSponsorId}
        onSaveSuccess={handleDrawerSuccess}
      />

      {/* Modal de Confirmação de Exclusão (Soft Delete) */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={ADMIN_SPONSORS_TEXTS.MODAL_DELETE.TITLE}
        description={ADMIN_SPONSORS_TEXTS.MODAL_DELETE.DESC(sponsorToDelete?.name || '')}
        confirmText={ADMIN_SPONSORS_TEXTS.MODAL_DELETE.BUTTON_CONFIRM}
        cancelText={ADMIN_SPONSORS_TEXTS.MODAL_DELETE.BUTTON_CANCEL}
        variant="danger"
        isLoading={isDeleting}
      />
    </LayoutContainer>
  );
};
