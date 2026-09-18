import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterForm } from '../schemas';
import { authRepository } from '../repositories';
import { useAuthStore } from '@/store/useAuthStore';

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '', lastName: '', cpf: '', birthDate: '', email: '', password: '', confirmPassword: '',
      phones: [{ number: '', isWhatsapp: false, isPrimary: true }],
      addresses: [{ zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', isPrimary: true }],
    }
  });

  const phonesArray = useFieldArray({ control: form.control, name: 'phones' });
  const addressesArray = useFieldArray({ control: form.control, name: 'addresses' });

  const fetchAddress = async (zipCode: string, index: number) => {
    try {
      const data = await authRepository.fetchViaCEP(zipCode);
      if (!data.erro) {
        form.setValue(`addresses.${index}.street` as const, data.logradouro);
        form.setValue(`addresses.${index}.neighborhood` as const, data.bairro);
        form.setValue(`addresses.${index}.city` as const, data.localidade);
        form.setValue(`addresses.${index}.state` as const, data.uf);
      }
    } catch {
      // ignore
    }
  };

  const removePhone = (index: number) => {
    const isRemovingPrimary = form.getValues(`phones.${index}.isPrimary`);
    phonesArray.remove(index);
    
    setTimeout(() => {
      const currentPhones = form.getValues('phones');
      if (currentPhones.length === 1 || isRemovingPrimary) {
        if (currentPhones.length > 0) {
          form.setValue('phones.0.isPrimary', true);
        }
      }
    }, 0);
  };

  const removeAddress = (index: number) => {
    const isRemovingPrimary = form.getValues(`addresses.${index}.isPrimary`);
    addressesArray.remove(index);
    
    setTimeout(() => {
      const currentAddresses = form.getValues('addresses');
      if (currentAddresses.length === 1 || isRemovingPrimary) {
        if (currentAddresses.length > 0) {
          form.setValue('addresses.0.isPrimary', true);
        }
      }
    }, 0);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterForm)[] = [];
    if (currentStep === 1) fieldsToValidate = ['firstName', 'lastName', 'cpf', 'birthDate'];
    if (currentStep === 2) fieldsToValidate = ['email', 'phones'];
    if (currentStep === 3) fieldsToValidate = ['addresses'];

    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = async (data: RegisterForm) => {
    setErrorMsg('');
    try {
      const payload = {
        ...data,
        // Garante que se houver 1 telefone/endereço, ele é principal
        phones: data.phones.map((p) => ({ ...p, isPrimary: data.phones.length === 1 ? true : p.isPrimary })),
        addresses: data.addresses.map((a) => ({ ...a, isPrimary: data.addresses.length === 1 ? true : a.isPrimary })),
      };

      // 1. Cadastra o usuário no banco (sem a foto)
      await authRepository.register(payload as unknown as RegisterForm);

      // 2. Faz o login automático para resgatar o JWT token
      const loginResponse = await authRepository.login({ email: data.email, password: data.password });
      setAuth(loginResponse.accessToken, loginResponse.user);

      // 3. Se houver foto, envia ela usando o token (agora o backend sabe o ID)
      if (avatarBlob) {
        try {
          await authRepository.uploadAvatar(avatarBlob);
        } catch (uploadError) {
          console.error('Falha ao enviar foto de perfil', uploadError);
          // Não vamos travar o fluxo se apenas a foto falhar
        }
      }

      setSuccess(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMsg(err.response?.data?.message || 'Ocorreu um erro ao realizar o cadastro.');
    }
  };

  return {
    form,
    phonesArray,
    addressesArray,
    currentStep,
    errorMsg,
    success,
    avatarBlob,
    setAvatarBlob,
    fetchAddress,
    removePhone,
    removeAddress,
    nextStep,
    prevStep,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
