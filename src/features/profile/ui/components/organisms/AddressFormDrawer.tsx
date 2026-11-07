import React from 'react';
import {
  Drawer,
  Input,
  Button,
  LayoutContainer,
  Checkbox,
  Form,
  FormField,
} from '@/shared/ui/components';
import { Address } from '@/store/useAuthStore';
import { PROFILE_TEXTS } from '../../../constants';
import { useAddressFormDrawer } from '@/features/profile/hooks/useAddressFormDrawer';

interface AddressFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
  onSave: (address: Address) => void | Promise<void>;
  isLoading?: boolean;
}

export const AddressFormDrawer = ({
  isOpen,
  onClose,
  address,
  onSave,
  isLoading = false,
}: AddressFormDrawerProps) => {
  const { form, isLoadingCep, handleZipCodeChange, handleSubmit } =
    useAddressFormDrawer({ isOpen, address, onSave });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      title={address ? PROFILE_TEXTS.ADDRESSES_EDIT_TITLE : PROFILE_TEXTS.ADDRESSES_ADD_TITLE}
    >
      <Form onSubmit={handleSubmit} className="flex flex-col h-full">
        <LayoutContainer className="flex-1 space-y-4">
          <FormField
            name="zipCode"
            control={form.control}
            label={PROFILE_TEXTS.ADDRESSES_ZIPCODE}
            required
            render={({ field }) => (
              <Input
                {...field}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                placeholder="00000-000"
                disabled={isLoadingCep}
              />
            )}
          />

          <FormField
            name="street"
            control={form.control}
            label={PROFILE_TEXTS.ADDRESSES_FORM_STREET}
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nome da rua / avenida"
              />
            )}
          />

          <LayoutContainer className="grid grid-cols-2 gap-4">
            <FormField
              name="number"
              control={form.control}
              label={PROFILE_TEXTS.ADDRESSES_FORM_NUMBER}
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Número"
                />
              )}
            />
            <FormField
              name="complement"
              control={form.control}
              label={PROFILE_TEXTS.ADDRESSES_FORM_COMPLEMENT}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Apto, Bloco..."
                />
              )}
            />
          </LayoutContainer>

          <FormField
            name="neighborhood"
            control={form.control}
            label={PROFILE_TEXTS.ADDRESSES_NEIGHBORHOOD}
            required
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Bairro"
              />
            )}
          />

          <LayoutContainer className="grid grid-cols-2 gap-4">
            <FormField
              name="city"
              control={form.control}
              label={PROFILE_TEXTS.ADDRESSES_FORM_CITY}
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Cidade"
                />
              )}
            />
            <FormField
              name="state"
              control={form.control}
              label={PROFILE_TEXTS.ADDRESSES_FORM_STATE}
              required
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="UF"
                />
              )}
            />
          </LayoutContainer>

          <LayoutContainer className="mt-4">
            <FormField
              name="isPrimary"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  label={PROFILE_TEXTS.ADDRESSES_FORM_PRIMARY}
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="mt-8 pt-6 border-t border-white/10 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {PROFILE_TEXTS.ADDRESSES_BUTTON_CANCEL}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="flex-1"
            isLoading={isLoading}
          >
            {PROFILE_TEXTS.ADDRESSES_BUTTON_SAVE}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
