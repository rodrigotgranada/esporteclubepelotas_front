import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ROLE_ADMIN_DRAWER_TEXTS } from '../ui/components/roles/RoleAdminDrawer.constants';
import { adminService } from '../services/admin.service';
import { roleAdminSchema, RoleAdminFormData } from '../schemas/roles/role-admin.schema';

const defaultRoleValues: RoleAdminFormData = {
  name: '',
  label: '',
  description: '',
  permissions: [],
};

export const useRoleAdminDrawer = (role: any, onSaveSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RoleAdminFormData>({
    resolver: zodResolver(roleAdminSchema),
    defaultValues: defaultRoleValues,
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name || '',
        label: role.label || '',
        description: role.description || '',
        permissions: role.permissions || [],
      });
    } else {
      form.reset(defaultRoleValues);
    }
  }, [role, form]);

  const handleTogglePermission = (permissionKey: string) => {
    const current = form.getValues('permissions') || [];
    if (current.includes(permissionKey)) {
      form.setValue(
        'permissions',
        current.filter((p) => p !== permissionKey),
      );
    } else {
      form.setValue('permissions', [...current, permissionKey]);
    }
  };

  const handleSubmit = form.handleSubmit(async (data: RoleAdminFormData) => {
    setIsLoading(true);

    try {
      if (role) {
        await adminService.updateRole(role._id, data);
        toast.success(ROLE_ADMIN_DRAWER_TEXTS.MESSAGES.SUCCESS_UPDATE);
      } else {
        await adminService.createRole(data);
        toast.success(ROLE_ADMIN_DRAWER_TEXTS.MESSAGES.SUCCESS_CREATE);
      }
      onSaveSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || ROLE_ADMIN_DRAWER_TEXTS.MESSAGES.ERROR_SAVE);
    } finally {
      setIsLoading(false);
    }
  });

  return {
    form,
    isLoading,
    handleTogglePermission,
    handleSubmit,
  };
};
