import { UseFormReturn } from 'react-hook-form';
import { RegisterForm } from '../../schemas';
import { AUTH_TEXTS } from '../../constants';
import { LayoutContainer } from '@/shared/ui/components/LayoutContainer';
import { Input } from '@/shared/ui/components/Input';
import { MaskedInput } from '@/shared/ui/components/MaskedInput';
import { ImageCropper } from '@/shared/ui/components/ImageCropper';

export interface RegisterStep1Props {
  form: UseFormReturn<RegisterForm>;
  setAvatarBlob: (blob: Blob | null) => void;
}

export const RegisterStep1 = ({ form, setAvatarBlob }: RegisterStep1Props) => {
  const { register, formState: { errors } } = form;

  return (
    <LayoutContainer className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <LayoutContainer className="flex justify-center mb-6">
        <ImageCropper 
          onCropSave={(blob) => setAvatarBlob(blob)} 
          onImageRemove={() => setAvatarBlob(null)} 
        />
      </LayoutContainer>
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input label={AUTH_TEXTS.REGISTER_FIRST_NAME_LABEL} placeholder="João" {...register('firstName')} error={errors.firstName?.message} />
        <Input label={AUTH_TEXTS.REGISTER_LAST_NAME_LABEL} placeholder="Silva" {...register('lastName')} error={errors.lastName?.message} />
      </LayoutContainer>
      <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MaskedInput label={AUTH_TEXTS.REGISTER_CPF_LABEL} mask="000.000.000-00" placeholder="000.000.000-00" {...register('cpf')} error={errors.cpf?.message} />
        <Input label={AUTH_TEXTS.REGISTER_BIRTH_DATE_LABEL} type="date" className="[color-scheme:dark]" {...register('birthDate')} error={errors.birthDate?.message} />
      </LayoutContainer>
    </LayoutContainer>
  );
};
