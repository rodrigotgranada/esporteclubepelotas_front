import { useState, useEffect } from 'react';
import { Address } from '@/store/useAuthStore';
import { fetchViaCEP, formatCEP } from '@/shared/utils';

interface UseAddressFormDrawerProps {
  isOpen: boolean;
  address?: Address | null;
  onSave: (address: Address) => void;
}

export const useAddressFormDrawer = ({ isOpen, address, onSave }: UseAddressFormDrawerProps) => {
  const [formData, setFormData] = useState<Partial<Address>>({});
  const [isLoadingCep, setIsLoadingCep] = useState(false);

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

  const updateField = async (field: keyof Address, value: string | boolean) => {
    if (field === 'zipCode' && typeof value === 'string') {
      const formatted = formatCEP(value);
      setFormData(prev => ({ ...prev, zipCode: formatted }));

      const cleanZip = value.replace(/\D/g, '');
      if (cleanZip.length === 8) {
        setIsLoadingCep(true);
        try {
          const cepData = await fetchViaCEP(cleanZip);
          if (cepData) {
            setFormData(prev => ({
              ...prev,
              zipCode: formatted,
              street: cepData.logradouro || prev.street || '',
              neighborhood: cepData.bairro || prev.neighborhood || '',
              city: cepData.localidade || prev.city || '',
              state: cepData.uf || prev.state || '',
            }));
          }
        } finally {
          setIsLoadingCep(false);
        }
      }
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    isLoadingCep,
    updateField,
    handleSubmit,
  };
};
