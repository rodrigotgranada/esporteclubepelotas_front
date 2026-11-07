import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { updatePassword } from '@/services/profile.service';
import { CHANGE_TEMPORARY_PASSWORD_TEXTS } from '../constants/change-temporary-password.constants';
import {
  changeTemporaryPasswordSchema,
  ChangeTemporaryPasswordForm,
} from '../schemas/auth.schemas';

export const useChangeTemporaryPassword = () => {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangeTemporaryPasswordForm>({
    resolver: zodResolver(changeTemporaryPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data: ChangeTemporaryPasswordForm) => {
    try {
      setIsLoading(true);
      await updatePassword(data.currentPassword, data.newPassword);
      updateUser({ mustChangePassword: false });
      toast.success(CHANGE_TEMPORARY_PASSWORD_TEXTS.TOAST_SUCCESS);

      const roleName = typeof user?.role === 'object' ? user?.role?.name : user?.role;
      if (roleName === 'ADMIN' || roleName === 'OWNER') {
        router.push('/gestao');
      } else {
        router.push('/profile');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || CHANGE_TEMPORARY_PASSWORD_TEXTS.TOAST_ERROR_GENERIC;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  });

  return {
    form,
    isLoading,
    handleSubmit,
    logout,
    router,
  };
};

