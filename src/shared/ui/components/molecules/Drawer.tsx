"use client";
import React, { useEffect } from 'react';
import { DrawerOverlay } from '../atoms';
import { Title, Button, LayoutContainer } from '../atoms';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer = ({ isOpen, onClose, title, children, size = 'md' }: DrawerProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
  };

  return (
    <>
      <DrawerOverlay isOpen={isOpen} onClose={onClose} />
      <LayoutContainer 
        className={`fixed z-50 bg-drawer border-border flex flex-col shadow-2xl transition-transform
          bottom-0 left-0 w-full max-h-[90vh] rounded-t-2xl border-t animate-in slide-in-from-bottom-full duration-300
          md:top-0 md:right-0 md:bottom-auto md:left-auto md:h-full md:max-h-none md:w-full md:rounded-none md:border-t-0 md:border-l md:slide-in-from-right-full ${sizeClasses[size]}`}
        role="dialog"
        aria-modal="true"
      >
        <LayoutContainer className="flex items-center justify-between p-6 border-b border-border">
          {title && <Title level="h3" className="text-xl font-bold text-text-primary m-0">{title}</Title>}
          <Button 
            variant="ghost"
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-full"
            aria-label="Close drawer"
          >
            <X size={20} />
          </Button>
        </LayoutContainer>
        <LayoutContainer className="p-6 flex-1 overflow-y-auto flex flex-col">
          {children}
        </LayoutContainer>
      </LayoutContainer>
    </>
  );
};
