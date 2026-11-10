'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button, Spinner } from '@/shared/ui/components/atoms';
import { useAdminMatches } from '../../../hooks/useAdminMatches';
import { AdminMatchesTable } from '../../components/admin/AdminMatchesTable';
import { AdminChampionshipsTable } from '../../components/admin/AdminChampionshipsTable';
import { AdminMatchModal } from '../../components/admin/AdminMatchModal';
import { AdminChampionshipDrawer } from '../../components/admin/AdminChampionshipDrawer';
import { AdminDeleteMatchModal } from '../../components/admin/AdminDeleteMatchModal';
import { MATCHES_CONSTANTS } from '../../../constants/matches.constants';

export const AdminMatchesFeature: React.FC = () => {
  const { ADMIN } = MATCHES_CONSTANTS;

  const {
    activeTab,
    setActiveTab,
    isLoading,
    // Partidas
    filteredMatches,
    championships,
    matchSearch,
    setMatchSearch,
    statusFilter,
    setStatusFilter,
    selectedChampionshipFilter,
    setSelectedChampionshipFilter,
    isMatchDrawerOpen,
    selectedMatch,
    handleOpenCreateMatch,
    handleOpenEditMatch,
    handleCloseMatchDrawer,
    matchToDelete,
    handleOpenDeleteMatch,
    handleCloseDeleteMatch,
    handleConfirmDeleteMatch,
    // Campeonatos
    filteredChampionships,
    champSearch,
    setChampSearch,
    isChampionshipDrawerOpen,
    selectedChampionship,
    handleOpenCreateChampionship,
    handleOpenEditChampionship,
    handleCloseChampionshipDrawer,
    champToDelete,
    handleOpenDeleteChampionship,
    handleCloseDeleteChampionship,
    handleConfirmDeleteChampionship,
    isDeleting,
    refetch,
  } = useAdminMatches();

  return (
    <LayoutContainer className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Cabeçalho da Página */}
      <LayoutContainer className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <LayoutContainer className="space-y-1">
          <Title level="h1" className="text-2xl md:text-3xl font-black text-text-primary uppercase tracking-tight">
            {ADMIN.PAGE_TITLE}
          </Title>
          <Text className="text-sm text-text-muted">
            {ADMIN.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Abas Alternadoras */}
        <LayoutContainer className="flex items-center space-x-2 bg-surface-card border border-border/60 p-1 rounded-xl">
          <Button
            variant={activeTab === 'matches' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('matches')}
            className={`rounded-lg text-xs md:text-sm ${
              activeTab === 'matches'
                ? 'bg-secondary text-primary font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            ⚽ {ADMIN.TABS.MATCHES}
          </Button>

          <Button
            variant={activeTab === 'championships' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('championships')}
            className={`rounded-lg text-xs md:text-sm ${
              activeTab === 'championships'
                ? 'bg-secondary text-primary font-bold shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🏆 {ADMIN.TABS.CHAMPIONSHIPS}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Conteúdo das Abas */}
      {isLoading ? (
        <LayoutContainer className="py-20 flex justify-center">
          <Spinner size={40} />
        </LayoutContainer>
      ) : activeTab === 'matches' ? (
        <AdminMatchesTable
          matches={filteredMatches}
          championships={championships}
          search={matchSearch}
          onSearchChange={setMatchSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          championshipFilter={selectedChampionshipFilter}
          onChampionshipFilterChange={setSelectedChampionshipFilter}
          onOpenCreate={handleOpenCreateMatch}
          onEdit={handleOpenEditMatch}
          onDelete={handleOpenDeleteMatch}
        />
      ) : (
        <AdminChampionshipsTable
          championships={filteredChampionships}
          search={champSearch}
          onSearchChange={setChampSearch}
          onOpenCreate={handleOpenCreateChampionship}
          onEdit={handleOpenEditChampionship}
          onDelete={handleOpenDeleteChampionship}
        />
      )}

      {/* Drawers e Modais */}
      {isMatchDrawerOpen && (
        <AdminMatchModal
          isOpen={isMatchDrawerOpen}
          match={selectedMatch}
          championships={championships}
          onClose={handleCloseMatchDrawer}
          onSuccess={refetch}
        />
      )}

      {isChampionshipDrawerOpen && (
        <AdminChampionshipDrawer
          isOpen={isChampionshipDrawerOpen}
          championship={selectedChampionship}
          onClose={handleCloseChampionshipDrawer}
          onSuccess={refetch}
        />
      )}

      <AdminDeleteMatchModal
        isOpen={Boolean(matchToDelete || champToDelete)}
        match={matchToDelete}
        championship={champToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          handleCloseDeleteMatch();
          handleCloseDeleteChampionship();
        }}
        onConfirm={() => {
          if (matchToDelete) handleConfirmDeleteMatch();
          if (champToDelete) handleConfirmDeleteChampionship();
        }}
      />
    </LayoutContainer>
  );
};
