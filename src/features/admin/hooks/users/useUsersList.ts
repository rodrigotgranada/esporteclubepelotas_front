import { useState, useEffect, useCallback, useRef } from 'react';
import { adminService, UserAdminData } from '@/features/admin/services/admin.service';
import { ADMIN_TEXTS } from '../../constants/admin.constants';
import { toast } from 'react-hot-toast';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useUsersList = () => {
  const [users, setUsers] = useState<UserAdminData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const mutatingRef = useRef(false);

  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  const loadUsers = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const params: any = { page, limit, search };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter;
      if (statusFilter === 'ALL') params.status = 'ALL';

      const res = await adminService.getUsers(params);
      setUsers(res.data || []);
      setTotal(res.total || 0);
    } catch (error) {
      console.error(error);
      if (!options?.silent) {
        toast.error(ADMIN_TEXTS.TOAST_ERROR_GENERIC);
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, [page, limit, search, roleFilter, statusFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useRealtimeEvents('users', () => {
    loadUsers({ silent: true });
  });

  const handleToggleStatus = async (user: UserAdminData) => {
    if (mutatingRef.current) return;
    mutatingRef.current = true;
    const newStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      toast.success(ADMIN_TEXTS.TOAST_USER_STATUS_UPDATED);
      await loadUsers({ silent: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || ADMIN_TEXTS.TOAST_ERROR_GENERIC);
    } finally {
      mutatingRef.current = false;
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllUsers = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedUserIds(users.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleBulkUpdateStatus = async (status: string) => {
    if (mutatingRef.current || selectedUserIds.length === 0) return;
    mutatingRef.current = true;
    try {
      setIsLoading(true);
      const count = selectedUserIds.length;
      await Promise.all(selectedUserIds.map((id) => adminService.updateUserStatus(id, status)));
      toast.success(`Status atualizado para ${count} usuários.`);
      setSelectedUserIds([]);
      await loadUsers({ silent: true });
    } catch {
      toast.error('Erro ao atualizar status em massa.');
    } finally {
      mutatingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleBulkUpdateRole = async (roleId: string) => {
    if (mutatingRef.current || selectedUserIds.length === 0) return;
    mutatingRef.current = true;
    try {
      setIsLoading(true);
      const count = selectedUserIds.length;
      await Promise.all(selectedUserIds.map((id) => adminService.updateUserRole(id, roleId)));
      toast.success(`Cargo atualizado para ${count} usuários.`);
      setSelectedUserIds([]);
      await loadUsers({ silent: true });
    } catch {
      toast.error('Erro ao atualizar cargo em massa.');
    } finally {
      mutatingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      toast.loading('Preparando exportação...', { id: 'export-csv' });
      const params: any = { page: 1, limit: 9999, search };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter;
      if (statusFilter === 'ALL') params.status = 'ALL';

      const res = await adminService.getUsers(params);
      const csvRows = [];
      const headers = ['ID', 'Nome', 'Sobrenome', 'Email', 'CPF', 'Nascimento', 'Status', 'Cargo'];
      csvRows.push(headers.join(','));

      res.data.forEach((u) => {
        const roleName = typeof u.role === 'string' ? u.role : u.role?.name || '';
        const birthDate = u.birthDate ? new Date(u.birthDate).toLocaleDateString('pt-BR') : '';
        const values = [
          u.id,
          `"${u.firstName}"`,
          `"${u.lastName}"`,
          `"${u.email}"`,
          `"${u.cpf}"`,
          `"${birthDate}"`,
          `"${u.status}"`,
          `"${roleName}"`,
        ];
        csvRows.push(values.join(','));
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Download iniciado!', { id: 'export-csv' });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao exportar CSV', { id: 'export-csv' });
    }
  };

  return {
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
    selectedUserIds,
    toggleUserSelection,
    selectAllUsers,
    handleBulkUpdateStatus,
    handleBulkUpdateRole,
    handleToggleStatus,
    loadUsers,
    handleExportCsv,
  };
};
