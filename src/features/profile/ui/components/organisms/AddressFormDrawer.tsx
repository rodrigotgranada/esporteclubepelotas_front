import React from 'react';
import { Drawer, Input, Button, LayoutContainer, Checkbox, Form } from '@/shared/ui/components';
import { Address } from '@/store/useAuthStore';
import { PROFILE_TEXTS } from '../../../constants';
import { useAddressFormDrawer } from '@/features/profile/hooks/useAddressFormDrawer';

interface AddressFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
  onSave: (address: Address) => void;
}

export const AddressFormDrawer = ({ isOpen, onClose, address, onSave }: AddressFormDrawerProps) => {
  const { formData, updateField, handleSubmit } = useAddressFormDrawer({ isOpen, address, onSave });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={address ? PROFILE_TEXTS.ADDRESSES_EDIT_TITLE : PROFILE_TEXTS.ADDRESSES_ADD_TITLE}
    >
      <Form onSubmit={handleSubmit} className="flex flex-col h-full">
        <LayoutContainer className="flex-1 space-y-4">
          <Input
            label={PROFILE_TEXTS.ADDRESSES_ZIPCODE}
            value={formData.zipCode || ''}
            onChange={e => updateField('zipCode', e.target.value)}
            required
          />
          <Input
            label={PROFILE_TEXTS.ADDRESSES_FORM_STREET}
            value={formData.street || ''}
            onChange={e => updateField('street', e.target.value)}
            required
          />
          <LayoutContainer className="grid grid-cols-2 gap-4">
            <Input
              label={PROFILE_TEXTS.ADDRESSES_FORM_NUMBER}
              value={formData.number || ''}
              onChange={e => updateField('number', e.target.value)}
              required
            />
            <Input
              label={PROFILE_TEXTS.ADDRESSES_FORM_COMPLEMENT}
              value={formData.complement || ''}
              onChange={e => updateField('complement', e.target.value)}
            />
          </LayoutContainer>
          <Input
            label={PROFILE_TEXTS.ADDRESSES_NEIGHBORHOOD}
            value={formData.neighborhood || ''}
            onChange={e => updateField('neighborhood', e.target.value)}
            required
          />
          <LayoutContainer className="grid grid-cols-2 gap-4">
            <Input
              label={PROFILE_TEXTS.ADDRESSES_FORM_CITY}
              value={formData.city || ''}
              onChange={e => updateField('city', e.target.value)}
              required
            />
            <Input
              label={PROFILE_TEXTS.ADDRESSES_FORM_STATE}
              value={formData.state || ''}
              onChange={e => updateField('state', e.target.value)}
              required
            />
          </LayoutContainer>
          <LayoutContainer className="mt-4">
            <Checkbox
              label={PROFILE_TEXTS.ADDRESSES_FORM_PRIMARY}
              checked={formData.isPrimary || false}
              onChange={e => updateField('isPrimary', e.target.checked)}
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="mt-8 pt-6 border-t border-white/10 flex gap-3">
          <Button type="button" variant="outline" size="md" className="flex-1" onClick={onClose}>
            {PROFILE_TEXTS.ADDRESSES_BUTTON_CANCEL}
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1">
            {PROFILE_TEXTS.ADDRESSES_BUTTON_SAVE}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
