'use client';

import React, { useMemo, useState } from 'react';
import { UserPlus, Plus, Search, Sprout } from 'lucide-react';
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
import { ADMIN_YOUTH_CONSTANTS } from '../../../constants/admin-youth.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';
import { useAdminAthletesList } from '../../../hooks/football/useAdminAthletesList';
import { useAdminSquadsList } from '../../../hooks/football/useAdminSquadsList';
import { useAdminAthleteDrawer } from '../../../hooks/football/useAdminAthleteDrawer';
import { useAdminSquadDrawer } from '../../../hooks/football/useAdminSquadDrawer';
import { useAdminSquadMembersDrawer } from '../../../hooks/football/useAdminSquadMembersDrawer';
import { useAdminNewsList } from '../../../hooks/news/useAdminNewsList';
import { AthletesTable } from '../../components/football/AthletesTable';
import { SquadsTable } from '../../components/football/SquadsTable';
import { AthleteEditorDrawer } from '../../components/football/AthleteEditorDrawer';
import { SquadEditorDrawer } from '../../components/football/SquadEditorDrawer';
import { SquadMembersDrawer } from '../../components/football/SquadMembersDrawer';
import { YouthPortalSettingsTab } from '../../components/football/YouthPortalSettingsTab';
import { AdminNewsFilterBar } from '../../components/news/AdminNewsFilterBar';
import { AdminNewsList } from '../../components/news/AdminNewsList';
import { NewsEditorDrawer } from '../../components/news/NewsEditorDrawer';

