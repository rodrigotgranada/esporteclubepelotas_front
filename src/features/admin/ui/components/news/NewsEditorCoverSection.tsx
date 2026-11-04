'use client';

import React from 'react';
import { LayoutContainer, Text, Input, ImageCropper } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsEditorCoverSectionProps {
  coverImage: string | null;
  coverCaption: string;
  setCoverCaption: (caption: string) => void;
  onCropSave: (croppedImageBlob: Blob) => void;
  onImageRemove: () => void;
}

export const NewsEditorCoverSection: React.FC<NewsEditorCoverSectionProps> = ({
  coverImage,
  coverCaption,
  setCoverCaption,
  onCropSave,
  onImageRemove,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-xs">
      <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
        {texts.LABEL_COVER_IMAGE}
      </Text>

      <ImageCropper
        shape="rect"
        aspect={16 / 9}
        initialImage={coverImage}
        onCropSave={onCropSave}
        onImageRemove={onImageRemove}
        placeholderLabel="Clique para carregar e recortar capa em 16:9"
        className="w-full"
      />

      <LayoutContainer className="flex flex-col gap-1.5 mt-2">
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LABEL_COVER_CAPTION}
        </Text>
        <Input
          value={coverCaption}
          onChange={(e) => setCoverCaption(e.target.value)}
          placeholder={texts.PLACEHOLDER_COVER_CAPTION}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
