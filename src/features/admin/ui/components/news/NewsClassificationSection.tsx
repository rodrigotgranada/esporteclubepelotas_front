'use client';

import React from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { Globe } from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Badge,
  Switch,
  Checkbox,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import type { NewsArticleFormData } from '../../../schemas/news/news.schema';

export interface NewsClassificationSectionProps {
  control: Control<NewsArticleFormData>;
  setValue: UseFormSetValue<NewsArticleFormData>;
  isYouth: boolean;
  isFemale: boolean;
}

export const NewsClassificationSection: React.FC<NewsClassificationSectionProps> = ({
  control,
  setValue,
  isYouth,
  isFemale,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="flex flex-col gap-4">
      <LayoutContainer
        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${
          isYouth ? 'bg-primary/10 border-primary/40 shadow-xs' : 'bg-surface border-border'
        }`}
      >
        <LayoutContainer className="flex items-center justify-between">
          <LayoutContainer className="flex items-center gap-2">
            <Text as="span" className="text-sm font-bold text-text-primary">
              {texts.SWITCH_IS_YOUTH_LABEL}
            </Text>
            <Badge variant={isYouth ? 'primary' : 'default'} size="sm" className="font-extrabold text-[10px] uppercase">
              {isYouth ? `🌱 ${texts.BADGE_YOUTH_ACTIVE}` : texts.BADGE_PRO_ACTIVE}
            </Badge>
          </LayoutContainer>

          <Controller
            control={control}
            name="isYouth"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    setValue('isFemale', false);
                  }
                }}
                aria-label={texts.SWITCH_IS_YOUTH_LABEL}
              />
            )}
          />
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-muted leading-relaxed">
          {texts.SWITCH_IS_YOUTH_DESC}
        </Text>
      </LayoutContainer>

      <LayoutContainer
        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-2 ${
          isFemale ? 'bg-primary/10 border-primary/40 shadow-xs' : 'bg-surface border-border'
        }`}
      >
        <LayoutContainer className="flex items-center justify-between">
          <LayoutContainer className="flex items-center gap-2">
            <Text as="span" className="text-sm font-bold text-text-primary">
              {texts.SWITCH_IS_FEMALE_LABEL}
            </Text>
            <Badge variant={isFemale ? 'primary' : 'default'} size="sm" className="font-extrabold text-[10px] uppercase">
              {isFemale ? `👑 ${texts.BADGE_FEMALE_ACTIVE}` : texts.BADGE_PRO_ACTIVE}
            </Badge>
          </LayoutContainer>

          <Controller
            control={control}
            name="isFemale"
            render={({ field }) => (
              <Switch
                checked={Boolean(field.value)}
                onChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    setValue('isYouth', false);
                  }
                }}
                aria-label={texts.SWITCH_IS_FEMALE_LABEL}
              />
            )}
          />
        </LayoutContainer>

        <Text as="p" className="text-xs text-text-muted leading-relaxed">
          {texts.SWITCH_IS_FEMALE_DESC}
        </Text>
      </LayoutContainer>

      {(isYouth || isFemale) && (
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3 animate-in fade-in duration-200">
          <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary" />
            {texts.LABEL_DISTRIBUTION_SECTION}
          </Text>

          <Controller
            control={control}
            name="showOnHomepage"
            render={({ field }) => (
              <Checkbox
                label={texts.LABEL_SHOW_ON_HOMEPAGE}
                description={texts.SHOW_ON_HOMEPAGE_HINT}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />

          <LayoutContainer className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-secondary mt-1">
            {isYouth ? texts.YOUTH_CATEGORY_NOTICE : texts.FEMALE_CATEGORY_NOTICE}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
