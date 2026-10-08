import React from 'react';
import { LayoutContainer, Text, Badge, Button } from '@/shared/ui/components';
import { Shield, ShieldAlert, CheckCircle, ChevronRight, Ban, Unlock } from 'lucide-react';
import Image from 'next/image';
import { UserAdminData } from '@/features/admin/services/admin.service';
import { ADMIN_TEXTS, USER_STATUS_MAP, USER_ROLE_MAP } from '../../../constants/admin.constants';
import { formatCPF } from '@/shared/utils/formatters';

interface UserMobileCardProps {
  user: UserAdminData;
  onEditUser: (user: UserAdminData) => void;
  onToggleStatus: (user: UserAdminData) => void;
  currentUserRole: string;
}

export const UserMobileCard = ({ user, onEditUser, onToggleStatus, currentUserRole }: UserMobileCardProps) => {
  const roleObj = typeof user.role === 'object' ? user.role : null;
  const roleName = roleObj?.name || user.role;
  const roleLabel = roleObj?.label || USER_ROLE_MAP[roleName as keyof typeof USER_ROLE_MAP] || roleName;
  const canEdit = currentUserRole === 'OWNER' || roleName !== 'OWNER';

  return (
    <LayoutContainer 
      className={`bg-surface border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm transition-transform active:scale-[0.98] ${canEdit ? 'cursor-pointer' : 'opacity-70'}`}
      onClick={() => canEdit && onEditUser(user)}
    >
      <LayoutContainer className="flex items-start justify-between">
        <LayoutContainer className="flex items-center gap-3">
          <LayoutContainer className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-primary font-bold overflow-hidden relative">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Avatar" fill sizes="48px" className="object-cover" />
            ) : (
              user.firstName[0]
            )}
          </LayoutContainer>
          <LayoutContainer>
            <LayoutContainer className="flex items-center gap-2">
              <Text className="text-base font-bold text-text-primary leading-none">{user.firstName} {user.lastName}</Text>
              {user.emailVerified ? (
                <span title="E-mail Verificado"><CheckCircle size={14} className="text-success" /></span>
              ) : (
                <Badge variant="warning" size="sm">{USER_STATUS_MAP.PENDING.toUpperCase()}</Badge>
              )}
            </LayoutContainer>
            <Text className="text-xs text-text-secondary mt-1">{user.email}</Text>
            {user.cpf && <Text className="text-xs text-text-secondary mt-0.5">CPF: {formatCPF(user.cpf)}</Text>}
          </LayoutContainer>
        </LayoutContainer>
        <ChevronRight size={20} className="text-text-secondary opacity-50" />
      </LayoutContainer>

      <LayoutContainer className="flex items-center justify-between border-t border-border pt-4">
        <LayoutContainer className="flex gap-2">
          <Badge variant={roleName === 'ADMIN' || roleName === 'OWNER' ? 'primary' : 'default'} size="sm">
            {roleName === 'ADMIN' || roleName === 'OWNER' ? <Shield size={12} /> : null}
            {roleLabel}
          </Badge>
          <Badge variant={user.status === 'ACTIVE' ? 'success' : user.status === 'BLOCKED' ? 'danger' : user.status === 'INACTIVE' ? 'default' : 'warning'} size="sm">
            {user.status === 'ACTIVE' ? <CheckCircle size={12} /> : user.status === 'BLOCKED' ? <ShieldAlert size={12} /> : null}
            {USER_STATUS_MAP[user.status] || user.status}
          </Badge>
        </LayoutContainer>

        {canEdit && (
          <Button
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onToggleStatus(user); }}
            className={`p-2 rounded-full border border-border flex items-center justify-center shadow-sm bg-background transition-colors ${
              user.status === 'BLOCKED' ? 'text-success hover:bg-success/10 border-success/30' : 'text-danger hover:bg-danger/10 border-danger/30'
            }`}
            title={user.status === 'BLOCKED' ? ADMIN_TEXTS.USERS_ACTION_UNBLOCK : ADMIN_TEXTS.USERS_ACTION_BLOCK}
          >
            {user.status === 'BLOCKED' ? <Unlock size={14} /> : <Ban size={14} />}
          </Button>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
