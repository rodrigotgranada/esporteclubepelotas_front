import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserAdminData, adminService } from '@/features/admin/services/admin.service';
import { toast } from 'react-hot-toast';
import { ADMIN_TEXTS } from '../../constants/admin.constants';
import { fetchViaCEP, formatCEP, generateTemporaryPassword } from '@/shared/utils';
import { USER_ADMIN_DRAWER_TEXTS } from '../../ui/components/users/UserAdminDrawer.constants';
import { userAdminSchema, UserAdminFormData } from '../../schemas/users/user-admin.schema';

const extractRoleId = (role: any): string => {
  if (!role) return '';
  if (typeof role === 'string') return role;
  if (typeof role === 'object') {
    if (role._id) {
      if (typeof role._id === 'string') return role._id;
      if (typeof role._id === 'object' && role._id.toString) {
        const str = role._id.toString();
        if (str && str !== '[object Object]') return str;
      }
    }
    if (role.name && typeof role.name === 'string') return role.name;
    if (role.id && typeof role.id === 'string') return role.id;
    if (role.toString) {
      const str = role.toString();
      if (str && str !== '[object Object]') return str;
    }
  }
  return '';
};

const defaultUserValues: UserAdminFormData = {
  firstName: '',
  lastName: '',
  email: '',
  cpf: '',
  role: '',
  status: 'ACTIVE',
  birthDate: '',
  phones: [],
  addresses: [],
  password: '',
  confirmPassword: '',
  mustChangePassword: false,
  avatarUrl: '',
};

