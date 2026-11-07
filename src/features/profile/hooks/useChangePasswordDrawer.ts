import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from '../schemas/change-password.schema';

interface UseChangePasswordDrawerProps {
  isOpen: boolean;
  onSubmit: (current: string, newPass: string) => Promise<boolean | void>;
  isLoading?: boolean;
}

export const useChangePasswordDrawer = ({
  isOpen,
  onSubmit,
  isLoading,
}: UseChangePasswordDrawerProps) => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [isOpen, form]);

  const handleSubmit = form.handleSubmit(async (data: ChangePasswordFormData) => {
    if (isLoading) return;
    const succeeded = await onSubmit(data.currentPassword, data.newPassword);
    if (succeeded !== false) {
      form.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  });

  return {
    form,
    handleSubmit,
  };
};
