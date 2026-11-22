'use client';

import React from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Lock, Unlock, Calendar } from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Input,
  Select,
  Option,
  Button,
  Badge,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import type { NewsArticleFormData } from '../../../schemas/news/news.schema';
import type { NewsCategoryData } from '../../../services/admin-news.service';

export interface NewsCategorySlugSectionProps {
  control: Control<NewsArticleFormData>;
  register: UseFormRegister<NewsArticleFormData>;
  errors: FieldErrors<NewsArticleFormData>;
  categories: NewsCategoryData[];
  onOpenQuickCategory: () => void;
  isPublishedArticle: boolean;
  isSlugLocked: boolean;
  onToggleSlugLock: () => void;
}

export const NewsCategorySlugSection: React.FC<NewsCategorySlugSectionProps> = ({
  control,
  register,
  errors,
  categories,
  onOpenQuickCategory,
  isPublishedArticle,
  isSlugLocked,
  onToggleSlugLock,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LayoutContainer className="flex flex-col">
        <LayoutContainer className="flex items-center justify-between mb-1">
          <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            {texts.LABEL_CATEGORY} *
          </Text>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenQuickCategory}
            className="text-xs h-6 px-1.5 text-primary hover:text-primary/80 font-bold"
          >
            {texts.BUTTON_QUICK_CATEGORY}
          </Button>
        </LayoutContainer>
        <FormField
          name="categoryId"
          control={control}
          error={errors.categoryId?.message}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full"
            >
              {categories.map((c) => (
                <Option key={c._id || c.slug} value={c._id || c.slug}>
                  {c.name}
                </Option>
              ))}
            </Select>
          )}
        />
      </LayoutContainer>

      <LayoutContainer className="flex flex-col">
        <LayoutContainer className="flex items-center justify-between mb-1">
          <LayoutContainer className="flex items-center gap-1.5">
            <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              {texts.LABEL_SLUG}
            </Text>
            {isPublishedArticle && (
              <Badge variant={isSlugLocked ? 'default' : 'warning'} size="sm">
                {isSlugLocked ? (
                  <Text as="span" className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {texts.SLUG_LOCKED_BADGE}
                  </Text>
                ) : (
                  <Text as="span" className="flex items-center gap-1">
                    <Unlock className="w-3 h-3" />
                    {texts.SLUG_UNLOCKED_BADGE}
                  </Text>
                )}
              </Badge>
            )}
          </LayoutContainer>
          {isPublishedArticle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleSlugLock}
              className="text-xs h-7 px-2"
            >
              {isSlugLocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 mr-1 text-primary" />
                  <Text as="span" className="text-primary">{texts.SLUG_UNLOCK_BTN}</Text>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 mr-1 text-text-secondary" />
                  <Text as="span">{texts.SLUG_LOCK_BTN}</Text>
                </>
              )}
            </Button>
          )}
        </LayoutContainer>
        <FormField
          error={errors.slug?.message}
          description={
            isSlugLocked
              ? texts.SLUG_LOCKED_HINT
              : isPublishedArticle
                ? texts.SLUG_UNLOCKED_WARNING
                : texts.SLUG_HINT
          }
        >
          <Input
            {...register('slug')}
            placeholder={texts.PLACEHOLDER_SLUG}
            disabled={isSlugLocked}
            className={isSlugLocked ? 'opacity-70 bg-surface-hover cursor-not-allowed' : ''}
          />
        </FormField>
      </LayoutContainer>
    </LayoutContainer>
  );
};

export interface NewsScheduleSectionProps {
  control: Control<NewsArticleFormData>;
  register: UseFormRegister<NewsArticleFormData>;
  errors: FieldErrors<NewsArticleFormData>;
  status?: string;
}

export const NewsScheduleSection: React.FC<NewsScheduleSectionProps> = ({
  control,
  register,
  errors,
  status,
}) => {
  const { DRAWER: texts, STATUS_MAP } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-surface">
      <FormField
        label={texts.LABEL_STATUS}
        name="status"
        control={control}
        error={errors.status?.message}
        render={({ field }) => (
          <Select
            value={field.value}
            onChange={(e) => field.onChange(e.target.value as NewsArticleFormData['status'])}
            className="w-full"
          >
            <Option value="DRAFT">{STATUS_MAP.DRAFT}</Option>
            <Option value="PUBLISHED">{STATUS_MAP.PUBLISHED}</Option>
            <Option value="SCHEDULED">{STATUS_MAP.SCHEDULED}</Option>
            <Option value="ARCHIVED">{STATUS_MAP.ARCHIVED}</Option>
          </Select>
        )}
      />

      {status === 'SCHEDULED' && (
        <FormField
          label={
            <Text as="span" className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {texts.LABEL_PUBLISHED_AT}
            </Text>
          }
          error={errors.publishedAt?.message}
        >
          <Input
            type="datetime-local"
            {...register('publishedAt')}
          />
        </FormField>
      )}
    </LayoutContainer>
  );
};
