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

export interface IdolCoachFieldsProps {
  form: UseFormReturn<IdolFormData, any, any>;
}

export const IdolCoachFields: React.FC<IdolCoachFieldsProps> = ({ form }) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_COACH}
      </Title>

      <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <FormField
          label={texts.LABEL_COACH_MATCHES}
          error={errors.coachMatches?.message}
        >
          <Input
            type="number"
            {...register('coachMatches')}
            placeholder="0"
          />
        </FormField>

        <FormField
          label={texts.LABEL_COACH_WINS}
          error={errors.coachWins?.message}
        >
          <Input
            type="number"
            {...register('coachWins')}
            placeholder="0"
          />
        </FormField>

        <FormField
          label={texts.LABEL_COACH_DRAWS}
          error={errors.coachDraws?.message}
        >
          <Input
            type="number"
            {...register('coachDraws')}
            placeholder="0"
          />
        </FormField>

        <FormField
          label={texts.LABEL_COACH_LOSSES}
          error={errors.coachLosses?.message}
        >
          <Input
            type="number"
            {...register('coachLosses')}
            placeholder="0"
          />
        </FormField>
      </LayoutContainer>

      <FormField
        label={texts.LABEL_TACTICAL_STYLE}
        error={errors.tacticalStyle?.message}
      >
        <Input
          {...register('tacticalStyle')}
          placeholder={texts.PLACEHOLDER_TACTICAL_STYLE}
        />
      </FormField>

      <FormField
        label={texts.LABEL_TITLES}
        error={errors.coachTitlesText?.message}
      >
        <Textarea
          {...register('coachTitlesText')}
          placeholder={texts.PLACEHOLDER_TITLES}
          rows={3}
        />
      </FormField>
    </LayoutContainer>
  );
};
