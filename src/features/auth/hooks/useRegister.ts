import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterForm } from '../schemas';
import { authRepository } from '../repositories';

export const useRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phones: [{ number: '', isWhatsapp: false, isPrimary: true }],
      addresses: [{ zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', isPrimary: true }],
    }
  });

  const fetchAddress = async (zipCode: string) => {
    try {
      const data = await authRepository.fetchViaCEP(zipCode);
      if (!data.erro) {
        form.setValue('addresses.0.street', data.logradouro);
        form.setValue('addresses.0.neighborhood', data.bairro);
        form.setValue('addresses.0.city', data.localidade);
        form.setValue('addresses.0.state', data.uf);
      }
    } catch (e) {
      // ignore
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
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
      await authRepository.register(data);
      setSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Ocorreu um erro ao realizar o cadastro.');
    }
  };

  return {
    form,
    currentStep,
    errorMsg,
    success,
    fetchAddress,
    nextStep,
    prevStep,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
