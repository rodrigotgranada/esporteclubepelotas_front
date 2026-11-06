'use client';

import React, { useState } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  Select,
  Option,
  ConfirmModal,
} from '@/shared/ui/components';
import { Plus, Search, Calendar, Layers, Clock } from 'lucide-react';
import { useAdminTimelineList } from '../../../hooks/timeline/useAdminTimelineList';
import { useAdminTimelineDrawer } from '../../../hooks/timeline/useAdminTimelineDrawer';
import { useAdminTimelineCategories } from '../../../hooks/timeline/useAdminTimelineCategories';
import { TimelineTable } from '../../components/timeline/TimelineTable';
import { TimelineDrawer } from '../../components/timeline/TimelineDrawer';
import { TimelineCategoriesTable } from '../../components/timeline/TimelineCategoriesTable';
import { TimelineCategoryModal } from '../../components/timeline/TimelineCategoryModal';
import { ADMIN_TIMELINE_CONSTANTS } from '../../../constants/admin-timeline.constants';

export const AdminTimelineFeature: React.FC = () => {
  const texts = ADMIN_TIMELINE_CONSTANTS;
  const [activeTab, setActiveTab] = useState<'events' | 'categories'>('events');

  const timelineList = useAdminTimelineList();
  const timelineCategories = useAdminTimelineCategories();

  const handleEventSuccess = () => {
    timelineList.reload();
    timelineCategories.loadCategories();
  };

  const timelineDrawer = useAdminTimelineDrawer(handleEventSuccess);

  return (
    <LayoutContainer className="flex flex-col gap-6 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {texts.PAGE_TITLE}
          </Title>
          <Text as="p" className="text-text-secondary text-sm sm:text-base">
            {texts.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Global Action Button based on Active Tab */}
        {activeTab === 'events' ? (
          <Button
            variant="primary"
            onClick={timelineDrawer.openCreate}
            className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {texts.BTN_NEW_EVENT}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={timelineCategories.openCreateModal}
            className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {texts.BTN_NEW_CATEGORY}
          </Button>
        )}
      </LayoutContainer>

      {/* Tabs Switcher */}
      <LayoutContainer className="flex items-center gap-2 border-b border-border/80 pb-2">
        <Button
          variant={activeTab === 'events' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('events')}
          className="font-bold text-xs sm:text-sm flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          {texts.TABS.EVENTS} ({timelineList.total})
        </Button>
        <Button
          variant={activeTab === 'categories' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('categories')}
          className="font-bold text-xs sm:text-sm flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          {texts.TABS.CATEGORIES} ({timelineCategories.categories.length})
        </Button>
      </LayoutContainer>

      {/* TAB 1: Marcos Históricos */}
      {activeTab === 'events' && (
        <LayoutContainer className="flex flex-col gap-6">
          {/* Action & Filter Bar */}
          <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <LayoutContainer className="relative flex-1 min-w-[200px]">
              <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
                <Search className="w-4 h-4" />
              </LayoutContainer>
              <Input
                value={timelineList.search}
                onChange={(e) => {
                  timelineList.setSearch(e.target.value);
                  timelineList.setPage(1);
                }}
                placeholder={texts.SEARCH_PLACEHOLDER}
                className="pl-9 w-full"
              />
            </LayoutContainer>

            {/* Category Filter (Dynamic from API) */}
            <LayoutContainer className="w-full sm:w-56 shrink-0">
              <Select
                value={timelineList.categoryFilter}
                onChange={(e) => {
                  timelineList.setCategoryFilter(e.target.value);
                  timelineList.setPage(1);
                }}
              >
                <Option value="">{texts.CATEGORY_ALL}</Option>
                {timelineCategories.categories.map((cat) => (
                  <Option key={cat.id || cat._id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </LayoutContainer>

            {/* Highlight Filter */}
            <LayoutContainer className="w-full sm:w-48 shrink-0">
              <Select
                value={timelineList.highlightFilter}
                onChange={(e) => {
                  timelineList.setHighlightFilter(e.target.value);
                  timelineList.setPage(1);
                }}
              >
                <Option value="ALL">{texts.HIGHLIGHT_FILTER_ALL}</Option>
                <Option value="HIGHLIGHTED">{texts.HIGHLIGHT_FILTER_ONLY}</Option>
              </Select>
            </LayoutContainer>
          </LayoutContainer>

          {/* Table */}
          <TimelineTable
            events={timelineList.events}
            isLoading={timelineList.isLoading}
            onEdit={timelineDrawer.openEdit}
            onDelete={(event) => timelineList.setEventToDelete(event)}
          />
        </LayoutContainer>
      )}

      {/* TAB 2: Categorias de Marcos */}
      {activeTab === 'categories' && (
        <LayoutContainer className="flex flex-col gap-4">
          <TimelineCategoriesTable
            categories={timelineCategories.categories}
            isLoading={timelineCategories.isLoading}
            onEdit={timelineCategories.openEditModal}
            onDelete={(cat) => timelineCategories.setCategoryToDelete(cat)}
          />
        </LayoutContainer>
      )}

      {/* Drawer for Events */}
      <TimelineDrawer
        isOpen={timelineDrawer.isOpen}
        isSaving={timelineDrawer.isSaving}
        isEditing={timelineDrawer.isEditing}
        categories={timelineCategories.categories}
        onOpenNewCategory={timelineCategories.openCreateModal}
        year={timelineDrawer.year}
        setYear={timelineDrawer.setYear}
        title={timelineDrawer.title}
        setTitle={timelineDrawer.setTitle}
        description={timelineDrawer.description}
        setDescription={timelineDrawer.setDescription}
        category={timelineDrawer.category}
        setCategory={timelineDrawer.setCategory}
        categoryId={timelineDrawer.categoryId}
        setCategoryId={timelineDrawer.setCategoryId}
        eventDate={timelineDrawer.eventDate}
        handleEventDateChange={timelineDrawer.handleEventDateChange}
        dateFormatted={timelineDrawer.dateFormatted}
        setDateFormatted={timelineDrawer.setDateFormatted}
        displayOrder={timelineDrawer.displayOrder}
        setDisplayOrder={timelineDrawer.setDisplayOrder}
        isHighlighted={timelineDrawer.isHighlighted}
        setIsHighlighted={timelineDrawer.setIsHighlighted}
        isActive={timelineDrawer.isActive}
        setIsActive={timelineDrawer.setIsActive}
        photoUrl={timelineDrawer.photoUrl}
        setPhotoUrl={timelineDrawer.setPhotoUrl}
        pendingPhotoFile={timelineDrawer.pendingPhotoFile}
        setPendingPhotoFile={timelineDrawer.setPendingPhotoFile}
        onClose={timelineDrawer.close}
        onSave={timelineDrawer.save}
      />

      {/* Category Modal */}
      <TimelineCategoryModal
        isOpen={timelineCategories.isModalOpen}
        onClose={timelineCategories.closeModal}
        onSave={timelineCategories.saveCategory}
        isSaving={timelineCategories.isSaving}
        isEditing={Boolean(timelineCategories.editingCategory)}
        name={timelineCategories.name}
        setName={timelineCategories.setName}
        slug={timelineCategories.slug}
        setSlug={timelineCategories.setSlug}
        icon={timelineCategories.icon}
        setIcon={timelineCategories.setIcon}
        description={timelineCategories.description}
        setDescription={timelineCategories.setDescription}
        displayOrder={timelineCategories.displayOrder}
        setDisplayOrder={timelineCategories.setDisplayOrder}
        isActive={timelineCategories.isActive}
        setIsActive={timelineCategories.setIsActive}
      />

      {/* Confirm Delete Event Modal */}
      <ConfirmModal
        isOpen={Boolean(timelineList.eventToDelete)}
        title={texts.DELETE_MODAL.TITLE}
        description={texts.DELETE_MODAL.MESSAGE}
        confirmText={texts.DELETE_MODAL.CONFIRM_BTN}
        onConfirm={timelineList.handleDelete}
        onClose={() => timelineList.setEventToDelete(null)}
        isLoading={timelineList.isDeleting}
      />

      {/* Confirm Delete Category Modal */}
      <ConfirmModal
        isOpen={Boolean(timelineCategories.categoryToDelete)}
        title={texts.DELETE_CATEGORY_MODAL.TITLE}
        description={texts.DELETE_CATEGORY_MODAL.MESSAGE}
        confirmText={texts.DELETE_CATEGORY_MODAL.CONFIRM_BTN}
        onConfirm={timelineCategories.handleDeleteCategory}
        onClose={() => timelineCategories.setCategoryToDelete(null)}
        isLoading={timelineCategories.isDeleting}
      />
    </LayoutContainer>
  );
};
