'use client';

import React, { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  LayoutContainer,
  Title,
  Text,
  FormField,
  Input,
  Button,
  SafeImage,
} from '@/shared/ui/components';
import { UpdateStadiumFormData } from '@/features/stadium/schemas/stadium.schema';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface StadiumGeneralFormProps {
  form: UseFormReturn<UpdateStadiumFormData>;
  coverPreviewUrl: string;
  onSelectCoverFile: (file: File) => void;
}

export const StadiumGeneralForm: React.FC<StadiumGeneralFormProps> = ({
  form,
  coverPreviewUrl,
  onSelectCoverFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, formState: { errors }, watch, setValue } = form;
  const isActive = watch('isActive');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectCoverFile(e.target.files[0]);
    }
  };

  return (
    <LayoutContainer className="flex flex-col gap-8">
      {/* 1. Capa Principal */}
      <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-4">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ADMIN_STADIUM_TEXTS.FORM.SECTION_BASIC}
        </Title>

        <LayoutContainer className="flex flex-col gap-2">
          <Text className="text-xs font-bold text-text-secondary uppercase tracking-wider">
            {ADMIN_STADIUM_TEXTS.FORM.COVER_LABEL}
          </Text>

          <LayoutContainer className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-background border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center">
            {coverPreviewUrl ? (
              <>
                <SafeImage
                  src={coverPreviewUrl}
                  alt="Capa do Estádio"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <LayoutContainer className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 cursor-pointer font-bold shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <Text as="span">{ADMIN_STADIUM_TEXTS.FORM.CHANGE_COVER}</Text>
                  </Button>
                </LayoutContainer>
              </>
            ) : (
              <LayoutContainer
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 cursor-pointer p-6 text-center"
              >
                <LayoutContainer className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </LayoutContainer>
                <Text className="text-sm font-bold text-text-primary">
                  {ADMIN_STADIUM_TEXTS.FORM.UPLOAD_COVER}
                </Text>
                <Text className="text-xs text-text-secondary">
                  {ADMIN_STADIUM_TEXTS.FORM.COVER_HINT}
                </Text>
              </LayoutContainer>
            )}

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </LayoutContainer>
        </LayoutContainer>

        {/* Título e Subtítulo */}
        <LayoutContainer className="grid grid-cols-1 gap-4 pt-2">
          <FormField label={ADMIN_STADIUM_TEXTS.FORM.TITLE_LABEL} error={errors.title?.message}>
            <Input
              placeholder={ADMIN_STADIUM_TEXTS.FORM.TITLE_PLACEHOLDER}
              {...register('title')}
            />
          </FormField>

          <FormField label={ADMIN_STADIUM_TEXTS.FORM.SUBTITLE_LABEL} error={errors.subtitle?.message}>
            <Input
              placeholder={ADMIN_STADIUM_TEXTS.FORM.SUBTITLE_PLACEHOLDER}
              {...register('subtitle')}
            />
          </FormField>
        </LayoutContainer>
      </LayoutContainer>

      {/* 2. Ficha Técnica do Estádio */}
      <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-5">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ADMIN_STADIUM_TEXTS.FORM.SECTION_FACTS}
        </Title>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField label={ADMIN_STADIUM_TEXTS.FORM.INAUGURATION_LABEL} error={errors.inaugurationDate?.message}>
            <Input
              placeholder={ADMIN_STADIUM_TEXTS.FORM.INAUGURATION_PLACEHOLDER}
              {...register('inaugurationDate')}
            />
          </FormField>

          <FormField label={ADMIN_STADIUM_TEXTS.FORM.CAPACITY_LABEL} error={errors.capacity?.message}>
            <Input
              placeholder={ADMIN_STADIUM_TEXTS.FORM.CAPACITY_PLACEHOLDER}
              {...register('capacity')}
            />
          </FormField>

          <FormField label={ADMIN_STADIUM_TEXTS.FORM.PITCH_LABEL} error={errors.pitchDimensions?.message}>
            <Input
              placeholder={ADMIN_STADIUM_TEXTS.FORM.PITCH_PLACEHOLDER}
              {...register('pitchDimensions')}
            />
          </FormField>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LayoutContainer className="sm:col-span-3">
            <FormField label={ADMIN_STADIUM_TEXTS.FORM.ADDRESS_LABEL} error={errors.address?.message}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.FORM.ADDRESS_PLACEHOLDER}
                {...register('address')}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-1">
            <FormField label={ADMIN_STADIUM_TEXTS.FORM.MAPS_DIRECT_LABEL} error={errors.mapsDirectUrl?.message}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.FORM.MAPS_DIRECT_PLACEHOLDER}
                {...register('mapsDirectUrl')}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-2">
            <FormField label={ADMIN_STADIUM_TEXTS.FORM.MAPS_EMBED_LABEL} error={errors.mapsEmbedUrl?.message}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.FORM.MAPS_EMBED_PLACEHOLDER}
                {...register('mapsEmbedUrl')}
              />
            </FormField>
          </LayoutContainer>
        </LayoutContainer>

        {/* Toggle Ativo */}
        <LayoutContainer className="pt-3 border-t border-border flex items-center justify-between">
          <LayoutContainer className="flex flex-col">
            <Text className="text-sm font-bold text-text-primary">
              {ADMIN_STADIUM_TEXTS.FORM.STATUS_ACTIVE_LABEL}
            </Text>
            <Text className="text-xs text-text-secondary">
              {ADMIN_STADIUM_TEXTS.FORM.STATUS_ACTIVE_HINT}
            </Text>
          </LayoutContainer>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setValue('isActive', !isActive, { shouldDirty: true })}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isActive ? 'bg-primary' : 'bg-surface border border-border'
            }`}
          >
            <LayoutContainer
              className={`bg-white dark:bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
