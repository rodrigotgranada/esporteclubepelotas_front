'use client';

import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import toast from 'react-hot-toast';
import { CROP_MODAL_TEXTS } from '../ui/components/molecules/CropModal.constants';

export const CROP_MIN_ZOOM = 0.5;
export const CROP_MAX_ZOOM = 4;
export const CROP_ZOOM_STEP = 0.25;

export interface CropAspectOption {
  label: string;
  value: number | undefined;
}

function getInitialAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 85 },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

function getInitialFreeCrop(): Crop {
  return { unit: '%', width: 80, height: 80, x: 10, y: 10 };
}

export function clampCropZoom(value: number): number {
  return Math.min(CROP_MAX_ZOOM, Math.max(CROP_MIN_ZOOM, Number(value.toFixed(2))));
}

export function isSameCropAspect(a: number | undefined, b: number | undefined): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  return Math.abs(a - b) < 0.001;
}

export interface UseCropModalOptions {
  imageSrc: string;
  aspect?: number;
  fixedShape?: 'round' | 'rect';
  aspectOptions?: CropAspectOption[];
  allowFreeCrop?: boolean;
  onCropSave: (croppedBlob: Blob) => void;
  onUseOriginal?: () => void;
}

export const useCropModal = ({
  imageSrc,
  aspect,
  fixedShape,
  aspectOptions,
  allowFreeCrop = true,
  onCropSave,
  onUseOriginal,
}: UseCropModalOptions) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspect);
  const [cropMode, setCropMode] = useState<'round' | 'rect'>(fixedShape || 'rect');
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [baseSize, setBaseSize] = useState<{ width: number; height: number } | null>(null);
  const [corsFailed, setCorsFailed] = useState(false);

  useEffect(() => {
    setCurrentImageSrc(imageSrc);
    setCurrentAspect(aspect);
    setZoom(1);
    setBaseSize(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setCorsFailed(false);
    if (fixedShape) {
      setCropMode(fixedShape);
    }
  }, [imageSrc, fixedShape, aspect]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgEl = e.currentTarget;
    const width = imgEl.clientWidth || imgEl.width || Math.min(imgEl.naturalWidth, 580);
    const height = imgEl.clientHeight || imgEl.height || Math.min(imgEl.naturalHeight, 380);

    setBaseSize((prev) => prev || { width, height });

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
      setBaseSize(null);
      setZoom(1);
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

    let targetCrop: { x: number; y: number; width: number; height: number } | null = null;

    if (crop && crop.width > 0 && crop.height > 0) {
      targetCrop =
        crop.unit === '%'
          ? {
              x: (crop.x / 100) * image.width,
              y: (crop.y / 100) * image.height,
              width: (crop.width / 100) * image.width,
              height: (crop.height / 100) * image.height,
            }
          : { x: crop.x, y: crop.y, width: crop.width, height: crop.height };
    } else if (completedCrop) {
      targetCrop = completedCrop;
    }

    if (!targetCrop || targetCrop.width <= 0 || targetCrop.height <= 0) {
      handleUseOriginal();
      return;
    }

    try {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const sourceX = Math.max(0, Math.round(targetCrop.x * scaleX));
      const sourceY = Math.max(0, Math.round(targetCrop.y * scaleY));
      const finalWidth = Math.min(
        image.naturalWidth - sourceX,
        Math.max(1, Math.round(targetCrop.width * scaleX)),
      );
      const finalHeight = Math.min(
        image.naturalHeight - sourceY,
        Math.max(1, Math.round(targetCrop.height * scaleY)),
      );

      if (finalWidth <= 0 || finalHeight <= 0) {
        handleUseOriginal();
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      ctx.imageSmoothingQuality = 'high';

      if (cropMode === 'round') {
        ctx.beginPath();
        ctx.arc(finalWidth / 2, finalHeight / 2, Math.min(finalWidth, finalHeight) / 2, 0, 2 * Math.PI);
        ctx.clip();
      }

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        finalWidth,
        finalHeight,
        0,
        0,
        finalWidth,
        finalHeight,
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
      handleUseOriginal();
    }
  };

  const isExternalHttp =
    typeof currentImageSrc === 'string' &&
    (currentImageSrc.startsWith('http://') || currentImageSrc.startsWith('https://'));
  const crossOriginProp: 'anonymous' | undefined = isExternalHttp && !corsFailed ? 'anonymous' : undefined;

  const resolvedAspectOptions: CropAspectOption[] | undefined =
    aspectOptions && aspectOptions.length > 0
      ? aspectOptions
      : cropMode === 'rect' && aspect !== undefined && allowFreeCrop
        ? [
            { label: CROP_MODAL_TEXTS.MODE_FREE, value: undefined },
            { label: CROP_MODAL_TEXTS.MODE_SUGGESTED, value: aspect },
          ]
        : undefined;

  const handleImageError = () => {
    if (isExternalHttp && !corsFailed) {
      setCorsFailed(true);
    }
  };

  return {
    imgRef,
    crop,
    setCrop,
    setCompletedCrop,
    currentAspect,
    cropMode,
    currentImageSrc,
    isRemovingBg,
    zoom,
    setZoom,
    baseSize,
    crossOriginProp,
    resolvedAspectOptions,
    onImageLoad,
    handleImageError,
    handleAspectChange,
    handleModeChange,
    handleRemoveBg,
    handleUseOriginal,
    handleSave,
  };
};