export const useUserAdminDrawer = (user: UserAdminData | null, onClose: () => void, onSaveSuccess: () => void) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'resetPassword' | 'resendEmail' | 'save' | null;
  }>({ isOpen: false, type: null });

  const [roles, setRoles] = useState<any[]>([]);

  const form = useForm<UserAdminFormData>({
    resolver: zodResolver(userAdminSchema),
    defaultValues: defaultUserValues,
  });

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
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        cpf: user.cpf || '',
        role: extractRoleId(user.role),
        status: (user.status as 'ACTIVE' | 'PENDING' | 'BLOCKED' | 'INACTIVE') || 'ACTIVE',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        phones: (user.phones || []).map((p) => ({
          number: p.number,
          isWhatsapp: Boolean(p.isWhatsapp),
          isPrimary: Boolean(p.isPrimary),
        })),
        addresses: (user.addresses || []).map((a) => ({
          zipCode: a.zipCode,
          street: a.street,
          number: a.number,
          complement: a.complement || '',
          neighborhood: a.neighborhood,
          city: a.city,
          state: a.state,
          isPrimary: Boolean(a.isPrimary),
        })),
        password: '',
        confirmPassword: '',
        mustChangePassword: user.mustChangePassword ?? false,
        avatarUrl: user.avatarUrl || '',
      });
    } else {
      const defaultRole = roles.find((r: any) => r.name === 'USER')?._id || '';
      form.reset({
        ...defaultUserValues,
        role: defaultRole,
      });
    }
    setAvatarFile(null);
  }, [user, roles, form]);

  const addPhone = () => {
    const current = form.getValues('phones') || [];
    form.setValue('phones', [
      ...current,
      { number: '', isWhatsapp: false, isPrimary: current.length === 0 },
    ]);
  };

  const updatePhone = (index: number, field: string, value: any) => {
    const current = [...(form.getValues('phones') || [])];
    if (!current[index]) return;
    current[index] = { ...current[index], [field]: value };

    if (field === 'isPrimary' && value === true) {
      current.forEach((p, i) => {
        if (i !== index) p.isPrimary = false;
      });
    }
    form.setValue('phones', current);
  };

  const removePhone = (index: number) => {
    const current = form.getValues('phones') || [];
    form.setValue(
      'phones',
      current.filter((_, i) => i !== index),
    );
  };

  const addAddress = () => {
    const current = form.getValues('addresses') || [];
    form.setValue('addresses', [
      ...current,
      {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        isPrimary: current.length === 0,
      },
    ]);
  };

  const updateAddress = async (index: number, field: string, value: any) => {
    const current = [...(form.getValues('addresses') || [])];
    if (!current[index]) return;

    if (field === 'zipCode' && typeof value === 'string') {
      const formatted = formatCEP(value);
      current[index] = { ...current[index], zipCode: formatted };
      form.setValue('addresses', current);

      const cleanZip = value.replace(/\D/g, '');
      if (cleanZip.length === 8) {
        try {
          const cepData = await fetchViaCEP(cleanZip);
          if (cepData) {
            const updated = [...(form.getValues('addresses') || [])];
            if (updated[index]) {
              updated[index] = {
                ...updated[index],
                zipCode: formatted,
                street: cepData.logradouro || updated[index].street || '',
                neighborhood: cepData.bairro || updated[index].neighborhood || '',
                city: cepData.localidade || updated[index].city || '',
                state: cepData.uf || updated[index].state || '',
              };
              form.setValue('addresses', updated);
            }
          }
        } catch (err) {
          console.error('ViaCEP lookup failed:', err);
        }
      }
      return;
    }

    current[index] = { ...current[index], [field]: value };
    if (field === 'isPrimary' && value === true) {
      current.forEach((a, i) => {
        if (i !== index) a.isPrimary = false;
      });
    }
    form.setValue('addresses', current);
  };

  const removeAddress = (index: number) => {
    const current = form.getValues('addresses') || [];
    form.setValue(
      'addresses',
      current.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = form.handleSubmit(async (data: UserAdminFormData) => {
    setIsLoading(true);

    try {
      if (user) {
        // Edit mode (PATCH semantics)
        const partialData: Record<string, any> = {};

        // 1. Avatar update
        if (avatarFile) {
          await adminService.updateUserAvatar(user.id, avatarFile);
        } else if (data.avatarUrl === '' && user.avatarUrl) {
          partialData.avatarUrl = '';
        }

        // 2. Personal fields
        if (data.firstName !== user.firstName) partialData.firstName = data.firstName;
        if (data.lastName !== user.lastName) partialData.lastName = data.lastName;
        if (data.email !== user.email) partialData.email = data.email;
        if (data.status !== user.status) partialData.status = data.status;

        if (data.birthDate) {
          const userBirth = user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '';
          const formBirth = data.birthDate.split('T')[0];
          if (formBirth !== userBirth) {
            partialData.birthDate = new Date(data.birthDate).toISOString();
          }
        }

        if (data.password) {
          partialData.password = data.password;
          partialData.mustChangePassword = Boolean(data.mustChangePassword);
        } else if (data.mustChangePassword !== user.mustChangePassword) {
          partialData.mustChangePassword = data.mustChangePassword;
        }

        // 3. Role
        const originalRoleId = extractRoleId(user.role);
        const formRoleId = extractRoleId(data.role);
        if (formRoleId && formRoleId !== originalRoleId) {
          partialData.role = formRoleId;
        }

        // 4. Phones
        const cleanPhone = (p: any) => ({
          number: (p.number || '').replace(/\D/g, ''),
          isWhatsapp: Boolean(p.isWhatsapp),
          isPrimary: Boolean(p.isPrimary),
        });
        const originalPhones = (user.phones || []).map(cleanPhone);
        const formPhones = (data.phones || []).map(cleanPhone);
        if (JSON.stringify(originalPhones) !== JSON.stringify(formPhones)) {
          if (formPhones.length === 0) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_PHONE);
          partialData.phones = formPhones;
        }

        // 5. Addresses
        const cleanAddress = (a: any) => ({
          zipCode: a.zipCode || '',
          street: a.street || '',
          number: a.number || '',
          complement: a.complement || '',
          neighborhood: a.neighborhood || '',
          city: a.city || '',
          state: a.state || '',
          isPrimary: Boolean(a.isPrimary),
        });
        const originalAddresses = (user.addresses || []).map(cleanAddress);
        const formAddresses = (data.addresses || []).map(cleanAddress);
        if (JSON.stringify(originalAddresses) !== JSON.stringify(formAddresses)) {
          if (formAddresses.length === 0) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_ADDRESS);
          partialData.addresses = formAddresses;
        }

        if (Object.keys(partialData).length > 0) {
          await adminService.updateUser(user.id, partialData);
        }

        toast.success(ADMIN_TEXTS.TOAST_USER_UPDATED);
      } else {
        // Create Mode
        if (!data.password) {
          throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_PASSWORD);
        }
        if (!data.phones || data.phones.length === 0) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_PHONE);
        if (!data.addresses || data.addresses.length === 0) throw new Error(ADMIN_TEXTS.TOAST_ERROR_NO_ADDRESS);

        const dataToSave: any = {
          ...data,
          birthDate: new Date(data.birthDate).toISOString(),
          role: extractRoleId(data.role) || roles.find((r: any) => r.name === 'USER')?._id,
          phones: (data.phones || []).map((p: any) => ({
            number: (p.number || '').replace(/\D/g, ''),
            isWhatsapp: Boolean(p.isWhatsapp),
            isPrimary: Boolean(p.isPrimary),
          })),
          addresses: (data.addresses || []).map((a: any) => ({
            zipCode: a.zipCode || '',
            street: a.street || '',
            number: a.number || '',
            complement: a.complement || '',
            neighborhood: a.neighborhood || '',
            city: a.city || '',
            state: a.state || '',
            isPrimary: Boolean(a.isPrimary),
          })),
        };
        delete dataToSave.confirmPassword;

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
  });

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

  const handleGenerateTemporaryPassword = () => {
    const generated = generateTemporaryPassword();
    form.setValue('password', generated);
    form.setValue('confirmPassword', generated);
    form.setValue('mustChangePassword', true);
    toast.success(USER_ADMIN_DRAWER_TEXTS.FEEDBACK.PASSWORD_GENERATED);
  };

  const handleCopyPassword = async () => {
    const pass = form.getValues('password');
    if (!pass) return;
    try {
      await navigator.clipboard.writeText(pass);
      toast.success(USER_ADMIN_DRAWER_TEXTS.FEEDBACK.PASSWORD_COPIED);
    } catch {
      toast.error(USER_ADMIN_DRAWER_TEXTS.FEEDBACK.PASSWORD_COPIED_FAILED);
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
        await handleSubmit();
        break;
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  const getModalConfig = () => {
    switch (confirmModal.type) {
      case 'delete':
        return {
          title: 'Excluir Usuário',
          description: USER_ADMIN_DRAWER_TEXTS.MODALS.CONFIRM_DELETE(user ? `${user.firstName} ${user.lastName}` : ''),
          confirmText: 'Excluir',
        };
      case 'resetPassword':
        return {
          title: 'Resetar Senha',
          description: USER_ADMIN_DRAWER_TEXTS.MODALS.CONFIRM_RESET_PASSWORD,
          confirmText: 'Resetar',
        };
      case 'resendEmail':
        return {
          title: 'Reenviar E-mail',
          description: USER_ADMIN_DRAWER_TEXTS.MODALS.CONFIRM_RESEND_VERIFICATION,
          confirmText: 'Reenviar',
        };
      case 'save':
      default:
        return {
          title: 'Salvar Alterações',
          description: USER_ADMIN_DRAWER_TEXTS.MODALS.CONFIRM_SAVE,
          confirmText: 'Salvar',
        };
    }
  };

  return {
    form,
    avatarFile,
    setAvatarFile,
    isLoading,
    handleSubmit,
    addPhone,
    updatePhone,
    removePhone,
    addAddress,
    updateAddress,
    removeAddress,
    handleGenerateTemporaryPassword,
    handleCopyPassword,
    confirmModal,
    setConfirmModal,
    executeConfirmedAction,
    getModalConfig,
    availableRoles: roles,
  };
};
