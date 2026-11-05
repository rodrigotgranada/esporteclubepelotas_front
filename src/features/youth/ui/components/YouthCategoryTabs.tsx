'use client';

import React from 'react';
import { LayoutContainer, Button, Text } from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { YouthCategoryType } from '../../hooks/useYouthHub';

export interface YouthCategoryTabsProps {
  selectedCategory: YouthCategoryType;
  onSelectCategory: (cat: YouthCategoryType) => void;
}

export const YouthCategoryTabs: React.FC<YouthCategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const tabs = YOUTH_CONSTANTS.TABS;

  const categories: { key: YouthCategoryType; label: string }[] = [
    { key: 'SUB_20', label: tabs.SUB_20 },
    { key: 'SUB_17', label: tabs.SUB_17 },
    { key: 'SUB_15', label: tabs.SUB_15 },
  ];

  return (
    <LayoutContainer className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      {categories.map((c) => {
        const isSelected = selectedCategory === c.key;
        return (
          <Button
            key={c.key}
            type="button"
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(c.key)}
            className="font-bold text-xs whitespace-nowrap rounded-full transition-all px-4 py-2"
          >
            <Text as="span">{c.label}</Text>
          </Button>
        );
      })}
    </LayoutContainer>
  );
};
