import React from 'react';
import { Drawer, Input, Button, LayoutContainer, Form, Text } from '@/shared/ui/components';
import { useRoleAdminDrawer } from '../../../hooks/useRoleAdminDrawer';
import { ROLE_ADMIN_DRAWER_TEXTS } from './RoleAdminDrawer.constants';

interface RoleAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: any | null;
  onSaveSuccess: () => void;
}

export const RoleAdminDrawer = ({ isOpen, onClose, role, onSaveSuccess }: RoleAdminDrawerProps) => {
  const { formData, isLoading, updateField, handleTogglePermission, handleSubmit } = useRoleAdminDrawer(role, onSaveSuccess);
  const isImmutable = role?.isImmutable;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={role ? ROLE_ADMIN_DRAWER_TEXTS.TITLE_EDIT : ROLE_ADMIN_DRAWER_TEXTS.TITLE_CREATE}
      size="md"
    >
      <Form onSubmit={handleSubmit} className="flex flex-col h-full mt-4">
        <LayoutContainer className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">

          <LayoutContainer className="space-y-4">
            <Input 
              label={ROLE_ADMIN_DRAWER_TEXTS.LABEL_NAME} 
              value={formData.name} 
              onChange={e => updateField('name', e.target.value.toUpperCase().replace(/\s+/g, '_'))} 
              required 
              disabled={isImmutable}
              placeholder={ROLE_ADMIN_DRAWER_TEXTS.PLACEHOLDER_NAME}
            />
            <Input 
              label={ROLE_ADMIN_DRAWER_TEXTS.LABEL_LABEL} 
              value={formData.label || ''} 
              onChange={e => updateField('label', e.target.value)} 
              required
              placeholder={ROLE_ADMIN_DRAWER_TEXTS.PLACEHOLDER_LABEL}
            />
            <Input 
              label={ROLE_ADMIN_DRAWER_TEXTS.LABEL_DESCRIPTION} 
              value={formData.description} 
              onChange={e => updateField('description', e.target.value)} 
              placeholder={ROLE_ADMIN_DRAWER_TEXTS.PLACEHOLDER_DESCRIPTION}
            />
          </LayoutContainer>

          <LayoutContainer className="border-t border-border pt-4">
            <Text className="text-sm font-bold text-text-primary mb-4">{ROLE_ADMIN_DRAWER_TEXTS.PERMISSIONS_TITLE}</Text>
            
            {isImmutable && (role?.name || role) === 'OWNER' && (
              <LayoutContainer className="bg-warning/10 border border-warning/30 p-3 rounded-lg mb-4">
                <Text className="text-xs text-warning">{ROLE_ADMIN_DRAWER_TEXTS.OWNER_WARNING}</Text>
              </LayoutContainer>
            )}

            <LayoutContainer className="space-y-3">
              {ROLE_ADMIN_DRAWER_TEXTS.AVAILABLE_PERMISSIONS.map(perm => {
                const isChecked = formData.permissions.includes(perm.key) || ((role?.name || role) === 'OWNER');
                return (
                  <LayoutContainer key={perm.key} className={`flex items-start gap-3 p-3 rounded-xl border ${isChecked ? 'bg-surface border-border' : 'bg-background border-border/50'}`}>
                    <input 
                      type="checkbox" 
                      id={perm.key}
                      checked={isChecked}
                      onChange={() => handleTogglePermission(perm.key)}
                      disabled={(isImmutable && (role?.name || role) === 'OWNER') || isLoading}
                      className="mt-1 accent-primary"
                    />
                    <LayoutContainer>
                      <label htmlFor={perm.key} className="text-sm font-bold text-text-primary cursor-pointer">{perm.module} ({perm.key})</label>
                      <Text className="text-xs text-text-secondary mt-1">{perm.description}</Text>
                    </LayoutContainer>
                  </LayoutContainer>
                )
              })}
            </LayoutContainer>
          </LayoutContainer>

        </LayoutContainer>

        <LayoutContainer className="mt-6 pt-6 border-t border-border flex gap-3">
          <Button type="button" variant="outline" size="md" className="flex-1" onClick={onClose}>
            {ROLE_ADMIN_DRAWER_TEXTS.BUTTON_CANCEL}
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" isLoading={isLoading}>
            {ROLE_ADMIN_DRAWER_TEXTS.BUTTON_SAVE}
          </Button>
        </LayoutContainer>
      </Form>
    </Drawer>
  );
};
