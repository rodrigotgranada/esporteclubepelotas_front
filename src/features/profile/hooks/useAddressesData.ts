import { useState } from 'react';
import { useAuthStore, Address, User } from '@/store/useAuthStore';
import { updateProfile } from '@/services/profile.service';
import { toast } from 'react-hot-toast';
import { PROFILE_TEXTS } from '../constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';

export const useAddressesData = () => {
  const { user, updateUser } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { isSaving: loading, runTransactionalSave } = useTransactionalSave();

  const handleOpenDrawer = (address?: Address) => {
    setSelectedAddress(address || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (loading) return;
    setIsDrawerOpen(false);
    setSelectedAddress(null);
  };

  const handleSaveAddress = async (addressData: Address) => {
    if (!user) return;

    const addresses = (user.addresses || []).map((a) => ({ ...a }));
    const nextAddress = { ...addressData };

    if (nextAddress.isPrimary) {
      addresses.forEach((a) => {
        a.isPrimary = false;
      });
    }

    if (selectedAddress) {
      const index = addresses.findIndex(
        (a) =>
          (a._id && selectedAddress._id && a._id === selectedAddress._id) ||
          (a.zipCode === selectedAddress.zipCode &&
            a.street === selectedAddress.street &&
            a.number === selectedAddress.number),
      );
      if (index !== -1) {
        addresses[index] = nextAddress;
      } else {
        addresses.push(nextAddress);
      }
    } else {
      if (addresses.length === 0) {
        nextAddress.isPrimary = true;
      }
      addresses.push(nextAddress);
    }

    await runTransactionalSave<void, User>({
      hasPendingMedia: false,
      saveToDb: async () => updateProfile({ addresses }),
      onConfirmed: (updatedUser) => {
        updateUser(updatedUser);
        setIsDrawerOpen(false);
        setSelectedAddress(null);
        toast.success(PROFILE_TEXTS.TOAST_ADDRESS_SAVE_SUCCESS);
      },
      onError: (error: any) => {
        console.error('Failed to save address:', error);
        toast.error(error?.response?.data?.message || PROFILE_TEXTS.TOAST_ADDRESS_SAVE_ERROR);
      },
    });
  };

  const handleDeleteAddress = async (addressToDelete: Address): Promise<boolean> => {
    if (!user) return false;

    const addresses = (user.addresses || [])
      .filter((a) => {
        if (a._id && addressToDelete._id) return a._id !== addressToDelete._id;
        return a !== addressToDelete;
      })
      .map((a) => ({ ...a }));

    if (addressToDelete.isPrimary && addresses.length > 0) {
      addresses[0].isPrimary = true;
    }

    let ok = false;
    await runTransactionalSave<void, User>({
      hasPendingMedia: false,
      saveToDb: async () => updateProfile({ addresses }),
      onConfirmed: (updatedUser) => {
        ok = true;
        updateUser(updatedUser);
        toast.success(PROFILE_TEXTS.TOAST_ADDRESS_DELETE_SUCCESS);
      },
      onError: (error: any) => {
        console.error('Failed to delete address:', error);
        toast.error(error?.response?.data?.message || PROFILE_TEXTS.TOAST_ADDRESS_DELETE_ERROR);
      },
    });
    return ok;
  };

  return {
    user,
    loading,
    isDrawerOpen,
    selectedAddress,
    handleOpenDrawer,
    handleCloseDrawer,
    handleSaveAddress,
    handleDeleteAddress,
  };
};
