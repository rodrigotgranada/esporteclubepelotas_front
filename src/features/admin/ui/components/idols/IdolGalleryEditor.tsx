'use client';

import React, { useRef } from 'react';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Input,
  Button,
  SafeImage,
  DEFAULT_NEWS_COVER,
} from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { IdolGalleryItem } from '../../../../idols/services/idols.service';

export interface IdolGalleryEditorProps {
  idolId: string | null;
  items: IdolGalleryItem[];
  onUpdateCaption: (index: number, caption: string) => void;
  onRemoveItem: (index: number) => void;
  onAddItems: (newItems: IdolGalleryItem[], newFiles?: File[]) => void;
}

export const IdolGalleryEditor: React.FC<IdolGalleryEditorProps> = ({
  items,
  onUpdateCaption,
  onRemoveItem,
  onAddItems,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const localItems: IdolGalleryItem[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      caption: '',
    }));
    onAddItems(localItems, files);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
            {texts.SECTION_GALLERY}
          </Title>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            {texts.BTN_UPLOAD_PHOTOS}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      <Text as="p" className="text-xs text-text-muted">
        {texts.GALLERY_HINT}
      </Text>

      {items.length === 0 ? (
        <LayoutContainer className="p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center gap-2 bg-background/50">
          <ImageIcon className="w-8 h-8 text-text-muted opacity-40" />
          <Text as="span" className="text-xs text-text-muted">
            {texts.GALLERY_EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <LayoutContainer
              key={`${item.url}-${idx}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border"
            >
              <LayoutContainer className="relative w-16 h-12 rounded-lg overflow-hidden bg-surface border border-border shrink-0">
                <SafeImage
                  src={item.url}
                  fallbackSrc={DEFAULT_NEWS_COVER}
                  loading="eager"
                  alt={item.caption || `${texts.LABEL_PHOTO_CAPTION} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </LayoutContainer>

              <LayoutContainer className="flex-1 min-w-0">
                <Input
                  value={item.caption || ''}
                  onChange={(e) => onUpdateCaption(idx, e.target.value)}
                  placeholder={texts.PLACEHOLDER_PHOTO_CAPTION}
                  className="text-xs"
                />
              </LayoutContainer>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(idx)}
                className="p-2 rounded-xl text-error hover:bg-error/10 shrink-0"
                title={texts.BTN_REMOVE_PHOTO}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
