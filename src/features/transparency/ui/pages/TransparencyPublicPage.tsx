'use client';

import React from 'react';
import { LayoutContainer, ModuleGuard } from '@/shared/ui/components';
import { TransparencyHero } from '../components/TransparencyHero';
import { TransparencyTabs } from '../components/TransparencyTabs';
import { TransparencyDocumentsGrid } from '../components/TransparencyDocumentsGrid';
import { TransparencyBoardSection } from '../components/TransparencyBoardSection';
import { useTransparencyPublic } from '../../hooks/useTransparencyPublic';

export function TransparencyPublicPage() {
  const {
    activeTab,
    setActiveTab,
    selectedYear,
    setSelectedYear,
    isLoading,
    availableYears,
    filteredDocuments,
    executiveBoard,
    deliberativeCouncil,
    fiscalCouncil,
  } = useTransparencyPublic();

  return (
    <ModuleGuard moduleSlug="transparency">
      <LayoutContainer className="min-h-screen bg-[#040A18] text-white">
        <LayoutContainer className="mx-auto max-w-7xl px-4 py-8 md:py-12 flex flex-col gap-8">
          <TransparencyHero />

          <TransparencyTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            availableYears={availableYears}
          />

          {activeTab === 'BOARD' ? (
            <TransparencyBoardSection
              executiveBoard={executiveBoard}
              deliberativeCouncil={deliberativeCouncil}
              fiscalCouncil={fiscalCouncil}
            />
          ) : (
            <TransparencyDocumentsGrid
              documents={filteredDocuments}
              isLoading={isLoading}
            />
          )}
        </LayoutContainer>
      </LayoutContainer>
    </ModuleGuard>
  );
}

