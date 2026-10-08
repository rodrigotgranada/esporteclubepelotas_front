"use client";
import React, { useState } from 'react';
import { Modal, Title, Text, Button, LayoutContainer } from '../atoms';
import { PasswordInput } from '../molecules';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { PROFILE_TEXTS } from '@/features/profile/constants';

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
  title = PROFILE_TEXTS.SENSITIVE_MODAL_TITLE_DEFAULT,
  description = PROFILE_TEXTS.SENSITIVE_MODAL_DESC_DEFAULT,
  confirmText = PROFILE_TEXTS.SENSITIVE_MODAL_BUTTON_CONFIRM,
  isLoading = false
}: SensitiveActionModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleConfirm = async () => {
    if (!password) {
      setError('A senha é obrigatória.');
      return;
    }
    setError(undefined);
    try {
      await onConfirm(password);
      setPassword(''); // clear after success
    } catch (err: any) {
      setError(err.message || 'Senha incorreta.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(undefined);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="border-yellow-500/20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <LayoutContainer className="flex flex-col items-center text-center pt-6">
        <div className="mb-6 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 text-yellow-400 p-5 rounded-full border border-yellow-500/20 shadow-inner">
          <ShieldAlert size={36} className="drop-shadow-md" />
        </div>
        
        <Title level="h3" className="text-2xl font-black text-white mb-3 tracking-tight">
          {title}
        </Title>
        
        <Text className="text-gray-400 mb-8 px-2 text-sm leading-relaxed">
          {description}
        </Text>

        <LayoutContainer className="w-full text-left mb-8">
          <PasswordInput
            label={PROFILE_TEXTS.SENSITIVE_MODAL_PASSWORD_LABEL}
            placeholder={PROFILE_TEXTS.SENSITIVE_MODAL_PASSWORD_PLACEHOLDER}
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
            {PROFILE_TEXTS.SENSITIVE_MODAL_BUTTON_CANCEL}
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
