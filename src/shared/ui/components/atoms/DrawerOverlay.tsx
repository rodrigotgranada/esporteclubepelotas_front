import React from 'react';

interface DrawerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrawerOverlay = ({ isOpen, onClose }: DrawerOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300" 
      onClick={onClose}
      aria-hidden="true"
    />
  );
};
