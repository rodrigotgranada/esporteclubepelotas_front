"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  X,
  Check,
  Wand2,
  Circle,
  Crop as CropIcon,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Modal } from '../atoms/Modal';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Slider } from '../atoms/Slider';
import { Text } from '../atoms/Text';
import { Title } from '../atoms/Title';
import toast from 'react-hot-toast';
import { CROP_MODAL_TEXTS } from './CropModal.constants';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

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
  allowFreeCrop?: boolean;
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
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  };
}

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));
}

function isSameAspect(a: number | undefined, b: number | undefined): boolean {
  if (a === undefined && b === undefined) return true;
  if (a === undefined || b === undefined) return false;
  return Math.abs(a - b) < 0.001;
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
  allowFreeCrop = true,
  texts = {},
}) => {
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

    // Prefer percentage crop computed against current layout dimensions so zoom changes stay exact
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

  if (!isOpen) return null;

  const isExternalHttp =
    typeof currentImageSrc === 'string' &&
    (currentImageSrc.startsWith('http://') || currentImageSrc.startsWith('https://'));
  const crossOriginProp = isExternalHttp && !corsFailed ? 'anonymous' : undefined;

  const resolvedAspectOptions: CropAspectOption[] | undefined =
    aspectOptions && aspectOptions.length > 0
      ? aspectOptions
      : cropMode === 'rect' && aspect !== undefined && allowFreeCrop
        ? [
            { label: CROP_MODAL_TEXTS.MODE_FREE, value: undefined },
            { label: CROP_MODAL_TEXTS.MODE_SUGGESTED, value: aspect },
          ]
        : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="!p-0 overflow-hidden bg-drawer border border-border max-w-2xl w-full"
    >
      {/* Header */}
      <LayoutContainer className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-border bg-surface">
        <Title level="h3" className="text-base font-bold text-text-primary shrink-0">
          {texts.title || CROP_MODAL_TEXTS.TITLE}
        </Title>

        {/* Mode / Aspect Ratio Toggle */}
        <LayoutContainer className="flex items-center gap-2 flex-wrap justify-end">
          {resolvedAspectOptions && resolvedAspectOptions.length > 0 ? (
            <LayoutContainer className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border flex-wrap">
              {resolvedAspectOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleAspectChange(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    isSameAspect(currentAspect, opt.value)
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
            aria-label={CROP_MODAL_TEXTS.CLOSE_ARIA}
          >
            <X size={18} />
          </button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Cropper Viewport with Real Layout Scaling & Full Scroll Pan */}
      <LayoutContainer className="relative w-full h-[420px] overflow-auto flex bg-black/95 p-4 select-none">
        <LayoutContainer className="m-auto w-fit shrink-0">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={cropMode === 'round' ? 1 : currentAspect}
            circularCrop={cropMode === 'round'}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={currentImageSrc}
              alt="Recorte"
              crossOrigin={crossOriginProp}
              onError={() => {
                if (isExternalHttp && !corsFailed) {
                  setCorsFailed(true);
                }
              }}
              onLoad={onImageLoad}
              style={
                baseSize
                  ? {
                      width: `${Math.round(baseSize.width * zoom)}px`,
                      height: `${Math.round(baseSize.height * zoom)}px`,
                      maxWidth: 'none',
                      maxHeight: 'none',
                    }
                  : {
                      maxHeight: '380px',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                    }
              }
              className="block rounded-xs"
            />
          </ReactCrop>
        </LayoutContainer>
      </LayoutContainer>

      {/* Controls & Footer */}
      <LayoutContainer className="p-5 flex flex-col space-y-4 bg-drawer border-t border-border">
        {/* Zoom Slider + Fine Controls */}
        <LayoutContainer className="flex items-center gap-3">
          <Text as="span" className="text-xs font-medium text-text-secondary w-11 shrink-0">
            {texts.zoom || CROP_MODAL_TEXTS.ZOOM}
          </Text>
          <button
            type="button"
            onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
            disabled={zoom <= MIN_ZOOM}
            className="p-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 cursor-pointer"
            aria-label={CROP_MODAL_TEXTS.ZOOM_OUT}
            title={CROP_MODAL_TEXTS.ZOOM_OUT}
          >
            <ZoomOut size={14} />
          </button>
          <Slider
            value={zoom}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            aria-label={texts.zoom || CROP_MODAL_TEXTS.ZOOM}
            onChange={(e) => setZoom(clampZoom(Number(e.target.value)))}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
            disabled={zoom >= MAX_ZOOM}
            className="p-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 cursor-pointer"
            aria-label={CROP_MODAL_TEXTS.ZOOM_IN}
            title={CROP_MODAL_TEXTS.ZOOM_IN}
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="text-xs font-bold text-text-primary bg-surface border border-border rounded-lg px-2 py-1 min-w-[52px] text-center hover:border-primary cursor-pointer"
            title={CROP_MODAL_TEXTS.ZOOM_RESET}
          >
            {`${Math.round(zoom * 100)}%`}
          </button>
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
