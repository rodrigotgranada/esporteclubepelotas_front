import React from 'react';
import { LayoutContainer, Title, Text, Button, SensitiveActionModal, Badge } from '@/shared/ui/components';
import { ShieldCheck, Mail, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { PROFILE_TEXTS } from '../../../constants';
import { useSecurityData } from '../../../hooks/useSecurityData';
import { ChangeContactDrawer, ChangePasswordDrawer } from '../organisms';

export const SecurityTab = () => {
  const {
    user,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    handleDeleteAccount,
    contactDrawerState,
    openContactDrawer,
    closeContactDrawer,
    handleRequestChange,
    isPasswordDrawerOpen,
    setIsPasswordDrawerOpen,
    handleUpdatePassword,
    isLoading,
  } = useSecurityData();

  if (!user) return null;

  return (
    <LayoutContainer className="animate-in fade-in duration-300 space-y-8">
      <LayoutContainer>
        <Title level="h2" className="text-xl font-bold text-text-primary flex items-center gap-2 mb-2">
          <ShieldCheck size={24} className="text-primary" />
          {PROFILE_TEXTS.SECURITY_TITLE}
        </Title>
        <Text className="text-text-secondary text-sm">{PROFILE_TEXTS.SECURITY_DESCRIPTION}</Text>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Box */}
        <LayoutContainer className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <LayoutContainer>
            <LayoutContainer className="flex items-center gap-2 text-text-secondary mb-3">
              <Mail size={18} />
              <Text as="span" className="font-semibold text-sm uppercase tracking-wide">{PROFILE_TEXTS.SECURITY_EMAIL_LABEL}</Text>
            </LayoutContainer>
            <Text className="text-text-primary text-lg font-medium">{user.email}</Text>
            
            <LayoutContainer className="mt-4">
              <Badge variant={user.emailVerified ? 'success' : 'warning'}>
                {user.emailVerified ? PROFILE_TEXTS.SECURITY_STATUS_VERIFIED : PROFILE_TEXTS.SECURITY_STATUS_PENDING}
              </Badge>
            </LayoutContainer>
          </LayoutContainer>
          <Button variant="secondary" size="sm" className="mt-6 w-full text-xs" onClick={() => openContactDrawer('email')}>
            {user.emailVerified ? PROFILE_TEXTS.SECURITY_BUTTON_CHANGE_EMAIL : PROFILE_TEXTS.SECURITY_BUTTON_VERIFY_EMAIL}
          </Button>
        </LayoutContainer>

        {/* Phone Box */}
        <LayoutContainer className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <LayoutContainer>
            <LayoutContainer className="flex items-center gap-2 text-text-secondary mb-3">
              <Smartphone size={18} />
              <Text as="span" className="font-semibold text-sm uppercase tracking-wide">{PROFILE_TEXTS.SECURITY_PHONE_LABEL}</Text>
            </LayoutContainer>
            <Text className="text-text-primary text-lg font-medium">{user.phones?.[0]?.number || PROFILE_TEXTS.SECURITY_PHONE_NOT_INFORMED}</Text>
            
            <LayoutContainer className="mt-4">
              <Badge variant={user.phones?.[0]?.isVerified ? 'success' : 'warning'}>
                {user.phones?.[0]?.isVerified ? PROFILE_TEXTS.SECURITY_STATUS_VERIFIED : PROFILE_TEXTS.SECURITY_STATUS_PENDING}
              </Badge>
            </LayoutContainer>
          </LayoutContainer>
          <Button variant="secondary" size="sm" className="mt-6 w-full text-xs" onClick={() => openContactDrawer('phone')}>
            {user.phones?.[0]?.isVerified ? PROFILE_TEXTS.SECURITY_BUTTON_CHANGE_PHONE : PROFILE_TEXTS.SECURITY_BUTTON_VERIFY_PHONE}
          </Button>
        </LayoutContainer>

        {/* Password Box */}
        <LayoutContainer className="bg-surface border border-border rounded-xl p-5 md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <LayoutContainer>
            <LayoutContainer className="flex items-center gap-2 text-text-secondary mb-2">
              <Key size={18} />
              <Text as="span" className="font-semibold text-sm uppercase tracking-wide">{PROFILE_TEXTS.SECURITY_PASSWORD_LABEL}</Text>
            </LayoutContainer>
            <Text className="text-text-secondary text-sm">{PROFILE_TEXTS.SECURITY_PASSWORD_DESC}</Text>
          </LayoutContainer>
          <Button variant="secondary" size="sm" className="whitespace-nowrap px-4" onClick={() => setIsPasswordDrawerOpen(true)}>{PROFILE_TEXTS.SECURITY_BUTTON_CHANGE_PASSWORD}</Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Danger Zone */}
      <LayoutContainer className="bg-error/10 border border-error/20 rounded-2xl p-6 mt-8">
        <Title level="h3" className="text-lg font-bold text-error flex items-center gap-2 mb-2">
          <AlertTriangle size={18} />
          {PROFILE_TEXTS.SECURITY_DANGER_ZONE_TITLE}
        </Title>
        <Text className="text-error/80 mb-6 text-sm">
          {PROFILE_TEXTS.SECURITY_DANGER_ZONE_DESC}
        </Text>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
          className="border-error/50 text-error hover:bg-error/10 transition-colors"
        >
          {PROFILE_TEXTS.SECURITY_BUTTON_DELETE_ACCOUNT}
        </Button>
      </LayoutContainer>

      <SensitiveActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title={PROFILE_TEXTS.DELETE_ACCOUNT_MODAL_TITLE}
        description={PROFILE_TEXTS.DELETE_ACCOUNT_MODAL_DESC}
        confirmText={PROFILE_TEXTS.DELETE_ACCOUNT_MODAL_BUTTON_CONFIRM}
        isLoading={isDeleting}
      />

      <ChangeContactDrawer
        isOpen={contactDrawerState.isOpen}
        onClose={closeContactDrawer}
        type={contactDrawerState.type}
        onSubmit={(newValue, currentPassword) => handleRequestChange(newValue, currentPassword)}
        isLoading={isLoading}
      />

      <ChangePasswordDrawer
        isOpen={isPasswordDrawerOpen}
        onClose={() => setIsPasswordDrawerOpen(false)}
        onSubmit={handleUpdatePassword}
        isLoading={isLoading}
      />
    </LayoutContainer>
  );
};
