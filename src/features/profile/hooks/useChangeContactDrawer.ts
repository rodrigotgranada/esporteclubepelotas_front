import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/useAuthStore';
import {
  changeContactSchema,
  ChangeContactFormData,
} from '../schemas/change-contact.schema';

interface UseChangeContactDrawerProps {
  isOpen: boolean;
  type: 'email' | 'phone';
  onSubmit: (newValue: string, currentPassword: string) => Promise<boolean | void>;
  isLoading: boolean;
}

export const useChangeContactDrawer = ({
  isOpen,
  type,
  onSubmit,
  isLoading,
}: UseChangeContactDrawerProps) => {
  const user = useAuthStore((state) => state.user);

  const form = useForm<ChangeContactFormData>({
    resolver: zodResolver(changeContactSchema),
    defaultValues: {
      newValue: '',
      currentPassword: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset({ newValue: '', currentPassword: '' });
    } else {
      let initial = '';
      if (type === 'email' && !user?.emailVerified) {
        initial = user?.email || '';
      } else if (
        type === 'phone' &&
        user?.phones &&
        user.phones.length > 0 &&
        !user.phones[0].isVerified
      ) {
        initial = user.phones[0].number || '';
      }
      form.reset({
        newValue: initial,
        currentPassword: '',
      });
    }
  }, [isOpen, type, user, form]);

  const handleSubmit = form.handleSubmit(async (data: ChangeContactFormData) => {
    if (isLoading) return;
    const succeeded = await onSubmit(data.newValue, data.currentPassword);
    if (succeeded !== false) {
      form.reset({ newValue: '', currentPassword: '' });
    }
  });

  return {
    form,
    handleSubmit,
  };
};
