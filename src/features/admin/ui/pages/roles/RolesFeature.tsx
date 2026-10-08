'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Spinner } from '@/shared/ui/components';
import { Shield, Plus, Edit2 } from 'lucide-react';
import { RoleAdminDrawer } from '../../components/roles/RoleAdminDrawer';
import { RoleMobileCard } from '../../components/roles/RoleMobileCard';
import { useRolesList } from '../../../hooks/useRolesList';
import { ROLES_FEATURE_TEXTS } from './RolesFeature.constants';

export const RolesFeature = () => {
  const {
    roles,
    isLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedRole,
    loadRoles,
    handleAddRole,
    handleEditRole
  } = useRolesList();

  return (
    <LayoutContainer className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LayoutContainer className="flex justify-between items-end">
        <LayoutContainer>
          <Title level="h1" className="text-3xl font-black text-text-primary">{ROLES_FEATURE_TEXTS.TITLE}</Title>
          <Text className="text-text-secondary mt-1">{ROLES_FEATURE_TEXTS.SUBTITLE}</Text>
        </LayoutContainer>
        <Button variant="primary" onClick={handleAddRole} className="flex items-center gap-2">
          <Plus size={18} /> {ROLES_FEATURE_TEXTS.BUTTON_NEW_ROLE}
        </Button>
      </LayoutContainer>

      <LayoutContainer className="mt-6 flex flex-col gap-4 w-full min-w-0">
        {/* Mobile/Tablet View */}
        <LayoutContainer className="flex flex-col gap-4 xl:hidden">
          {roles.map((role, index) => {
            let roleKey = role.name || `role-${index}`;
            if (typeof role._id === 'string') roleKey = role._id;
            else if (role._id && typeof role._id.toString === 'function' && role._id.toString() !== '[object Object]') roleKey = role._id.toString();
            return <RoleMobileCard key={roleKey} role={role} onEditRole={handleEditRole} />;
          })}
          {isLoading ? (
            <Spinner text="Carregando cargos..." className="bg-surface border border-border rounded-xl" />
          ) : roles.length === 0 && (
            <LayoutContainer className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
              {ROLES_FEATURE_TEXTS.EMPTY_STATE}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Desktop View */}
        <LayoutContainer className="hidden xl:block w-full min-w-0 bg-surface border border-border rounded-2xl overflow-hidden">
          <LayoutContainer className="overflow-x-auto w-full">
          <Table className="min-w-[800px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{ROLES_FEATURE_TEXTS.TABLE_HEADERS.ROLE}</TableHead>
                <TableHead>{ROLES_FEATURE_TEXTS.TABLE_HEADERS.DESCRIPTION}</TableHead>
                <TableHead>{ROLES_FEATURE_TEXTS.TABLE_HEADERS.PERMISSIONS}</TableHead>
                <TableHead>{ROLES_FEATURE_TEXTS.TABLE_HEADERS.STATUS}</TableHead>
                <TableHead className="text-right">{ROLES_FEATURE_TEXTS.TABLE_HEADERS.ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role, index) => {
                let roleKey = role.name || `role-${index}`;
                if (typeof role._id === 'string') roleKey = role._id;
                else if (role._id && typeof role._id.toString === 'function' && role._id.toString() !== '[object Object]') roleKey = role._id.toString();

                return (
                  <TableRow 
                    key={roleKey} 
                    className="cursor-pointer" 
                    onClick={() => handleEditRole(role)}
                  >
                  <TableCell>
                    <LayoutContainer className="flex items-center gap-2">
                      {role.isImmutable && <Shield size={14} className="text-primary" />}
                      <LayoutContainer>
                        <Text className="text-sm font-bold text-text-primary">{role.label || role.name}</Text>
                        <Text className="text-xs text-text-secondary font-mono">{role.name}</Text>
                      </LayoutContainer>
                    </LayoutContainer>
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">{role.description}</TableCell>
                  <TableCell>
                    <LayoutContainer className="flex flex-wrap gap-1">
                      {(role.permissions || []).slice(0, 3).map((perm: string) => (
                        <Badge key={perm} variant="default" size="sm" className="text-[10px]">{perm}</Badge>
                      ))}
                      {(role.permissions?.length || 0) > 3 && (
                        <Badge variant="default" size="sm" className="text-[10px] bg-white/10">+{(role.permissions?.length || 0) - 3}</Badge>
                      )}
                      {(!role.permissions || role.permissions.length === 0) && <span className="text-xs text-text-secondary">{ROLES_FEATURE_TEXTS.BADGES.NONE}</span>}
                    </LayoutContainer>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isImmutable ? 'primary' : 'default'} size="sm">
                      {role.isImmutable ? ROLES_FEATURE_TEXTS.BADGES.SYSTEM : ROLES_FEATURE_TEXTS.BADGES.CUSTOM}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      onClick={(e) => { e.stopPropagation(); handleEditRole(role); }}
                      className="text-xs px-3 py-1.5 text-secondary hover:text-text-primary flex items-center gap-2"
                    >
                      <Edit2 size={14} /> {ROLES_FEATURE_TEXTS.BUTTON_EDIT}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12">
                    <Spinner text="Carregando cargos..." />
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-text-secondary py-12">{ROLES_FEATURE_TEXTS.EMPTY_STATE}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </LayoutContainer>
      </LayoutContainer>
      </LayoutContainer>

      <RoleAdminDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        role={selectedRole} 
        onSaveSuccess={() => { setIsDrawerOpen(false); loadRoles(); }} 
      />
    </LayoutContainer>
  );
};
