'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  LayoutContainer,
  Title,
  Input,
  Select,
  Option,
  Textarea,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { IdolFormData } from '@/features/admin/schemas';

export interface IdolPlayerFieldsProps {
  form: UseFormReturn<IdolFormData, any, any>;
}

export const IdolPlayerFields: React.FC<IdolPlayerFieldsProps> = ({ form }) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface/50 border border-border shadow-xs animate-in fade-in duration-200">
      <Title level="h4" className="text-sm font-black text-primary uppercase tracking-wider">
        {texts.SECTION_PLAYER}
      </Title>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField
          label={texts.LABEL_POSITION}
          error={errors.position?.message}
        >
          <Input
            {...register('position')}
            placeholder={texts.PLACEHOLDER_POSITION}
          />
        </FormField>

        <FormField
          label={texts.LABEL_PREFERRED_FOOT}
          name="preferredFoot"
          control={control}
          error={errors.preferredFoot?.message}
          render={({ field }) => (
            <Select
              value={field.value || 'Destro'}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full"
            >
              <Option value="Destro">Destro</Option>
              <Option value="Canhoto">Canhoto</Option>
              <Option value="Ambidestro">Ambidestro</Option>
            </Select>
          )}
        />

        <FormField
          label={texts.LABEL_JERSEY}
          error={errors.historicJerseyNumber?.message}
        >
          <Input
            type="number"
            {...register('historicJerseyNumber')}
            placeholder={texts.PLACEHOLDER_JERSEY}
          />
        </FormField>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          label={texts.LABEL_MATCHES}
          error={errors.matchesCount?.message}
        >
          <Input
            type="number"
            {...register('matchesCount')}
            placeholder={texts.PLACEHOLDER_MATCHES}
          />
        </FormField>

        <FormField
          label={texts.LABEL_GOALS}
          error={errors.goalsCount?.message}
        >
          <Input
            type="number"
            {...register('goalsCount')}
            placeholder={texts.PLACEHOLDER_GOALS}
          />
        </FormField>
      </LayoutContainer>

      <FormField
        label={texts.LABEL_MEMORABLE_MATCH}
        error={errors.memorableMatch?.message}
      >
        <Input
          {...register('memorableMatch')}
          placeholder={texts.PLACEHOLDER_MEMORABLE_MATCH}
        />
      </FormField>

      <FormField
        label={texts.LABEL_TITLES}
        error={errors.titlesText?.message}
      >
        <Textarea
          {...register('titlesText')}
          placeholder={texts.PLACEHOLDER_TITLES}
          rows={3}
        />
      </FormField>
    </LayoutContainer>
  );
};
