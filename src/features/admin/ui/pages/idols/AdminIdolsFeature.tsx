'use client';

import React from 'react';
import { LayoutContainer, Title, Text, ConfirmModal } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { useAdminIdolsList } from '../../../hooks/idols/useAdminIdolsList';
import { IdolFilterBar } from '../../components/idols/IdolFilterBar';
import { IdolsTable } from '../../components/idols/IdolsTable';
import { IdolEditorDrawer } from '../../components/idols/IdolEditorDrawer';

export const AdminIdolsFeature = () => {
  const {
    idols,
    total,
    page,
    totalPages,
    isLoading,
    setPage,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    drawerOpen,
    selectedIdolId,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleDrawerSuccess,
    deleteModalOpen,
    idolToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    handleToggleFeatured,
  } = useAdminIdolsList();

  return (
    <LayoutContainer className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {ADMIN_IDOLS_TEXTS.PAGE_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {ADMIN_IDOLS_TEXTS.PAGE_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Filter Bar */}
      <IdolFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onNewIdol={openCreateDrawer}
      />

      {/* Table & Cards */}
      <IdolsTable
        idols={idols}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={openEditDrawer}
        onDelete={openDeleteModal}
        onToggleFeatured={handleToggleFeatured}
      />

      {/* Editor Drawer */}
      <IdolEditorDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        idolId={selectedIdolId}
        onSaveSuccess={handleDrawerSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title={ADMIN_IDOLS_TEXTS.MODAL_DELETE.TITLE}
        description={ADMIN_IDOLS_TEXTS.MODAL_DELETE.DESC(idolToDelete?.name || '')}
        confirmText={ADMIN_IDOLS_TEXTS.MODAL_DELETE.BUTTON_CONFIRM}
        cancelText={ADMIN_IDOLS_TEXTS.MODAL_DELETE.BUTTON_CANCEL}
        variant="danger"
        isLoading={isDeleting}
      />
    </LayoutContainer>
  );
};
