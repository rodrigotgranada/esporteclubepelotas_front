'use client';

import React, { useRef } from 'react';
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
} from '@/shared/ui/components';
import { Upload, X } from 'lucide-react';
import { TimelineCategory } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '@/features/admin/constants/admin-timeline.constants';

interface TimelineDrawerProps {
  isOpen: boolean;
  isSaving: boolean;
  isEditing: boolean;
  year: number;
  setYear: (val: number) => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  category: TimelineCategory;
  setCategory: (val: TimelineCategory) => void;
  dateFormatted: string;
  setDateFormatted: (val: string) => void;
  displayOrder: number;
  setDisplayOrder: (val: number) => void;
  isHighlighted: boolean;
  setIsHighlighted: (val: boolean) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  photoUrl: string | null;
  setPhotoUrl: (val: string | null) => void;
  pendingPhotoFile: File | null;
  setPendingPhotoFile: (val: File | null) => void;
  onClose: () => void;
  onSave: () => void;
}

export const TimelineDrawer: React.FC<TimelineDrawerProps> = ({
  isOpen,
  isSaving,
  isEditing,
  year,
  setYear,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  dateFormatted,
  setDateFormatted,
  displayOrder,
  setDisplayOrder,
  isHighlighted,
  setIsHighlighted,
  isActive,
  setIsActive,
  photoUrl,
  setPhotoUrl,
  pendingPhotoFile,
  setPendingPhotoFile,
  onClose,
  onSave,
}) => {
  const texts = ADMIN_TIMELINE_CONSTANTS.DRAWER;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPendingPhotoFile(null);
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="xl"
    >
      <LayoutContainer className="flex flex-col gap-6 py-2">
        <Text className="text-xs text-text-secondary -mt-2">
          {texts.SUBTITLE}
        </Text>

        {/* Row 1: Year and Category */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={texts.FIELD_YEAR}
            type="number"
            value={year || ''}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder={texts.FIELD_YEAR_PLACEHOLDER}
          />

          <LayoutContainer className="flex flex-col">
            <Select
              label={texts.FIELD_CATEGORY}
              value={category}
              onChange={(e) => setCategory(e.target.value as TimelineCategory)}
            >
              <Option value="FOUNDATION">{ADMIN_TIMELINE_CONSTANTS.CATEGORIES.FOUNDATION}</Option>
              <Option value="TITLE">{ADMIN_TIMELINE_CONSTANTS.CATEGORIES.TITLE}</Option>
              <Option value="STADIUM">{ADMIN_TIMELINE_CONSTANTS.CATEGORIES.STADIUM}</Option>
              <Option value="MILESTONE">{ADMIN_TIMELINE_CONSTANTS.CATEGORIES.MILESTONE}</Option>
              <Option value="GLORY">{ADMIN_TIMELINE_CONSTANTS.CATEGORIES.GLORY}</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        {/* Row 2: Title */}
        <Input
          label={texts.FIELD_TITLE}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={texts.FIELD_TITLE_PLACEHOLDER}
        />

        {/* Row 3: Date Formatted and Display Order */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={texts.FIELD_DATE_FORMATTED}
            value={dateFormatted}
            onChange={(e) => setDateFormatted(e.target.value)}
            placeholder={texts.FIELD_DATE_PLACEHOLDER}
          />

          <Input
            label={texts.FIELD_ORDER}
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </LayoutContainer>

        {/* Row 4: Description */}
        <Textarea
          label={texts.FIELD_DESCRIPTION}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={texts.FIELD_DESCRIPTION_PLACEHOLDER}
          rows={5}
        />

        {/* Row 5: Photo Upload */}
        <LayoutContainer className="flex flex-col gap-2">
          <Text className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            {texts.PHOTO_LABEL}
          </Text>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {photoUrl ? (
            <LayoutContainer className="relative w-full h-44 rounded-xl overflow-hidden border border-border bg-background group">
              <SafeImage
                src={photoUrl}
                alt="Preview marco histórico"
                fill
                sizes="(max-width: 600px) 100vw, 400px"
                className="object-cover"
                fallbackSrc={DEFAULT_NEWS_COVER}
                unoptimized={Boolean(photoUrl && photoUrl.startsWith('http'))}
              />
              <LayoutContainer className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold"
                >
                  {texts.BTN_CHANGE_PHOTO}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-xs font-bold border-error/50 text-error hover:bg-error/10"
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
              onClick={() => fileInputRef.current?.click()}
              className="h-28 border-dashed border-2 border-border/80 hover:border-primary/60 flex flex-col items-center justify-center gap-2 rounded-xl text-text-secondary hover:text-primary transition-all"
            >
              <Upload className="w-6 h-6 text-primary" />
              <Text className="text-xs font-semibold">Clique para selecionar foto ou documento histórico</Text>
            </Button>
          )}
        </LayoutContainer>

        {/* Row 6: Toggles */}
        <LayoutContainer className="flex flex-col gap-4 p-4 rounded-xl bg-surface border border-border">
          <LayoutContainer className="flex items-center justify-between">
            <LayoutContainer className="flex flex-col pr-4">
              <Text className="text-sm font-bold text-text-primary">
                {texts.FIELD_IS_HIGHLIGHTED}
              </Text>
              <Text className="text-xs text-text-secondary">
                {texts.FIELD_IS_HIGHLIGHTED_DESC}
              </Text>
            </LayoutContainer>
            <Switch
              checked={isHighlighted}
              onChange={setIsHighlighted}
            />
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-between border-t border-border/60 pt-3">
            <LayoutContainer className="flex flex-col pr-4">
              <Text className="text-sm font-bold text-text-primary">
                {texts.FIELD_IS_ACTIVE}
              </Text>
            </LayoutContainer>
            <Switch
              checked={isActive}
              onChange={setIsActive}
            />
          </LayoutContainer>
        </LayoutContainer>

        {/* Footer Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            {texts.BTN_CANCEL}
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} className="font-bold">
            {isSaving ? texts.BTN_SAVING : texts.BTN_SAVE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Drawer>
  );
};
