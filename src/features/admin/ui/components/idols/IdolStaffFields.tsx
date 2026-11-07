'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  LayoutContainer,
  Title,
  Input,
  Textarea,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { IdolFormData } from '@/features/admin/schemas';

export interface IdolStaffFieldsProps {
  form: UseFormReturn<IdolFormData, any, any>;
}

export const IdolStaffFields: React.FC<IdolStaffFieldsProps> = ({ form }) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_STAFF}
      </Title>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          label={texts.LABEL_ROLE_NAME}
          error={errors.roleName?.message}
        >
          <Input
            {...register('roleName')}
            placeholder={texts.PLACEHOLDER_ROLE_NAME}
          />
        </FormField>

        <FormField
          label={texts.LABEL_YEARS_DEDICATION}
          error={errors.yearsOfDedication?.message}
        >
          <Input
            {...register('yearsOfDedication')}
            placeholder={texts.PLACEHOLDER_YEARS_DEDICATION}
          />
        </FormField>
      </LayoutContainer>

      <FormField
        label={texts.LABEL_BACKSTAGE_STORY}
        error={errors.backstageStory?.message}
      >
        <Textarea
          {...register('backstageStory')}
          placeholder={texts.PLACEHOLDER_BACKSTAGE_STORY}
          rows={3}
        />
      </FormField>
    </LayoutContainer>
  );
};
