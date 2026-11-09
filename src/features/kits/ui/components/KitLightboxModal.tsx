import React from 'react';
import { ImageLightboxModal } from '@/shared/ui/components';
import { KitLightboxState } from '../../hooks/useKits';

export interface KitLightboxModalProps {
  lightbox: KitLightboxState;
  onClose: () => void;
}

export const KitLightboxModal: React.FC<KitLightboxModalProps> = ({
  lightbox,
  onClose,
}) => {
  if (!lightbox.isOpen || lightbox.images.length === 0) return null;

  const displayTitle = lightbox.subtitle
    ? `${lightbox.title} • ${lightbox.subtitle}`
    : lightbox.title;

  return (
    <ImageLightboxModal
      isOpen={lightbox.isOpen}
      onClose={onClose}
      images={lightbox.images}
      titles={lightbox.titles}
      title={displayTitle}
      initialIndex={lightbox.initialIndex}
    />
  );
};
