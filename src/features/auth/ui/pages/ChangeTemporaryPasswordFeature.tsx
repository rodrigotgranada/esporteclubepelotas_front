'use client';

import React, { useState } from 'react';
import { LayoutContainer, Title, Text, Button, PasswordInput, Form } from '@/shared/ui/components';
import { KeyRound, ShieldAlert, Check } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { updatePassword } from '@/services/profile.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CHANGE_TEMPORARY_PASSWORD_TEXTS } from '../../constants/change-temporary-password.constants';

export const ChangeTemporaryPasswordFeature = () => {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(CHANGE_TEMPORARY_PASSWORD_TEXTS.ERROR_REQUIRED_FIELDS);
      return;
    }

    if (newPassword.length < 6) {
      setError(CHANGE_TEMPORARY_PASSWORD_TEXTS.ERROR_MIN_LENGTH);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(CHANGE_TEMPORARY_PASSWORD_TEXTS.ERROR_PASSWORD_MISMATCH);
      return;
    }

    if (newPassword === currentPassword) {
      setError(CHANGE_TEMPORARY_PASSWORD_TEXTS.ERROR_SAME_AS_CURRENT);
      return;
    }

    try {
      setIsLoading(true);
      await updatePassword(currentPassword, newPassword);
      updateUser({ mustChangePassword: false });
      toast.success(CHANGE_TEMPORARY_PASSWORD_TEXTS.TOAST_SUCCESS);
      
      const roleName = typeof user?.role === 'object' ? user?.role?.name : user?.role;
      if (roleName === 'ADMIN' || roleName === 'OWNER') {
        router.push('/gestao');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || CHANGE_TEMPORARY_PASSWORD_TEXTS.TOAST_ERROR_GENERIC;
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <PasswordInput
            label={CHANGE_TEMPORARY_PASSWORD_TEXTS.LABEL_CURRENT_PASSWORD}
            placeholder={CHANGE_TEMPORARY_PASSWORD_TEXTS.PLACEHOLDER_CURRENT_PASSWORD}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <PasswordInput
            label={CHANGE_TEMPORARY_PASSWORD_TEXTS.LABEL_NEW_PASSWORD}
            placeholder={CHANGE_TEMPORARY_PASSWORD_TEXTS.PLACEHOLDER_NEW_PASSWORD}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <PasswordInput
            label={CHANGE_TEMPORARY_PASSWORD_TEXTS.LABEL_CONFIRM_PASSWORD}
            placeholder={CHANGE_TEMPORARY_PASSWORD_TEXTS.PLACEHOLDER_CONFIRM_PASSWORD}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <LayoutContainer className="bg-error/10 border border-error/30 rounded-lg p-2.5">
              <Text className="text-xs font-medium text-error">{error}</Text>
            </LayoutContainer>
          )}

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
