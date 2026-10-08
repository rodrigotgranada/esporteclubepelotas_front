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
    handleExportCsv,
    selectedUserIds,
    toggleUserSelection,
    selectAllUsers,
    handleBulkUpdateStatus,
    handleBulkUpdateRole
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

      {selectedUserIds.length > 0 && (
        <LayoutContainer className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <Text className="font-bold text-primary">
            {selectedUserIds.length} usuário(s) selecionado(s)
          </Text>
          <LayoutContainer className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkUpdateRole(e.target.value);
                  e.target.value = ''; // reset
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Alterar Cargo para...</option>
              {availableRoles.map(r => (
                <option key={r._id || r.id} value={r._id || r.id}>{r.label || r.name}</option>
              ))}
            </select>
            
            <select
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkUpdateStatus(e.target.value);
                  e.target.value = ''; // reset
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Alterar Status para...</option>
              <option value="ACTIVE">ATIVO</option>
              <option value="PENDING">PENDENTE</option>
              <option value="BLOCKED">BLOQUEADO</option>
              <option value="INACTIVE">INATIVO</option>
            </select>
          </LayoutContainer>
        </LayoutContainer>
      )}

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
        selectedUserIds={selectedUserIds}
        toggleUserSelection={toggleUserSelection}
        selectAllUsers={selectAllUsers}
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
