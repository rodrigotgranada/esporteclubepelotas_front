import { useState } from 'react';
import { useAuthStore, Address } from '@/store/useAuthStore';
import { updateProfile } from '@/services/profile.service';

export const useAddressesData = () => {
  const { user, updateUser } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenDrawer = (address?: Address) => {
    setSelectedAddress(address || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAddress(null);
  };

  const handleSaveAddress = async (addressData: Address) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const addresses = [...(user.addresses || [])];
      
      if (addressData.isPrimary) {
        addresses.forEach(a => { a.isPrimary = false; });
      }

      if (selectedAddress) {
        // Edit
        const index = addresses.findIndex(a => a._id === selectedAddress._id || a === selectedAddress);
        if (index !== -1) {
          addresses[index] = { ...addressData };
        }
      } else {
        // Add
        if (addresses.length === 0) {
          addressData.isPrimary = true;
        }
        addresses.push(addressData);
      }

      const updatedUser = await updateProfile({ addresses });
      updateUser(updatedUser);
      handleCloseDrawer();
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressToDelete: Address) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const addresses = (user.addresses || []).filter(a => a._id !== addressToDelete._id && a !== addressToDelete);
      
      // If we deleted the primary address, make the first one primary (if any exists)
      if (addressToDelete.isPrimary && addresses.length > 0) {
        addresses[0].isPrimary = true;
      }

      const updatedUser = await updateProfile({ addresses });
      updateUser(updatedUser);
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setLoading(false);
    }
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
