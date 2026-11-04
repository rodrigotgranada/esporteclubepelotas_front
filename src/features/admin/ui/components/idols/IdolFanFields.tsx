'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Input } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';

export interface IdolFanFieldsProps {
  stadiumSector: string;
  setStadiumSector: (val: string) => void;
  trademark: string;
  setTrademark: (val: string) => void;
}

export const IdolFanFields: React.FC<IdolFanFieldsProps> = ({
  stadiumSector,
  setStadiumSector,
  trademark,
  setTrademark,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_FAN}
      </Title>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_STADIUM_SECTOR}
        </Text>
        <Input
          value={stadiumSector}
          onChange={(e) => setStadiumSector(e.target.value)}
          placeholder={texts.PLACEHOLDER_STADIUM_SECTOR}
        />
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_TRADEMARK}
        </Text>
        <Input
          value={trademark}
          onChange={(e) => setTrademark(e.target.value)}
          placeholder={texts.PLACEHOLDER_TRADEMARK}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
