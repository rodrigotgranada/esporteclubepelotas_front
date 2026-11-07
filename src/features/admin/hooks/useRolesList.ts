import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';
import { toast } from 'react-hot-toast';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useRolesList = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  const loadRoles = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const res = await adminService.getRoles();
      setRoles(res || []);
    } catch (error: any) {
      console.error('Erro ao carregar cargos:', error?.message);
      if (!options?.silent) {
        toast.error('Erro ao carregar cargos e permissões');
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useRealtimeEvents('roles', () => {
    loadRoles({ silent: true });
  });

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
    handleEditRole,
  };
};
