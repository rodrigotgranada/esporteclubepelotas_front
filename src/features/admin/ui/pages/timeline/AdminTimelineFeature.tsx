'use client';

import React from 'react';
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
import { Plus, Search, Calendar } from 'lucide-react';
import { useAdminTimelineList } from '../../../hooks/timeline/useAdminTimelineList';
import { useAdminTimelineDrawer } from '../../../hooks/timeline/useAdminTimelineDrawer';
import { TimelineTable } from '../../components/timeline/TimelineTable';
import { TimelineDrawer } from '../../components/timeline/TimelineDrawer';
import { ADMIN_TIMELINE_CONSTANTS } from '../../../constants/admin-timeline.constants';

export const AdminTimelineFeature: React.FC = () => {
  const texts = ADMIN_TIMELINE_CONSTANTS;

  const timelineList = useAdminTimelineList();
  const timelineDrawer = useAdminTimelineDrawer(timelineList.reload);

  return (
    <LayoutContainer className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
          {texts.PAGE_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {texts.PAGE_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Action Bar */}
      <LayoutContainer className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-3xl">
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

          {/* Category Filter */}
          <LayoutContainer className="w-full sm:w-56 shrink-0">
            <Select
              value={timelineList.categoryFilter}
              onChange={(e) => {
                timelineList.setCategoryFilter(e.target.value);
                timelineList.setPage(1);
              }}
            >
              <Option value="">{texts.CATEGORY_ALL}</Option>
              <Option value="FOUNDATION">{texts.CATEGORIES.FOUNDATION}</Option>
              <Option value="TITLE">{texts.CATEGORIES.TITLE}</Option>
              <Option value="STADIUM">{texts.CATEGORIES.STADIUM}</Option>
              <Option value="MILESTONE">{texts.CATEGORIES.MILESTONE}</Option>
              <Option value="GLORY">{texts.CATEGORIES.GLORY}</Option>
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

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={timelineDrawer.openCreate}
          className="font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {texts.BTN_NEW_EVENT}
        </Button>
      </LayoutContainer>

      {/* Table */}
      <TimelineTable
        events={timelineList.events}
        isLoading={timelineList.isLoading}
        onEdit={timelineDrawer.openEdit}
        onDelete={(event) => timelineList.setEventToDelete(event)}
      />

      {/* Drawer */}
      <TimelineDrawer
        isOpen={timelineDrawer.isOpen}
        isSaving={timelineDrawer.isSaving}
        isEditing={timelineDrawer.isEditing}
        year={timelineDrawer.year}
        setYear={timelineDrawer.setYear}
        title={timelineDrawer.title}
        setTitle={timelineDrawer.setTitle}
        description={timelineDrawer.description}
        setDescription={timelineDrawer.setDescription}
        category={timelineDrawer.category}
        setCategory={timelineDrawer.setCategory}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(timelineList.eventToDelete)}
        title={texts.DELETE_MODAL.TITLE}
        description={texts.DELETE_MODAL.MESSAGE}
        confirmText={texts.DELETE_MODAL.CONFIRM_BTN}
        onConfirm={timelineList.handleDelete}
        onClose={() => timelineList.setEventToDelete(null)}
        isLoading={timelineList.isDeleting}
      />
    </LayoutContainer>
  );
};
