'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore, Settings } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { STORE_SETTINGS_TEXTS } from '../../ui/components/settings/store/StoreSettingsTab.constants';
import {
  useTransactionalSave,
  verifyUploadedUrl,
} from '@/shared/hooks/useTransactionalSave';
import {
  storeSettingsSchema,
  StoreSettingsFormData,
} from '@/features/admin/schemas/settings/store-settings.schema';

/**
 * Normaliza número vindo do banco (ex: "5553999999999") para exibição no MaskedInput sem o 55
 */
function normalizeWhatsappForInput(rawNumber?: string | null): string {
  if (!rawNumber) return '';
  const digits = rawNumber.replace(/\D/g, '');
  if (digits.length >= 12 && digits.startsWith('55')) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Normaliza número do input para salvar no banco garantindo o prefixo 55
 */
function normalizeWhatsappForSave(inputVal?: string | null): string {
  if (!inputVal) return '';
  const digits = inputVal.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }
  return `55${digits}`;
}

export const useStoreSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();

  const facadeFileInputRef = useRef<HTMLInputElement>(null);
  const [facadePreview, setFacadePreview] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const { isSaving: isLoading, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: STORE_SETTINGS_TEXTS.UPLOADING_BUTTON,
    savingDb: STORE_SETTINGS_TEXTS.SAVING_BUTTON,
  });

  const form = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: 'Alcateia',
      storeDescription: '',
      storeFacadeUrl: '',
      storeExternalUrl: '',
      storeIsOnlineActive: false,
      storeInstagramUrl: 'https://www.instagram.com/alcateia.ecpelotas/',
      storeInstagramDescription: 'Acompanhe lançamentos de uniformes, bastidores da boutique, reposições e novidades diárias em primeira mão.',
      storeWhatsappNumber: '',
      storeWhatsappDescription: 'Consulte tamanhos disponíveis, envie seu comprovante e garanta seu manto com atendimento personalizado.',
      storeWhatsappMessage: 'Olá! Gostaria de informações sobre produtos e mantos oficiais do E.C. Pelotas.',
      storeOpeningHours: 'Segunda a Sexta: 09h às 19h | Sábado: 09h às 13h | Dias de jogos: até o intervalo',
      storeAddress: 'Estádio Boca do Lobo - Av. Bento Gonçalves esquina Parque Dom Antônio Zattera - Pelotas/RS',
      storeHasMemberDiscount: true,
      storeMemberDiscountText: 'Sócios do Pelotas em dia têm desconto exclusivo em produtos e mantos oficiais mediante apresentação da carteirinha física ou digital.',
    },
  });

  const { reset, setValue } = form;

  useEffect(() => {
    if (settings) {
      const facade = settings.storeFacadeUrl || '';
      reset({
        storeName: settings.storeName ?? 'Alcateia',
        storeDescription: settings.storeDescription ?? '',
        storeFacadeUrl: facade,
        storeExternalUrl: settings.storeExternalUrl ?? '',
        storeIsOnlineActive: settings.storeIsOnlineActive ?? false,
        storeInstagramUrl: settings.storeInstagramUrl ?? '',
        storeInstagramDescription:
          settings.storeInstagramDescription ??
          'Acompanhe lançamentos de uniformes, bastidores da boutique, reposições e novidades diárias em primeira mão.',
        storeWhatsappNumber: normalizeWhatsappForInput(settings.storeWhatsappNumber),
        storeWhatsappDescription:
          settings.storeWhatsappDescription ??
          'Consulte tamanhos disponíveis, envie seu comprovante e garanta seu manto com atendimento personalizado.',
        storeWhatsappMessage: settings.storeWhatsappMessage ?? '',
        storeOpeningHours: settings.storeOpeningHours ?? '',
        storeAddress: settings.storeAddress ?? '',
        storeHasMemberDiscount: settings.storeHasMemberDiscount ?? true,
        storeMemberDiscountText: settings.storeMemberDiscountText ?? '',
      });
      setFacadePreview(facade || null);
    }
  }, [settings, reset]);

  // Upload e Seleção de Foto da Fachada
  const triggerFacadeFileInput = () => {
    facadeFileInputRef.current?.click();
  };

  const handleFacadeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setIsCropOpen(true);

    if (facadeFileInputRef.current) {
      facadeFileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], `store-facade-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });
    const previewUrl = URL.createObjectURL(croppedBlob);

    setFileToUpload(croppedFile);
    setFacadePreview(previewUrl);
    setValue('storeFacadeUrl', previewUrl, { shouldValidate: true });

    setIsCropOpen(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
    setImageToCrop(null);
  };

  const handleUseOriginal = useCallback(() => {
    if (!imageToCrop) return;
    fetch(imageToCrop)
      .then((res) => res.blob())
      .then(handleCropComplete)
      .catch((err) => {
        console.error('Erro ao usar imagem original da fachada:', err);
      });
  }, [imageToCrop]);

  const handleRemoveFacade = () => {
    setFileToUpload(null);
    setFacadePreview(null);
    setValue('storeFacadeUrl', '', { shouldValidate: true });
  };

  const handleSave = form.handleSubmit(async (data: StoreSettingsFormData) => {
    await runTransactionalSave<string | undefined, Settings>({
      hasPendingMedia: Boolean(fileToUpload),
      uploadMedia: async () => {
        if (fileToUpload) {
          const uploadedUrl = await settingsApi.uploadFacadeMedia(fileToUpload);
          return verifyUploadedUrl(uploadedUrl);
        }
        return undefined;
      },
      saveToDb: async (uploadedFacadeUrl) => {
        let finalFacadeUrl = data.storeFacadeUrl?.trim() ?? '';
        if (uploadedFacadeUrl) {
          finalFacadeUrl = uploadedFacadeUrl;
        } else if (finalFacadeUrl.startsWith('blob:')) {
          finalFacadeUrl = '';
        }

        const normalizedWhatsapp = normalizeWhatsappForSave(data.storeWhatsappNumber);

        return settingsApi.updateSettings({
          storeName: data.storeName.trim(),
          storeDescription: data.storeDescription?.trim() ?? '',
          storeFacadeUrl: finalFacadeUrl,
          storeExternalUrl: data.storeExternalUrl?.trim() ?? '',
          storeIsOnlineActive: Boolean(data.storeIsOnlineActive),
          storeInstagramUrl: data.storeInstagramUrl?.trim() ?? '',
          storeInstagramDescription: data.storeInstagramDescription?.trim() ?? '',
          storeWhatsappNumber: normalizedWhatsapp,
          storeWhatsappDescription: data.storeWhatsappDescription?.trim() ?? '',
          storeWhatsappMessage: data.storeWhatsappMessage?.trim() ?? '',
          storeOpeningHours: data.storeOpeningHours?.trim() ?? '',
          storeAddress: data.storeAddress?.trim() ?? '',
          storeHasMemberDiscount: Boolean(data.storeHasMemberDiscount),
          storeMemberDiscountText: data.storeMemberDiscountText?.trim() ?? '',
        });
      },
      onConfirmed: (updated) => {
        updateSettings({
          storeName: updated.storeName,
          storeDescription: updated.storeDescription,
          storeFacadeUrl: updated.storeFacadeUrl,
          storeExternalUrl: updated.storeExternalUrl,
          storeIsOnlineActive: updated.storeIsOnlineActive,
          storeInstagramUrl: updated.storeInstagramUrl,
          storeInstagramDescription: updated.storeInstagramDescription,
          storeWhatsappNumber: updated.storeWhatsappNumber,
          storeWhatsappDescription: updated.storeWhatsappDescription,
          storeWhatsappMessage: updated.storeWhatsappMessage,
          storeOpeningHours: updated.storeOpeningHours,
          storeAddress: updated.storeAddress,
          storeHasMemberDiscount: updated.storeHasMemberDiscount,
          storeMemberDiscountText: updated.storeMemberDiscountText,
        });
        setFileToUpload(null);
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
    savingLabel,
    facadeFileInputRef,
    facadePreview,
    isCropOpen,
    imageToCrop,
    triggerFacadeFileInput,
    handleFacadeFileChange,
    handleCropComplete,
    handleCropCancel,
    handleUseOriginal,
    handleRemoveFacade,
    handleSave,
  };
};
