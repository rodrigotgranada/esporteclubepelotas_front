import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { confirmProfileChange } from '@/services/profile.service';
import { toast } from 'react-hot-toast';
import { PROFILE_TEXTS } from '@/features/profile/constants';

export interface PendingChangeFormData {
  code: string;
}

export const useChangesData = () => {
  const { user, updateUser } = useAuthStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, PendingChangeFormData>>({});

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: { code: value },
    }));
  };

  const getFormData = (id: string): PendingChangeFormData =>
    formData[id] || { code: '' };

  const handleConfirm = async (type: 'email' | 'phone', id: string) => {
    const data = formData[id];

    if (!data?.code) {
      toast.error(PROFILE_TEXTS.TOAST_CONFIRM_CHANGE_REQUIRED);
      return;
    }

    try {
      setLoadingId(id);
      const updatedUser = await confirmProfileChange(type, data.code);
      updateUser(updatedUser);
      const successMsg = type === 'email'
        ? PROFILE_TEXTS.TOAST_CONFIRM_CHANGE_EMAIL_SUCCESS
        : PROFILE_TEXTS.TOAST_CONFIRM_CHANGE_PHONE_SUCCESS;
      toast.success(successMsg);
    } catch (error: any) {
      toast.error(error.response?.data?.message || PROFILE_TEXTS.TOAST_CONFIRM_CHANGE_ERROR);
    } finally {
      setLoadingId(null);
    }
  };

  return {
    user,
    loadingId,
    getFormData,
    handleInputChange,
    handleConfirm,
  };
};
