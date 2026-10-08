import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface UseChangeContactDrawerProps {
  isOpen: boolean;
  type: 'email' | 'phone';
  onSubmit: (newValue: string, currentPassword: string) => Promise<void>;
  isLoading: boolean;
}

export const useChangeContactDrawer = ({ isOpen, type, onSubmit, isLoading }: UseChangeContactDrawerProps) => {
  const [newValue, setNewValue] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!isOpen) {
      setNewValue('');
      setCurrentPassword('');
    } else {
      if (type === 'email' && !user?.emailVerified) {
        setNewValue(user?.email || '');
      } else if (type === 'phone' && user?.phones && user.phones.length > 0 && !user.phones[0].isVerified) {
        setNewValue(user.phones[0].number || '');
      }
    }
  }, [isOpen, type, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newValue, currentPassword);
    if (!isLoading) {
      setNewValue('');
      setCurrentPassword('');
    }
  };

  return {
    newValue,
    setNewValue,
    currentPassword,
    setCurrentPassword,
    handleSubmit,
  };
};
