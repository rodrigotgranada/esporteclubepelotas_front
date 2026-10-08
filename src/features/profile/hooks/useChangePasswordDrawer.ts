import { useState, useEffect } from 'react';
import { PROFILE_TEXTS } from '@/features/profile/constants';

interface UseChangePasswordDrawerProps {
  isOpen: boolean;
  onSubmit: (current: string, newPass: string) => Promise<void>;
}

export const useChangePasswordDrawer = ({ isOpen, onSubmit }: UseChangePasswordDrawerProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(PROFILE_TEXTS.CHANGE_PASSWORD_ERROR_MISMATCH);
      return;
    }

    if (newPassword.length < 6) {
      setError(PROFILE_TEXTS.CHANGE_PASSWORD_ERROR_MIN_LENGTH);
      return;
    }

    await onSubmit(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleSubmit,
  };
};
