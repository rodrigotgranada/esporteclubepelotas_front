import React from 'react';
import { LayoutContainer, Text, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Spinner, Checkbox } from '@/shared/ui/components';
import { Shield, ShieldAlert, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { UserAdminData } from '@/features/admin/services/admin.service';
import { ADMIN_TEXTS, USER_STATUS_MAP, USER_ROLE_MAP } from '../../../constants/admin.constants';
import { formatCPF } from '@/shared/utils/formatters';

import { UserMobileCard } from './UserMobileCard';

interface UsersListProps {
  users: UserAdminData[];
  onToggleStatus: (user: UserAdminData) => void;
  onEditUser: (user: UserAdminData) => void;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  setPage: (page: number | ((p: number) => number)) => void;
  currentUserRole: string;
  isLoading?: boolean;
  selectedUserIds: string[];
  toggleUserSelection: (id: string) => void;
  selectAllUsers: (selectAll: boolean) => void;
}

export const UsersList = ({
  users,
  onToggleStatus,
  onEditUser,
  page,
  limit,
  total,
  totalPages,
  setPage,
  currentUserRole,
  isLoading,
  selectedUserIds,
  toggleUserSelection,
  selectAllUsers
}: UsersListProps) => {
  return (
    <LayoutContainer className="mt-6 flex flex-col gap-4 w-full min-w-0">
      {/* Mobile/Tablet View: Cards */}
      <LayoutContainer className="flex flex-col gap-4 xl:hidden">
        {users.map(user => (
          <UserMobileCard 
            key={user.id} 
            user={user} 
            onEditUser={onEditUser} 
            onToggleStatus={onToggleStatus} 
            currentUserRole={currentUserRole} 
          />
        ))}
        {isLoading ? (
          <Spinner text="Carregando usuários..." className="bg-surface border border-border rounded-xl" />
        ) : users.length === 0 && (
          <LayoutContainer className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
            {ADMIN_TEXTS.USERS_TABLE_EMPTY}
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* Desktop View: Table */}
      <LayoutContainer className="hidden xl:block w-full min-w-0 bg-surface border border-border rounded-2xl overflow-hidden">
        <LayoutContainer className="overflow-x-auto w-full">
          <Table className="min-w-[800px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    label=""
                    checked={users.length > 0 && selectedUserIds.length === users.length}
                    onChange={(e) => selectAllUsers(e.target.checked)}
                  />
                </TableHead>
                <TableHead>{ADMIN_TEXTS.USERS_TABLE_HEADER_USER}</TableHead>
                <TableHead>{ADMIN_TEXTS.USERS_TABLE_HEADER_CPF}</TableHead>
                <TableHead>{ADMIN_TEXTS.USERS_TABLE_HEADER_ROLE}</TableHead>
                <TableHead>{ADMIN_TEXTS.USERS_TABLE_HEADER_STATUS}</TableHead>
                <TableHead className="text-right">{ADMIN_TEXTS.USERS_TABLE_HEADER_ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => {
                const roleObj = typeof user.role === 'object' ? user.role : null;
                const roleName = roleObj?.name || user.role;
                const roleLabel = roleObj?.label || USER_ROLE_MAP[roleName as keyof typeof USER_ROLE_MAP] || roleName;
                const canEdit = currentUserRole === 'OWNER' || roleName !== 'OWNER';
                return (
                  <TableRow key={user.id} className={`${canEdit ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed'} ${selectedUserIds.includes(user.id) ? 'bg-primary/5' : ''}`} onClick={() => canEdit && onEditUser(user)}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        label=""
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <LayoutContainer className="flex items-center gap-3">
                        <LayoutContainer className="w-10 h-10 rounded-full bg-surface overflow-hidden relative border border-border flex items-center justify-center text-primary font-bold text-sm">
                          {user.avatarUrl ? (
                            <Image src={user.avatarUrl} alt="Avatar" fill sizes="40px" className="object-cover" />
                          ) : (
                            user.firstName[0]
                          )}
                        </LayoutContainer>
                        <LayoutContainer>
                          <LayoutContainer className="flex items-center gap-2">
                            <Text className="text-sm font-bold text-text-primary">{user.firstName} {user.lastName}</Text>
                            {user.emailVerified ? (
                              <span title="E-mail Verificado"><CheckCircle size={14} className="text-success" /></span>
                            ) : (
                              <Badge variant="warning" size="sm">{USER_STATUS_MAP.PENDING.toUpperCase()}</Badge>
                            )}
                          </LayoutContainer>
                          <Text className="text-xs text-text-secondary">{user.email}</Text>
                        </LayoutContainer>
                      </LayoutContainer>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{formatCPF(user.cpf) || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={roleName === 'ADMIN' || roleName === 'OWNER' ? 'primary' : 'default'} size="md">
                        {roleName === 'ADMIN' || roleName === 'OWNER' ? <Shield size={12} /> : null}
                        {roleLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'ACTIVE' ? 'success' : user.status === 'BLOCKED' ? 'danger' : user.status === 'INACTIVE' ? 'default' : 'warning'} size="md">
                        {user.status === 'ACTIVE' ? <CheckCircle size={12} /> : user.status === 'BLOCKED' ? <ShieldAlert size={12} /> : null}
                        {USER_STATUS_MAP[user.status] || user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canEdit && (
                        <LayoutContainer className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); onEditUser(user); }}
                            className="text-xs px-3 py-1.5 text-secondary hover:text-text-primary"
                          >
                            {ADMIN_TEXTS.USERS_TABLE_EDIT}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); onToggleStatus(user); }}
                            className={`text-xs px-3 py-1.5 ${user.status === 'BLOCKED' ? 'text-success hover:text-text-primary' : 'text-warning hover:text-text-primary'}`}
                          >
                            {user.status === 'BLOCKED' ? ADMIN_TEXTS.USERS_ACTION_UNBLOCK : ADMIN_TEXTS.USERS_ACTION_BLOCK}
                          </Button>
                        </LayoutContainer>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <Spinner text="Carregando usuários..." />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-text-secondary py-12">{ADMIN_TEXTS.USERS_TABLE_EMPTY}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </LayoutContainer>
      </LayoutContainer>

      {/* Pagination */}
      <LayoutContainer className="border-t border-border p-4 flex items-center justify-between bg-background">
        <Text className="text-xs text-text-secondary">{ADMIN_TEXTS.USERS_PAGINATION_SHOWING} {(page - 1) * limit + 1} {ADMIN_TEXTS.USERS_PAGINATION_TO} {Math.min(page * limit, total)} {ADMIN_TEXTS.USERS_PAGINATION_OF} {total} {ADMIN_TEXTS.USERS_PAGINATION_USERS}</Text>
        <LayoutContainer className="flex gap-2">
          <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs px-3 py-1.5 disabled:opacity-50">{ADMIN_TEXTS.USERS_PAGINATION_PREV}</Button>
          <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-xs px-3 py-1.5 disabled:opacity-50">{ADMIN_TEXTS.USERS_PAGINATION_NEXT}</Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
