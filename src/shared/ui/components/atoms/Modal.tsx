"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutContainer } from './LayoutContainer';
import { X } from 'lucide-react';

export type ModalSize = 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl' 
  | '2xl' 
  | '3xl' 
  | '4xl' 
  | '5xl' 
  | '6xl' 
  | '7xl' 
  | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: ModalSize;
  noPadding?: boolean;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-[96vw]',
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  showCloseButton = true,
  size = 'md',
  noPadding = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <LayoutContainer 
        ref={modalRef}
        className={`relative bg-drawer border border-border rounded-2xl shadow-2xl w-full animate-in zoom-in-95 duration-200 ${
          noPadding ? '' : 'p-6'
        } ${SIZE_CLASSES[size] || 'max-w-md'} ${className}`}
      >
        {showCloseButton && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors z-20 p-1 rounded-lg hover:bg-surface"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </LayoutContainer>
    </div>,
    document.body
  );
};
