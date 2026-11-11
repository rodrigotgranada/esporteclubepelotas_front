'use client';

import React from 'react';
import { LayoutContainer, Button, Select, Option } from '@/shared/ui/components';
import { TRANSPARENCY_TEXTS } from '../../constants/transparency.constants';

interface TransparencyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  availableYears: number[];
}

export function TransparencyTabs({
  activeTab,
  onTabChange,
  selectedYear,
  onYearChange,
  availableYears,
}: TransparencyTabsProps) {
  const tabs = [
    { id: 'ALL', label: TRANSPARENCY_TEXTS.TABS.ALL },
    { id: 'ESTATUTO', label: TRANSPARENCY_TEXTS.TABS.ESTATUTO },
    { id: 'BALANCO', label: TRANSPARENCY_TEXTS.TABS.BALANCO },
    { id: 'FINANCEIRO', label: TRANSPARENCY_TEXTS.TABS.FINANCEIRO },
    { id: 'ATA', label: TRANSPARENCY_TEXTS.TABS.ATA },
    { id: 'BOARD', label: TRANSPARENCY_TEXTS.TABS.BOARD },
  ];

  return (
    <LayoutContainer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
      <LayoutContainer className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={
                isActive
                  ? 'bg-amber-400 text-[#0B1B3D] font-bold border-amber-400'
                  : 'text-gray-300 border-gray-700 hover:border-amber-400/50'
              }
            >
              {tab.label}
            </Button>
          );
        })}
      </LayoutContainer>

      {activeTab !== 'BOARD' && availableYears.length > 0 && (
        <LayoutContainer className="w-full md:w-48">
          <Select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full bg-[#071126] border-gray-700 text-sm text-gray-200"
          >
            <Option value="ALL">{TRANSPARENCY_TEXTS.ALL_YEARS}</Option>
            {availableYears.map((year) => (
              <Option key={year} value={String(year)}>
                {year}
              </Option>
            ))}
          </Select>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
}

