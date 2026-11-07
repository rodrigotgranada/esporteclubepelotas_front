'use client';

import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import {
  Drawer,
  LayoutContainer,
  Text,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  ImageCropper,
  Switch,
  Badge,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';
import {
  AthleteGender,
  AthleteType,
  PreferredFoot,
} from '@/features/football/services/football.service';
import { AthleteFormData } from '../../../schemas/football/athlete.schema';

export interface AthleteEditorDrawerProps {
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  savingLabel?: string;
  form: UseFormReturn<AthleteFormData, any, any>;
  photoUrl: string;
  setPhotoUrl: (v: string) => void;
  pendingPhotoFile?: File | null;
  setPendingPhotoFile: (f: File | null) => void;
  allowedTypes?: AthleteType[];
}

export const AthleteEditorDrawer: React.FC<AthleteEditorDrawerProps> = ({
  isOpen,
  isEditing,
  onClose,
  onSave,
  isSaving,
  savingLabel,
  form,
  photoUrl,
  setPhotoUrl,
  setPendingPhotoFile,
  allowedTypes,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE;
  const { register, control, watch, formState: { errors } } = form;

  const athleteType = watch('athleteType');
  const isStaff = athleteType === 'STAFF';
  const isYouth = athleteType === 'YOUTH';

  const handleCropComplete = (croppedImageBlob: Blob) => {
    const file = new File([croppedImageBlob], 'photo.webp', {
      type: croppedImageBlob.type || 'image/webp',
    });
    setPendingPhotoFile(file);
    const previewUrl = URL.createObjectURL(croppedImageBlob);
    setPhotoUrl(previewUrl);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="lg"
    >
      <LayoutContainer className="flex flex-col gap-6 p-6">
        <LayoutContainer className="flex flex-col gap-2">
          <Text as="span" className="text-xs font-extrabold uppercase text-text-primary tracking-wider">
            {texts.PHOTO_LABEL}
          </Text>
          <ImageCropper
            shape="rect"
            aspect={3 / 4}
            initialImage={photoUrl}
            onCropSave={handleCropComplete}
            onImageRemove={() => {
              setPhotoUrl('');
              setPendingPhotoFile(null);
            }}
            placeholderLabel={texts.PHOTO_LABEL}
          />
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-secondary border border-border">
          <FormField
            control={control}
            name="gender"
            label={`${texts.FIELD_GENDER} *`}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as AthleteGender)}
                className="w-full"
              >
                <Option value="MALE">{texts.GENDER_MALE}</Option>
                <Option value="FEMALE">{texts.GENDER_FEMALE}</Option>
              </Select>
            )}
          />

          <FormField
            control={control}
            name="athleteType"
            label={`${texts.FIELD_ATHLETE_TYPE} *`}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(e) => {
                  const nextType = e.target.value as AthleteType;
                  field.onChange(nextType);
                  if (nextType === 'STAFF') {
                    form.setValue('staffRole', form.getValues('staffRole') || 'Treinador');
                  }
                }}
                className="w-full"
              >
                {(!allowedTypes || allowedTypes.includes('PROFESSIONAL') || athleteType === 'PROFESSIONAL') && (
                  <Option value="PROFESSIONAL">{texts.TYPE_PROFESSIONAL}</Option>
                )}
                {(!allowedTypes || allowedTypes.includes('YOUTH') || athleteType === 'YOUTH') && (
                  <Option value="YOUTH">{texts.TYPE_YOUTH}</Option>
                )}
                {(!allowedTypes || allowedTypes.includes('STAFF') || athleteType === 'STAFF') && (
                  <Option value="STAFF">{texts.TYPE_STAFF}</Option>
                )}
              </Select>
            )}
          />
        </LayoutContainer>

        {isYouth && (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <FormField
              control={control}
              name="youthCategory"
              label={texts.FIELD_YOUTH_CATEGORY}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full"
                >
                  <Option value="SUB_20">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_20_FULL}</Option>
                  <Option value="SUB_17">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_17_FULL}</Option>
                  <Option value="SUB_15">{FOOTBALL_CONSTANTS.CATEGORIES.SUB_15_FULL}</Option>
                </Select>
              )}
            />

            <FormField label={texts.FIELD_ENTRY_YEAR} error={errors.entryYear?.message}>
              <Input
                type="number"
                {...register('entryYear')}
                placeholder={texts.FIELD_ENTRY_YEAR_PLACEHOLDER}
              />
            </FormField>
          </LayoutContainer>
        )}

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={`${texts.FIELD_NAME} *`} error={errors.name?.message}>
            <Input
              {...register('name')}
              placeholder={texts.FIELD_NAME_PLACEHOLDER}
            />
          </FormField>

          <FormField label={texts.FIELD_NICKNAME} error={errors.nickname?.message}>
            <Input
              {...register('nickname')}
              placeholder={texts.FIELD_NICKNAME_PLACEHOLDER}
            />
          </FormField>
        </LayoutContainer>

        {isStaff ? (
          <FormField
            control={control}
            name="staffRole"
            label={`${texts.FIELD_STAFF_ROLE} *`}
            error={errors.staffRole?.message}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              >
                {FOOTBALL_CONSTANTS.STAFF_ROLES.map((role) => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        ) : (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label={`${texts.FIELD_PRIMARY_POSITION} *`}
              error={errors.primaryPosition?.message}
            >
              <Input
                {...register('primaryPosition')}
                placeholder={texts.FIELD_PRIMARY_POSITION_PLACEHOLDER}
              />
            </FormField>

            <FormField
              control={control}
              name="preferredFoot"
              label={texts.FIELD_PREFERRED_FOOT}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value as PreferredFoot)}
                  className="w-full"
                >
                  <Option value="RIGHT">{FOOTBALL_CONSTANTS.FEET.RIGHT}</Option>
                  <Option value="LEFT">{FOOTBALL_CONSTANTS.FEET.LEFT}</Option>
                  <Option value="BOTH">{FOOTBALL_CONSTANTS.FEET.BOTH}</Option>
                </Select>
              )}
            />
          </LayoutContainer>
        )}

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label={texts.FIELD_BIRTH_DATE} error={errors.birthDate?.message}>
            <Input type="date" {...register('birthDate')} />
          </FormField>

          <FormField label={texts.FIELD_BIRTH_PLACE} error={errors.birthPlace?.message}>
            <Input
              {...register('birthPlace')}
              placeholder={texts.FIELD_BIRTH_PLACE_PLACEHOLDER}
            />
          </FormField>
        </LayoutContainer>

        {!isStaff && (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label={texts.FIELD_HEIGHT} error={errors.height?.message}>
              <Input
                type="number"
                {...register('height')}
                placeholder={texts.FIELD_HEIGHT_PLACEHOLDER}
              />
            </FormField>

            <FormField label={texts.FIELD_WEIGHT} error={errors.weight?.message}>
              <Input
                type="number"
                {...register('weight')}
                placeholder={texts.FIELD_WEIGHT_PLACEHOLDER}
              />
            </FormField>
          </LayoutContainer>
        )}

        {!isStaff && (
          <FormField
            label={texts.FIELD_SECONDARY_POSITIONS}
            error={errors.secondaryPositionsText?.message}
          >
            <Input
              {...register('secondaryPositionsText')}
              placeholder={texts.FIELD_SECONDARY_POSITIONS_PLACEHOLDER}
            />
          </FormField>
        )}

        {!isYouth && (
          <FormField
            label={texts.FIELD_PAST_CLUBS}
            error={errors.pastClubsText?.message}
          >
            <Input
              {...register('pastClubsText')}
              placeholder={texts.FIELD_PAST_CLUBS_PLACEHOLDER}
            />
          </FormField>
        )}

        <FormField label={texts.FIELD_INSTAGRAM} error={errors.instagram?.message}>
          <Input
            {...register('instagram')}
            placeholder={texts.FIELD_INSTAGRAM_PLACEHOLDER}
          />
        </FormField>

        <FormField label={texts.FIELD_BIOGRAPHY} error={errors.biography?.message}>
          <Textarea
            {...register('biography')}
            rows={4}
            placeholder={texts.FIELD_BIOGRAPHY_PLACEHOLDER}
          />
        </FormField>

        {!isStaff && (
          <LayoutContainer className="flex items-center justify-between p-4 rounded-2xl bg-surface-secondary border border-border">
            <LayoutContainer className="flex flex-col gap-0.5">
              <Text as="span" className="text-sm font-bold text-text-primary">
                {texts.FIELD_IS_RETIRED}
              </Text>
              <Text as="p" className="text-xs text-text-secondary">
                {texts.FIELD_IS_RETIRED_DESC}
              </Text>
            </LayoutContainer>
            <Controller
              control={control}
              name="isRetired"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  aria-label={texts.FIELD_IS_RETIRED}
                />
              )}
            />
          </LayoutContainer>
        )}

        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            {texts.BTN_CANCEL}
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            isLoading={isSaving}
            className="font-bold shadow-md shadow-primary/20"
          >
            {isSaving ? savingLabel || texts.BTN_SAVING : texts.BTN_SAVE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Drawer>
  );
};
