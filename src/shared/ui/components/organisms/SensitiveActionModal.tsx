"use client";
import React, { useState } from 'react';
import { Modal, Title, Text, Button, LayoutContainer } from '../atoms';
import { PasswordInput } from '../molecules';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { SENSITIVE_ACTION_MODAL_TEXTS } from './SensitiveActionModal.constants';

export interface SensitiveActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  isLoading?: boolean;
}

export const SensitiveActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = SENSITIVE_ACTION_MODAL_TEXTS.TITLE_DEFAULT,
  description = SENSITIVE_ACTION_MODAL_TEXTS.DESC_DEFAULT,
  confirmText = SENSITIVE_ACTION_MODAL_TEXTS.BUTTON_CONFIRM,
  isLoading = false
}: SensitiveActionModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleConfirm = async () => {
    if (!password) {
      setError(SENSITIVE_ACTION_MODAL_TEXTS.ERROR_PASSWORD_REQUIRED);
      return;
    }
    setError(undefined);
    try {
      await onConfirm(password);
      setPassword('');
    } catch (err: any) {
      setError(err.message || SENSITIVE_ACTION_MODAL_TEXTS.ERROR_INCORRECT_PASSWORD);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="border-primary/20 bg-surface">
      <LayoutContainer className="flex flex-col items-center text-center pt-6">
        <LayoutContainer className="mb-6 bg-primary/10 text-primary p-5 rounded-full border border-primary/20 shadow-inner">
          <ShieldAlert size={36} className="drop-shadow-md" />
        </LayoutContainer>
        
        <Title level="h3" className="text-2xl font-black text-text-primary mb-3 tracking-tight">
          {title}
        </Title>
        
        <Text className="text-text-secondary mb-8 px-2 text-sm leading-relaxed">
          {description}
        </Text>

        <LayoutContainer className="w-full text-left mb-8">
          <PasswordInput
            label={SENSITIVE_ACTION_MODAL_TEXTS.PASSWORD_LABEL}
            placeholder={SENSITIVE_ACTION_MODAL_TEXTS.PASSWORD_PLACEHOLDER}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              if (error) setError(undefined);
            }}
            error={error}
          />
        </LayoutContainer>

        <LayoutContainer className="flex w-full gap-3 mt-2">
          <Button 
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            {SENSITIVE_ACTION_MODAL_TEXTS.BUTTON_CANCEL}
          </Button>
          <Button 
            variant="primary"
            size="md"
            fullWidth
            onClick={handleConfirm}
            isLoading={isLoading}
            rightIcon={<ArrowRight size={18} />}
          >
            {confirmText}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
