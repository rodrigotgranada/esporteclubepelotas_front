"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutContainer } from './LayoutContainer';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  showCloseButton = true 
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
        className={`relative bg-drawer border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200 ${className}`}
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
