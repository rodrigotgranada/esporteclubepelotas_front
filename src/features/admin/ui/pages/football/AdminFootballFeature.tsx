'use client';

import React, { useState } from 'react';
import { UserPlus, Plus, Search, Shield, Filter } from 'lucide-react';
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

  // Hooks de Listagem
  const athletesList = useAdminAthletesList();
  const squadsList = useAdminSquadsList();

  // Hooks de Drawers
  const athleteDrawer = useAdminAthleteDrawer(() => athletesList.reload());
  const squadDrawer = useAdminSquadDrawer(() => squadsList.reload());
  const squadMembersDrawer = useAdminSquadMembersDrawer(() => squadsList.reload());

  // Aba selecionada
  const [activeTabId, setActiveTabId] = useState<string>('athletes');

  // Definição dos conteúdos das abas
  const tabs = [
    {
      id: 'athletes',
      label: texts.TABS.ATHLETES,
      content: (
        <LayoutContainer className="flex flex-col gap-6">
          {/* Barra de Ações do Banco de Atletas */}
          <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <LayoutContainer className="flex-1 max-w-md relative">
              <Input
                value={athletesList.search}
                onChange={(e) => athletesList.setSearch(e.target.value)}
                placeholder={texts.ATHLETES_TAB.SEARCH_PLACEHOLDER}
              />
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
          {/* Barra de Ações de Elencos & Temporadas */}
          <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Select
                value={squadsList.selectedCategory}
                onChange={(e) => squadsList.setSelectedCategory(e.target.value)}
                className="w-full sm:w-56"
              >
                <Option value="">Todas as Categorias</Option>
                <Option value="PROFESSIONAL">{FOOTBALL_CONSTANTS.CATEGORIES.PROFESSIONAL}</Option>
                <Option value="FEMININE">{FOOTBALL_CONSTANTS.CATEGORIES.FEMININE}</Option>
                <Option value="SUB_20">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_20}</Option>
                <Option value="SUB_17">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_17}</Option>
                <Option value="SUB_15">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_15}</Option>
              </Select>
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
            onToggleCurrent={squadListActionToggle}
          />
        </LayoutContainer>
      ),
    },
  ];

  function squadListActionToggle(squad: any) {
    squadsList.handleToggleCurrent(squad);
  }

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
        errors={athleteDrawer.errors}
        gender={athleteDrawer.gender}
        setGender={athleteDrawer.setGender}
        athleteType={athleteDrawer.athleteType}
        setAthleteType={athleteDrawer.setAthleteType}
        staffRole={athleteDrawer.staffRole}
        setStaffRole={athleteDrawer.setStaffRole}
        youthCategory={athleteDrawer.youthCategory}
        setYouthCategory={athleteDrawer.setYouthCategory}
        entryYear={athleteDrawer.entryYear}
        setEntryYear={athleteDrawer.setEntryYear}
        name={athleteDrawer.name}
        setName={athleteDrawer.setName}
        nickname={athleteDrawer.nickname}
        setNickname={athleteDrawer.setNickname}
        birthDate={athleteDrawer.birthDate}
        setBirthDate={athleteDrawer.setBirthDate}
        birthPlace={athleteDrawer.birthPlace}
        setBirthPlace={athleteDrawer.setBirthPlace}
        height={athleteDrawer.height}
        setHeight={athleteDrawer.setHeight}
        weight={athleteDrawer.weight}
        setWeight={athleteDrawer.setWeight}
        preferredFoot={athleteDrawer.preferredFoot}
        setPreferredFoot={athleteDrawer.setPreferredFoot}
        primaryPosition={athleteDrawer.primaryPosition}
        setPrimaryPosition={athleteDrawer.setPrimaryPosition}
        secondaryPositionsText={athleteDrawer.secondaryPositionsText}
        setSecondaryPositionsText={athleteDrawer.setSecondaryPositionsText}
        pastClubsText={athleteDrawer.pastClubsText}
        setPastClubsText={athleteDrawer.setPastClubsText}
        biography={athleteDrawer.biography}
        setBiography={athleteDrawer.setBiography}
        instagram={athleteDrawer.instagram}
        setInstagram={athleteDrawer.setInstagram}
        photoUrl={athleteDrawer.photoUrl}
        setPhotoUrl={athleteDrawer.setPhotoUrl}
        pendingPhotoFile={athleteDrawer.pendingPhotoFile}
        setPendingPhotoFile={athleteDrawer.setPendingPhotoFile}
      />

      <SquadEditorDrawer
        isOpen={squadDrawer.isOpen}
        isEditing={squadDrawer.isEditing}
        onClose={squadDrawer.close}
        onSave={squadDrawer.save}
        isSaving={squadDrawer.isSaving}
        errors={squadDrawer.errors}
        year={squadDrawer.year}
        setYear={squadDrawer.setYear}
        category={squadDrawer.category}
        setCategory={squadDrawer.setCategory}
        seasonName={squadDrawer.seasonName}
        setSeasonName={squadDrawer.setSeasonName}
        coachName={squadDrawer.coachName}
        setCoachName={squadDrawer.setCoachName}
        isCurrent={squadDrawer.isCurrent}
        setIsCurrent={squadDrawer.setIsCurrent}
        staff={squadDrawer.staff}
        newStaffRole={squadDrawer.newStaffRole}
        setNewStaffRole={squadDrawer.setNewStaffRole}
        newStaffName={squadDrawer.newStaffName}
        setNewStaffName={squadDrawer.setNewStaffName}
        onAddStaff={squadDrawer.handleAddStaff}
        onRemoveStaff={squadDrawer.handleRemoveStaff}
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
