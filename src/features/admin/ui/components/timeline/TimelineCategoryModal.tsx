'use client';

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Input,
  Textarea,
  Select,
  Option,
  Switch,
  Button,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_TIMELINE_CONSTANTS } from '@/features/admin/constants/admin-timeline.constants';
import { Flag, Trophy, Landmark, Star, Sparkles, Medal, Shield, Heart } from 'lucide-react';
import { TimelineCategoryFormData } from '@/features/admin/schemas/timeline/timeline-category.schema';

export interface TimelineCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  isEditing: boolean;
  form: UseFormReturn<TimelineCategoryFormData, any, any>;
}

export const renderCategoryIconComponent = (iconName: string, className = 'w-4 h-4 text-primary') => {
  switch (iconName) {
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Medal':
      return <Medal className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Flag':
    default:
      return <Flag className={className} />;
  }
};

export const TimelineCategoryModal: React.FC<TimelineCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  isEditing,
  form,
}) => {
  const texts = ADMIN_TIMELINE_CONSTANTS.MODAL_CATEGORY;

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const icon = watch('icon');

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full p-6">
      <LayoutContainer className="flex items-center gap-2 mb-1">
        {renderCategoryIconComponent(icon, 'w-5 h-5 text-primary')}
        <Title level="h3" className="text-lg font-black text-text-primary">
          {isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
        </Title>
      </LayoutContainer>

      <Text as="p" className="text-xs text-text-secondary mb-4 leading-relaxed">
        {texts.DESC}
      </Text>

      <LayoutContainer className="flex flex-col gap-4">
        {/* Name */}
        <FormField
          label={`${texts.FIELD_NAME} *`}
          error={errors.name?.message}
        >
          <Input
            {...register('name')}
            placeholder={texts.FIELD_NAME_PLACEHOLDER}
          />
        </FormField>

        {/* Slug and Icon */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={texts.FIELD_SLUG}
            error={errors.slug?.message}
          >
            <Input
              {...register('slug')}
              placeholder={texts.FIELD_SLUG_PLACEHOLDER}
            />
          </FormField>

          <FormField
            label={texts.FIELD_ICON}
            name="icon"
            control={control}
            error={errors.icon?.message}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              >
                {ADMIN_TIMELINE_CONSTANTS.CATEGORY_ICONS.map((ic) => (
                  <Option key={ic.value} value={ic.value}>
                    {ic.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        </LayoutContainer>

        {/* Order and Active */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <FormField
            label={texts.FIELD_ORDER}
            error={errors.displayOrder?.message}
          >
            <Input
              type="number"
              {...register('displayOrder')}
            />
          </FormField>

          <LayoutContainer className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_ACTIVE}
            </Text>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </LayoutContainer>
        </LayoutContainer>

        <FormField
          label={texts.FIELD_DESC}
          error={errors.description?.message}
        >
          <Textarea
            {...register('description')}
            placeholder={texts.FIELD_DESC_PLACEHOLDER}
            rows={3}
          />
        </FormField>

        {/* Modal Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            {texts.BTN_CANCEL}
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} className="font-bold">
            {isSaving ? texts.BTN_SAVING : texts.BTN_SAVE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
