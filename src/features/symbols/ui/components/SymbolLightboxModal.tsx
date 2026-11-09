import React from 'react';
import { ImageLightboxModal } from '@/shared/ui/components';

export interface SymbolLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export const SymbolLightboxModal: React.FC<SymbolLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
}) => {
  if (!imageUrl) return null;

  const displayTitle = subtitle ? `${title} • ${subtitle}` : title;

  return (
    <ImageLightboxModal
      isOpen={isOpen}
      onClose={onClose}
      images={[imageUrl]}
      title={displayTitle}
      initialIndex={0}
    />
  );
};

