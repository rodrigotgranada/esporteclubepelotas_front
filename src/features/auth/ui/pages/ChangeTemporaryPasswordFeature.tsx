'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  PasswordInput,
  Form,
  FormField,
  PasswordStrengthMeter,
} from '@/shared/ui/components';
import { KeyRound, ShieldAlert, Check } from 'lucide-react';
import { CHANGE_TEMPORARY_PASSWORD_TEXTS } from '../../constants/change-temporary-password.constants';
import { useChangeTemporaryPassword } from '../../hooks/useChangeTemporaryPassword';

export const ChangeTemporaryPasswordFeature = () => {
  const { form, isLoading, handleSubmit, logout, router } =
    useChangeTemporaryPassword();

  const newPassword = form.watch('newPassword');

  return (
    <LayoutContainer className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <LayoutContainer className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <LayoutContainer className="flex flex-col items-center text-center mb-6">
          <LayoutContainer className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-3">
            <KeyRound size={28} />
          </LayoutContainer>
          <Title level="h1" className="text-2xl font-black text-text-primary">
            {CHANGE_TEMPORARY_PASSWORD_TEXTS.PAGE_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary mt-1">
            {CHANGE_TEMPORARY_PASSWORD_TEXTS.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Security Alert Banner */}
        <LayoutContainer className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 mb-6 flex items-start gap-3">
          <ShieldAlert size={20} className="text-primary shrink-0 mt-0.5" />
          <LayoutContainer className="text-left">
            <Text className="text-xs font-bold text-text-primary">
              {CHANGE_TEMPORARY_PASSWORD_TEXTS.SECURITY_NOTICE_TITLE}
            </Text>
            <Text className="text-xs text-text-secondary mt-0.5">
              {CHANGE_TEMPORARY_PASSWORD_TEXTS.SECURITY_NOTICE_DESC}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Form */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            name="currentPassword"
            control={form.control}
            label={CHANGE_TEMPORARY_PASSWORD_TEXTS.LABEL_CURRENT_PASSWORD}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder={CHANGE_TEMPORARY_PASSWORD_TEXTS.PLACEHOLDER_CURRENT_PASSWORD}
                required
              />
            )}
          />

          <FormField
            name="newPassword"
            control={form.control}
            label={CHANGE_TEMPORARY_PASSWORD_TEXTS.LABEL_NEW_PASSWORD}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder={CHANGE_TEMPORARY_PASSWORD_TEXTS.PLACEHOLDER_NEW_PASSWORD}
                required
              />
            )}
          />

          {newPassword && <PasswordStrengthMeter password={newPassword} />}

          <FormField
            name="confirmPassword"
            control={form.control}
            label={CHANGE_TEMPORARY_PASSWORD_TEXTS.LABEL_CONFIRM_PASSWORD}
            required
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder={CHANGE_TEMPORARY_PASSWORD_TEXTS.PLACEHOLDER_CONFIRM_PASSWORD}
                required
              />
            )}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            leftIcon={<Check size={18} />}
          >
            {CHANGE_TEMPORARY_PASSWORD_TEXTS.BUTTON_SUBMIT}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full text-text-secondary"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            {CHANGE_TEMPORARY_PASSWORD_TEXTS.BUTTON_LOGOUT}
          </Button>
        </Form>
      </LayoutContainer>
    </LayoutContainer>
  );
};
