import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettingsStore, Settings } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import toast from 'react-hot-toast';
import { GENERAL_SETTINGS_TEXTS } from '../../ui/components/settings/general/GeneralSettingsTab.constants';
import {
  isBlobUrl,
  sanitizeMediaUrlList,
  stripBlobUrl,
  useTransactionalSave,
  verifyUploadedUrl,
} from '@/shared/hooks/useTransactionalSave';
import {
  generalSettingsSchema,
  GeneralSettingsFormData,
} from '../../schemas/settings/general-settings.schema';

export const useGeneralSettingsTab = () => {
  const { settings, setSettings } = useSettingsStore();
  const isFetching = false;
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const { isSaving, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: GENERAL_SETTINGS_TEXTS.BUTTON_UPLOADING_LOGO,
    savingDb: GENERAL_SETTINGS_TEXTS.BUTTON_SAVING,
  });

  const form = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      clubName: 'Esporte Clube Pelotas',
      clubLogoUrl: null,
      clubLogoGallery: [],
    },
  });

  const previewLogo = form.watch('clubLogoUrl');
  const gallery = form.watch('clubLogoGallery') || [];

  useEffect(() => {
    if (settings) {
      form.setValue('clubName', settings.clubName || '');
      form.setValue(
        'clubLogoGallery',
        settings.clubLogoGallery?.length
          ? settings.clubLogoGallery
          : settings.clubLogoUrl
            ? [settings.clubLogoUrl]
            : [],
      );
      if (!fileToUpload) {
        form.setValue('clubLogoUrl', settings.clubLogoUrl || null);
      }
    }
  }, [settings, fileToUpload, form]);

  useEffect(() => {
    return () => {
      if (previewLogo && isBlobUrl(previewLogo)) {
        URL.revokeObjectURL(previewLogo);
      }
    };
  }, [previewLogo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (cropImageSrc && isBlobUrl(cropImageSrc)) {
        URL.revokeObjectURL(cropImageSrc);
      }
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setCropImageSrc(url);
      setIsCropModalOpen(true);
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    if (previewLogo && isBlobUrl(previewLogo)) {
      URL.revokeObjectURL(previewLogo);
    }
    const url = URL.createObjectURL(croppedBlob);
    form.setValue('clubLogoUrl', url);
    setFileToUpload(new File([croppedBlob], 'logo.png', { type: 'image/png' }));
    setIsCropModalOpen(false);
  };

  const handleUseOriginal = () => {
    if (cropImageSrc && originalFile) {
      form.setValue('clubLogoUrl', cropImageSrc);
      setFileToUpload(originalFile);
      setIsCropModalOpen(false);
    }
  };

  const handleSelectFromGallery = (url: string) => {
    form.setValue('clubLogoUrl', url);
    setFileToUpload(null);
  };

  const handleRemoveFromGallery = (url: string) => {
    const newGallery = gallery.filter((item) => item !== url);
    form.setValue('clubLogoGallery', newGallery);
  };

  const handleSave = form.handleSubmit(async (data: GeneralSettingsFormData) => {
    await runTransactionalSave<string | undefined, Settings>({
      hasPendingMedia: Boolean(fileToUpload),
      uploadMedia: async () => {
        const uploadedUrl = await settingsApi.uploadLogoMedia(fileToUpload!);
        return verifyUploadedUrl(uploadedUrl);
      },
      saveToDb: async (uploadedUrl) => {
        const finalUrl = uploadedUrl
          ? uploadedUrl
          : stripBlobUrl(data.clubLogoUrl, settings?.clubLogoUrl || '');

        let finalGallery = sanitizeMediaUrlList(data.clubLogoGallery);
        if (finalUrl && !finalGallery.includes(finalUrl)) {
          finalGallery = [finalUrl, ...finalGallery];
        }

        const payload = {
          clubName: data.clubName.trim(),
          clubLogoUrl: finalUrl,
          clubLogoGallery: finalGallery,
        };

        const res = await settingsApi.updateSettings(payload);
        return res;
      },
      onConfirmed: (savedSettings) => {
        toast.success(GENERAL_SETTINGS_TEXTS.TOAST_SUCCESS);
        setSettings(savedSettings);
        form.setValue('clubLogoUrl', savedSettings.clubLogoUrl || null);
        form.setValue('clubLogoGallery', savedSettings.clubLogoGallery || []);
        setFileToUpload(null);
      },
      onError: (err: any) => {
        console.error('Failed to update general settings:', err);
        toast.error(err?.response?.data?.message || err?.message || GENERAL_SETTINGS_TEXTS.TOAST_ERROR);
      },
    });
  });

  return {
    form,
    isSaving,
    savingLabel,
    isFetching,
    previewLogo,
    gallery,
    isCropModalOpen,
    setIsCropModalOpen,
    cropImageSrc,
    handleFileChange,
    handleCropSave,
    handleUseOriginal,
    handleSelectFromGallery,
    handleRemoveFromGallery,
    handleSave,
  };
};
