'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { useAdminStadium, AdminStadiumTab } from '../../../hooks/stadium/useAdminStadium';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { StadiumGeneralForm } from '../../components/stadium/StadiumGeneralForm';
import { StadiumStoryEditor } from '../../components/stadium/StadiumStoryEditor';
import { StadiumGalleryManager } from '../../components/stadium/StadiumGalleryManager';
import { StadiumFactsManager } from '../../components/stadium/StadiumFactsManager';
import { Save, Loader2, BookOpen, Settings, Camera, History, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const AdminStadiumFeature: React.FC = () => {
  const {
    form,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    savingLabel,
    coverPreviewUrl,
    handleSelectCoverFile,
    handleAddGalleryImage,
    handleUpdateGalleryImage,
    handleRemoveGalleryImage,
    handleAddFact,
    handleUpdateFact,
    handleRemoveFact,
    handleAddQuickFact,
    handleUpdateQuickFact,
    handleRemoveQuickFact,
    onSubmit,
  } = useAdminStadium();

  if (isLoading) {
    return (
      <LayoutContainer className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <Text className="text-text-secondary text-sm">Carregando dados da Boca do Lobo...</Text>
      </LayoutContainer>
    );
  }

  const tabs: { id: AdminStadiumTab; label: string; icon: React.ElementType }[] = [
    { id: 'STORY', label: ADMIN_STADIUM_TEXTS.TABS.STORY, icon: BookOpen },
    { id: 'GENERAL', label: ADMIN_STADIUM_TEXTS.TABS.GENERAL, icon: Settings },
    { id: 'GALLERY', label: ADMIN_STADIUM_TEXTS.TABS.GALLERY, icon: Camera },
    { id: 'FACTS', label: ADMIN_STADIUM_TEXTS.TABS.FACTS, icon: History },
  ];

  return (
    <LayoutContainer className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Header */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h1" className="text-2xl sm:text-3xl font-black text-text-primary">
            {ADMIN_STADIUM_TEXTS.PAGE_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary">
            {ADMIN_STADIUM_TEXTS.PAGE_DESCRIPTION}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          <Link href="/estadio" target="_blank" rel="noopener noreferrer">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2 cursor-pointer font-medium"
            >
              <ExternalLink className="w-4 h-4 text-primary" />
              <Text as="span">Ver no Portal</Text>
            </Button>
          </Link>

          <Button
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={onSubmit}
            className="flex items-center gap-2 cursor-pointer font-bold shadow-md"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <Text as="span">
              {isSaving ? savingLabel || ADMIN_STADIUM_TEXTS.FORM.SAVING_BUTTON : ADMIN_STADIUM_TEXTS.FORM.SAVE_BUTTON}
            </Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Tabs Navigation */}
      <LayoutContainer className="flex border-b border-border gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              type="button"
              key={tab.id}
              variant={isActive ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-black shadow-sm'
                  : 'bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <Text as="span">{tab.label}</Text>
            </Button>
          );
        })}
      </LayoutContainer>

      {/* Formulário / Conteúdo da Tab Ativa */}
      <LayoutContainer as="section" className="flex flex-col gap-6">
        {activeTab === 'STORY' && <StadiumStoryEditor form={form} />}

        {activeTab === 'GENERAL' && (
          <StadiumGeneralForm
            form={form}
            coverPreviewUrl={coverPreviewUrl}
            onSelectCoverFile={handleSelectCoverFile}
            onAddQuickFact={handleAddQuickFact}
            onUpdateQuickFact={handleUpdateQuickFact}
            onRemoveQuickFact={handleRemoveQuickFact}
          />
        )}

        {activeTab === 'GALLERY' && (
          <StadiumGalleryManager
            gallery={form.watch('gallery') || []}
            onAddImage={handleAddGalleryImage}
            onUpdateImage={handleUpdateGalleryImage}
            onRemoveImage={handleRemoveGalleryImage}
          />
        )}

        {activeTab === 'FACTS' && (
          <StadiumFactsManager
            facts={form.watch('facts') || []}
            onAddFact={handleAddFact}
            onUpdateFact={handleUpdateFact}
            onRemoveFact={handleRemoveFact}
          />
        )}

        {/* Botão de Rodapé Flutuante / Fixo */}
        <LayoutContainer className="flex justify-end pt-4 border-t border-border">
          <Button
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={onSubmit}
            className="flex items-center gap-2 cursor-pointer font-bold shadow-md px-6 py-2.5"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <Text as="span">
              {isSaving ? savingLabel || ADMIN_STADIUM_TEXTS.FORM.SAVING_BUTTON : ADMIN_STADIUM_TEXTS.FORM.SAVE_BUTTON}
            </Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
