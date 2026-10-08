'use client';

import React, { useState } from 'react';
import { LayoutContainer, Title, Text } from '@/shared/ui/components';
import { ConfirmModal } from '@/shared/ui/components/molecules/ConfirmModal';
import { ADMIN_TEXTS } from '../../../constants/admin.constants';
import { useUsersList } from '../../../hooks/users/useUsersList';
import { UsersFilterBar } from '../../components/users/UsersFilterBar';
import { UsersList } from '../../components/users/UsersList';
import { UserAdminData } from '../../../services/admin.service';
import { useAuthStore } from '@/store/useAuthStore';
import { UserAdminDrawer } from '../../components/users/UserAdminDrawer';

export const UsersListFeature = () => {
  const { user: currentUser } = useAuthStore();
  const currentUserRole = typeof currentUser?.role === 'string' ? currentUser.role : (currentUser?.role?.name || 'ADMIN');

  const {
    users,
    total,
    page,
    setPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    limit,
    totalPages,
    isLoading,
    handleToggleStatus,
    loadUsers,
    handleExportCsv
  } = useUsersList();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdminData | null>(null);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);

  React.useEffect(() => {
    import('../../../services/admin.service').then(({ adminService }) => {
      adminService.getRoles().then(setAvailableRoles).catch(console.error);
    });
  }, []);

  // Status Modal State
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; user: UserAdminData | null }>({
    isOpen: false,
    user: null,
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: UserAdminData) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleSaveSuccess = () => {
    handleDrawerClose();
    loadUsers();
  };

  const confirmToggleStatus = (user: UserAdminData) => {
    setStatusModal({ isOpen: true, user });
  };

  const executeToggleStatus = async () => {
    if (statusModal.user) {
      await handleToggleStatus(statusModal.user);
      setStatusModal({ isOpen: false, user: null });
    }
  };

  return (
    <LayoutContainer className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LayoutContainer>
        <Title level="h1" className="text-3xl font-black text-text-primary">{ADMIN_TEXTS.USERS_TITLE}</Title>
        <Text className="text-text-secondary mt-1">{ADMIN_TEXTS.USERS_SUBTITLE}</Text>
      </LayoutContainer>

      <UsersFilterBar
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddUser={handleAddUser}
        onExport={handleExportCsv}
        availableRoles={availableRoles}
      />

      <UsersList
        users={users}
        onToggleStatus={confirmToggleStatus}
        onEditUser={handleEditUser}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        currentUserRole={currentUserRole}
        isLoading={isLoading}
      />

      <UserAdminDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        user={selectedUser}
        onSaveSuccess={handleSaveSuccess}
      />

      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, user: null })}
        onConfirm={executeToggleStatus}
        title={statusModal.user?.status === 'BLOCKED' ? 'Desbloquear Usuário' : 'Bloquear Usuário'}
        description={`Tem certeza que deseja ${statusModal.user?.status === 'BLOCKED' ? 'desbloquear' : 'bloquear'} o usuário ${statusModal.user?.firstName}?`}
        confirmText="Sim, continuar"
        variant="warning"
      />
    </LayoutContainer>
  );
};
