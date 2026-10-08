import { useState, useEffect } from 'react';
import { adminService, UserAdminData } from '@/features/admin/services/admin.service';
import { ADMIN_TEXTS } from '../../constants/admin.constants';
import { toast } from 'react-hot-toast';

export const useUsersList = () => {
  const [users, setUsers] = useState<UserAdminData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE'); // default to ACTIVE as requested
  const [isLoading, setIsLoading] = useState(false);
  
  const limit = 10;
  const totalPages = Math.ceil(total / limit) || 1;

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit, search };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter && statusFilter !== 'ALL') params.status = statusFilter;
      if (statusFilter === 'ALL') params.status = 'ALL'; // Wait, let's just send 'ALL' as string if we change backend to accept string


      const res = await adminService.getUsers(params);
      setUsers(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
      toast.error(ADMIN_TEXTS.TOAST_ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter, statusFilter]);

  const handleToggleStatus = async (user: UserAdminData) => {
    const newStatus = user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      toast.success(ADMIN_TEXTS.TOAST_USER_STATUS_UPDATED);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || ADMIN_TEXTS.TOAST_ERROR_GENERIC);
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

      res.data.forEach(u => {
        const roleName = typeof u.role === 'string' ? u.role : (u.role?.name || '');
        const birthDate = u.birthDate ? new Date(u.birthDate).toLocaleDateString() : '';
        const values = [
          u.id,
          `"${u.firstName}"`,
          `"${u.lastName}"`,
          `"${u.email}"`,
          `"${u.cpf}"`,
          `"${birthDate}"`,
          `"${u.status}"`,
          `"${roleName}"`
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
    handleToggleStatus,
    loadUsers,
    handleExportCsv
  };
};
