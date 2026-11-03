'use client';

import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import { LayoutContainer, Text, Button, Input } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (source: string) => void;
}

export const NewsImageInsertModal: React.FC<NewsImageInsertModalProps> = ({
  isOpen,
  onClose,
  onImageSelected,
}) => {
  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  if (!isOpen) return null;

  const handleSelectLocalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleConfirmUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    onImageSelected(trimmed);
    setImageUrlInput('');
  };

  return (
    <LayoutContainer className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <LayoutContainer className="w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <LayoutContainer className="flex items-center justify-between pb-2 border-b border-border">
          <Text className="text-sm font-bold text-text-primary flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            {texts.IMAGE_MODAL_TITLE}
          </Text>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-drawer flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </LayoutContainer>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleSelectLocalImage}
          className="hidden"
        />

        {/* Option A: Upload from computer */}
        <LayoutContainer className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center text-xs font-bold py-3"
            leftIcon={<Upload className="w-4 h-4 text-primary" />}
            onClick={() => fileInputRef.current?.click()}
          >
            {texts.IMAGE_MODAL_UPLOAD_BTN}
          </Button>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="flex-1 h-px bg-border" />
          <Text className="text-[11px] text-text-secondary uppercase">OU</Text>
          <LayoutContainer className="flex-1 h-px bg-border" />
        </LayoutContainer>

        {/* Option B: Insert via URL */}
        <LayoutContainer className="flex flex-col gap-2">
          <Text className="text-xs font-semibold text-text-primary">
            {texts.IMAGE_MODAL_URL_LABEL}
          </Text>
          <Input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder={texts.IMAGE_MODAL_URL_PLACEHOLDER}
            className="text-xs"
          />
        </LayoutContainer>

        {/* Footer */}
        <LayoutContainer className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            {texts.IMAGE_MODAL_CANCEL_BTN}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleConfirmUrl}
            disabled={!imageUrlInput.trim()}
            leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
          >
            {texts.IMAGE_MODAL_INSERT_BTN}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

