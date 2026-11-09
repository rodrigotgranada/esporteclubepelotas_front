'use client';

import React from 'react';
import { Plus, Music, Award, Disc } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { ANTHEM_TEXTS } from '@/features/anthem/constants/anthem.constants';
import { useAdminAnthemList } from '@/features/anthem/hooks/useAdminAnthemList';
import { AdminAnthemTable } from './components/AdminAnthemTable';
import { AdminAnthemDrawer } from './components/AdminAnthemDrawer';
import { AdminAnthemDeleteModal } from './components/AdminAnthemDeleteModal';

export const AdminAnthemFeature: React.FC = () => {
  const {
    anthems,
    isLoading,
    isDrawerOpen,
    selectedAnthem,
    deletingAnthem,
    isDeleting,
    handleOpenNew,
    handleOpenEdit,
    handleCloseDrawer,
    handleSetOfficial,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    reload,
  } = useAdminAnthemList();

  const officialVersion = anthems.find((a) => a.isOfficial);
  const versionsWithAudio = anthems.filter((a) => a.audioUrl).length;

  return (
    <LayoutContainer className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* 1. Cabeçalho Administrativo */}
      <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {ANTHEM_TEXTS.ADMIN_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">
            {ANTHEM_TEXTS.ADMIN_SUBTITLE}
          </Text>
        </LayoutContainer>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenNew}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold text-xs uppercase tracking-wider shadow-sm"
        >
          {ANTHEM_TEXTS.ADMIN_BTN_NEW}
        </Button>
      </LayoutContainer>

      {/* 2. Grid de Métricas */}
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LayoutContainer className="p-5 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-xs">
          <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Music className="w-6 h-6" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Total de Versões
            </Text>
            <Title level="h3" className="text-2xl font-black text-text-primary">
              {anthems.length}
            </Title>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="p-5 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-xs">
          <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col overflow-hidden">
            <Text className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Versão Oficial Ativa
            </Text>
            <Title level="h3" className="text-base font-black text-text-primary truncate">
              {officialVersion ? officialVersion.title : 'Nenhuma definida'}
            </Title>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="p-5 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-xs">
          <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Disc className="w-6 h-6" />
          </LayoutContainer>
          <LayoutContainer className="flex flex-col">
            <Text className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Com Arquivo de Áudio
            </Text>
            <Title level="h3" className="text-2xl font-black text-text-primary">
              {versionsWithAudio}
            </Title>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* 3. Tabela de Versões */}
      <AdminAnthemTable
        anthems={anthems}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onSetOfficial={handleSetOfficial}
        onDelete={handleOpenDelete}
      />

      {/* 4. Drawer de Criação e Edição */}
      <AdminAnthemDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        anthem={selectedAnthem}
        onSuccess={reload}
      />

      {/* 5. Modal de Exclusão */}
      <AdminAnthemDeleteModal
        isOpen={Boolean(deletingAnthem)}
        onClose={handleCloseDelete}
        anthem={deletingAnthem}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </LayoutContainer>
  );
};

