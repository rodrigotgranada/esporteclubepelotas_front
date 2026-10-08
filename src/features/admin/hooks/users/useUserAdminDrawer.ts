import { useState, useEffect } from 'react';
import { UserAdminData, adminService } from '@/features/admin/services/admin.service';
import { toast } from 'react-hot-toast';
import { ADMIN_TEXTS } from '../../constants/admin.constants';

export const useUserAdminDrawer = (user: UserAdminData | null, onClose: () => void, onSaveSuccess: () => void) => {
  const [formData, setFormData] = useState<Partial<UserAdminData> & { password?: string, confirmPassword?: string }>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'resetPassword' | 'resendEmail' | 'save' | null;
  }>({ isOpen: false, type: null });

  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getRoles();
        setRoles(data);
      } catch (error) {
        console.error('Erro ao buscar cargos:', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        cpf: user.cpf,
        role: user.role?._id || user.role, // Handle both object and string for fallback
        status: user.status,
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        phones: user.phones || [],
        addresses: user.addresses || [],
        password: '',
        confirmPassword: '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        cpf: '',
        role: roles.find((r: any) => r.name === 'USER')?._id || '',
        status: 'ACTIVE',
        birthDate: '',
        phones: [],
        addresses: [],
        password: '',
        confirmPassword: '',
      });
    }
    setAvatarFile(null);
  }, [user, roles]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...(prev.phones || []), { number: '', isWhatsapp: false, isPrimary: (prev.phones?.length === 0) }]
    }));
  };

  const updatePhone = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newPhones = [...(prev.phones || [])];
      newPhones[index] = { ...newPhones[index], [field]: value };
      
      // Handle isPrimary logic
      if (field === 'isPrimary' && value === true) {
        newPhones.forEach((p, i) => { if (i !== index) p.isPrimary = false; });
      }
      return { ...prev, phones: newPhones };
    });
  };

  const removePhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phones: (prev.phones || []).filter((_, i) => i !== index)
    }));
  };

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', isPrimary: (prev.addresses?.length === 0) }]
    }));
  };

  const updateAddress = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newAddresses = [...(prev.addresses || [])];
      newAddresses[index] = { ...newAddresses[index], [field]: value };
      
      // Handle isPrimary logic
      if (field === 'isPrimary' && value === true) {
        newAddresses.forEach((a, i) => { if (i !== index) a.isPrimary = false; });
      }
      return { ...prev, addresses: newAddresses };
    });
  };

  const removeAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: (prev.addresses || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        throw new Error(ADMIN_TEXTS.TOAST_ERROR_PASSWORD_MISMATCH);
      }

      const dataToSave: any = { ...formData };
      delete dataToSave.confirmPassword;
      
      if (!user && !dataToSave.password) {
        throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_PASSWORD);
      }
      
      if (!dataToSave.password) {
        delete dataToSave.password;
      }
      
      // Se não for edição e phones/addresses estiver vazio, vamos forçar array vazio ou erro (o DTO backend exige)
      // Se não for edição e phones/addresses estiver vazio, vamos forçar array vazio ou erro (o DTO backend exige)
      if (!dataToSave.phones || dataToSave.phones.length === 0) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_PHONE);
      if (!dataToSave.addresses || dataToSave.addresses.length === 0) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_ADDRESS);
      if (!dataToSave.birthDate) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_BIRTHDATE);
      
      // Converte birthDate string para Date ISO para o backend
      if (dataToSave.birthDate) {
        dataToSave.birthDate = new Date(dataToSave.birthDate).toISOString();
      }

      if (user) {
        // Edit mode (Backend currently patch admin uses standard fields, we need to handle arrays in backend too if we want to update them, but let's send them)
        await adminService.updateUser(user.id, dataToSave);
        toast.success(ADMIN_TEXTS.TOAST_USER_UPDATED);
      } else {
        // Create Mode
        await adminService.createUser(dataToSave, avatarFile || undefined);
        toast.success(ADMIN_TEXTS.TOAST_USER_CREATED);
      }
      onSaveSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || ADMIN_TEXTS.TOAST_ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await adminService.softDeleteUser(user.id);
      toast.success(ADMIN_TEXTS.TOAST_USER_DELETED);
      onSaveSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || ADMIN_TEXTS.TOAST_ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await adminService.resendVerification(user.id);
      toast.success(ADMIN_TEXTS.TOAST_USER_RESEND_VERIFICATION);
    } catch (error: any) {
      toast.error(error.response?.data?.message || ADMIN_TEXTS.TOAST_ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForcePasswordReset = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await adminService.forcePasswordReset(user.id);
      toast.success(ADMIN_TEXTS.TOAST_USER_PASSWORD_RESET);
    } catch (error: any) {
      toast.error(error.response?.data?.message || ADMIN_TEXTS.TOAST_ERROR_GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const executeConfirmedAction = async () => {
    switch (confirmModal.type) {
      case 'delete':
        await handleSoftDelete();
        break;
      case 'resetPassword':
        await handleForcePasswordReset();
        break;
      case 'resendEmail':
        await handleResendVerification();
        break;
      case 'save':
        await handleSubmit({ preventDefault: () => { } } as React.FormEvent);
        break;
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  const getModalConfig = () => {
    switch (confirmModal.type) {
      case 'delete':
        return {
          title: 'Excluir Usuário',
          description: 'Tem certeza que deseja excluir este usuário? (Soft Delete)',
          variant: 'danger' as const
        };
      case 'resetPassword':
        return {
          title: 'Forçar Redefinição de Senha',
          description: 'Isso enviará um e-mail com instruções de recuperação de senha para o usuário. Deseja continuar?',
          variant: 'warning' as const
        };
      case 'resendEmail':
        return {
          title: 'Reenviar Verificação',
          description: 'Isso enviará um novo e-mail de verificação de conta para o usuário. Continuar?',
          variant: 'info' as const
        };
      case 'save':
        return {
          title: 'Salvar Alterações',
          description: 'Deseja confirmar e salvar os dados deste usuário?',
          variant: 'info' as const
        };
      default:
        return { title: '', description: '', variant: 'info' as const };
    }
  };

  return {
    formData,
    updateField,
    addPhone,
    updatePhone,
    removePhone,
    addAddress,
    updateAddress,
    removeAddress,
    avatarFile,
    setAvatarFile,
    isLoading,
    handleSubmit,
    handleSoftDelete,
    handleResendVerification,
    handleForcePasswordReset,
    confirmModal,
    setConfirmModal,
    executeConfirmedAction,
    getModalConfig,
    availableRoles: roles,
  };
};
