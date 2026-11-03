"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, Wand2, Circle, Crop as CropIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Modal } from '../atoms/Modal';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Slider } from '../atoms/Slider';
import { Text } from '../atoms/Text';
import { Title } from '../atoms/Title';
import toast from 'react-hot-toast';
import { CROP_MODAL_TEXTS } from './CropModal.constants';

export interface CropAspectOption {
  label: string;
  value: number | undefined;
}

export interface CropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropSave: (croppedBlob: Blob) => void;
  onUseOriginal?: () => void;
  isLoading?: boolean;
  aspect?: number;
  fixedShape?: 'round' | 'rect';
  aspectOptions?: CropAspectOption[];
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

function getInitialAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 85,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

function getInitialFreeCrop(): Crop {
  return {
    unit: '%',
    width: 85,
    height: 85,
    x: 7.5,
    y: 7.5,
  };
}

export const CropModal: React.FC<CropModalProps> = ({ 
  isOpen, 
  imageSrc, 
  onClose, 
  onCropSave, 
  onUseOriginal, 
  isLoading = false,
  aspect,
  fixedShape,
  aspectOptions,
  texts = {}
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspect);
  const [cropMode, setCropMode] = useState<'round' | 'rect'>(fixedShape || 'rect');
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setCurrentImageSrc(imageSrc);
    setCurrentAspect(aspect);
    setZoom(1);
    if (fixedShape) {
      setCropMode(fixedShape);
    }
  }, [imageSrc, fixedShape, aspect]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (cropMode === 'round') {
      setCrop(getInitialAspectCrop(width, height, 1));
    } else if (currentAspect) {
      setCrop(getInitialAspectCrop(width, height, currentAspect));
    } else {
      setCrop(getInitialFreeCrop());
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setCurrentAspect(newAspect);
    setCropMode('rect');
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (newAspect) {
        setCrop(getInitialAspectCrop(width, height, newAspect));
      } else {
        setCrop(getInitialFreeCrop());
      }
    }
  };

  const handleModeChange = (mode: 'round' | 'rect') => {
    setCropMode(mode);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      if (mode === 'round') {
        setCurrentAspect(1);
        setCrop(getInitialAspectCrop(width, height, 1));
      } else {
        setCurrentAspect(undefined);
        setCrop(getInitialFreeCrop());
      }
    }
  };

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
    const image = imgRef.current;
    if (!image) return;

    // Resolve target crop in displayed pixels
    let targetCrop: { x: number; y: number; width: number; height: number } | null = completedCrop;

    if (!targetCrop && crop && crop.width && crop.height) {
      targetCrop = {
        x: (crop.x / 100) * image.width,
        y: (crop.y / 100) * image.height,
        width: (crop.width / 100) * image.width,
        height: (crop.height / 100) * image.height,
      };
    }

    if (!targetCrop || targetCrop.width <= 0 || targetCrop.height <= 0) {
      handleUseOriginal();
      return;
    }

    try {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const canvas = document.createElement('canvas');
      const finalWidth = Math.max(1, Math.floor(targetCrop.width * scaleX));
      const finalHeight = Math.max(1, Math.floor(targetCrop.height * scaleY));

      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      ctx.imageSmoothingQuality = 'high';

      // If circular mode, clip to circle
      if (cropMode === 'round') {
        ctx.beginPath();
        ctx.arc(finalWidth / 2, finalHeight / 2, Math.min(finalWidth, finalHeight) / 2, 0, 2 * Math.PI);
        ctx.clip();
      }

      ctx.drawImage(
        image,
        targetCrop.x * scaleX,
        targetCrop.y * scaleY,
        targetCrop.width * scaleX,
        targetCrop.height * scaleY,
        0,
        0,
        finalWidth,
        finalHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error(CROP_MODAL_TEXTS.TOAST_ERROR_ORIGINAL);
          return;
        }
        onCropSave(blob);
      }, 'image/png');
    } catch (e) {
      console.error('Failed to crop canvas', e);
      toast.error('Erro ao recortar a imagem.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={false}
      className="!p-0 overflow-hidden bg-drawer border border-border max-w-xl w-full"
    >
      {/* Header */}
      <LayoutContainer className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface">
        <Title level="h3" className="text-base font-bold text-text-primary">
          {texts.title || CROP_MODAL_TEXTS.TITLE}
        </Title>

        {/* Mode / Aspect Ratio Toggle */}
        <LayoutContainer className="flex items-center gap-2">
          {aspectOptions && aspectOptions.length > 0 ? (
            <LayoutContainer className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
              {aspectOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleAspectChange(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    currentAspect === opt.value
                      ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </LayoutContainer>
          ) : (
            !fixedShape && (
              <LayoutContainer className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => handleModeChange('round')}
                  className={`text-xs px-2.5 py-1 flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer ${
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
                  onClick={() => handleModeChange('rect')}
                  className={`text-xs px-2.5 py-1 flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer ${
                    cropMode === 'rect' 
                      ? 'bg-primary text-button-primary-text font-bold shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <CropIcon size={13} />
                  {texts.modeFree || CROP_MODAL_TEXTS.MODE_FREE}
                </button>
              </LayoutContainer>
            )
          )}

          <button 
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-background cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Cropper Viewport with Draggable Handles */}
      <LayoutContainer className="relative w-full max-h-[440px] overflow-auto flex items-center justify-center bg-black/95 p-3 select-none">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={cropMode === 'round' ? 1 : currentAspect}
          circularCrop={cropMode === 'round'}
          className="max-h-[400px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={currentImageSrc}
            alt="Recorte"
            crossOrigin="anonymous"
            onLoad={onImageLoad}
            style={{
              maxHeight: '400px',
              width: 'auto',
              maxWidth: '100%',
              transform: zoom > 1 ? `scale(${zoom})` : undefined,
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease-out',
            }}
            className="object-contain block mx-auto rounded-xs"
          />
        </ReactCrop>
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
            max={2.5}
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
