'use client';

import React, { useMemo, useState } from 'react';
import { UserPlus, Plus, Search, Crown, Heart, Sparkles, Mail, Phone } from 'lucide-react';
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
  Badge,
} from '@/shared/ui/components';
import { ADMIN_FEMALE_CONSTANTS } from '../../../constants/admin-female.constants';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
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
import { AdminNewsFilterBar } from '../../components/news/AdminNewsFilterBar';
import { AdminNewsList } from '../../components/news/AdminNewsList';
import { NewsEditorDrawer } from '../../components/news/NewsEditorDrawer';

export const AdminFemaleFeature: React.FC = () => {
  const femaleTexts = ADMIN_FEMALE_CONSTANTS;
  const footballTexts = ADMIN_FOOTBALL_CONSTANTS;

  // Hooks de Listagem exclusivos do escopo Feminino
  const squadsList = useAdminSquadsList({ scope: 'FEMALE' });
  const athletesList = useAdminAthletesList({ scope: 'FEMALE', defaultAthleteType: 'PROFESSIONAL' });
  const femaleNews = useAdminNewsList({ fixedIsFemale: true });

  // Hooks de Drawers com categoria padrão FEMININE e gênero padrão FEMALE
  const squadDrawer = useAdminSquadDrawer(() => squadsList.reload(), 'FEMININE');
  const squadMembersDrawer = useAdminSquadMembersDrawer(() => squadsList.reload());
  const athleteDrawer = useAdminAthleteDrawer(() => athletesList.reload(), 'PROFESSIONAL', 'FEMALE');

  const [activeTabId, setActiveTabId] = useState<string>('squads');

  const existingFemaleCompetitions = useMemo(() => {
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
      label: femaleTexts.TABS.SQUADS,
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
                  placeholder={femaleTexts.SQUADS_TAB.SEARCH_PLACEHOLDER}
                  className="pl-9 w-full"
                />
              </LayoutContainer>

              <Badge variant="primary" size="md" className="font-extrabold uppercase shrink-0 py-2.5 px-3.5">
                👑 {femaleTexts.SQUADS_TAB.CATEGORY_LABEL}
              </Badge>
            </LayoutContainer>

            <Button
              variant="primary"
              onClick={squadDrawer.openCreate}
              className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              {femaleTexts.SQUADS_TAB.BTN_NEW}
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
      label: femaleTexts.TABS.ATHLETES,
      content: (
        <LayoutContainer className="flex flex-col gap-6">
          <LayoutContainer className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3">
            <Crown className="w-5 h-5 text-primary shrink-0" />
            <Text as="p" className="text-xs sm:text-sm text-text-secondary">
              {femaleTexts.ATHLETES_TAB.NOTICE}
            </Text>
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
                  placeholder={femaleTexts.ATHLETES_TAB.SEARCH_PLACEHOLDER}
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
                  <Option value="">{femaleTexts.ATHLETES_TAB.FILTER_TYPE_ALL}</Option>
                  <Option value="PROFESSIONAL">{femaleTexts.ATHLETES_TAB.FILTER_TYPE_ATHLETES}</Option>
                  <Option value="STAFF">{femaleTexts.ATHLETES_TAB.FILTER_TYPE_STAFF}</Option>
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
              {femaleTexts.ATHLETES_TAB.BTN_NEW}
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
      label: femaleTexts.TABS.NEWS,
      content: (
        <LayoutContainer className="flex flex-col gap-6">
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <LayoutContainer className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <Text as="p" className="text-xs sm:text-sm text-text-secondary">
                {femaleTexts.NEWS_TAB.DISTRIBUTION_HINT}
              </Text>
            </LayoutContainer>
            <Button
              variant="primary"
              onClick={femaleNews.openCreateDrawer}
              className="font-bold flex items-center gap-2 shadow-md shadow-primary/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              {femaleTexts.NEWS_TAB.BTN_NEW}
            </Button>
          </LayoutContainer>

          <AdminNewsFilterBar
            search={femaleNews.search}
            onSearchChange={femaleNews.setSearch}
            statusFilter={femaleNews.statusFilter}
            onStatusFilterChange={femaleNews.setStatusFilter}
            categoryFilter={femaleNews.categoryFilter}
            onCategoryFilterChange={femaleNews.setCategoryFilter}
            featuredFilter={femaleNews.featuredFilter}
            onFeaturedFilterChange={femaleNews.setFeaturedFilter}
            categories={femaleNews.categories}
            onNewArticle={femaleNews.openCreateDrawer}
          />

          <AdminNewsList
            news={femaleNews.news}
            isLoading={femaleNews.isLoading}
            page={femaleNews.page}
            totalPages={femaleNews.totalPages}
            onPageChange={femaleNews.setPage}
            onEdit={femaleNews.openEditDrawer}
            onDelete={femaleNews.openDeleteModal}
            deleteModalOpen={femaleNews.deleteModalOpen}
            articleToDelete={femaleNews.articleToDelete}
            isDeleting={femaleNews.isDeleting}
            onCloseDeleteModal={femaleNews.closeDeleteModal}
            onConfirmDelete={femaleNews.confirmDelete}
            onDuplicate={femaleNews.openDuplicateModal}
            duplicateModalOpen={femaleNews.duplicateModalOpen}
            articleToDuplicate={femaleNews.articleToDuplicate}
            isDuplicating={femaleNews.isDuplicating}
            onCloseDuplicateModal={femaleNews.closeDuplicateModal}
            onConfirmDuplicate={femaleNews.confirmDuplicate}
          />
        </LayoutContainer>
      ),
    },
    {
      id: 'project',
      label: femaleTexts.TABS.PROJECT,
      content: (
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4">
            <LayoutContainer className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-primary" />
              <Title level="h3" className="text-lg font-bold text-text-primary">
                {femaleTexts.PROJECT_TAB.CARD_TITLE}
              </Title>
            </LayoutContainer>
            <Text as="p" className="text-sm text-text-secondary leading-relaxed">
              {femaleTexts.PROJECT_TAB.CARD_DESC}
            </Text>
            <LayoutContainer className="flex items-center gap-2 pt-2">
              <Badge variant="primary" size="sm">
                {femaleTexts.PROJECT_TAB.STATUS_ACTIVE}
              </Badge>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4">
            <LayoutContainer className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              <Title level="h3" className="text-lg font-bold text-text-primary">
                {femaleTexts.PROJECT_TAB.CONTACT_TITLE}
              </Title>
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-3 text-sm text-text-secondary">
              <LayoutContainer className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <Text as="span">{femaleTexts.PROJECT_TAB.WHATSAPP_LABEL}: (53) 98119-0823</Text>
              </LayoutContainer>
              <LayoutContainer className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <Text as="span">{femaleTexts.PROJECT_TAB.EMAIL_LABEL}: feminino@ecpelotas.com.br</Text>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      ),
    },
  ];

  return (
    <LayoutContainer className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {femaleTexts.TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {femaleTexts.SUBTITLE}
        </Text>
      </LayoutContainer>

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
        existingCompetitions={existingFemaleCompetitions}
        allowedCategories={['FEMININE']}
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
        includeYouthAthletes={false}
        setIncludeYouthAthletes={() => {}}
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

      <NewsEditorDrawer
        isOpen={femaleNews.drawerOpen}
        onClose={femaleNews.closeDrawer}
        articleId={femaleNews.selectedArticleId}
        onSaveSuccess={femaleNews.handleDrawerSuccess}
        defaultIsYouth={false}
        defaultIsFemale={true}
      />

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
