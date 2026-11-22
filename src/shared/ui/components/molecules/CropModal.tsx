'use client';

import React from 'react';
import ReactCrop from 'react-image-crop';
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
import { CROP_MODAL_TEXTS } from './CropModal.constants';
import {
  useCropModal,
  clampCropZoom,
  isSameCropAspect,
  CROP_MIN_ZOOM,
  CROP_MAX_ZOOM,
  CROP_ZOOM_STEP,
  type CropAspectOption,
} from '@/shared/hooks/useCropModal';

export type { CropAspectOption };

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
  const {
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
  } = useCropModal({
    imageSrc,
    aspect,
    fixedShape,
    aspectOptions,
    allowFreeCrop,
    onCropSave,
    onUseOriginal,
  });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="!p-0 overflow-hidden bg-drawer border border-border max-w-2xl w-full"
    >
      <LayoutContainer className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-border bg-surface">
        <Title level="h3" className="text-base font-bold text-text-primary shrink-0">
          {texts.title || CROP_MODAL_TEXTS.TITLE}
        </Title>

        <LayoutContainer className="flex items-center gap-2 flex-wrap justify-end">
          {resolvedAspectOptions && resolvedAspectOptions.length > 0 ? (
            <LayoutContainer className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border flex-wrap">
              {resolvedAspectOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleAspectChange(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                    isSameCropAspect(currentAspect, opt.value)
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
              onError={handleImageError}
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

      <LayoutContainer className="p-5 flex flex-col space-y-4 bg-drawer border-t border-border">
        <LayoutContainer className="flex items-center gap-3">
          <Text as="span" className="text-xs font-medium text-text-secondary w-11 shrink-0">
            {texts.zoom || CROP_MODAL_TEXTS.ZOOM}
          </Text>
          <button
            type="button"
            onClick={() => setZoom((z) => clampCropZoom(z - CROP_ZOOM_STEP))}
            disabled={zoom <= CROP_MIN_ZOOM}
            className="p-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary disabled:opacity-40 cursor-pointer"
            aria-label={CROP_MODAL_TEXTS.ZOOM_OUT}
            title={CROP_MODAL_TEXTS.ZOOM_OUT}
          >
            <ZoomOut size={14} />
          </button>
          <Slider
            value={zoom}
            min={CROP_MIN_ZOOM}
            max={CROP_MAX_ZOOM}
            step={0.05}
            aria-label={texts.zoom || CROP_MODAL_TEXTS.ZOOM}
            onChange={(e) => setZoom(clampCropZoom(Number(e.target.value)))}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setZoom((z) => clampCropZoom(z + CROP_ZOOM_STEP))}
            disabled={zoom >= CROP_MAX_ZOOM}
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
