'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import {
  Drawer,
  LayoutContainer,
  Text,
  Input,
  Textarea,
  Select,
  Option,
  Switch,
  Button,
  SafeImage,
  DEFAULT_NEWS_COVER,
  FormField,
  CropModal,
} from '@/shared/ui/components';
import { Upload, X, Plus, Camera, Loader2, Trash2 } from 'lucide-react';
import { TimelineCategoryData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '@/features/admin/constants/admin-timeline.constants';
import { adminTimelineService } from '../../../services/admin-timeline.service';
import { isBlobUrl } from '@/shared/hooks/useTransactionalSave';
import { TimelineEventFormData } from '@/features/admin/schemas/timeline/timeline.schema';
import { toast } from 'react-hot-toast';

export interface TimelineDrawerProps {
  isOpen: boolean;
  isSaving: boolean;
  savingLabel?: string;
  isEditing: boolean;
  form: UseFormReturn<TimelineEventFormData, any, any>;
  categories: TimelineCategoryData[];
  onOpenNewCategory?: () => void;
  pendingPhotoFile: File | null;
  setPendingPhotoFile: (val: File | null) => void;
  handleEventDateChange: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const TimelineDrawer: React.FC<TimelineDrawerProps> = ({
  isOpen,
  isSaving,
  savingLabel,
  isEditing,
  form,
  categories,
  onOpenNewCategory,
  pendingPhotoFile,
  setPendingPhotoFile,
  handleEventDateChange,
  onClose,
  onSave,
}) => {
  const texts = ADMIN_TIMELINE_CONSTANTS.DRAWER;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const photoUrl = watch('imageUrl');

  useEffect(() => {
    return () => {
      if (photoUrl && isBlobUrl(photoUrl)) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoUrl && isBlobUrl(photoUrl)) {
        URL.revokeObjectURL(photoUrl);
      }
      setPendingPhotoFile(file);
      setValue('imageUrl', URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    if (photoUrl && isBlobUrl(photoUrl)) {
      URL.revokeObjectURL(photoUrl);
    }
    setPendingPhotoFile(null);
    setValue('imageUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Mini-Galeria: estados e manipuladores
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [selectedGalleryFile, setSelectedGalleryFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const galleryUrls = watch('galleryUrls') || [];

  const handleSelectGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedGalleryFile(file);
      setCropSourceImage(URL.createObjectURL(file));
      setIsCropModalOpen(true);
      e.target.value = '';
    }
  };

  const handleGalleryCropSave = async (blob: Blob) => {
    try {
      setIsUploadingGallery(true);
      const fileToUpload = new File([blob], `timeline-gallery-${Date.now()}.png`, { type: 'image/png' });
      const uploadedUrl = await adminTimelineService.uploadPhotoMedia(fileToUpload);
      setValue('galleryUrls', [...galleryUrls, uploadedUrl]);
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setSelectedGalleryFile(null);
      toast.success('Foto complementar adicionada!');
    } catch (err) {
      console.error('Erro ao enviar foto complementar:', err);
      toast.error('Erro ao enviar foto para galeria.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleGalleryUseOriginal = async () => {
    if (!selectedGalleryFile) return;
    try {
      setIsUploadingGallery(true);
      const uploadedUrl = await adminTimelineService.uploadPhotoMedia(selectedGalleryFile);
      setValue('galleryUrls', [...galleryUrls, uploadedUrl]);
      setIsCropModalOpen(false);
      setCropSourceImage('');
      setSelectedGalleryFile(null);
      toast.success('Foto complementar adicionada!');
    } catch (err) {
      console.error('Erro ao enviar foto original:', err);
      toast.error('Erro ao enviar foto para galeria.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setValue(
      'galleryUrls',
      galleryUrls.filter((_, idx) => idx !== index)
    );
  };

  const handleCategorySelect = (selectedSlugOrId: string) => {
    setValue('category', selectedSlugOrId);
    const found = categories.find(
      (c) => c.slug === selectedSlugOrId || c.id === selectedSlugOrId || c._id === selectedSlugOrId,
    );
    if (found) {
      setValue('categoryId', found.id || found._id || '');
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="xl"
    >
      <LayoutContainer className="flex flex-col gap-6 py-2">
        <Text as="p" className="text-xs text-text-secondary -mt-2">
          {texts.SUBTITLE}
        </Text>

        {/* Row 1: DatePicker & Category */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={texts.FIELD_DATE}
            description={texts.FIELD_DATE_HELP}
            error={errors.eventDate?.message}
          >
            <Input
              type="date"
              value={watch('eventDate') || ''}
              onChange={(e) => handleEventDateChange(e.target.value)}
            />
          </FormField>

          <LayoutContainer className="flex flex-col">
            <LayoutContainer className="flex items-center justify-between mb-1">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.FIELD_CATEGORY}
              </Text>
              {onOpenNewCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onOpenNewCategory}
                  className="h-auto px-1 py-0 text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {texts.BTN_QUICK_CATEGORY}
                </Button>
              )}
            </LayoutContainer>
            <FormField error={errors.category?.message}>
              <Select
                value={watch('category')}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full"
              >
                {categories.map((cat) => (
                  <Option key={cat.id || cat._id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </FormField>
          </LayoutContainer>
        </LayoutContainer>

        {/* Row 2: Year and Formatted Date Preview */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={`${texts.FIELD_YEAR} *`}
            error={errors.year?.message}
          >
            <Input
              type="number"
              {...register('year')}
              placeholder={texts.FIELD_YEAR_PLACEHOLDER}
            />
          </FormField>

          <FormField
            label={texts.FIELD_DATE_FORMATTED}
            error={errors.dateFormatted?.message}
          >
            <Input
              {...register('dateFormatted')}
              placeholder={texts.FIELD_DATE_PLACEHOLDER}
            />
          </FormField>
        </LayoutContainer>

        {/* Row 3: Title & Display Order */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LayoutContainer className="sm:col-span-2">
            <FormField
              label={`${texts.FIELD_TITLE} *`}
              error={errors.title?.message}
            >
              <Input
                {...register('title')}
                placeholder={texts.FIELD_TITLE_PLACEHOLDER}
              />
            </FormField>
          </LayoutContainer>

          <FormField
            label={texts.FIELD_ORDER}
            error={errors.displayOrder?.message}
          >
            <Input
              type="number"
              {...register('displayOrder')}
            />
          </FormField>
        </LayoutContainer>

        {/* Row 4: Description */}
        <FormField
          label={`${texts.FIELD_DESCRIPTION} *`}
          error={errors.description?.message}
        >
          <Textarea
            {...register('description')}
            placeholder={texts.FIELD_DESCRIPTION_PLACEHOLDER}
            rows={5}
          />
        </FormField>

        {/* Row 5: Photo Upload */}
        <LayoutContainer className="flex flex-col gap-2">
          <Text as="span" className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            {texts.PHOTO_LABEL}
          </Text>

          <LayoutContainer className="hidden">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </LayoutContainer>

          {photoUrl ? (
            <LayoutContainer className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-background group">
              <SafeImage
                src={photoUrl}
                alt={texts.PHOTO_PREVIEW_ALT}
                fill
                sizes="(max-width: 600px) 100vw, 400px"
                className="object-cover"
                fallbackSrc={DEFAULT_NEWS_COVER}
                unoptimized={Boolean(photoUrl && (photoUrl.startsWith('http') || photoUrl.startsWith('blob:')))}
              />
              <LayoutContainer className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold"
                >
                  {texts.BTN_CHANGE_PHOTO}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={handleRemovePhoto}
                  className="text-xs font-bold border-[#ea580c]/50 text-[#ea580c] hover:bg-[#ea580c]/10"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  {texts.BTN_REMOVE_PHOTO}
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => fileInputRef.current?.click()}
              className="h-28 border-dashed border-2 border-border/80 hover:border-primary/60 flex flex-col items-center justify-center gap-2 rounded-xl text-text-secondary hover:text-primary transition-all"
            >
              <Upload className="w-6 h-6 text-primary" />
              <Text as="span" className="text-xs font-semibold">{texts.SELECT_PHOTO_PLACEHOLDER}</Text>
            </Button>
          )}
        </LayoutContainer>

        {/* Row 5.1: Mini-Galeria de Fotos Complementares de Arquivo */}
        <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl bg-surface border border-border">
          <LayoutContainer className="flex items-center justify-between">
            <LayoutContainer className="flex flex-col">
              <Text as="span" className="text-xs font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-primary" />
                {texts.GALLERY_LABEL}
              </Text>
              <Text as="p" className="text-[11px] text-text-secondary">
                {texts.GALLERY_HELP}
              </Text>
            </LayoutContainer>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving || isUploadingGallery}
              onClick={() => galleryInputRef.current?.click()}
              className="text-xs font-bold border-primary/50 text-primary hover:bg-primary hover:text-black flex items-center gap-1.5 cursor-pointer"
            >
              {isUploadingGallery ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <Text as="span">{texts.BTN_ADD_GALLERY_PHOTO}</Text>
            </Button>
            <Input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelectGalleryFile}
            />
          </LayoutContainer>

          {/* Grid de Miniaturas da Galeria */}
          {galleryUrls.length > 0 && (
            <LayoutContainer className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
              {galleryUrls.map((url, idx) => (
                <LayoutContainer
                  key={idx}
                  className="group relative h-20 rounded-xl overflow-hidden border border-border bg-background shadow-xs"
                >
                  <SafeImage
                    src={url}
                    alt={`Foto complementar ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  <LayoutContainer className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      size="none"
                      variant="custom"
                      onClick={() => handleRemoveGalleryPhoto(idx)}
                      className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-md"
                      title={texts.TOOLTIP_REMOVE_GALLERY_PHOTO}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              ))}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Row 6: Toggles */}
        <LayoutContainer className="flex flex-col gap-4 p-4 rounded-xl bg-surface border border-border">
          <LayoutContainer className="flex items-center justify-between">
            <LayoutContainer className="flex flex-col pr-4">
              <Text as="span" className="text-sm font-bold text-text-primary">
                {texts.FIELD_IS_HIGHLIGHTED}
              </Text>
              <Text as="p" className="text-xs text-text-secondary">
                {texts.FIELD_IS_HIGHLIGHTED_DESC}
              </Text>
            </LayoutContainer>
            <Controller
              control={control}
              name="isHighlighted"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between border-t border-border/60 pt-3">
            <LayoutContainer className="flex flex-col pr-4">
              <Text as="span" className="text-sm font-bold text-text-primary">
                {texts.FIELD_IS_ACTIVE}
              </Text>
            </LayoutContainer>
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

        {/* Footer Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            {texts.BTN_CANCEL}
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} className="font-bold">
            {isSaving ? (savingLabel || texts.BTN_SAVING) : texts.BTN_SAVE}
          </Button>
        </LayoutContainer>

        {/* Modal de Recorte / Ajuste de Imagem Complementar */}
        {isCropModalOpen && cropSourceImage && (
          <CropModal
            isOpen={isCropModalOpen}
            imageSrc={cropSourceImage}
            onClose={() => {
              setIsCropModalOpen(false);
              setCropSourceImage('');
              setSelectedGalleryFile(null);
            }}
            onCropSave={handleGalleryCropSave}
            onUseOriginal={handleGalleryUseOriginal}
            isLoading={isUploadingGallery}
            aspectOptions={[
              { label: 'Livre', value: undefined },
              { label: '16:9 Panorâmico', value: 16 / 9 },
              { label: '4:3 Clássico', value: 4 / 3 },
              { label: '1:1 Quadrado', value: 1 },
            ]}
            texts={{
              title: 'Ajustar Foto do Acervo Histórico',
            }}
          />
        )}
      </LayoutContainer>
    </Drawer>
  );
};
