import React from 'react';
import {
  Drawer,
  Input,
  Button,
  LayoutContainer,
  Form,
  Text,
  Checkbox,
  FormField,
} from '@/shared/ui/components';
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
  const { form, isLoading, handleTogglePermission, handleSubmit } = useRoleAdminDrawer(role, onSaveSuccess);
  const { modules } = useSystemModulesStore();
  const isImmutable = role?.isImmutable;

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const permissions = watch('permissions') || [];

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
            <FormField
              label={ROLE_ADMIN_DRAWER_TEXTS.LABEL_NAME}
              error={errors.name?.message}
            >
              <Input
                {...register('name', {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase().replace(/\s+/g, '_');
                  },
                })}
                disabled={isImmutable}
                placeholder={ROLE_ADMIN_DRAWER_TEXTS.PLACEHOLDER_NAME}
              />
            </FormField>

            <FormField
              label={ROLE_ADMIN_DRAWER_TEXTS.LABEL_LABEL}
              error={errors.label?.message}
            >
              <Input
                {...register('label')}
                placeholder={ROLE_ADMIN_DRAWER_TEXTS.PLACEHOLDER_LABEL}
              />
            </FormField>

            <FormField
              label={ROLE_ADMIN_DRAWER_TEXTS.LABEL_DESCRIPTION}
              error={errors.description?.message}
            >
              <Input
                {...register('description')}
                placeholder={ROLE_ADMIN_DRAWER_TEXTS.PLACEHOLDER_DESCRIPTION}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="border-t border-border pt-4">
            <Text as="p" className="text-sm font-bold text-text-primary mb-4">
              {ROLE_ADMIN_DRAWER_TEXTS.PERMISSIONS_TITLE}
            </Text>

            {isImmutable && (role?.name || role) === 'OWNER' && (
              <LayoutContainer className="bg-warning/10 border border-warning/30 p-3 rounded-lg mb-4">
                <Text as="p" className="text-xs text-warning">
                  {ROLE_ADMIN_DRAWER_TEXTS.OWNER_WARNING}
                </Text>
              </LayoutContainer>
            )}

            <LayoutContainer className="space-y-4">
              {[...ROLE_ADMIN_DRAWER_TEXTS.CORE_MODULES, ...modules].map((mod) => {
                const moduleName = mod.name;
                const moduleSlug = mod.slug;

                return (
                  <LayoutContainer key={moduleSlug} className="bg-surface border border-border/50 rounded-xl p-4">
                    <Text as="span" className="text-sm font-bold text-text-primary mb-3">
                      {moduleName}
                    </Text>
                    <LayoutContainer className="flex flex-wrap gap-4 mt-2">
                      {ROLE_ADMIN_DRAWER_TEXTS.CRUD_ACTIONS.map((action) => {
                        const permKey = `${moduleSlug}.${action.action}`;
                        const isChecked = permissions.includes(permKey) || (role?.name || role) === 'OWNER';

                        return (
                          <Checkbox
                            key={permKey}
                            label={action.label}
                            checked={isChecked}
                            onChange={() => handleTogglePermission(permKey)}
                            disabled={(isImmutable && (role?.name || role) === 'OWNER') || isLoading}
                          />
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
