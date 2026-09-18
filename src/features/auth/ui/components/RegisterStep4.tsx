import { UseFormReturn } from 'react-hook-form';
import { RegisterForm } from '../../schemas';
import { AUTH_TEXTS } from '../../constants';
import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { PasswordInput } from '@/shared/ui/components/PasswordInput';

export interface RegisterStep4Props {
  form: UseFormReturn<RegisterForm>;
}

export const RegisterStep4 = ({ form }: RegisterStep4Props) => {
  const { register, formState: { errors } } = form;

  return (
    <LayoutContainer className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <PasswordInput label={AUTH_TEXTS.REGISTER_PASSWORD_LABEL} placeholder="••••••••" {...register('password')} error={errors.password?.message} />
      <PasswordInput label={AUTH_TEXTS.REGISTER_CONFIRM_PASSWORD_LABEL} placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
    </LayoutContainer>
  );
};
