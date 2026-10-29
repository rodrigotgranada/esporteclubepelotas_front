import React from 'react';
import { Drawer, Input, PasswordInput, Button, LayoutContainer, Form, Text, Accordion, PhoneInput, CpfInput, Select, Option, Checkbox, IconButton, ImageCropper } from '@/shared/ui/components';
import { ConfirmModal } from '@/shared/ui/components/molecules/ConfirmModal';
import { UserAdminData } from '@/features/admin/services/admin.service';
import { useUserAdminDrawer } from '../../../hooks/users/useUserAdminDrawer';
import { useAuthStore } from '@/store/useAuthStore';
import { ADMIN_TEXTS, USER_STATUS_MAP } from '../../../constants/admin.constants';
import { USER_ADMIN_DRAWER_TEXTS } from './UserAdminDrawer.constants';
import { Plus, Trash2 } from 'lucide-react';

interface UserAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAdminData | null;
  onSaveSuccess: () => void;
}

export const UserAdminDrawer = ({ isOpen, onClose, user, onSaveSuccess }: UserAdminDrawerProps) => {
  const { user: currentUser } = useAuthStore();
  const currentUserRole = currentUser?.role?.name || currentUser?.role || 'ADMIN';

  const {
    formData, updateField,
    addPhone, updatePhone, removePhone,
    addAddress, updateAddress, removeAddress,
    avatarFile, setAvatarFile,
    isLoading, handleSubmit,
    confirmModal, setConfirmModal, executeConfirmedAction, getModalConfig,
    availableRoles
  } = useUserAdminDrawer(user, onClose, onSaveSuccess);

  const handleFormSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModal({ isOpen: true, type: 'save' });
  };

  const modalConfig = getModalConfig();

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={user ? ADMIN_TEXTS.USER_DRAWER_TITLE_EDIT : ADMIN_TEXTS.USER_DRAWER_TITLE_CREATE}
        size="xl"
      >
        <Form onSubmit={handleFormSubmitClick} className="flex flex-col h-full mt-4">
          <LayoutContainer className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.PERSONAL_DATA} defaultOpen={true}>
              <LayoutContainer className="flex flex-col items-center mb-6">
                <ImageCropper
                  initialImage={avatarFile ? URL.createObjectURL(avatarFile) : (user?.avatarUrl || null)}
                  onCropSave={(blob) => {
                    const file = new File([blob], 'avatar.png', { type: blob.type || 'image/png' });
                    setAvatarFile(file);
                  }}
                  onImageRemove={() => {
                    setAvatarFile(null);
                    updateField('avatarUrl', '');
                  }}
                />
                <Text className="text-xs text-text-secondary mt-2">
                  {user ? USER_ADMIN_DRAWER_TEXTS.LABELS.CLICK_TO_CHANGE_PHOTO : USER_ADMIN_DRAWER_TEXTS.LABELS.UPLOAD_PHOTO_HINT}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.FIRST_NAME} value={formData.firstName || ''} onChange={e => updateField('firstName', e.target.value)} required />
                <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.LAST_NAME} value={formData.lastName || ''} onChange={e => updateField('lastName', e.target.value)} required />
              </LayoutContainer>
              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <CpfInput label={USER_ADMIN_DRAWER_TEXTS.LABELS.CPF} value={formData.cpf || ''} onChange={e => updateField('cpf', e.target.value)} required disabled={!!user} />
                <Input type="date" label={USER_ADMIN_DRAWER_TEXTS.LABELS.BIRTH_DATE} value={formData.birthDate || ''} onChange={e => updateField('birthDate', e.target.value)} required />
              </LayoutContainer>
              <Input type="email" label={USER_ADMIN_DRAWER_TEXTS.LABELS.EMAIL} value={formData.email || ''} onChange={e => updateField('email', e.target.value)} required disabled={!!user && currentUserRole !== 'OWNER'} />
            </Accordion>

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.PHONES}>
              {formData.phones?.map((phone, idx) => (
                <LayoutContainer key={idx} className="bg-surface p-4 rounded-xl mb-4 relative border border-border">
                  <IconButton icon={<Trash2 size={18} />} variant="ghost" onClick={() => removePhone(idx)} className="absolute top-2 right-2 text-text-secondary hover:text-error" />
                  <PhoneInput label={USER_ADMIN_DRAWER_TEXTS.LABELS.PHONE(idx)} value={phone.number} onChange={e => updatePhone(idx, 'number', e.target.value)} required />
                  <LayoutContainer className="flex items-center gap-6 mt-3">
                    <Checkbox label={USER_ADMIN_DRAWER_TEXTS.LABELS.IS_WHATSAPP} checked={phone.isWhatsapp || false} onChange={e => updatePhone(idx, 'isWhatsapp', e.target.checked)} />
                    <Checkbox label={USER_ADMIN_DRAWER_TEXTS.LABELS.IS_PRIMARY_PHONE} checked={phone.isPrimary || false} onChange={e => updatePhone(idx, 'isPrimary', e.target.checked)} />
                  </LayoutContainer>
                </LayoutContainer>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addPhone} className="w-full flex items-center justify-center gap-2 border-secondary/30 text-secondary hover:bg-secondary/10">
                <Plus size={16} />
                {USER_ADMIN_DRAWER_TEXTS.BUTTONS.ADD_PHONE}
              </Button>
            </Accordion>

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.ADDRESSES}>
              {formData.addresses?.map((address, idx) => (
                <LayoutContainer key={idx} className="bg-surface p-4 rounded-xl mb-4 relative border border-border space-y-3">
                  <IconButton icon={<Trash2 size={18} />} variant="ghost" onClick={() => removeAddress(idx)} className="absolute top-2 right-2 text-text-secondary hover:text-error" />
                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.ZIP_CODE} value={address.zipCode} onChange={e => updateAddress(idx, 'zipCode', e.target.value)} required />
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.CITY} value={address.city} onChange={e => updateAddress(idx, 'city', e.target.value)} required />
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.STATE} value={address.state} onChange={e => updateAddress(idx, 'state', e.target.value)} required />
                  </LayoutContainer>
                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.STREET} value={address.street} onChange={e => updateAddress(idx, 'street', e.target.value)} required className="sm:col-span-2" />
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.NUMBER} value={address.number} onChange={e => updateAddress(idx, 'number', e.target.value)} required />
                  </LayoutContainer>
                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.NEIGHBORHOOD} value={address.neighborhood} onChange={e => updateAddress(idx, 'neighborhood', e.target.value)} required />
                    <Input label={USER_ADMIN_DRAWER_TEXTS.LABELS.COMPLEMENT} value={address.complement || ''} onChange={e => updateAddress(idx, 'complement', e.target.value)} />
                  </LayoutContainer>
                  <Checkbox label={USER_ADMIN_DRAWER_TEXTS.LABELS.IS_PRIMARY_ADDRESS} checked={address.isPrimary || false} onChange={e => updateAddress(idx, 'isPrimary', e.target.checked)} />
                </LayoutContainer>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAddress} className="w-full flex items-center justify-center gap-2 border-secondary/30 text-secondary hover:bg-secondary/10">
                <Plus size={16} />
                {USER_ADMIN_DRAWER_TEXTS.BUTTONS.ADD_ADDRESS}
              </Button>
            </Accordion>

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.ACCESS_STATUS}>
              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <LayoutContainer>
                  <Select
                    label={USER_ADMIN_DRAWER_TEXTS.LABELS.ROLE}
                    value={formData.role || ''}
                    onChange={e => updateField('role', e.target.value)}
                    disabled={currentUserRole !== 'OWNER' && (formData.role === 'OWNER' || formData.role === availableRoles.find(r => r.name === 'OWNER')?._id)}
                  >
                    {availableRoles.map((r: any) => {
                      const isOwnerRole = r.name === 'OWNER';
                      const canAssign = currentUserRole === 'OWNER' || !isOwnerRole;
                      if (!canAssign) return null;
                      return (
                        <Option key={r._id || r.name} value={r._id || r.name}>
                          {r.label || r.name}
                        </Option>
                      );
                    })}
                  </Select>
                </LayoutContainer>

                <LayoutContainer>
                  <Select
                    label={USER_ADMIN_DRAWER_TEXTS.LABELS.STATUS}
                    value={formData.status || 'ACTIVE'}
                    onChange={e => updateField('status', e.target.value)}
                  >
                    <Option value="ACTIVE">{USER_STATUS_MAP.ACTIVE}</Option>
                    <Option value="BLOCKED">{USER_STATUS_MAP.BLOCKED}</Option>
                  </Select>
                </LayoutContainer>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 mb-4">
                <PasswordInput
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD}
                  placeholder={user ? USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD_PLACEHOLDER_EDIT : USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD_PLACEHOLDER_CREATE}
                  value={formData.password || ''}
                  onChange={e => updateField('password', e.target.value)}
                  required={!user}
                />
                <PasswordInput
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.CONFIRM_PASSWORD}
                  placeholder={USER_ADMIN_DRAWER_TEXTS.LABELS.CONFIRM_PASSWORD_PLACEHOLDER}
                  value={formData.confirmPassword || ''}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                  required={!!formData.password}
                />
              </LayoutContainer>
            </Accordion>

            {user && (
              <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.ADMIN_ACTIONS}>
                <LayoutContainer className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-secondary/30 text-secondary hover:bg-secondary/10"
                    onClick={() => setConfirmModal({ isOpen: true, type: 'resendEmail' })}
                  >
                    {USER_ADMIN_DRAWER_TEXTS.BUTTONS.RESEND_EMAIL}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-secondary/30 text-secondary hover:bg-secondary/10"
                    onClick={() => setConfirmModal({ isOpen: true, type: 'resetPassword' })}
                  >
                    {USER_ADMIN_DRAWER_TEXTS.BUTTONS.RESET_PASSWORD}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-error/50 text-error hover:bg-error/10"
                    onClick={() => setConfirmModal({ isOpen: true, type: 'delete' })}
                  >
                    {USER_ADMIN_DRAWER_TEXTS.BUTTONS.DELETE_USER}
                  </Button>
                </LayoutContainer>
              </Accordion>
            )}

          </LayoutContainer>

          <LayoutContainer className="mt-6 pt-6 border-t border-border flex gap-3">
            <Button type="button" variant="outline" size="md" className="flex-1" onClick={onClose}>
              {ADMIN_TEXTS.USER_DRAWER_BUTTON_CANCEL}
            </Button>
            <Button type="submit" variant="primary" size="md" className="flex-1" isLoading={isLoading}>
              {ADMIN_TEXTS.USER_DRAWER_BUTTON_SAVE}
            </Button>
          </LayoutContainer>
        </Form>
      </Drawer>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={executeConfirmedAction}
        title={modalConfig.title}
        description={modalConfig.description}
        variant={modalConfig.variant}
        isLoading={isLoading}
      />
    </>
  );
};
