'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Images,
  Plus,
  X,
  Crop as CropIcon,
} from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Button,
  Badge,
  CropModal,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsEditorGallerySectionProps {
  gallery: string[];
  galleryPreviews: string[];
  galleryCropItem: {
    type: 'new' | 'existing';
    index: number;
    src: string;
  } | null;
  onSelectFiles: (files: FileList | File[]) => void;
  onOpenCrop: (type: 'new' | 'existing', index: number, src: string) => void;
  onCropSave: (croppedBlob: Blob) => void;
  onCropCancel: () => void;
  onRemoveExisting: (url: string) => void;
  onRemoveNew: (index: number) => void;
}

export const NewsEditorGallerySection: React.FC<NewsEditorGallerySectionProps> = ({
  gallery,
  galleryPreviews,
  galleryCropItem,
  onSelectFiles,
  onOpenCrop,
  onCropSave,
  onCropCancel,
  onRemoveExisting,
  onRemoveNew,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalCount = gallery.length + galleryPreviews.length;

  return (
    <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-xs">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <LayoutContainer className="flex flex-col">
          <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Images className="w-4 h-4 text-primary" />
            {texts.LABEL_GALLERY}
            {totalCount > 0 && (
              <Badge variant="default" size="sm" className="text-[10px] py-0 px-1.5 font-bold">
                {totalCount}
              </Badge>
            )}
          </Text>
          <Text as="span" className="text-[11px] text-text-secondary">
            {texts.LABEL_GALLERY_HINT}
          </Text>
        </LayoutContainer>

        <label className="cursor-pointer self-start sm:self-auto">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onSelectFiles(e.target.files);
                e.target.value = '';
              }
            }}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs pointer-events-none"
          >
            {texts.BUTTON_ADD_GALLERY_PHOTOS}
          </Button>
        </label>
      </LayoutContainer>

      {/* Gallery Photos Grid (Saved + Previews) */}
      {totalCount > 0 ? (
        <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Salvas no banco */}
          {gallery.map((url, idx) => (
            <LayoutContainer
              key={`exist-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-drawer shadow-xs"
            >
              <Image
                src={url}
                alt={`Foto galeria ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
              />

              {/* Action Buttons on Hover */}
              <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button
                  type="button"
                  onClick={() => onOpenCrop('existing', idx, url)}
                  className="w-8 h-8 rounded-full bg-surface/90 hover:bg-primary text-text-primary hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title={texts.GALLERY_CROP_TOOLTIP}
                  aria-label={texts.GALLERY_CROP_TOOLTIP}
                >
                  <CropIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="w-8 h-8 rounded-full bg-surface/90 hover:bg-error text-text-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title={texts.GALLERY_REMOVE_TOOLTIP}
                  aria-label={texts.GALLERY_REMOVE_TOOLTIP}
                >
                  <X className="w-4 h-4" />
                </button>
              </LayoutContainer>
            </LayoutContainer>
          ))}

          {/* Novas fotos na fila */}
          {galleryPreviews.map((previewUrl, idx) => (
            <LayoutContainer
              key={`preview-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/50 group bg-drawer shadow-xs"
            >
              <Image
                src={previewUrl}
                alt={`Nova foto ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Badge
                variant="primary"
                size="sm"
                className="absolute bottom-1.5 left-1.5 text-[9px] py-0 px-1 font-bold shadow-xs z-10"
              >
                {texts.GALLERY_NEW_BADGE}
              </Badge>

              {/* Action Buttons on Hover */}
              <LayoutContainer className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity z-20">
                <button
                  type="button"
                  onClick={() => onOpenCrop('new', idx, previewUrl)}
                  className="w-8 h-8 rounded-full bg-surface/90 hover:bg-primary text-text-primary hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title={texts.GALLERY_CROP_TOOLTIP}
                  aria-label={texts.GALLERY_CROP_TOOLTIP}
                >
                  <CropIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveNew(idx)}
                  className="w-8 h-8 rounded-full bg-surface/90 hover:bg-error text-text-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title={texts.GALLERY_REMOVE_TOOLTIP}
                  aria-label={texts.GALLERY_REMOVE_TOOLTIP}
                >
                  <X className="w-4 h-4" />
                </button>
              </LayoutContainer>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      ) : (
        <LayoutContainer className="p-4 border border-dashed border-border rounded-xl text-center bg-background/40 flex flex-col items-center justify-center gap-1.5">
          <Images className="w-6 h-6 text-text-secondary/40" />
          <Text className="text-xs text-text-secondary">
            {texts.GALLERY_EMPTY_TEXT}
          </Text>
        </LayoutContainer>
      )}

      {/* Crop, Resize & AI Background Removal Modal for Gallery */}
      {galleryCropItem && (
        <CropModal
          isOpen={Boolean(galleryCropItem)}
          imageSrc={galleryCropItem.src}
          onClose={onCropCancel}
          onCropSave={onCropSave}
          fixedShape="rect"
          aspectOptions={[
            { label: '16:9', value: 16 / 9 },
            { label: '4:3', value: 4 / 3 },
            { label: '1:1', value: 1 },
            { label: 'Livre', value: undefined },
          ]}
          texts={{
            title: texts.GALLERY_CROP_TITLE,
          }}
        />
      )}
    </LayoutContainer>
  );
};
