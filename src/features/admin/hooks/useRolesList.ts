import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';
import { toast } from 'react-hot-toast';

export const useRolesList = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getRoles();
      setRoles(res);
    } catch (error: any) {
      console.error('Erro ao carregar cargos:', error?.message);
      toast.error('Erro ao carregar cargos e permissões');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsDrawerOpen(true);
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
  };

  return {
    roles,
    isLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedRole,
    loadRoles,
    handleAddRole,
    handleEditRole
  };
};
