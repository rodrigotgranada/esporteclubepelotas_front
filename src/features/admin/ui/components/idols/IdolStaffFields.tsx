'use client';

import React from 'react';
import { LayoutContainer, Text, Title, Input, Textarea } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';

export interface IdolStaffFieldsProps {
  roleName: string;
  setRoleName: (val: string) => void;
  yearsOfDedication: string;
  setYearsOfDedication: (val: string) => void;
  backstageStory: string;
  setBackstageStory: (val: string) => void;
}

export const IdolStaffFields: React.FC<IdolStaffFieldsProps> = ({
  roleName,
  setRoleName,
  yearsOfDedication,
  setYearsOfDedication,
  backstageStory,
  setBackstageStory,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_STAFF}
      </Title>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_ROLE_NAME}
          </Text>
          <Input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder={texts.PLACEHOLDER_ROLE_NAME}
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-secondary">
            {texts.LABEL_YEARS_DEDICATION}
          </Text>
          <Input
            value={yearsOfDedication}
            onChange={(e) => setYearsOfDedication(e.target.value)}
            placeholder={texts.PLACEHOLDER_YEARS_DEDICATION}
          />
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-1.5">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_BACKSTAGE_STORY}
        </Text>
        <Textarea
          value={backstageStory}
          onChange={(e) => setBackstageStory(e.target.value)}
          placeholder={texts.PLACEHOLDER_BACKSTAGE_STORY}
          rows={3}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
