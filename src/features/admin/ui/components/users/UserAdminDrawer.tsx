import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Drawer,
  Input,
  PasswordInput,
  Button,
  LayoutContainer,
  Form,
  Text,
  Accordion,
  PhoneInput,
  CpfInput,
  Select,
  Option,
  Checkbox,
  IconButton,
  ImageCropper,
  PasswordStrengthMeter,
  FormField,
} from '@/shared/ui/components';
import { ConfirmModal } from '@/shared/ui/components/molecules/ConfirmModal';
import { UserAdminData } from '@/features/admin/services/admin.service';
import { useUserAdminDrawer } from '../../../hooks/users/useUserAdminDrawer';
import { useAuthStore } from '@/store/useAuthStore';
import { ADMIN_TEXTS, USER_STATUS_MAP, ROLE_HIERARCHY } from '../../../constants/admin.constants';
import { USER_ADMIN_DRAWER_TEXTS } from './UserAdminDrawer.constants';
import { Plus, Trash2, Sparkles, Copy } from 'lucide-react';

interface UserAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAdminData | null;
  onSaveSuccess: () => void;
}

export const UserAdminDrawer = ({ isOpen, onClose, user, onSaveSuccess }: UserAdminDrawerProps) => {
  const { user: currentUser } = useAuthStore();
  const currentUserRole: string = (typeof currentUser?.role === 'object' ? currentUser?.role?.name : currentUser?.role) || 'ADMIN';
  const isSelf = !!(user && currentUser && (user.id === currentUser._id || user.id === (currentUser as any).id || (user as any)._id === currentUser._id));

  const {
    form,
    addPhone,
    updatePhone,
    removePhone,
    addAddress,
    updateAddress,
    removeAddress,
    avatarFile,
    setAvatarFile,
    isLoading,
    handleSubmit,
    handleGenerateTemporaryPassword,
    handleCopyPassword,
    confirmModal,
    setConfirmModal,
    executeConfirmedAction,
    getModalConfig,
    availableRoles,
  } = useUserAdminDrawer(user, onClose, onSaveSuccess);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentRole = watch('role');
  const currentStatus = watch('status');
  const currentPassword = watch('password');
  const phones = watch('phones') || [];
  const addresses = watch('addresses') || [];

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
                    setValue('avatarUrl', '');
                  }}
                />
                <Text as="p" className="text-xs text-text-secondary mt-2">
                  {user ? USER_ADMIN_DRAWER_TEXTS.LABELS.CLICK_TO_CHANGE_PHOTO : USER_ADMIN_DRAWER_TEXTS.LABELS.UPLOAD_PHOTO_HINT}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.FIRST_NAME}
                  error={errors.firstName?.message}
                >
                  <Input
                    {...register('firstName')}
                  />
                </FormField>

                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.LAST_NAME}
                  error={errors.lastName?.message}
                >
                  <Input
                    {...register('lastName')}
                  />
                </FormField>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.CPF}
                  error={errors.cpf?.message}
                >
                  <CpfInput
                    {...register('cpf')}
                    disabled={!!user}
                  />
                </FormField>

                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.BIRTH_DATE}
                  error={errors.birthDate?.message}
                >
                  <Input
                    type="date"
                    {...register('birthDate')}
                  />
                </FormField>
              </LayoutContainer>

              <FormField
                label={USER_ADMIN_DRAWER_TEXTS.LABELS.EMAIL}
                error={errors.email?.message}
              >
                <Input
                  type="email"
                  {...register('email')}
                  disabled={!!user && currentUserRole !== 'OWNER'}
                />
              </FormField>
            </Accordion>

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.PHONES}>
              {phones.map((phone, idx) => (
                <LayoutContainer key={idx} className="bg-surface p-4 rounded-xl mb-4 relative border border-border">
                  <IconButton
                    icon={<Trash2 size={18} />}
                    variant="ghost"
                    onClick={() => removePhone(idx)}
                    className="absolute top-2 right-2 text-text-secondary hover:text-[#ea580c]"
                    aria-label="Remover telefone"
                  />
                  <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.PHONE(idx)}>
                    <PhoneInput
                      value={phone.number}
                      onChange={(e) => updatePhone(idx, 'number', e.target.value)}
                    />
                  </FormField>
                  <LayoutContainer className="flex items-center gap-6 mt-3">
                    <Checkbox
                      label={USER_ADMIN_DRAWER_TEXTS.LABELS.IS_WHATSAPP}
                      checked={phone.isWhatsapp || false}
                      onChange={(e) => updatePhone(idx, 'isWhatsapp', e.target.checked)}
                    />
                    <Checkbox
                      label={USER_ADMIN_DRAWER_TEXTS.LABELS.IS_PRIMARY_PHONE}
                      checked={phone.isPrimary || false}
                      onChange={(e) => updatePhone(idx, 'isPrimary', e.target.checked)}
                    />
                  </LayoutContainer>
                </LayoutContainer>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPhone}
                className="w-full flex items-center justify-center gap-2 border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Plus size={16} />
                {USER_ADMIN_DRAWER_TEXTS.BUTTONS.ADD_PHONE}
              </Button>
            </Accordion>

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.ADDRESSES}>
              {addresses.map((address, idx) => (
                <LayoutContainer key={idx} className="bg-surface p-4 rounded-xl mb-4 relative border border-border space-y-3">
                  <IconButton
                    icon={<Trash2 size={18} />}
                    variant="ghost"
                    onClick={() => removeAddress(idx)}
                    className="absolute top-2 right-2 text-text-secondary hover:text-[#ea580c]"
                    aria-label="Remover endereço"
                  />
                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.ZIP_CODE}>
                      <Input
                        value={address.zipCode}
                        onChange={(e) => updateAddress(idx, 'zipCode', e.target.value)}
                      />
                    </FormField>
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.CITY}>
                      <Input
                        value={address.city}
                        onChange={(e) => updateAddress(idx, 'city', e.target.value)}
                      />
                    </FormField>
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.STATE}>
                      <Input
                        value={address.state}
                        onChange={(e) => updateAddress(idx, 'state', e.target.value)}
                      />
                    </FormField>
                  </LayoutContainer>
                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.STREET} className="sm:col-span-2">
                      <Input
                        value={address.street}
                        onChange={(e) => updateAddress(idx, 'street', e.target.value)}
                      />
                    </FormField>
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.NUMBER}>
                      <Input
                        value={address.number}
                        onChange={(e) => updateAddress(idx, 'number', e.target.value)}
                      />
                    </FormField>
                  </LayoutContainer>
                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.NEIGHBORHOOD}>
                      <Input
                        value={address.neighborhood}
                        onChange={(e) => updateAddress(idx, 'neighborhood', e.target.value)}
                      />
                    </FormField>
                    <FormField label={USER_ADMIN_DRAWER_TEXTS.LABELS.COMPLEMENT}>
                      <Input
                        value={address.complement || ''}
                        onChange={(e) => updateAddress(idx, 'complement', e.target.value)}
                      />
                    </FormField>
                  </LayoutContainer>
                  <Checkbox
                    label={USER_ADMIN_DRAWER_TEXTS.LABELS.IS_PRIMARY_ADDRESS}
                    checked={address.isPrimary || false}
                    onChange={(e) => updateAddress(idx, 'isPrimary', e.target.checked)}
                  />
                </LayoutContainer>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddress}
                className="w-full flex items-center justify-center gap-2 border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Plus size={16} />
                {USER_ADMIN_DRAWER_TEXTS.BUTTONS.ADD_ADDRESS}
              </Button>
            </Accordion>

            <Accordion title={USER_ADMIN_DRAWER_TEXTS.SECTIONS.ACCESS_STATUS}>
              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <LayoutContainer>
                  {(() => {
                    const actorLevel = ROLE_HIERARCHY[currentUserRole?.toUpperCase()] || 0;
                    const targetRoleName = availableRoles.find((r) => r._id === currentRole || r.name === currentRole)?.name || currentRole;
                    const targetRoleLevel = ROLE_HIERARCHY[targetRoleName?.toUpperCase()] || 0;
                    const canChangeRole = currentUserRole === 'OWNER' || (!user ? true : targetRoleLevel < actorLevel);

                    return (
                      <FormField
                        label={USER_ADMIN_DRAWER_TEXTS.LABELS.ROLE}
                        name="role"
                        control={control}
                        error={errors.role?.message}
                        description={
                          isSelf
                            ? USER_ADMIN_DRAWER_TEXTS.LABELS.ROLE_SELF_DISABLED_HINT
                            : !canChangeRole
                              ? 'Você não tem permissão para alterar o cargo deste usuário.'
                              : undefined
                        }
                        render={({ field }) => (
                          <Select
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={isSelf || !canChangeRole}
                            className="w-full"
                          >
                            {availableRoles.map((r: any) => {
                              const roleLevel = ROLE_HIERARCHY[r.name?.toUpperCase()] || 0;
                              const canAssign = currentUserRole === 'OWNER' || roleLevel < actorLevel;
                              if (!canAssign) return null;
                              return (
                                <Option key={r._id || r.name} value={r._id || r.name}>
                                  {r.label || r.name}
                                </Option>
                              );
                            })}
                          </Select>
                        )}
                      />
                    );
                  })()}
                </LayoutContainer>

                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.STATUS}
                  name="status"
                  control={control}
                  error={errors.status?.message}
                  render={({ field }) => (
                    <Select
                      value={field.value || 'ACTIVE'}
                      onChange={(e) => field.onChange(e.target.value as any)}
                      disabled={isSelf}
                      className="w-full"
                    >
                      <Option value="ACTIVE">{USER_STATUS_MAP.ACTIVE}</Option>
                      <Option value="PENDING">{USER_STATUS_MAP.PENDING}</Option>
                      <Option value="BLOCKED">{USER_STATUS_MAP.BLOCKED}</Option>
                      <Option value="INACTIVE">{USER_STATUS_MAP.INACTIVE}</Option>
                    </Select>
                  )}
                />
              </LayoutContainer>

              <LayoutContainer className="flex items-center justify-between pt-3 pb-1 border-t border-border/40">
                <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  {USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD}
                </Text>
                <LayoutContainer className="flex items-center gap-2">
                  {currentPassword && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPassword}
                      leftIcon={<Copy size={13} />}
                      className="text-xs h-7 px-2.5 text-text-secondary hover:text-text-primary"
                    >
                      {USER_ADMIN_DRAWER_TEXTS.BUTTONS.COPY_PASSWORD}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateTemporaryPassword}
                    leftIcon={<Sparkles size={13} className="text-primary" />}
                    className="text-xs h-7 px-2.5 border-primary/30 text-text-primary hover:bg-primary/10"
                  >
                    {USER_ADMIN_DRAWER_TEXTS.BUTTONS.GENERATE_PASSWORD}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD}
                  error={errors.password?.message}
                >
                  <PasswordInput
                    placeholder={user ? USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD_PLACEHOLDER_EDIT : USER_ADMIN_DRAWER_TEXTS.LABELS.PASSWORD_PLACEHOLDER_CREATE}
                    {...register('password')}
                  />
                </FormField>

                <FormField
                  label={USER_ADMIN_DRAWER_TEXTS.LABELS.CONFIRM_PASSWORD}
                  error={errors.confirmPassword?.message}
                >
                  <PasswordInput
                    placeholder={USER_ADMIN_DRAWER_TEXTS.LABELS.CONFIRM_PASSWORD_PLACEHOLDER}
                    {...register('confirmPassword')}
                  />
                </FormField>

                {currentPassword && (
                  <LayoutContainer className="sm:col-span-2">
                    <PasswordStrengthMeter password={currentPassword} />
                  </LayoutContainer>
                )}

                <LayoutContainer className="sm:col-span-2 pt-1">
                  <Controller
                    control={control}
                    name="mustChangePassword"
                    render={({ field }) => (
                      <Checkbox
                        label={USER_ADMIN_DRAWER_TEXTS.LABELS.MUST_CHANGE_PASSWORD}
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  <Text as="p" className="text-xs text-text-secondary mt-1 pl-6">
                    {USER_ADMIN_DRAWER_TEXTS.LABELS.MUST_CHANGE_PASSWORD_HINT}
                  </Text>
                </LayoutContainer>
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
                    className={`w-full ${isSelf ? 'opacity-50 cursor-not-allowed' : 'border-[#ea580c]/50 text-[#ea580c] hover:bg-[#ea580c]/10'}`}
                    disabled={isSelf}
                    onClick={() => !isSelf && setConfirmModal({ isOpen: true, type: 'delete' })}
                  >
                    {USER_ADMIN_DRAWER_TEXTS.BUTTONS.DELETE_USER}
                  </Button>
                  {isSelf && (
                    <Text as="p" className="text-xs text-text-secondary text-center">
                      {USER_ADMIN_DRAWER_TEXTS.LABELS.DELETE_USER_SELF_DISABLED_HINT}
                    </Text>
                  )}
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
        isLoading={isLoading}
      />
    </>
  );
};
