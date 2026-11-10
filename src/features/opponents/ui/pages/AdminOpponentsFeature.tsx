'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
} from '@/shared/ui/components/atoms';
import { OPPONENTS_CONSTANTS } from '../../constants/opponents.constants';
import { useAdminOpponents } from '../../hooks/useAdminOpponents';
import {
  AdminOpponentsTable,
  AdminOpponentModal,
  AdminDeleteOpponentModal,
} from '../components';

export const AdminOpponentsFeature: React.FC = () => {
  const {
    opponents,
    totalCount,
    filteredCount,
    search,
    statusFilter,
    sortField,
    sortDirection,
    handleSort,
    isLoading,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    onSearchChange,
    onStatusFilterChange,
    isModalOpen,
    selectedOpponent,
    isDeleteModalOpen,
    opponentToDelete,
    isDeleting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    handleSuccessSave,
  } = useAdminOpponents();

  return (
    <LayoutContainer className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho da Feature */}
      <LayoutContainer className="space-y-1">
        <Title level="h1" className="text-2xl font-bold tracking-tight text-text-primary">
          {OPPONENTS_CONSTANTS.PAGE_TITLE}
        </Title>
        <Text className="text-sm text-text-muted">
          {OPPONENTS_CONSTANTS.PAGE_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Conteúdo Principal */}
      {isLoading && totalCount === 0 ? (
        <LayoutContainer className="flex items-center justify-center p-16 border border-border/50 rounded-2xl bg-surface-card shadow-sm">
          <Text className="text-sm text-text-muted animate-pulse">
            Carregando catálogo de clubes adversários...
          </Text>
        </LayoutContainer>
      ) : (
        <AdminOpponentsTable
          opponents={opponents}
          totalCount={totalCount}
          filteredCount={filteredCount}
          search={search}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onGoToPage={goToPage}
          onOpenCreate={handleOpenCreate}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Modal de Criação / Edição de Clube */}
      <AdminOpponentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        opponent={selectedOpponent}
        onSuccess={handleSuccessSave}
      />

      {/* Modal de Confirmação de Exclusão */}
      <AdminDeleteOpponentModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        opponent={opponentToDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </LayoutContainer>
  );
};
