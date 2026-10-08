import { useState, useEffect } from 'react';
import { Address } from '@/store/useAuthStore';

interface UseAddressFormDrawerProps {
  isOpen: boolean;
  address?: Address | null;
  onSave: (address: Address) => void;
}

export const useAddressFormDrawer = ({ isOpen, address, onSave }: UseAddressFormDrawerProps) => {
  const [formData, setFormData] = useState<Partial<Address>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(address || {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isPrimary: false,
      });
    }
  }, [isOpen, address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Address);
  };

  const updateField = (field: keyof Address, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    handleSubmit,
  };
};
