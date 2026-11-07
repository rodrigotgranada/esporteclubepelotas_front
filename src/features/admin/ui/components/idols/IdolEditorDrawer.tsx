'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Drawer,
  LayoutContainer,
  Text,
  Title,
  Input,
  Select,
  Option,
  Button,
  Checkbox,
  Spinner,
  ImageCropper,
  Textarea,
  FormField,
} from '@/shared/ui/components';
import { Save, Star } from 'lucide-react';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { useAdminIdolDrawer } from '../../../hooks/idols/useAdminIdolDrawer';
import { IdolPlayerFields } from './IdolPlayerFields';
import { IdolCoachFields } from './IdolCoachFields';
import { IdolStaffFields } from './IdolStaffFields';
import { IdolFanFields } from './IdolFanFields';
import { IdolPeriodsEditor } from './IdolPeriodsEditor';
import { IdolGalleryEditor } from './IdolGalleryEditor';
import { IdolCategory } from '../../../../idols/services/idols.service';

export interface IdolEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  idolId: string | null;
  onSaveSuccess: () => void;
}

export const IdolEditorDrawer: React.FC<IdolEditorDrawerProps> = ({
  isOpen,
  onClose,
  idolId,
  onSaveSuccess,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  const {
    form,
    isLoading,
    isSaving,
    savingLabel,
    handleCropSave,
    handlePhotoRemove,
    handleAddPeriod,
    handleUpdatePeriod,
    handleRemovePeriod,
    handleAddGalleryItems,
    handleUpdateGalleryCaption,
    handleRemoveGalleryItem,
    handleSave,
  } = useAdminIdolDrawer(idolId, isOpen, onSaveSuccess);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const category = watch('category');
  const photoUrl = watch('photoUrl');
  const periods = watch('periods') || [];
  const galleryItems = watch('galleryItems') || [];
  const isActiveInClub = watch('isActiveInClub');
  const isFeatured = watch('isFeatured');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={idolId ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="2xl"
    >
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-16">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium">
            {texts.LOADING_DATA}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-6 pb-8">
          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
              {texts.SECTION_BASIC}
            </Title>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label={texts.LABEL_CATEGORY}
                name="category"
                control={control}
                error={errors.category?.message}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value as IdolCategory)}
                    className="w-full"
                  >
                    <Option value="PLAYER">{ADMIN_IDOLS_TEXTS.CATEGORIES.PLAYER}</Option>
                    <Option value="COACH">{ADMIN_IDOLS_TEXTS.CATEGORIES.COACH}</Option>
                    <Option value="STAFF">{ADMIN_IDOLS_TEXTS.CATEGORIES.STAFF}</Option>
                    <Option value="FAN">{ADMIN_IDOLS_TEXTS.CATEGORIES.FAN}</Option>
                  </Select>
                )}
              />

              <FormField
                label={`${texts.LABEL_NAME} *`}
                error={errors.name?.message}
              >
                <Input
                  {...register('name')}
                  placeholder={texts.PLACEHOLDER_NAME}
                />
              </FormField>
            </LayoutContainer>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label={texts.LABEL_NICKNAME}
                error={errors.nickname?.message}
              >
                <Input
                  {...register('nickname')}
                  placeholder={texts.PLACEHOLDER_NICKNAME}
                />
              </FormField>

              <FormField
                label={texts.LABEL_SLUG}
                error={errors.slug?.message}
              >
                <Input
                  {...register('slug')}
                  placeholder={texts.PLACEHOLDER_SLUG}
                />
              </FormField>
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-2 pt-2">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.LABEL_PHOTO}
              </Text>
              <Text as="p" className="text-xs text-text-muted mb-1">
                {texts.PHOTO_HINT}
              </Text>
              <ImageCropper
                shape="rect"
                aspect={3 / 4}
                initialImage={photoUrl}
                onCropSave={handleCropSave}
                onImageRemove={handlePhotoRemove}
                placeholderLabel={texts.PHOTO_CROP_PLACEHOLDER}
                className="w-full max-w-sm mx-auto"
              />
            </LayoutContainer>
          </LayoutContainer>

          {category === 'PLAYER' && <IdolPlayerFields form={form} />}
          {category === 'COACH' && <IdolCoachFields form={form} />}
          {category === 'STAFF' && <IdolStaffFields form={form} />}
          {category === 'FAN' && <IdolFanFields form={form} />}

          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
              {texts.SECTION_PERIOD_ORIGIN}
            </Title>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label={`${texts.LABEL_START_YEAR} *`}
                error={errors.startYear?.message}
              >
                <Input
                  type="number"
                  {...register('startYear')}
                  placeholder={texts.PLACEHOLDER_START_YEAR}
                />
              </FormField>

              <FormField
                label={texts.LABEL_END_YEAR}
                error={errors.endYear?.message}
              >
                <Input
                  type="number"
                  disabled={isActiveInClub}
                  {...register('endYear')}
                  placeholder={texts.PLACEHOLDER_END_YEAR}
                />
              </FormField>
            </LayoutContainer>

            <Controller
              control={control}
              name="isActiveInClub"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label={texts.CHECKBOX_ACTIVE_IN_CLUB}
                />
              )}
            />

            <IdolPeriodsEditor
              periods={periods}
              onAdd={handleAddPeriod}
              onUpdate={handleUpdatePeriod}
              onRemove={handleRemovePeriod}
            />

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <FormField
                label={texts.LABEL_BIRTH_DATE}
                error={errors.birthDate?.message}
              >
                <Input
                  type="date"
                  {...register('birthDate')}
                />
              </FormField>

              <FormField
                label={texts.LABEL_DEATH_DATE}
                error={errors.deathDate?.message}
              >
                <Input
                  type="date"
                  {...register('deathDate')}
                />
              </FormField>

              <FormField
                label={texts.LABEL_BIRTH_PLACE}
                error={errors.birthPlace?.message}
              >
                <Input
                  {...register('birthPlace')}
                  placeholder={texts.PLACEHOLDER_BIRTH_PLACE}
                />
              </FormField>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
              {texts.SECTION_BIO}
            </Title>

            <FormField
              label={texts.LABEL_QUOTE}
              error={errors.quote?.message}
            >
              <Input
                {...register('quote')}
                placeholder={texts.PLACEHOLDER_QUOTE}
              />
            </FormField>

            <FormField
              label={`${texts.LABEL_BIOGRAPHY} *`}
              error={errors.biography?.message}
            >
              <Textarea
                {...register('biography')}
                placeholder={texts.PLACEHOLDER_BIOGRAPHY}
                rows={6}
              />
            </FormField>
          </LayoutContainer>

          <IdolGalleryEditor
            idolId={idolId}
            items={galleryItems}
            onUpdateCaption={handleUpdateGalleryCaption}
            onRemoveItem={handleRemoveGalleryItem}
            onAddItems={handleAddGalleryItems}
          />

          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <LayoutContainer className="flex items-center gap-3">
                <Star className={`w-5 h-5 ${isFeatured ? 'text-primary fill-primary' : 'text-text-muted'}`} />
                <LayoutContainer className="flex flex-col">
                  <Text as="span" className="text-sm font-bold text-text-primary">
                    {texts.LABEL_FEATURED}
                  </Text>
                  <Text as="span" className="text-xs text-text-muted">
                    {texts.FEATURED_DESC}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
              <Controller
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <Checkbox
                    label={texts.CHECKBOX_FEATURED}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5 pt-3 border-t border-border">
              <FormField
                label={texts.LABEL_ORDER}
                error={errors.order?.message}
              >
                <Input
                  type="number"
                  min={0}
                  {...register('order')}
                  placeholder="0"
                  className="max-w-xs"
                />
              </FormField>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              {texts.BUTTON_CANCEL}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="font-bold"
            >
              {isSaving ? savingLabel || texts.BUTTON_SAVING : texts.BUTTON_SAVE}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </Drawer>
  );
};
