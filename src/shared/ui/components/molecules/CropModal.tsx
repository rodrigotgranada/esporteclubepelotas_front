"use client";
import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Wand2, Circle, Crop, Image as ImageIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Modal } from '../atoms/Modal';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Slider } from '../atoms/Slider';
import { Text } from '../atoms/Text';
import { Title } from '../atoms/Title';
import toast from 'react-hot-toast';
import { CROP_MODAL_TEXTS } from './CropModal.constants';

const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number, y: number, width: number, height: number }): Promise<Blob> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
};

export interface CropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropSave: (croppedBlob: Blob) => void;
  onUseOriginal?: () => void;
  isLoading?: boolean;
  texts?: {
    title?: string;
    zoom?: string;
    modeCircular?: string;
    modeFree?: string;
    useOriginal?: string;
    removeBg?: string;
    cancel?: string;
    save?: string;
  };
}

export const CropModal = ({ 
  isOpen, 
  imageSrc, 
  onClose, 
  onCropSave, 
  onUseOriginal, 
  isLoading = false,
  texts = {}
}: CropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropMode, setCropMode] = useState<'round' | 'rect'>('round');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  useEffect(() => {
    setCurrentImageSrc(imageSrc);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, [imageSrc]);

  const onCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { x: number, y: number, width: number, height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRemoveBg = async () => {
    try {
      setIsRemovingBg(true);
      const loadingToast = toast.loading(CROP_MODAL_TEXTS.TOAST_BG_LOADING, { duration: 15000 });
      
      const { removeBackground } = await import('@imgly/background-removal');
      const imageBlob = await removeBackground(currentImageSrc);
      const url = URL.createObjectURL(imageBlob);
      setCurrentImageSrc(url);
      
      toast.dismiss(loadingToast);
      toast.success(CROP_MODAL_TEXTS.TOAST_BG_SUCCESS);
    } catch (err) {
      console.error('Failed to remove bg', err);
      toast.error(CROP_MODAL_TEXTS.TOAST_BG_ERROR);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleUseOriginal = async () => {
    if (!currentImageSrc) return;
    try {
      if (onUseOriginal) {
        onUseOriginal();
        return;
      }
      const response = await fetch(currentImageSrc);
      const blob = await response.blob();
      onCropSave(blob);
    } catch (err) {
      console.error('Failed to use original image', err);
      toast.error(CROP_MODAL_TEXTS.TOAST_ERROR_ORIGINAL);
    }
  };

  const handleSave = async () => {
    if (!currentImageSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(currentImageSrc, croppedAreaPixels);
      onCropSave(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={false}
      className="!p-0 overflow-hidden bg-drawer border border-border max-w-lg w-full"
    >
      {/* Header */}
      <LayoutContainer className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface">
        <Title level="h3" className="text-base font-bold text-text-primary">
          {texts.title || CROP_MODAL_TEXTS.TITLE}
        </Title>

        {/* Mode Toggle: Circular vs Livre */}
        <LayoutContainer className="flex items-center gap-2">
          <LayoutContainer className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setCropMode('round')}
              className={`text-xs px-2.5 py-1 flex items-center gap-1.5 rounded-lg transition-colors ${
                cropMode === 'round' 
                  ? 'bg-primary text-button-primary-text font-bold shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Circle size={13} />
              {texts.modeCircular || CROP_MODAL_TEXTS.MODE_CIRCULAR}
            </button>
            <button
              type="button"
              onClick={() => setCropMode('rect')}
              className={`text-xs px-2.5 py-1 flex items-center gap-1.5 rounded-lg transition-colors ${
                cropMode === 'rect' 
                  ? 'bg-primary text-button-primary-text font-bold shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Crop size={13} />
              {texts.modeFree || CROP_MODAL_TEXTS.MODE_FREE}
            </button>
          </LayoutContainer>

          <button 
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-background"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </LayoutContainer>
      </LayoutContainer>
        
      {/* Cropper Viewport */}
      <LayoutContainer className="relative w-full h-80 bg-black/90">
        <Cropper
          image={currentImageSrc}
          crop={crop}
          zoom={zoom}
          aspect={cropMode === 'round' ? 1 : undefined}
          cropShape={cropMode}
          showGrid={cropMode === 'rect'}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </LayoutContainer>
      
      {/* Controls & Footer */}
      <LayoutContainer className="p-5 flex flex-col space-y-4 bg-drawer border-t border-border">
        {/* Zoom Slider */}
        <LayoutContainer className="flex items-center gap-4">
          <Text as="span" className="text-xs font-medium text-text-secondary w-12">
            {texts.zoom || CROP_MODAL_TEXTS.ZOOM}
          </Text>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </LayoutContainer>

        {/* Buttons Bar */}
        <LayoutContainer className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          <LayoutContainer className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseOriginal}
              disabled={isLoading || isRemovingBg}
              className="border-border text-text-secondary hover:text-text-primary flex items-center gap-1.5 text-xs h-9"
            >
              <ImageIcon size={14} />
              {texts.useOriginal || CROP_MODAL_TEXTS.USE_ORIGINAL}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemoveBg}
              isLoading={isRemovingBg}
              leftIcon={<Wand2 className="w-4 h-4 text-white/90" />}
              className="text-xs h-9 font-medium shadow-sm"
              title={CROP_MODAL_TEXTS.REMOVE_BACKGROUND}
            >
              {texts.removeBg || CROP_MODAL_TEXTS.REMOVE_BACKGROUND}
            </Button>
          </LayoutContainer>

          <LayoutContainer className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading || isRemovingBg}
              className="text-xs h-9"
            >
              {texts.cancel || CROP_MODAL_TEXTS.CANCEL}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={isLoading || isRemovingBg}
              leftIcon={<Check className="w-4 h-4" />}
              className="text-xs h-9 font-bold"
            >
              {texts.save || CROP_MODAL_TEXTS.SAVE}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
