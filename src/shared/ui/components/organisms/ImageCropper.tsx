'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, Trash2, Edit2, X, Check } from 'lucide-react';

interface ImageCropperProps {
  onCropSave: (croppedImageBlob: Blob) => void;
  onImageRemove: () => void;
  initialImage?: string | null;
}

import { CropModal } from '../molecules/CropModal';

export const ImageCropper: React.FC<ImageCropperProps> = ({ onCropSave, onImageRemove, initialImage }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(initialImage || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setCroppedImagePreview(croppedUrl);
    setIsModalOpen(false);
    onCropSave(croppedBlob);
  };

  const handleRemove = () => {
    setCroppedImagePreview(null);
    setImageSrc(null);
    onImageRemove();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer transition-all hover:border-yellow-500">
        {croppedImagePreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={croppedImagePreview} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
              <label className="cursor-pointer text-white hover:text-yellow-500 transition-colors">
                <Edit2 className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button type="button" onClick={handleRemove} className="text-white hover:text-yellow-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500 transition-colors">
            <Camera className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium uppercase tracking-wider">Adicionar</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      <CropModal
        isOpen={isModalOpen}
        imageSrc={imageSrc || ''}
        onClose={() => setIsModalOpen(false)}
        onCropSave={handleCropSave}
      />
    </div>
  );
};
