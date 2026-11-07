'use client';

import React, { useState } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  SafeImage,
  ImageLightboxModal,
} from '@/shared/ui/components';
import { STADIUM_TEXTS } from '../../constants/stadium.constants';
import { StadiumGalleryImage } from '../../types/stadium.types';
import { Camera, Maximize2 } from 'lucide-react';

interface StadiumGalleryProps {
  gallery?: StadiumGalleryImage[];
}

export const StadiumGallery: React.FC<StadiumGalleryProps> = ({ gallery = [] }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  // Ordena fotos por prioridade de exibição
  const sortedGallery = [...gallery].sort((a, b) => (a.order || 0) - (b.order || 0));

  const lightboxImages = sortedGallery.map((img) => ({
    url: img.url,
    caption: img.caption || 'Estádio Boca do Lobo - Esporte Clube Pelotas',
  }));

  return (
    <LayoutContainer as="section" className="w-full py-12 sm:py-16 bg-surface/40 border-t border-b border-border">
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Galeria */}
        <LayoutContainer className="max-w-3xl mb-10 flex flex-col gap-3">
          <Badge
            variant="default"
            size="md"
            className="w-fit inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 font-bold px-3 py-1"
          >
            <Camera className="w-3.5 h-3.5 text-primary" />
            {STADIUM_TEXTS.GALLERY_SECTION.BADGE}
          </Badge>

          <Title level="h2" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {STADIUM_TEXTS.GALLERY_SECTION.TITLE}
          </Title>

          <Text className="text-base text-text-secondary leading-relaxed">
            {STADIUM_TEXTS.GALLERY_SECTION.SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Grid de Imagens */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedGallery.map((photo, index) => (
            <LayoutContainer
              key={index}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-border/80 bg-surface cursor-pointer shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <SafeImage
                src={photo.url}
                alt={photo.caption || 'Foto da Boca do Lobo'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay com gradiente escuro na base para legibilidade */}
              <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Botão de Zoom Flutuante */}
              <LayoutContainer className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                <Maximize2 className="w-4 h-4" />
              </LayoutContainer>

              {/* Legenda na base */}
              {photo.caption && (
                <LayoutContainer className="absolute bottom-0 inset-x-0 p-4">
                  <Text as="p" className="text-xs sm:text-sm text-white font-medium line-clamp-2 leading-snug drop-shadow-sm">
                    {photo.caption}
                  </Text>
                </LayoutContainer>
              )}
            </LayoutContainer>
          ))}
        </LayoutContainer>

        {/* Modal Lightbox Unificado */}
        {selectedPhotoIndex !== null && (
          <ImageLightboxModal
            isOpen={selectedPhotoIndex !== null}
            initialIndex={selectedPhotoIndex}
            images={sortedGallery.map((img) => img.url)}
            onClose={() => setSelectedPhotoIndex(null)}
          />
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