export const AdminYouthFeature: React.FC = () => {
  const youthTexts = ADMIN_YOUTH_CONSTANTS;
  const footballTexts = ADMIN_FOOTBALL_CONSTANTS;

  // Hooks de Listagem (escopo Base)
  const squadsList = useAdminSquadsList({ scope: 'YOUTH' });
  const athletesList = useAdminAthletesList({ scope: 'YOUTH', defaultAthleteType: 'YOUTH' });
  const youthNews = useAdminNewsList({ fixedIsYouth: true });

  // Hooks de Drawers pré-configurados para a Base
  const squadDrawer = useAdminSquadDrawer(() => squadsList.reload(), 'SUB_20');
  const squadMembersDrawer = useAdminSquadMembersDrawer(() => squadsList.reload());
  const athleteDrawer = useAdminAthleteDrawer(() => athletesList.reload(), 'YOUTH');

  const [activeTabId, setActiveTabId] = useState<string>('squads');

  // Campeonatos da base já existentes para vincular categorias (Sub-20, Sub-17, Sub-15) facilmente
  const existingYouthCompetitions = useMemo(() => {
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
      id: 'squads',
      label: youthTexts.TABS.SQUADS,
      content: (
        <LayoutContainer className="flex flex-col gap-6">
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
                  placeholder={youthTexts.SQUADS_TAB.SEARCH_PLACEHOLDER}
                  className="pl-9 w-full"
                />
              </LayoutContainer>

              <LayoutContainer className="w-full sm:w-64 shrink-0">
                <Select
                  value={squadsList.selectedCategory}
                  onChange={(e) => {
                    squadsList.setSelectedCategory(e.target.value);
                    squadsList.setPage(1);
                  }}
                  className="w-full"
                >
                  <Option value="">{youthTexts.SQUADS_TAB.ALL_YOUTH_CATEGORIES}</Option>
                  <Option value="SUB_20">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_20}</Option>
                  <Option value="SUB_17">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_17}</Option>
                  <Option value="SUB_15">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_15}</Option>
                </Select>
              </LayoutContainer>
            </LayoutContainer>

            <Button
              variant="primary"
              onClick={squadDrawer.openCreate}
              className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              {youthTexts.SQUADS_TAB.BTN_NEW}
            </Button>
          </LayoutContainer>

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
    {
      id: 'athletes',
      label: youthTexts.TABS.ATHLETES,
      content: (
        <LayoutContainer className="flex flex-col gap-5">
          <LayoutContainer className="px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-2.5 text-xs text-text-secondary">
            <Sprout className="w-4 h-4 text-primary shrink-0" />
            <Text as="span">{youthTexts.ATHLETES_TAB.TRANSITION_HINT}</Text>
          </LayoutContainer>

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
                  placeholder={youthTexts.ATHLETES_TAB.SEARCH_PLACEHOLDER}
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
                  <Option value="">{youthTexts.ATHLETES_TAB.FILTER_TYPE_ALL}</Option>
                  <Option value="YOUTH">{youthTexts.ATHLETES_TAB.FILTER_TYPE_YOUTH}</Option>
                  <Option value="STAFF">{youthTexts.ATHLETES_TAB.FILTER_TYPE_STAFF}</Option>
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
                  <Option value="ALL">{footballTexts.ATHLETES_TAB.FILTER_ALL_STATUS}</Option>
                  <Option value="ACTIVE">{footballTexts.ATHLETES_TAB.FILTER_ACTIVE_ONLY}</Option>
                  <Option value="RETIRED">{footballTexts.ATHLETES_TAB.FILTER_RETIRED_ONLY}</Option>
                </Select>
              </LayoutContainer>
            </LayoutContainer>

            <Button
              variant="primary"
              onClick={athleteDrawer.openCreate}
              className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              {youthTexts.ATHLETES_TAB.BTN_NEW}
            </Button>
          </LayoutContainer>

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
      id: 'news',
      label: youthTexts.TABS.NEWS,
      content: (
        <LayoutContainer className="flex flex-col gap-5">
          <LayoutContainer className="px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-2.5 text-xs text-text-secondary">
            <Sprout className="w-4 h-4 text-primary shrink-0" />
            <Text as="span">{youthTexts.NEWS_TAB.DISTRIBUTION_HINT}</Text>
          </LayoutContainer>

          <AdminNewsFilterBar
            search={youthNews.search}
            onSearchChange={youthNews.setSearch}
            statusFilter={youthNews.statusFilter}
            onStatusFilterChange={youthNews.setStatusFilter}
            categoryFilter={youthNews.categoryFilter}
            onCategoryFilterChange={youthNews.setCategoryFilter}
            featuredFilter={youthNews.featuredFilter}
            onFeaturedFilterChange={youthNews.setFeaturedFilter}
            categories={youthNews.categories}
            onNewArticle={youthNews.openCreateDrawer}
          />

          <AdminNewsList
            news={youthNews.news}
            isLoading={youthNews.isLoading}
            page={youthNews.page}
            totalPages={youthNews.totalPages}
            onPageChange={youthNews.setPage}
            onEdit={youthNews.openEditDrawer}
            onDelete={youthNews.openDeleteModal}
            deleteModalOpen={youthNews.deleteModalOpen}
            articleToDelete={youthNews.articleToDelete}
            isDeleting={youthNews.isDeleting}
            onCloseDeleteModal={youthNews.closeDeleteModal}
            onConfirmDelete={youthNews.confirmDelete}
            onDuplicate={youthNews.openDuplicateModal}
            duplicateModalOpen={youthNews.duplicateModalOpen}
            articleToDuplicate={youthNews.articleToDuplicate}
            isDuplicating={youthNews.isDuplicating}
            onCloseDuplicateModal={youthNews.closeDuplicateModal}
            onConfirmDuplicate={youthNews.confirmDuplicate}
          />
        </LayoutContainer>
      ),
    },
    {
      id: 'portal-settings',
      label: youthTexts.TABS.PORTAL_SETTINGS,
      content: <YouthPortalSettingsTab />,
    },
  ];

  return (
    <LayoutContainer className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {youthTexts.TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {youthTexts.SUBTITLE}
        </Text>
      </LayoutContainer>

      <Tabs
        tabs={tabs}
        defaultTab={activeTabId}
        onChange={(tabId) => setActiveTabId(tabId)}
      />

      {/* Drawers da Base */}
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
        existingCompetitions={existingYouthCompetitions}
        allowedCategories={['SUB_20', 'SUB_17', 'SUB_15']}
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
        allowedTypes={['YOUTH', 'STAFF']}
      />

      <NewsEditorDrawer
        isOpen={youthNews.drawerOpen}
        onClose={youthNews.closeDrawer}
        articleId={youthNews.selectedArticleId}
        onSaveSuccess={youthNews.handleDrawerSuccess}
        defaultIsYouth={true}
      />

      {/* Modal de Exclusão de Atleta */}
      <ConfirmModal
        isOpen={!!athletesList.athleteToDelete}
        onClose={() => athletesList.setAthleteToDelete(null)}
        onConfirm={athletesList.handleDelete}
        title={footballTexts.DELETE_MODAL.TITLE_ATHLETE}
        description={footballTexts.DELETE_MODAL.DESC_ATHLETE}
        confirmText={footballTexts.DELETE_MODAL.BTN_CONFIRM}
        cancelText={footballTexts.DELETE_MODAL.BTN_CANCEL}
        variant="danger"
        isLoading={athletesList.isDeleting}
      />

      {/* Modal de Exclusão de Elenco */}
      <ConfirmModal
        isOpen={!!squadsList.squadToDelete}
        onClose={() => squadsList.setSquadToDelete(null)}
        onConfirm={squadsList.handleDelete}
        title={footballTexts.DELETE_MODAL.TITLE_SQUAD}
        description={footballTexts.DELETE_MODAL.DESC_SQUAD}
        confirmText={footballTexts.DELETE_MODAL.BTN_CONFIRM}
        cancelText={footballTexts.DELETE_MODAL.BTN_CANCEL}
        variant="danger"
        isLoading={squadsList.isDeleting}
      />
    </LayoutContainer>
  );
};

