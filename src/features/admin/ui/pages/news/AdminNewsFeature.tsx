'use client';

import React from 'react';
import { LayoutContainer, Title, Text } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminNewsList } from '../../../hooks/news/useAdminNewsList';
import { AdminNewsFilterBar } from '../../components/news/AdminNewsFilterBar';
import { AdminNewsList } from '../../components/news/AdminNewsList';
import { NewsEditorDrawer } from '../../components/news/NewsEditorDrawer';

export const AdminNewsFeature = () => {
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

      {/* Filter and Actions Bar */}
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

      {/* Articles List / Table */}
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
      />

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

