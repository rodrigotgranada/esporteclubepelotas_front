import React from 'react';
import { Drawer, PasswordInput, Button, LayoutContainer, Form, Text } from '@/shared/ui/components';
import { PROFILE_TEXTS } from '@/features/profile/constants';
import { useChangePasswordDrawer } from '@/features/profile/hooks/useChangePasswordDrawer';

interface ChangePasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (current: string, newPass: string) => Promise<void>;
  isLoading: boolean;
}

export const ChangePasswordDrawer = ({ isOpen, onClose, onSubmit, isLoading }: ChangePasswordDrawerProps) => {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleSubmit,
  } = useChangePasswordDrawer({ isOpen, onSubmit });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={PROFILE_TEXTS.CHANGE_PASSWORD_DRAWER_TITLE}>
      <Form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-4">
        <LayoutContainer className="flex-1 space-y-4">
          <PasswordInput
            label={PROFILE_TEXTS.CHANGE_PASSWORD_LABEL_CURRENT}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <PasswordInput
            label={PROFILE_TEXTS.CHANGE_PASSWORD_LABEL_NEW}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <PasswordInput
            label={PROFILE_TEXTS.CHANGE_PASSWORD_LABEL_CONFIRM}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && (
            <Text className="text-red-500 text-sm">{error}</Text>
          )}
        </LayoutContainer>

        <LayoutContainer className="mt-8 pt-6 border-t border-white/10 flex gap-3">
          <Button type="button" variant="outline" size="md" className="flex-1" onClick={onClose}>
            {PROFILE_TEXTS.ADDRESSES_BUTTON_CANCEL}
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" isLoading={isLoading}>
            {PROFILE_TEXTS.CHANGE_PASSWORD_BUTTON_SAVE}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
