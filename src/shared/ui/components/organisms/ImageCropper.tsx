'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2, Edit2 } from 'lucide-react';
import { CropModal } from '../molecules/CropModal';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { IMAGE_CROPPER_TEXTS } from './ImageCropper.constants';

interface ImageCropperProps {
  onCropSave: (croppedImageBlob: Blob) => void;
  onImageRemove: () => void;
  initialImage?: string | null;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  onCropSave,
  onImageRemove,
  initialImage,
  className = '',
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(initialImage || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCroppedImagePreview(initialImage || null);
  }, [initialImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setCroppedImagePreview(croppedUrl);
    setIsModalOpen(false);
    setImageSrc(null);
    onCropSave(croppedBlob);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCroppedImagePreview(null);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
  };

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <LayoutContainer className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <LayoutContainer
        onClick={handleOpenPicker}
        className="relative group w-32 h-32 rounded-full overflow-hidden bg-surface border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-all hover:border-primary shadow-sm"
      >
        {croppedImagePreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={croppedImagePreview}
              alt={IMAGE_CROPPER_TEXTS.ALT_AVATAR}
              className="w-full h-full object-cover"
            />
            <LayoutContainer className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
              <LayoutContainer
                role="button"
                className="cursor-pointer text-white hover:text-primary transition-colors p-2 rounded-full hover:bg-white/10"
                title={IMAGE_CROPPER_TEXTS.CHANGE_PHOTO}
              >
                <Edit2 className="w-5 h-5" />
              </LayoutContainer>
              <LayoutContainer
                role="button"
                onClick={handleRemove}
                className="cursor-pointer text-white hover:text-error transition-colors p-2 rounded-full hover:bg-white/10"
                title={IMAGE_CROPPER_TEXTS.REMOVE_PHOTO}
              >
                <Trash2 className="w-5 h-5" />
              </LayoutContainer>
            </LayoutContainer>
          </>
        ) : (
          <LayoutContainer className="flex flex-col items-center justify-center w-full h-full text-text-secondary group-hover:text-primary transition-colors">
            <Camera className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium uppercase tracking-wider">{IMAGE_CROPPER_TEXTS.ADD_PHOTO}</span>
          </LayoutContainer>
        )}
      </LayoutContainer>

      <CropModal
        isOpen={isModalOpen}
        imageSrc={imageSrc || ''}
        onClose={() => {
          setIsModalOpen(false);
          setImageSrc(null);
        }}
        onCropSave={handleCropSave}
      />
    </LayoutContainer>
  );
};
