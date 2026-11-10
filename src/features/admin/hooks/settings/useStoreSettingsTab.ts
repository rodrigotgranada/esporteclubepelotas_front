import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore, Settings } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { STORE_SETTINGS_TEXTS } from '../../ui/components/settings/store/StoreSettingsTab.constants';
import { useTransactionalSave } from '@/shared/hooks/useTransactionalSave';
import {
  storeSettingsSchema,
  StoreSettingsFormData,
} from '@/features/admin/schemas/settings/store-settings.schema';

export const useStoreSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { isSaving: isLoading, runTransactionalSave } = useTransactionalSave({
    savingDb: STORE_SETTINGS_TEXTS.SAVING_BUTTON,
  });

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: 'Loja Oficial Lobo Mania',
      storeDescription: '',
      storeExternalUrl: '',
      storeIsOnlineActive: false,
      storeInstagramUrl: 'https://www.instagram.com/lojadolobo/',
      storeWhatsappNumber: '',
      storeWhatsappMessage: 'Olá! Gostaria de informações sobre produtos e mantos oficiais do E.C. Pelotas.',
      storeOpeningHours: 'Segunda a Sexta: 09h às 19h | Sábado: 09h às 13h | Dias de jogos: até o intervalo',
      storeAddress: 'Estádio Boca do Lobo - Av. Bento Gonçalves esquina Parque Dom Antônio Zattera - Pelotas/RS',
      storeHasMemberDiscount: true,
      storeMemberDiscountText: 'Sócios do Pelotas em dia têm desconto exclusivo em produtos e mantos oficiais mediante apresentação da carteirinha física ou digital.',
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (settings) {
      reset({
        storeName: settings.storeName ?? 'Loja Oficial Lobo Mania',
        storeDescription: settings.storeDescription ?? '',
        storeExternalUrl: settings.storeExternalUrl ?? '',
        storeIsOnlineActive: settings.storeIsOnlineActive ?? false,
        storeInstagramUrl: settings.storeInstagramUrl ?? '',
        storeWhatsappNumber: settings.storeWhatsappNumber ?? '',
        storeWhatsappMessage: settings.storeWhatsappMessage ?? '',
        storeOpeningHours: settings.storeOpeningHours ?? '',
        storeAddress: settings.storeAddress ?? '',
        storeHasMemberDiscount: settings.storeHasMemberDiscount ?? true,
        storeMemberDiscountText: settings.storeMemberDiscountText ?? '',
      });
    }
  }, [settings, reset]);

  const handleSave = form.handleSubmit(async (data: StoreSettingsFormData) => {
    await runTransactionalSave<void, Settings>({
      hasPendingMedia: false,
      saveToDb: async () =>
        settingsApi.updateSettings({
          storeName: data.storeName.trim(),
          storeDescription: data.storeDescription?.trim() ?? '',
          storeExternalUrl: data.storeExternalUrl?.trim() ?? '',
          storeIsOnlineActive: Boolean(data.storeIsOnlineActive),
          storeInstagramUrl: data.storeInstagramUrl?.trim() ?? '',
          storeWhatsappNumber: data.storeWhatsappNumber?.trim() ?? '',
          storeWhatsappMessage: data.storeWhatsappMessage?.trim() ?? '',
          storeOpeningHours: data.storeOpeningHours?.trim() ?? '',
          storeAddress: data.storeAddress?.trim() ?? '',
          storeHasMemberDiscount: Boolean(data.storeHasMemberDiscount),
          storeMemberDiscountText: data.storeMemberDiscountText?.trim() ?? '',
        }),
      onConfirmed: (updated) => {
        updateSettings({
          storeName: updated.storeName,
          storeDescription: updated.storeDescription,
          storeExternalUrl: updated.storeExternalUrl,
          storeIsOnlineActive: updated.storeIsOnlineActive,
          storeInstagramUrl: updated.storeInstagramUrl,
          storeWhatsappNumber: updated.storeWhatsappNumber,
          storeWhatsappMessage: updated.storeWhatsappMessage,
          storeOpeningHours: updated.storeOpeningHours,
          storeAddress: updated.storeAddress,
          storeHasMemberDiscount: updated.storeHasMemberDiscount,
          storeMemberDiscountText: updated.storeMemberDiscountText,
        });
        toast.success(STORE_SETTINGS_TEXTS.SAVE_SUCCESS);
      },
      onError: () => {
        toast.error(STORE_SETTINGS_TEXTS.SAVE_ERROR);
      },
    });
  });

  return {
    form,
    isLoading,
    handleSave,
  };
};
