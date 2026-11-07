'use client';

import React, { useState, useRef } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  FormField,
  Input,
  SafeImage,
} from '@/shared/ui/components';
import { StadiumGalleryImage } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { Plus, Trash2, Camera, Upload, Loader2 } from 'lucide-react';

interface StadiumGalleryManagerProps {
  gallery: StadiumGalleryImage[];
  onAddImage: (file: File, caption: string) => Promise<void>;
  onRemoveImage: (index: number) => void;
}

export const StadiumGalleryManager: React.FC<StadiumGalleryManagerProps> = ({
  gallery,
  onAddImage,
  onRemoveImage,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      await onAddImage(selectedFile, caption);
      setSelectedFile(null);
      setFilePreview('');
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.GALLERY.TITLE}
          </Title>
          <Text className="text-xs text-text-secondary">
            {ADMIN_STADIUM_TEXTS.GALLERY.SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Box de Adicionar Nova Foto */}
      <LayoutContainer className="p-5 rounded-2xl bg-background border border-border flex flex-col gap-4">
        <Title level="h4" className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          {ADMIN_STADIUM_TEXTS.GALLERY.UPLOAD_MODAL_TITLE}
        </Title>

        <LayoutContainer className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Seletor de Arquivo */}
          <LayoutContainer className="md:col-span-5 flex flex-col gap-1.5">
            <LayoutContainer
              onClick={() => fileInputRef.current?.click()}
              className="h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-surface flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-colors"
            >
              {filePreview ? (
                <SafeImage
                  src={filePreview}
                  alt="Preview"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : (
                <LayoutContainer className="flex flex-col items-center gap-1 text-center p-2">
                  <Upload className="w-5 h-5 text-primary" />
                  <Text className="text-xs font-bold text-text-primary">
                    {ADMIN_STADIUM_TEXTS.GALLERY.SELECT_IMAGE}
                  </Text>
                  <Text className="text-[10px] text-text-secondary">
                    PNG, JPG ou WEBP até 10MB
                  </Text>
                </LayoutContainer>
              )}
            </LayoutContainer>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </LayoutContainer>

          {/* Campo de Legenda */}
          <LayoutContainer className="md:col-span-5">
            <FormField label={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_LABEL}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.GALLERY.CAPTION_PLACEHOLDER}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          {/* Botão de Enviar */}
          <LayoutContainer className="md:col-span-2">
            <Button
              type="button"
              variant="primary"
              disabled={!selectedFile || isUploading}
              onClick={handleAddPhoto}
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer h-10"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <Text as="span">Adicionar</Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Grid de Fotos Existentes */}
      {gallery.length === 0 ? (
        <LayoutContainer className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
          <Camera className="w-8 h-8 text-text-secondary mb-2" />
          <Text className="text-sm text-text-secondary">
            {ADMIN_STADIUM_TEXTS.GALLERY.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gallery.map((photo, index) => (
            <LayoutContainer
              key={index}
              className="group relative h-48 rounded-xl overflow-hidden border border-border bg-background flex flex-col justify-end p-2.5 shadow-sm"
            >
              <SafeImage
                src={photo.url}
                alt={photo.caption || 'Foto da Galeria'}
                fill
                sizes="250px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Botão de Excluir */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 w-7 h-7 p-0 rounded-full bg-black/70 hover:bg-[#ea580c] hover:text-white text-white flex items-center justify-center transition-colors cursor-pointer"
                title={ADMIN_STADIUM_TEXTS.GALLERY.DELETE_PHOTO_TOOLTIP}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>

              {/* Legenda */}
              <Text as="p" className="relative z-10 text-[11px] text-white font-medium line-clamp-2">
                {photo.caption || 'Sem legenda'}
              </Text>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
