import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Address } from '@/store/useAuthStore';
import { fetchViaCEP, formatCEP } from '@/shared/utils';
import { addressSchema, AddressFormData } from '../schemas/address.schema';

interface UseAddressFormDrawerProps {
  isOpen: boolean;
  address?: Address | null;
  onSave: (address: Address) => void;
}

export const useAddressFormDrawer = ({
  isOpen,
  address,
  onSave,
}: UseAddressFormDrawerProps) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        zipCode: address?.zipCode || '',
        street: address?.street || '',
        number: address?.number || '',
        complement: address?.complement || '',
        neighborhood: address?.neighborhood || '',
        city: address?.city || '',
        state: address?.state || '',
        isPrimary: address?.isPrimary || false,
      });
    }
  }, [isOpen, address, form]);

  const handleZipCodeChange = async (rawVal: string) => {
    const formatted = formatCEP(rawVal);
    form.setValue('zipCode', formatted, { shouldValidate: true });

    const cleanZip = rawVal.replace(/\D/g, '');
    if (cleanZip.length === 8) {
      setIsLoadingCep(true);
      try {
        const cepData = await fetchViaCEP(cleanZip);
        if (cepData) {
          form.setValue('zipCode', formatted, { shouldValidate: true });
          if (cepData.logradouro) form.setValue('street', cepData.logradouro, { shouldValidate: true });
          if (cepData.bairro) form.setValue('neighborhood', cepData.bairro, { shouldValidate: true });
          if (cepData.localidade) form.setValue('city', cepData.localidade, { shouldValidate: true });
          if (cepData.uf) form.setValue('state', cepData.uf, { shouldValidate: true });
        }
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleSubmit = form.handleSubmit((data: AddressFormData) => {
    onSave({
      ...(address?._id ? { _id: address._id } : {}),
      zipCode: data.zipCode,
      street: data.street,
      number: data.number,
      complement: data.complement || '',
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      isPrimary: Boolean(data.isPrimary),
    } as Address);
  });

  return {
    form,
    isLoadingCep,
    handleZipCodeChange,
    handleSubmit,
  };
};
