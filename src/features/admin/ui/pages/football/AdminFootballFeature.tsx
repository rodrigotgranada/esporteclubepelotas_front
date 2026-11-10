'use client';

import React, { useMemo, useState } from 'react';
import { UserPlus, Plus, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  Select,
  Option,
  Tabs,
  ConfirmModal,
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';
import { useAdminAthletesList } from '../../../hooks/football/useAdminAthletesList';
import { useAdminSquadsList } from '../../../hooks/football/useAdminSquadsList';
import { useAdminAthleteDrawer } from '../../../hooks/football/useAdminAthleteDrawer';
import { useAdminSquadDrawer } from '../../../hooks/football/useAdminSquadDrawer';
import { useAdminSquadMembersDrawer } from '../../../hooks/football/useAdminSquadMembersDrawer';
import { AthletesTable } from '../../components/football/AthletesTable';
import { SquadsTable } from '../../components/football/SquadsTable';
import { AthleteEditorDrawer } from '../../components/football/AthleteEditorDrawer';
import { SquadEditorDrawer } from '../../components/football/SquadEditorDrawer';
import { SquadMembersDrawer } from '../../components/football/SquadMembersDrawer';

export const AdminFootballFeature: React.FC = () => {
  const texts = ADMIN_FOOTBALL_CONSTANTS;

  // Hooks de Listagem (escopo Profissional, Feminino & Comissão)
  const athletesList = useAdminAthletesList({ scope: 'PROFESSIONAL' });
  const squadsList = useAdminSquadsList({ scope: 'PROFESSIONAL' });

  // Hooks de Drawers
  const athleteDrawer = useAdminAthleteDrawer(() => athletesList.reload(), 'PROFESSIONAL');
  const squadDrawer = useAdminSquadDrawer(() => squadsList.reload(), 'PROFESSIONAL');
  const squadMembersDrawer = useAdminSquadMembersDrawer(() => squadsList.reload());

  // Aba selecionada
  const [activeTabId, setActiveTabId] = useState<string>('athletes');

  // Lista única de campeonatos profissionais/femininos existentes
  const existingCompetitions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const sq of squadsList.squads) {
      const name = sq.seasonName?.trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.set(name.toLowerCase(), name);
      }
    }
    return Array.from(seen.values());
  }, [squadsList.squads]);

  const tabs = [
    {
      id: 'athletes',
      label: texts.TABS.ATHLETES,
      content: (
        <LayoutContainer className="flex flex-col gap-6">
          {/* Barra de Ações do Banco de Profissionais */}
          <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-3xl">
              <LayoutContainer className="relative flex-1 min-w-[200px]">
                <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
                  <Search className="w-4 h-4" />
                </LayoutContainer>
                <Input
                  value={athletesList.search}
                  onChange={(e) => {
                    athletesList.setSearch(e.target.value);
                    athletesList.setPage(1);
                  }}
                  placeholder={texts.ATHLETES_TAB.SEARCH_PLACEHOLDER}
                  className="pl-9 w-full"
                />
              </LayoutContainer>

              <LayoutContainer className="w-full sm:w-56 shrink-0">
                <Select
                  value={athletesList.athleteTypeFilter}
                  onChange={(e) => {
                    athletesList.setAthleteTypeFilter(e.target.value as any);
                    athletesList.setPage(1);
                  }}
                >
                  <Option value="">{texts.ATHLETES_TAB.FILTER_TYPE_ALL}</Option>
                  <Option value="PROFESSIONAL">{texts.ATHLETES_TAB.FILTER_TYPE_PROFESSIONAL}</Option>
                  <Option value="STAFF">{texts.ATHLETES_TAB.FILTER_TYPE_STAFF}</Option>
                </Select>
              </LayoutContainer>

              <LayoutContainer className="w-full sm:w-52 shrink-0">
                <Select
                  value={athletesList.retiredFilter}
                  onChange={(e) => {
                    athletesList.setRetiredFilter(e.target.value as any);
                    athletesList.setPage(1);
                  }}
                >
                  <Option value="ALL">{texts.ATHLETES_TAB.FILTER_ALL_STATUS}</Option>
                  <Option value="ACTIVE">{texts.ATHLETES_TAB.FILTER_ACTIVE_ONLY}</Option>
                  <Option value="RETIRED">{texts.ATHLETES_TAB.FILTER_RETIRED_ONLY}</Option>
                </Select>
              </LayoutContainer>
            </LayoutContainer>

            <Button
              variant="primary"
              onClick={athleteDrawer.openCreate}
              className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              {texts.ATHLETES_TAB.BTN_NEW}
            </Button>
          </LayoutContainer>

          {/* Tabela de Atletas */}
          <AthletesTable
            athletes={athletesList.athletes}
            isLoading={athletesList.isLoading}
            page={athletesList.page}
            totalPages={athletesList.totalPages}
            total={athletesList.total}
            limit={athletesList.limit}
            onPageChange={athletesList.setPage}
            onEdit={athleteDrawer.openEdit}
            onDelete={(athlete) => athletesList.setAthleteToDelete(athlete)}
          />
        </LayoutContainer>
      ),
    },
    {
      id: 'squads',
      label: texts.TABS.SQUADS,
      content: (
        <LayoutContainer className="flex flex-col gap-6">
          {/* Barra de Ações de Elencos & Competições */}
          <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
              <LayoutContainer className="relative flex-1 min-w-[200px]">
                <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
                  <Search className="w-4 h-4" />
                </LayoutContainer>
                <Input
                  value={squadsList.search}
                  onChange={(e) => {
                    squadsList.setSearch(e.target.value);
                    squadsList.setPage(1);
                  }}
                  placeholder={texts.SQUADS_TAB.SEARCH_PLACEHOLDER}
                  className="pl-9 w-full"
                />
              </LayoutContainer>
              <LayoutContainer className="w-full sm:w-56 shrink-0">
                <Select
                  value={squadsList.selectedCategory}
                  onChange={(e) => {
                    squadsList.setSelectedCategory(e.target.value);
                    squadsList.setPage(1);
                  }}
                  className="w-full sm:w-56"
                >
                  <Option value="">{texts.SQUADS_TAB.ALL_CATEGORIES}</Option>
                  <Option value="PROFESSIONAL">{FOOTBALL_CONSTANTS.CATEGORIES.PROFESSIONAL}</Option>
                  <Option value="FEMININE">{FOOTBALL_CONSTANTS.CATEGORIES.FEMININE}</Option>
                </Select>
              </LayoutContainer>
            </LayoutContainer>

            <Button
              variant="primary"
              onClick={squadDrawer.openCreate}
              className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              {texts.SQUADS_TAB.BTN_NEW}
            </Button>
          </LayoutContainer>

          {/* Tabela de Elencos */}
          <SquadsTable
            squads={squadsList.squads}
            isLoading={squadsList.isLoading}
            onEdit={squadDrawer.openEdit}
            onDelete={(squad) => squadsList.setSquadToDelete(squad)}
            onManageMembers={squadMembersDrawer.open}
            onToggleCurrent={(squad) => squadsList.handleToggleCurrent(squad)}
          />
        </LayoutContainer>
      ),
    },
  ];

  return (
    <LayoutContainer className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header da Página */}
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {texts.TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {texts.SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        defaultTab={activeTabId}
        onChange={(tabId) => setActiveTabId(tabId)}
      />

      {/* Drawers */}
      <AthleteEditorDrawer
        isOpen={athleteDrawer.isOpen}
        isEditing={athleteDrawer.isEditing}
        onClose={athleteDrawer.close}
        onSave={athleteDrawer.save}
        isSaving={athleteDrawer.isSaving}
        savingLabel={athleteDrawer.savingLabel}
        form={athleteDrawer.form}
        photoUrl={athleteDrawer.photoUrl}
        setPhotoUrl={athleteDrawer.setPhotoUrl}
        pendingPhotoFile={athleteDrawer.pendingPhotoFile}
        setPendingPhotoFile={athleteDrawer.setPendingPhotoFile}
        allowedTypes={['PROFESSIONAL', 'STAFF']}
      />

      <SquadEditorDrawer
        isOpen={squadDrawer.isOpen}
        isEditing={squadDrawer.isEditing}
        onClose={squadDrawer.close}
        onSave={squadDrawer.save}
        isSaving={squadDrawer.isSaving}
        form={squadDrawer.form}
        newStaffRole={squadDrawer.newStaffRole}
        setNewStaffRole={squadDrawer.setNewStaffRole}
        newStaffName={squadDrawer.newStaffName}
        setNewStaffName={squadDrawer.setNewStaffName}
        onAddStaff={squadDrawer.handleAddStaff}
        onRemoveStaff={squadDrawer.handleRemoveStaff}
        existingCompetitions={existingCompetitions}
        allowedCategories={['PROFESSIONAL', 'FEMININE']}
        championships={squadDrawer.championships}
        coaches={squadDrawer.coaches}
        onChampionshipChange={squadDrawer.handleChampionshipChange}
        onCoachChange={squadDrawer.handleCoachChange}
      />

      <SquadMembersDrawer
        isOpen={squadMembersDrawer.isOpen}
        squad={squadMembersDrawer.squad}
        members={squadMembersDrawer.members}
        availableAthletes={squadMembersDrawer.availableAthletes}
        isLoadingAthletes={squadMembersDrawer.isLoadingAthletes}
        isSaving={squadMembersDrawer.isSaving}
        includeYouthAthletes={squadMembersDrawer.includeYouthAthletes}
        setIncludeYouthAthletes={squadMembersDrawer.setIncludeYouthAthletes}
        includeRetiredAthletes={squadMembersDrawer.includeRetiredAthletes}
        setIncludeRetiredAthletes={squadMembersDrawer.setIncludeRetiredAthletes}
        onClose={squadMembersDrawer.close}
        onSave={squadMembersDrawer.save}
        selectedAthleteId={squadMembersDrawer.selectedAthleteId}
        setSelectedAthleteId={squadMembersDrawer.setSelectedAthleteId}
        jerseyNumber={squadMembersDrawer.jerseyNumber}
        setJerseyNumber={squadMembersDrawer.setJerseyNumber}
        sector={squadMembersDrawer.sector}
        setSector={squadMembersDrawer.setSector}
        role={squadMembersDrawer.role}
        setRole={squadMembersDrawer.setRole}
        onAddMember={squadMembersDrawer.handleAddMember}
        onRemoveMember={squadMembersDrawer.handleRemoveMember}
      />

      {/* Modal de Exclusão de Atleta */}
      <ConfirmModal
        isOpen={!!athletesList.athleteToDelete}
        onClose={() => athletesList.setAthleteToDelete(null)}
        onConfirm={athletesList.handleDelete}
        title={texts.DELETE_MODAL.TITLE_ATHLETE}
        description={texts.DELETE_MODAL.DESC_ATHLETE}
        confirmText={texts.DELETE_MODAL.BTN_CONFIRM}
        cancelText={texts.DELETE_MODAL.BTN_CANCEL}
        variant="danger"
        isLoading={athletesList.isDeleting}
      />

      {/* Modal de Exclusão de Elenco */}
      <ConfirmModal
        isOpen={!!squadsList.squadToDelete}
        onClose={() => squadsList.setSquadToDelete(null)}
        onConfirm={squadsList.handleDelete}
        title={texts.DELETE_MODAL.TITLE_SQUAD}
        description={texts.DELETE_MODAL.DESC_SQUAD}
        confirmText={texts.DELETE_MODAL.BTN_CONFIRM}
        cancelText={texts.DELETE_MODAL.BTN_CANCEL}
        variant="danger"
        isLoading={squadsList.isDeleting}
      />
    </LayoutContainer>
  );
};
