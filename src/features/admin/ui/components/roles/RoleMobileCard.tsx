import React from 'react';
import { LayoutContainer, Text, Badge, Button } from '@/shared/ui/components';
import { Shield, Edit2 } from 'lucide-react';
import { ROLES_FEATURE_TEXTS } from '../../pages/roles/RolesFeature.constants';

interface RoleMobileCardProps {
  role: any;
  onEditRole: (role: any) => void;
}

export const RoleMobileCard = ({ role, onEditRole }: RoleMobileCardProps) => {
  return (
    <LayoutContainer 
      className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-4 cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => onEditRole(role)}
    >
      <LayoutContainer className="flex justify-between items-start gap-4">
        <LayoutContainer className="flex items-center gap-2">
          {role.isImmutable && <Shield size={16} className="text-primary flex-shrink-0" />}
          <LayoutContainer>
            <Text className="text-base font-bold text-text-primary">{role.label || role.name}</Text>
            <Text className="text-xs text-text-secondary font-mono">{role.name}</Text>
          </LayoutContainer>
        </LayoutContainer>
        <Badge variant={role.isImmutable ? 'primary' : 'default'} size="sm">
          {role.isImmutable ? ROLES_FEATURE_TEXTS.BADGES.SYSTEM : ROLES_FEATURE_TEXTS.BADGES.CUSTOM}
        </Badge>
      </LayoutContainer>

      <Text className="text-sm text-text-secondary">{role.description}</Text>

      <LayoutContainer className="flex flex-wrap gap-1">
        {(role.permissions || []).slice(0, 3).map((perm: string) => (
          <Badge key={perm} variant="default" size="sm" className="text-[10px]">{perm}</Badge>
        ))}
        {(role.permissions?.length || 0) > 3 && (
          <Badge variant="default" size="sm" className="text-[10px] bg-white/10">+{(role.permissions?.length || 0) - 3}</Badge>
        )}
        {(!role.permissions || role.permissions.length === 0) && (
          <span className="text-xs text-text-secondary">{ROLES_FEATURE_TEXTS.BADGES.NONE}</span>
        )}
      </LayoutContainer>

      <LayoutContainer className="flex justify-end pt-2 border-t border-border mt-2">
        <Button 
          variant="ghost" 
          onClick={(e) => { e.stopPropagation(); onEditRole(role); }}
          className="text-xs px-3 py-1.5 text-secondary hover:text-text-primary flex items-center gap-2"
        >
          <Edit2 size={14} /> {ROLES_FEATURE_TEXTS.BUTTON_EDIT}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
