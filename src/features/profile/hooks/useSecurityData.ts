import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { deleteAccount, requestProfileChange, updatePassword, confirmFirebasePhone } from '@/services/profile.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { PROFILE_TEXTS } from '@/features/profile/constants';

export const useSecurityData = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [contactDrawerState, setContactDrawerState] = useState<{isOpen: boolean, type: 'email'|'phone'}>({ isOpen: false, type: 'email' });
  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async (password: string) => {
    try {
      setIsDeleting(true);
      await deleteAccount(password);
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const openContactDrawer = (type: 'email' | 'phone') => {
    setContactDrawerState({ isOpen: true, type });
  };

  const closeContactDrawer = () => {
    setContactDrawerState({ ...contactDrawerState, isOpen: false });
  };

  const handleRequestChange = async (newValue: string, currentPassword: string) => {
    try {
      setIsLoading(true);
      const res = await requestProfileChange(contactDrawerState.type, newValue, currentPassword);
      toast.success(PROFILE_TEXTS.TOAST_REQUEST_CHANGE_SUCCESS);
      useAuthStore.getState().updateUser(res.user);
      closeContactDrawer();
    } catch (error: any) {
      toast.error(error.response?.data?.message || PROFILE_TEXTS.TOAST_REQUEST_CHANGE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    try {
      setIsLoading(true);
      await updatePassword(currentPass, newPass);
      toast.success(PROFILE_TEXTS.TOAST_UPDATE_PASSWORD_SUCCESS);
      setIsPasswordDrawerOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || PROFILE_TEXTS.TOAST_UPDATE_PASSWORD_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    handleDeleteAccount,
    contactDrawerState,
    openContactDrawer,
    closeContactDrawer,
    handleRequestChange,
    isPasswordDrawerOpen,
    setIsPasswordDrawerOpen,
    handleUpdatePassword,
    isLoading,
  };
};
