import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RegisterForm } from '../../schemas';
import { AUTH_TEXTS } from '../../constants';
import { LayoutContainer  } from '@/shared/ui/components';
import { Title  } from '@/shared/ui/components';
import { Text  } from '@/shared/ui/components';
import { Button  } from '@/shared/ui/components';
import { EmailInput  } from '@/shared/ui/components';
import { MaskedInput  } from '@/shared/ui/components';

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
          <Title level="h3" className="text-sm font-bold text-gray-200">Telefones</Title>
          <Button onClick={() => phonesArray.append({ number: '', isWhatsapp: false, isPrimary: false })} className="text-xs text-yellow-400 flex items-center gap-1 hover:text-yellow-300">
            <Plus size={14} /> Adicionar Telefone
          </Button>
        </LayoutContainer>

        {phonesArray.fields.map((field, index) => (
          <LayoutContainer key={field.id} className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-3 relative">
            {phonesArray.fields.length > 1 && (
              <Button onClick={() => removePhone(index)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400">
                <Trash2 size={16} />
              </Button>
            )}
            <MaskedInput mask="(00) 00000-0000" placeholder="(00) 00000-0000" {...register(`phones.${index}.number` as const)} error={errors.phones?.[index]?.number?.message} />
            <LayoutContainer className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" {...register(`phones.${index}.isWhatsapp` as const)} className="w-4 h-4 rounded bg-black/50 border-white/20 text-yellow-400 focus:ring-yellow-400" />
                <Text as="span" className="text-sm text-gray-400 group-hover:text-white">WhatsApp</Text>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  {...register(`phones.${index}.isPrimary` as const)} 
                  disabled={phonesArray.fields.length === 1}
                  onChange={(e) => {
                    register(`phones.${index}.isPrimary`).onChange(e);
                    if (e.target.checked) {
                      phonesArray.fields.forEach((_, i) => {
                        if (i !== index) form.setValue(`phones.${i}.isPrimary`, false);
                      });
                    }
                  }}
                  className="w-4 h-4 rounded bg-black/50 border-white/20 text-yellow-400 focus:ring-yellow-400 disabled:opacity-50" 
                />
                <Text as="span" className="text-sm text-gray-400 group-hover:text-white">Principal</Text>
              </label>
            </LayoutContainer>
          </LayoutContainer>
        ))}
      </LayoutContainer>
    </LayoutContainer>
  );
};
