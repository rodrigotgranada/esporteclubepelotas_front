"use client";
import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Wand2 } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Modal } from '../atoms/Modal';
import { LayoutContainer } from '../atoms/LayoutContainer';
import { Slider } from '../atoms/Slider';
import { Text } from '../atoms/Text';
import { Title } from '../atoms/Title';
import toast from 'react-hot-toast';

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
    }, 'image/png'); // Mudando para PNG para suportar transparência
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
    title: string;
    zoom: string;
    useOriginal: string;
    cancel: string;
    save: string;
  };
}

export const CropModal = ({ 
  isOpen, 
  imageSrc, 
  onClose, 
  onCropSave, 
  onUseOriginal, 
  isLoading = false,
  texts = {
    title: 'Ajustar Foto',
    zoom: 'Zoom',
    useOriginal: 'Usar Original',
    cancel: 'Cancelar',
    save: 'Salvar'
  }
}: CropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  useEffect(() => {
    setCurrentImageSrc(imageSrc);
  }, [imageSrc]);

  const onCropComplete = useCallback((croppedArea: unknown, croppedAreaPixels: { x: number, y: number, width: number, height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRemoveBg = async () => {
    try {
      setIsRemovingBg(true);
      const loadingToast = toast.loading('Carregando IA e processando fundo... (pode demorar alguns segundos)', { duration: 15000 });
      
      const { removeBackground } = await import('@imgly/background-removal');
      const imageBlob = await removeBackground(currentImageSrc);
      const url = URL.createObjectURL(imageBlob);
      setCurrentImageSrc(url);
      
      toast.dismiss(loadingToast);
      toast.success('Fundo removido com sucesso!');
    } catch (err) {
      console.error('Failed to remove bg', err);
      toast.error('Não foi possível remover o fundo automaticamente.');
    } finally {
      setIsRemovingBg(false);
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
    <Modal isOpen={isOpen} onClose={onClose} className="!p-0 overflow-hidden bg-[#121214]">
      <LayoutContainer className="flex items-center justify-between p-4 border-b border-white/5">
        <Title level="h3" className="text-lg font-bold text-white">{texts.title}</Title>
      </LayoutContainer>
        
        <LayoutContainer className="relative w-full h-80 bg-black bg-[url('/checkers.png')]">
          <Cropper
            image={currentImageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </LayoutContainer>
        
        <LayoutContainer className="p-4 flex flex-col space-y-4 bg-[#121214]">
          <LayoutContainer className="flex items-center gap-4">
            <Text as="span" className="text-xs text-gray-400">{texts.zoom}</Text>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </LayoutContainer>
          <LayoutContainer className="flex justify-between items-center pt-2">
            <LayoutContainer className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onUseOriginal}
                disabled={isLoading || isRemovingBg || !onUseOriginal}
                className={!onUseOriginal ? 'invisible' : ''}
              >
                {texts.useOriginal}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveBg}
                isLoading={isRemovingBg}
                leftIcon={<Wand2 className="w-4 h-4 text-purple-500" />}
                className="hover:border-purple-500 hover:text-purple-400 transition-colors"
                title="Remover fundo com IA"
              >
                Remover Fundo
              </Button>
            </LayoutContainer>
            <LayoutContainer className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isLoading || isRemovingBg}
              >
                {texts.cancel}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={isLoading || isRemovingBg}
                leftIcon={<Check className="w-4 h-4" />}
              >
                {texts.save}
              </Button>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
    </Modal>
  );
};
