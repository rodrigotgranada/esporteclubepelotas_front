import React from 'react';
import {
  Drawer,
  PasswordInput,
  Button,
  LayoutContainer,
  Form,
  FormField,
  PasswordStrengthMeter,
} from '@/shared/ui/components';
import { PROFILE_TEXTS } from '@/features/profile/constants';
import { useChangePasswordDrawer } from '@/features/profile/hooks/useChangePasswordDrawer';

interface ChangePasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (current: string, newPass: string) => Promise<boolean | void>;
  isLoading: boolean;
}

export const ChangePasswordDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ChangePasswordDrawerProps) => {
  const { form, handleSubmit } = useChangePasswordDrawer({
    isOpen,
    onSubmit,
    isLoading,
  });

  const newPassword = form.watch('newPassword');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      title={PROFILE_TEXTS.CHANGE_PASSWORD_DRAWER_TITLE}
    >
      <Form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-4">
        <LayoutContainer className="flex-1 space-y-4">
          <FormField
            name="currentPassword"
            control={form.control}
            label={PROFILE_TEXTS.CHANGE_PASSWORD_LABEL_CURRENT}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                required
              />
            )}
          />

          <FormField
            name="newPassword"
            control={form.control}
            label={PROFILE_TEXTS.CHANGE_PASSWORD_LABEL_NEW}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                required
              />
            )}
          />

          {newPassword && (
            <PasswordStrengthMeter password={newPassword} />
          )}

          <FormField
            name="confirmPassword"
            control={form.control}
            label={PROFILE_TEXTS.CHANGE_PASSWORD_LABEL_CONFIRM}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                required
              />
            )}
          />
        </LayoutContainer>

        <LayoutContainer className="mt-8 pt-6 border-t border-white/10 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {PROFILE_TEXTS.ADDRESSES_BUTTON_CANCEL}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1"
            isLoading={isLoading}
          >
            {PROFILE_TEXTS.CHANGE_PASSWORD_BUTTON_SAVE}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
