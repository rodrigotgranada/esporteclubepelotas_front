'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LayoutContainer, Title, Input, FormField } from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { IdolFormData } from '@/features/admin/schemas';

export interface IdolFanFieldsProps {
  form: UseFormReturn<IdolFormData, any, any>;
}

export const IdolFanFields: React.FC<IdolFanFieldsProps> = ({ form }) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_FAN}
      </Title>

      <FormField
        label={texts.LABEL_STADIUM_SECTOR}
        error={errors.stadiumSector?.message}
      >
        <Input
          {...register('stadiumSector')}
          placeholder={texts.PLACEHOLDER_STADIUM_SECTOR}
        />
      </FormField>

      <FormField
        label={texts.LABEL_TRADEMARK}
        error={errors.trademark?.message}
      >
        <Input
          {...register('trademark')}
          placeholder={texts.PLACEHOLDER_TRADEMARK}
        />
      </FormField>
    </LayoutContainer>
  );
};
