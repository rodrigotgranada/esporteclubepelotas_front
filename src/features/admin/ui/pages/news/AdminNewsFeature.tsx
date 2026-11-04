'use client';

import React, { useState } from 'react';
import { Newspaper, Sparkles, MessageSquare } from 'lucide-react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminNewsList } from '../../../hooks/news/useAdminNewsList';
import { AdminNewsFilterBar } from '../../components/news/AdminNewsFilterBar';
import { AdminNewsList } from '../../components/news/AdminNewsList';
import { AdminShowcaseTab } from '../../components/news/AdminShowcaseTab';
import { AdminCommentsModerationTab } from '../../components/news/AdminCommentsModerationTab';
import { NewsEditorDrawer } from '../../components/news/NewsEditorDrawer';

export const AdminNewsFeature = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'showcase' | 'comments'>('articles');

  const {
    news,
    categories,
    page,
    totalPages,
    isLoading,
    setPage,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    featuredFilter,
    setFeaturedFilter,
    // Drawer
    drawerOpen,
    selectedArticleId,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleDrawerSuccess,
    // Delete
    deleteModalOpen,
    articleToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    // Duplicate
    duplicateModalOpen,
    articleToDuplicate,
    isDuplicating,
    openDuplicateModal,
    closeDuplicateModal,
    confirmDuplicate,
  } = useAdminNewsList();

  return (
    <LayoutContainer className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <LayoutContainer className="flex flex-col gap-1">
        <Title level="h1" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {ADMIN_NEWS_TEXTS.PAGE_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base">
          {ADMIN_NEWS_TEXTS.PAGE_SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Navigation Tabs */}
      <LayoutContainer className="flex items-center gap-2 border-b border-border pb-1">
        <Button
          type="button"
          variant={activeTab === 'articles' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('articles')}
          leftIcon={<Newspaper className="w-4 h-4" />}
          className="rounded-lg font-bold text-xs"
        >
          {ADMIN_NEWS_TEXTS.COMMENTS_MODERATION.TAB_ARTICLES}
        </Button>
        <Button
          type="button"
          variant={activeTab === 'showcase' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('showcase')}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="rounded-lg font-bold text-xs"
        >
          {ADMIN_NEWS_TEXTS.SHOWCASE.TAB_TITLE}
        </Button>
        <Button
          type="button"
          variant={activeTab === 'comments' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('comments')}
          leftIcon={<MessageSquare className="w-4 h-4" />}
          className="rounded-lg font-bold text-xs"
        >
          {ADMIN_NEWS_TEXTS.COMMENTS_MODERATION.TAB_COMMENTS}
        </Button>
      </LayoutContainer>

      {/* Tab 1: Articles & Publications */}
      {activeTab === 'articles' && (
        <>
          <AdminNewsFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            featuredFilter={featuredFilter}
            onFeaturedFilterChange={setFeaturedFilter}
            categories={categories}
            onNewArticle={openCreateDrawer}
          />

          <AdminNewsList
            news={news}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onEdit={openEditDrawer}
            onDelete={openDeleteModal}
            deleteModalOpen={deleteModalOpen}
            articleToDelete={articleToDelete}
            isDeleting={isDeleting}
            onCloseDeleteModal={closeDeleteModal}
            onConfirmDelete={confirmDelete}
            onDuplicate={openDuplicateModal}
            duplicateModalOpen={duplicateModalOpen}
            articleToDuplicate={articleToDuplicate}
            isDuplicating={isDuplicating}
            onCloseDuplicateModal={closeDuplicateModal}
            onConfirmDuplicate={confirmDuplicate}
          />
        </>
      )}

      {/* Tab 2: Showcase Visual Manager (Vitrine da Capa) */}
      {activeTab === 'showcase' && <AdminShowcaseTab />}

      {/* Tab 3: Comments Moderation */}
      {activeTab === 'comments' && <AdminCommentsModerationTab />}

      {/* Editor Drawer */}
      <NewsEditorDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        articleId={selectedArticleId}
        onSaveSuccess={handleDrawerSuccess}
      />
    </LayoutContainer>
  );
};

