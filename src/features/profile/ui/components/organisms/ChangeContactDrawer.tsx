import React from 'react';
import {
  Drawer,
  PasswordInput,
  Button,
  LayoutContainer,
  Form,
  PhoneInput,
  Text,
  Input,
  FormField,
} from '@/shared/ui/components';
import { PROFILE_TEXTS } from '@/features/profile/constants';
import { useChangeContactDrawer } from '@/features/profile/hooks/useChangeContactDrawer';
import { Info } from 'lucide-react';

interface ChangeContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'email' | 'phone';
  onSubmit: (newValue: string, currentPassword: string) => Promise<boolean | void>;
  isLoading: boolean;
}

export const ChangeContactDrawer = ({
  isOpen,
  onClose,
  type,
  onSubmit,
  isLoading,
}: ChangeContactDrawerProps) => {
  const { form, handleSubmit } = useChangeContactDrawer({
    isOpen,
    type,
    onSubmit,
    isLoading,
  });

  const isEmail = type === 'email';
  const title = isEmail
    ? PROFILE_TEXTS.CHANGE_EMAIL_DRAWER_TITLE
    : PROFILE_TEXTS.CHANGE_PHONE_DRAWER_TITLE;
  const label = isEmail
    ? PROFILE_TEXTS.CHANGE_EMAIL_LABEL
    : PROFILE_TEXTS.CHANGE_PHONE_LABEL;
  const placeholder = isEmail
    ? PROFILE_TEXTS.CHANGE_EMAIL_PLACEHOLDER
    : PROFILE_TEXTS.CHANGE_PHONE_PLACEHOLDER;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      title={title}
    >
      <Form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-4">
        <LayoutContainer className="flex-1 space-y-4">
          {isEmail ? (
            <FormField
              name="newValue"
              control={form.control}
              label={label}
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={placeholder}
                  type="email"
                />
              )}
            />
          ) : (
            <FormField
              name="newValue"
              control={form.control}
              label={label}
              required
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder={placeholder}
                />
              )}
            />
          )}

          <FormField
            name="currentPassword"
            control={form.control}
            label={PROFILE_TEXTS.CHANGE_CURRENT_PASSWORD_LABEL}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder={PROFILE_TEXTS.CHANGE_CURRENT_PASSWORD_PLACEHOLDER}
              />
            )}
          />

          {!isEmail && (
            <LayoutContainer className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <Info size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <Text className="text-sm text-yellow-200/80">
                {PROFILE_TEXTS.CHANGE_PHONE_INFO_WARNING}
              </Text>
            </LayoutContainer>
          )}
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
            {PROFILE_TEXTS.CHANGE_BUTTON_REQUEST}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
