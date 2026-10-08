import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import toast from 'react-hot-toast';
import { GENERAL_SETTINGS_TEXTS } from '../../ui/components/settings/general/GeneralSettingsTab.constants';

export const useGeneralSettingsTab = () => {
  const { settings, setSettings } = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [clubName, setClubName] = useState(settings?.clubName || 'Esporte Clube Pelotas');
  const [previewLogo, setPreviewLogo] = useState<string | null>(settings?.clubLogoUrl || null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [gallery, setGallery] = useState<string[]>(settings?.clubLogoGallery || []);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  useEffect(() => {
    if (settings) {
      setClubName(settings.clubName || '');
      setGallery(settings.clubLogoGallery?.length ? settings.clubLogoGallery : (settings.clubLogoUrl ? [settings.clubLogoUrl] : []));
      if (!fileToUpload) {
        setPreviewLogo(settings.clubLogoUrl || null);
      }
    }
  }, [settings, fileToUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setCropImageSrc(url);
      setIsCropModalOpen(true);
    }
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const url = URL.createObjectURL(croppedBlob);
    setPreviewLogo(url);
    setFileToUpload(new File([croppedBlob], 'logo.png', { type: 'image/png' }));
    setIsCropModalOpen(false);
  };

  const handleUseOriginal = () => {
    if (cropImageSrc && originalFile) {
      setPreviewLogo(cropImageSrc);
      setFileToUpload(originalFile);
      setIsCropModalOpen(false);
    }
  };

  const handleSelectFromGallery = (url: string) => {
    setPreviewLogo(url);
    setFileToUpload(null);
  };

  const handleRemoveFromGallery = (url: string) => {
    const newGallery = gallery.filter(item => item !== url);
    setGallery(newGallery);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data: any = { clubName, clubLogoGallery: gallery };

      if (previewLogo && !previewLogo.startsWith('blob:') && !fileToUpload) {
        data.clubLogoUrl = previewLogo;
      }

      const newSettings = await settingsApi.updateSettings(data, fileToUpload || undefined);
      setSettings(newSettings);
      setFileToUpload(null);
      toast.success(GENERAL_SETTINGS_TEXTS.TOAST_SUCCESS);
    } catch (err) {
      toast.error(GENERAL_SETTINGS_TEXTS.TOAST_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    clubName,
    setClubName,
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
