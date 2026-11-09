'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { LayoutContainer } from '../../atoms/LayoutContainer';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { SafeImage } from '../SafeImage';
import { IMAGE_LIGHTBOX_TEXTS } from './ImageLightboxModal.constants';

export interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
  titles?: string[];
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
  titles,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincroniza index quando o modal abre com um novo initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
    }
  }, [isOpen, initialIndex, images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Teclado: Escape fecha, Setas navegam
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !mounted || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const total = images.length;
  const hasMultiple = total > 1;
  const currentTitle = titles && titles[currentIndex] ? titles[currentIndex] : title;

  return createPortal(
    <LayoutContainer className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none">
      {/* Top Header Bar */}
      <LayoutContainer className="w-full flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent z-20">
        <LayoutContainer className="flex items-center gap-3">
          <Text className="text-xs sm:text-sm font-bold text-neutral-300">
            {IMAGE_LIGHTBOX_TEXTS.COUNTER(currentIndex + 1, total)}
          </Text>
          {currentTitle && (
            <Text className="hidden sm:inline text-xs text-neutral-400 border-l border-neutral-700 pl-3 max-w-md truncate">
              {currentTitle}
            </Text>
          )}
        </LayoutContainer>

        <Button
          type="button"
          variant="custom"
          size="none"
          onClick={onClose}
          className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-700/60 cursor-pointer"
          aria-label={IMAGE_LIGHTBOX_TEXTS.CLOSE}
        >
          <X className="w-5 h-5" />
        </Button>
      </LayoutContainer>

      {/* Main Stage Image Area */}
      <LayoutContainer className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Botão Anterior */}
        {hasMultiple && (
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-primary transition-all border border-neutral-700/50 shadow-lg backdrop-blur-xs cursor-pointer"
            aria-label={IMAGE_LIGHTBOX_TEXTS.PREVIOUS}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {/* Imagem Principal Centralizada */}
        <LayoutContainer className="relative w-full h-full max-w-5xl max-h-[78vh] flex items-center justify-center">
          <SafeImage
            src={currentImage}
            alt={`Foto ${currentIndex + 1} de ${total}`}
            fill
            sizes="100vw"
            priority
            className="object-contain rounded-lg animate-in zoom-in-95 duration-200"
          />
        </LayoutContainer>

        {/* Botão Próximo */}
        {hasMultiple && (
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-primary transition-all border border-neutral-700/50 shadow-lg backdrop-blur-xs cursor-pointer"
            aria-label={IMAGE_LIGHTBOX_TEXTS.NEXT}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </LayoutContainer>

      {/* Bottom Bar: Miniaturas (Thumbnails) se houver mais de uma foto */}
      {hasMultiple && (
        <LayoutContainer className="w-full py-3 px-4 sm:px-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex justify-center z-20">
          <LayoutContainer className="flex items-center gap-2 max-w-2xl overflow-x-auto py-1 px-2 scrollbar-thin">
            {images.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <Button
                  key={idx}
                  type="button"
                  variant="custom"
                  size="none"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                    isActive
                      ? 'border-primary scale-105 shadow-md shadow-primary/20'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:border-neutral-500'
                  }`}
                  aria-label={IMAGE_LIGHTBOX_TEXTS.COUNTER(idx + 1, total)}
                >
                  <SafeImage
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Button>
              );
            })}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>,
    document.body
  );
};
