import { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import { ROLE_ADMIN_DRAWER_TEXTS } from '../ui/components/roles/RoleAdminDrawer.constants';
import { adminService } from '../services/admin.service';

export const useRoleAdminDrawer = (role: any, onSaveSuccess: () => void) => {
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    permissions: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        label: role.label || '',
        description: role.description || '',
        permissions: role.permissions || []
      });
    } else {
      setFormData({
        name: '',
        label: '',
        description: '',
        permissions: []
      });
    }
  }, [role]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTogglePermission = (permissionKey: string) => {
    setFormData(prev => {
      const perms = prev.permissions;
      if (perms.includes(permissionKey)) {
        return { ...prev, permissions: perms.filter(p => p !== permissionKey) };
      } else {
        return { ...prev, permissions: [...perms, permissionKey] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role) {
        await adminService.updateRole(role._id, formData);
        toast.success(ROLE_ADMIN_DRAWER_TEXTS.MESSAGES.SUCCESS_UPDATE);
      } else {
        await adminService.createRole(formData);
        toast.success(ROLE_ADMIN_DRAWER_TEXTS.MESSAGES.SUCCESS_CREATE);
      }
      onSaveSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || ROLE_ADMIN_DRAWER_TEXTS.MESSAGES.ERROR_SAVE);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    updateField,
    handleTogglePermission,
    handleSubmit
  };
};
