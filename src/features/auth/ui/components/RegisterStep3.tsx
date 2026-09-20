import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RegisterForm } from '../../schemas';
import { AUTH_TEXTS } from '../../constants';
import { LayoutContainer  } from '@/shared/ui/components';
import { Title  } from '@/shared/ui/components';
import { Text  } from '@/shared/ui/components';
import { Button  } from '@/shared/ui/components';
import { Input  } from '@/shared/ui/components';
import { MaskedInput  } from '@/shared/ui/components';

export interface RegisterStep3Props {
  form: UseFormReturn<RegisterForm>;
  addressesArray: UseFieldArrayReturn<RegisterForm, 'addresses', 'id'>;
  fetchAddress: (zipCode: string, index: number) => Promise<void>;
  removeAddress: (index: number) => void;
}

export const RegisterStep3 = ({ form, addressesArray, fetchAddress, removeAddress }: RegisterStep3Props) => {
  const { register, formState: { errors } } = form;

  return (
    <LayoutContainer className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <LayoutContainer className="flex items-center justify-between">
        <Title level="h3" className="text-sm font-bold text-gray-200">Endereços</Title>
        <Button onClick={() => addressesArray.append({ zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', isPrimary: false })} className="text-xs text-yellow-400 flex items-center gap-1 hover:text-yellow-300">
          <Plus size={14} /> Adicionar Endereço
        </Button>
      </LayoutContainer>

      {addressesArray.fields.map((field, index) => (
        <LayoutContainer key={field.id} className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-4 relative">
          {addressesArray.fields.length > 1 && (
            <Button onClick={() => removeAddress(index)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400">
              <Trash2 size={16} />
            </Button>
          )}
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <LayoutContainer className="sm:col-span-1">
              <MaskedInput mask="00000-000" placeholder="00000-000" label={AUTH_TEXTS.REGISTER_ZIP_CODE_LABEL} {...register(`addresses.${index}.zipCode` as const)} 
                onAccept={(val) => {
                  form.setValue(`addresses.${index}.zipCode`, val);
                  if(val.length === 9) fetchAddress(val, index);
                }}
                error={errors.addresses?.[index]?.zipCode?.message} 
              />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-2">
              <Input label={AUTH_TEXTS.REGISTER_STREET_LABEL} placeholder="Rua..." {...register(`addresses.${index}.street` as const)} error={errors.addresses?.[index]?.street?.message} />
            </LayoutContainer>
          </LayoutContainer>
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <LayoutContainer className="sm:col-span-1">
              <Input label={AUTH_TEXTS.REGISTER_NUMBER_LABEL} placeholder="123" {...register(`addresses.${index}.number` as const)} error={errors.addresses?.[index]?.number?.message} />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-1">
              <Input label="Complemento" placeholder="Apto 4" {...register(`addresses.${index}.complement` as const)} error={errors.addresses?.[index]?.complement?.message} />
            </LayoutContainer>
            <LayoutContainer className="sm:col-span-2">
              <Input label={AUTH_TEXTS.REGISTER_NEIGHBORHOOD_LABEL} placeholder="Centro" {...register(`addresses.${index}.neighborhood` as const)} error={errors.addresses?.[index]?.neighborhood?.message} />
            </LayoutContainer>
          </LayoutContainer>
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={AUTH_TEXTS.REGISTER_CITY_LABEL} placeholder="Cidade" {...register(`addresses.${index}.city` as const)} error={errors.addresses?.[index]?.city?.message} />
            <Input label={AUTH_TEXTS.REGISTER_STATE_LABEL} placeholder="Estado" {...register(`addresses.${index}.state` as const)} error={errors.addresses?.[index]?.state?.message} />
          </LayoutContainer>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              {...register(`addresses.${index}.isPrimary` as const)} 
              disabled={addressesArray.fields.length === 1} 
              onChange={(e) => {
                register(`addresses.${index}.isPrimary`).onChange(e);
                if (e.target.checked) {
                  addressesArray.fields.forEach((_, i) => {
                    if (i !== index) form.setValue(`addresses.${i}.isPrimary`, false);
                  });
                }
              }}
              className="w-4 h-4 rounded bg-black/50 border-white/20 text-yellow-400 focus:ring-yellow-400 disabled:opacity-50" 
            />
            <Text as="span" className="text-sm text-gray-400 group-hover:text-white">Endereço Principal</Text>
          </label>
        </LayoutContainer>
      ))}
    </LayoutContainer>
  );
};
