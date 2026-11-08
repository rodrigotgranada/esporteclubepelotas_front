'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { adminSponsorsService } from '../../services/admin-sponsors.service';
import { sponsorSchema, SponsorFormData } from '../../schemas/sponsor.schema';
import { ADMIN_SPONSORS_TEXTS } from '../../constants/admin-sponsors.constants';
import { CreateSponsorPayload } from '@/features/sponsors/types/sponsors.types';
import {
  useTransactionalSave,
  verifyUploadedUrl,
  stripBlobUrl,
} from '@/shared/hooks/useTransactionalSave';

interface UseSponsorAdminDrawerProps {
  isOpen: boolean;
  sponsorId?: string | null;
  onSaveSuccess: () => void;
  onClose: () => void;
}

export type LogoTarget = 'light' | 'dark';

export const useSponsorAdminDrawer = ({
  isOpen,
  sponsorId,
  onSaveSuccess,
  onClose,
}: UseSponsorAdminDrawerProps) => {
  const fileInputLightRef = useRef<HTMLInputElement>(null);
  const fileInputDarkRef = useRef<HTMLInputElement>(null);

  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [fileLightToUpload, setFileLightToUpload] = useState<File | null>(null);

  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);
  const [fileDarkToUpload, setFileDarkToUpload] = useState<File | null>(null);

  const [cropTarget, setCropTarget] = useState<LogoTarget | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const { isSaving, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: ADMIN_SPONSORS_TEXTS.DRAWER.BUTTON_UPLOADING,
    savingDb: ADMIN_SPONSORS_TEXTS.DRAWER.BUTTON_SAVING,
  });

  const form = useForm<SponsorFormData>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      logoDarkUrl: '',
      websiteUrl: '',
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
      contractStartDate: '',
      contractEndDate: '',
    },
  });

  const resetAll = useCallback(() => {
    form.reset({
      name: '',
      logoUrl: '',
      logoDarkUrl: '',
      websiteUrl: '',
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
      contractStartDate: '',
      contractEndDate: '',
    });
    setLogoLightPreview(null);
    setFileLightToUpload(null);
    setLogoDarkPreview(null);
    setFileDarkToUpload(null);
    setCropTarget(null);
    setImageToCrop(null);
    setIsCropOpen(false);
  }, [form]);

  // Carregar dados caso seja edição
  useEffect(() => {
    if (!isOpen) {
      resetAll();
      return;
    }

    if (sponsorId) {
      setIsLoadingDetails(true);
      adminSponsorsService
        .getSponsorById(sponsorId)
        .then((sponsor) => {
          const isFeatured = Boolean(sponsor.isFeatured ?? (sponsor as any).featured ?? false);
          const isActive =
            sponsor.isActive !== undefined
              ? Boolean(sponsor.isActive)
              : (sponsor as any).active !== undefined
                ? Boolean((sponsor as any).active)
                : true;

          const lightUrl = sponsor.logoUrl || '';
          const darkUrl = sponsor.logoDarkUrl || '';

          form.reset({
            name: sponsor.name || '',
            logoUrl: lightUrl,
            logoDarkUrl: darkUrl,
            websiteUrl: sponsor.websiteUrl || '',
            isFeatured,
            isActive,
            displayOrder: sponsor.displayOrder ?? 0,
            contractStartDate: sponsor.contractStartDate ? sponsor.contractStartDate.slice(0, 10) : '',
            contractEndDate: sponsor.contractEndDate ? sponsor.contractEndDate.slice(0, 10) : '',
          });
          setLogoLightPreview(lightUrl || null);
          setLogoDarkPreview(darkUrl || null);
        })
        .catch((err) => {
          console.error('Erro ao buscar dados do patrocinador:', err);
          toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_LOAD);
          onClose();
        })
        .finally(() => {
          setIsLoadingDetails(false);
        });
    } else {
      resetAll();
    }
  }, [isOpen, sponsorId, form, resetAll, onClose]);

  // Disparo dos seletores de arquivo
  const triggerFileInput = (target: LogoTarget) => {
    if (target === 'light') {
      fileInputLightRef.current?.click();
    } else {
      fileInputDarkRef.current?.click();
    }
  };

  const handleFileChange = (target: LogoTarget, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropTarget(target);
    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setIsCropOpen(true);

    if (target === 'light' && fileInputLightRef.current) {
      fileInputLightRef.current.value = '';
    } else if (target === 'dark' && fileInputDarkRef.current) {
      fileInputDarkRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const prefix = cropTarget === 'dark' ? 'sponsor-logo-dark' : 'sponsor-logo-light';
    const croppedFile = new File([croppedBlob], `${prefix}-${Date.now()}.png`, {
      type: 'image/png',
    });
    const previewUrl = URL.createObjectURL(croppedBlob);

    if (cropTarget === 'dark') {
      setFileDarkToUpload(croppedFile);
      setLogoDarkPreview(previewUrl);
      form.setValue('logoDarkUrl', previewUrl, { shouldValidate: true });
    } else {
      setFileLightToUpload(croppedFile);
      setLogoLightPreview(previewUrl);
      form.setValue('logoUrl', previewUrl, { shouldValidate: true });
    }

    setIsCropOpen(false);
    setImageToCrop(null);
    setCropTarget(null);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
    setImageToCrop(null);
    setCropTarget(null);
  };

  const handleUseOriginal = useCallback(() => {
    if (!imageToCrop) return;
    fetch(imageToCrop)
      .then((res) => res.blob())
      .then(handleCropComplete)
      .catch((err) => {
        console.error('Erro ao usar imagem original do logotipo:', err);
      });
  }, [imageToCrop, handleCropComplete]);

  const handleRemoveLogo = (target: LogoTarget) => {
    if (target === 'dark') {
      setFileDarkToUpload(null);
      setLogoDarkPreview(null);
      form.setValue('logoDarkUrl', '', { shouldValidate: true });
    } else {
      setFileLightToUpload(null);
      setLogoLightPreview(null);
      form.setValue('logoUrl', '', { shouldValidate: true });
    }
  };

  // Submissão com Pipeline Transacional Media-First
  const onSubmit = form.handleSubmit((data: SponsorFormData) => {
    const hasAnyLogo = Boolean(
      fileLightToUpload ||
        (data.logoUrl && !data.logoUrl.startsWith('blob:')) ||
        fileDarkToUpload ||
        (data.logoDarkUrl && !data.logoDarkUrl.startsWith('blob:')),
    );

    if (!hasAnyLogo) {
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_LOGO_REQUIRED);
      return;
    }

    runTransactionalSave({
      hasPendingMedia: Boolean(fileLightToUpload || fileDarkToUpload),
      uploadMedia: async () => {
        let uploadedLightUrl: string | undefined;
        let uploadedDarkUrl: string | undefined;

        if (fileLightToUpload) {
          const resLight = await adminSponsorsService.uploadLogo(fileLightToUpload);
          uploadedLightUrl = verifyUploadedUrl(resLight);
        }

        if (fileDarkToUpload) {
          const resDark = await adminSponsorsService.uploadLogo(fileDarkToUpload);
          uploadedDarkUrl = verifyUploadedUrl(resDark);
        }

        return { uploadedLightUrl, uploadedDarkUrl };
      },
      saveToDb: async (uploadResult) => {
        const finalLightUrl = uploadResult?.uploadedLightUrl
          ? uploadResult.uploadedLightUrl
          : stripBlobUrl(data.logoUrl || '', '');

        const finalDarkUrl = uploadResult?.uploadedDarkUrl
          ? uploadResult.uploadedDarkUrl
          : stripBlobUrl(data.logoDarkUrl || '', '');

        const payload: CreateSponsorPayload = {
          name: data.name.trim(),
          logoUrl: finalLightUrl || finalDarkUrl, // fallback canônico no backend
          logoDarkUrl: finalDarkUrl || null,
          websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null,
          isFeatured: Boolean(data.isFeatured),
          featured: Boolean(data.isFeatured),
          isActive: Boolean(data.isActive),
          active: Boolean(data.isActive),
          displayOrder: Number(data.displayOrder || 0),
          contractStartDate: data.contractStartDate ? data.contractStartDate : null,
          contractEndDate: data.contractEndDate ? data.contractEndDate : null,
        };

        if (sponsorId) {
          return await adminSponsorsService.updateSponsor(sponsorId, payload);
        } else {
          return await adminSponsorsService.createSponsor(payload);
        }
      },
      onConfirmed: () => {
        toast.success(
          sponsorId
            ? ADMIN_SPONSORS_TEXTS.TOAST.UPDATE_SUCCESS
            : ADMIN_SPONSORS_TEXTS.TOAST.CREATE_SUCCESS,
        );
        resetAll();
        onSaveSuccess();
      },
      onError: (err) => {
        console.error('Erro na submissão do patrocinador:', err);
        toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_SAVE);
      },
    });
  });

  // Previews dinâmicos com regra de fallback mútuo para a UI
  const effectiveLightPreview = logoLightPreview || logoDarkPreview || null;
  const effectiveDarkPreview = logoDarkPreview || logoLightPreview || null;

  return {
    form,
    fileInputLightRef,
    fileInputDarkRef,
    logoLightPreview,
    logoDarkPreview,
    effectiveLightPreview,
    effectiveDarkPreview,
    isCropOpen,
    imageToCrop,
    isLoadingDetails,
    isSaving,
    savingLabel,
    triggerFileInput,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleUseOriginal,
    handleRemoveLogo,
    onSubmit,
  };
};
