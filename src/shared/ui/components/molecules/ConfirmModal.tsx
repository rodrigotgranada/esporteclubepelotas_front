import React from 'react';
import { Modal, Title, Text, Button, LayoutContainer } from '../atoms';
import { AlertTriangle, Check, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle size={36} className="text-error drop-shadow-md" />;
      case 'warning':
        return <AlertTriangle size={36} className="text-warning drop-shadow-md" />;
      case 'info':
      default:
        return <Check size={36} className="text-primary drop-shadow-md" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="border-border bg-background">
      <LayoutContainer className="flex flex-col items-center text-center pt-6">
        <div className="mb-6 bg-surface p-5 rounded-full border border-border shadow-inner">
          {getIcon()}
        </div>
        
        <Title level="h3" className="text-2xl font-black text-text-primary mb-3 tracking-tight">
          {title}
        </Title>
        
        <Text className="text-text-secondary mb-10 px-2 text-sm leading-relaxed">
          {description}
        </Text>

        <LayoutContainer className="flex w-full gap-3 mt-2">
          <Button 
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
            leftIcon={<X size={18} />}
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary"
            size="md"
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={<Check size={18} />}
          >
            {confirmText}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
