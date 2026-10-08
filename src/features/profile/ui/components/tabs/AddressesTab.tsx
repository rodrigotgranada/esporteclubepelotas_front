import React, { useState } from 'react';
import { LayoutContainer, Title, Text, Button, ConfirmModal, Badge } from '@/shared/ui/components';
import { MapPin, Plus } from 'lucide-react';
import { PROFILE_TEXTS } from '../../../constants';
import { useAddressesData } from '../../../hooks/useAddressesData';
import { AddressFormDrawer } from '../organisms';

export const AddressesTab = () => {
  const { 
    user, 
    isDrawerOpen, 
    selectedAddress, 
    handleOpenDrawer, 
    handleCloseDrawer, 
    handleSaveAddress,
    handleDeleteAddress 
  } = useAddressesData();

  const [addressToDelete, setAddressToDelete] = useState<any>(null);

  if (!user) return null;
  return (
    <LayoutContainer className="animate-in fade-in duration-300">
      <LayoutContainer className="flex items-center justify-between mb-8">
        <LayoutContainer>
          <Title level="h2" className="text-xl font-bold text-text-primary flex items-center gap-2 mb-1">
            <MapPin size={24} className="text-primary" />
            {PROFILE_TEXTS.ADDRESSES_TITLE}
          </Title>
          <Text className="text-text-secondary text-sm">{PROFILE_TEXTS.ADDRESSES_DESCRIPTION}</Text>
        </LayoutContainer>
        <Button 
          variant="primary" 
          size="sm" 
          className="flex items-center gap-2 whitespace-nowrap"
          onClick={() => handleOpenDrawer()}
        >
          <Plus size={16} /> {PROFILE_TEXTS.ADDRESSES_ADD_BUTTON}
        </Button>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.addresses && user.addresses.length > 0 ? (
          user.addresses.map((address, index) => (
            <LayoutContainer key={address._id || index} className="bg-surface border border-primary/50 rounded-xl p-5 relative overflow-hidden">
              {address.isPrimary && (
                <Badge variant="primary" isAbsolute>
                  {PROFILE_TEXTS.ADDRESSES_BADGE_PRIMARY}
                </Badge>
              )}
              <Text className="text-text-primary font-bold mb-1 mt-2">
                {address.street}, {address.number}
              </Text>
              <Text className="text-text-secondary text-sm mb-4">
                {address.complement && <>{address.complement}<br /></>}
                {PROFILE_TEXTS.ADDRESSES_NEIGHBORHOOD} {address.neighborhood}, {address.city} - {address.state}<br />
                {PROFILE_TEXTS.ADDRESSES_ZIPCODE}: {address.zipCode}
              </Text>
              <LayoutContainer className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs py-1 h-auto px-3"
                  onClick={() => handleOpenDrawer(address)}
                >
                  {PROFILE_TEXTS.ADDRESSES_BUTTON_EDIT}
                </Button>
                {user.addresses && user.addresses.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 h-auto px-3 text-error hover:bg-error/10 border-error/30 hover:border-error/50"
                    onClick={() => setAddressToDelete(address)}
                  >
                    {PROFILE_TEXTS.ADDRESSES_BUTTON_DELETE}
                  </Button>
                )}
              </LayoutContainer>
            </LayoutContainer>
          ))
        ) : (
          <Text className="text-text-secondary col-span-2 text-center py-8 border border-dashed border-border rounded-xl">
            {PROFILE_TEXTS.ADDRESSES_EMPTY_MESSAGE}
          </Text>
        )}
      </LayoutContainer>

      <AddressFormDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        address={selectedAddress} 
        onSave={handleSaveAddress} 
      />

      <ConfirmModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={() => {
          if (addressToDelete) {
            handleDeleteAddress(addressToDelete);
            setAddressToDelete(null);
          }
        }}
        title="Excluir Endereço"
        description={PROFILE_TEXTS.ADDRESSES_CONFIRM_DELETE}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
      />
    </LayoutContainer>
  );
};
