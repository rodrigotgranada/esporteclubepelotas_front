import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RegisterForm } from '../../schemas';
import { AUTH_TEXTS } from '../../constants';
import { LayoutContainer, Title, Text, Button, EmailInput, MaskedInput, Checkbox } from '@/shared/ui/components';

export interface RegisterStep2Props {
  form: UseFormReturn<RegisterForm>;
  phonesArray: UseFieldArrayReturn<RegisterForm, 'phones', 'id'>;
  removePhone: (index: number) => void;
}

export const RegisterStep2 = ({ form, phonesArray, removePhone }: RegisterStep2Props) => {
  const { register, formState: { errors } } = form;

  return (
    <LayoutContainer className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <EmailInput label={AUTH_TEXTS.REGISTER_EMAIL_LABEL} placeholder="torcedor@email.com" {...register('email')} error={errors.email?.message} />
      
      <LayoutContainer className="space-y-4 pt-4 border-t border-white/10">
        <LayoutContainer className="flex items-center justify-between">
          <Title level="h3" className="text-sm font-bold text-gray-200">{AUTH_TEXTS.REGISTER_PHONE_SECTION_TITLE}</Title>
          <Button variant="ghost" size="sm" onClick={() => phonesArray.append({ number: '', isWhatsapp: false, isPrimary: false })} className="text-yellow-400">
            <Plus size={14} /> {AUTH_TEXTS.REGISTER_ADD_PHONE_BUTTON}
          </Button>
        </LayoutContainer>

        {phonesArray.fields.map((field, index) => (
          <LayoutContainer key={field.id} className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 relative">
            {phonesArray.fields.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removePhone(index)} className="absolute top-3 right-3 text-gray-500 hover:text-yellow-500">
                <Trash2 size={16} />
              </Button>
            )}
            <MaskedInput mask="(00) 00000-0000" placeholder="(00) 00000-0000" {...register(`phones.${index}.number` as const)} error={errors.phones?.[index]?.number?.message} />
            <LayoutContainer className="flex items-center gap-6">
              <Checkbox
                label={AUTH_TEXTS.REGISTER_WHATSAPP_LABEL}
                {...register(`phones.${index}.isWhatsapp` as const)}
              />
              <Checkbox
                label={AUTH_TEXTS.REGISTER_PRIMARY_LABEL}
                disabled={phonesArray.fields.length === 1}
                {...register(`phones.${index}.isPrimary` as const)}
                onChange={(e) => {
                  register(`phones.${index}.isPrimary`).onChange(e);
                  if (e.target.checked) {
                    phonesArray.fields.forEach((_, i) => {
                      if (i !== index) form.setValue(`phones.${i}.isPrimary`, false);
                    });
                  }
                }}
              />
            </LayoutContainer>
          </LayoutContainer>
        ))}
      </LayoutContainer>
    </LayoutContainer>
  );
};
