import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { updateProfile } from '@/services/profile.service';
import { toast } from 'react-hot-toast';
import { PROFILE_TEXTS } from '../constants';

export const usePreferencesData = () => {
  const { user, updateUser } = useAuthStore();
  const [receiveNewsletter, setReceiveNewsletter] = useState<boolean>(true);
  const [receiveSms, setReceiveSms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.preferences) {
      setReceiveNewsletter(user.preferences.receiveNewsletter ?? true);
      setReceiveSms(user.preferences.receiveSms ?? false);
    }
  }, [user]);

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateProfile({
        preferences: {
          receiveNewsletter,
          receiveSms,
        },
      });
      updateUser(updatedUser);
      toast.success(PROFILE_TEXTS.TOAST_PREFERENCES_SUCCESS);
    } catch (error: any) {
      console.error('Failed to update preferences:', error);
      toast.error(error.response?.data?.message || PROFILE_TEXTS.TOAST_PREFERENCES_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!user) return;
    try {
      const dataToExport = {
        exportedAt: new Date().toISOString(),
        description: 'Cópia de dados pessoais - Esporte Clube Pelotas (LGPD)',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          cpf: user.cpf,
          birthDate: user.birthDate,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          phones: user.phones || [],
          addresses: user.addresses || [],
          preferences: {
            receiveNewsletter,
            receiveSms,
          },
        },
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToExport, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      const cleanCpf = user.cpf ? user.cpf.replace(/\D/g, '') : 'usuario';
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `dados_ecpelotas_${cleanCpf}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success(PROFILE_TEXTS.TOAST_EXPORT_SUCCESS);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  return {
    receiveNewsletter,
    setReceiveNewsletter,
    receiveSms,
    setReceiveSms,
    loading,
    handleSavePreferences,
    handleExportData,
  };
};

