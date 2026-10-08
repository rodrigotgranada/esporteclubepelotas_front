import React from 'react';
import { Drawer, Input, Button, LayoutContainer, Form, Text } from '@/shared/ui/components';
import { useRoleAdminDrawer } from '../../../hooks/useRoleAdminDrawer';
import { ROLE_ADMIN_DRAWER_TEXTS } from './RoleAdminDrawer.constants';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';

interface RoleAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: any | null;
  onSaveSuccess: () => void;
}

export const RoleAdminDrawer = ({ isOpen, onClose, role, onSaveSuccess }: RoleAdminDrawerProps) => {
  const { formData, isLoading, updateField, handleTogglePermission, handleSubmit } = useRoleAdminDrawer(role, onSaveSuccess);
  const { modules } = useSystemModulesStore();
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

            <LayoutContainer className="space-y-4">
              {[...ROLE_ADMIN_DRAWER_TEXTS.CORE_MODULES, ...modules].map(mod => {
                const moduleName = mod.name;
                const moduleSlug = mod.slug;
                
                return (
                  <LayoutContainer key={moduleSlug} className="bg-surface border border-border/50 rounded-xl p-4">
                    <Text className="text-sm font-bold text-text-primary mb-3">{moduleName}</Text>
                    <LayoutContainer className="flex flex-wrap gap-4">
                      {ROLE_ADMIN_DRAWER_TEXTS.CRUD_ACTIONS.map(action => {
                        const permKey = `${moduleSlug}.${action.action}`;
                        const isChecked = formData.permissions.includes(permKey) || ((role?.name || role) === 'OWNER');
                        
                        return (
                          <label key={permKey} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              id={permKey}
                              checked={isChecked}
                              onChange={() => handleTogglePermission(permKey)}
                              disabled={(isImmutable && (role?.name || role) === 'OWNER') || isLoading}
                              className="accent-primary"
                            />
                            <Text className="text-xs text-text-secondary">{action.label}</Text>
                          </label>
                        );
                      })}
                    </LayoutContainer>
                  </LayoutContainer>
                );
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
