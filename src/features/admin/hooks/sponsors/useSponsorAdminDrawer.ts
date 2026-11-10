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

export const useSponsorAdminDrawer = ({
  isOpen,
  sponsorId,
  onSaveSuccess,
  onClose,
}: UseSponsorAdminDrawerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

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
    setLogoPreview(null);
    setFileToUpload(null);
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

          const logo = sponsor.logoUrl || sponsor.logoDarkUrl || '';

          form.reset({
            name: sponsor.name || '',
            logoUrl: logo,
            logoDarkUrl: logo,
            websiteUrl: sponsor.websiteUrl || '',
            isFeatured,
            isActive,
            displayOrder: sponsor.displayOrder ?? 0,
            contractStartDate: sponsor.contractStartDate ? sponsor.contractStartDate.slice(0, 10) : '',
            contractEndDate: sponsor.contractEndDate ? sponsor.contractEndDate.slice(0, 10) : '',
          });

          setLogoPreview(logo || null);
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

  // Disparo do seletor de arquivo
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setIsCropOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], `sponsor-logo-${Date.now()}.png`, {
      type: 'image/png',
    });
    const previewUrl = URL.createObjectURL(croppedBlob);

    setFileToUpload(croppedFile);
    setLogoPreview(previewUrl);
    form.setValue('logoUrl', previewUrl, { shouldValidate: true });
    form.setValue('logoDarkUrl', previewUrl, { shouldValidate: true });

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
        console.error('Erro ao usar imagem original do logotipo:', err);
      });
  }, [imageToCrop, handleCropComplete]);

  const handleRemoveLogo = () => {
    setFileToUpload(null);
    setLogoPreview(null);
    form.setValue('logoUrl', '', { shouldValidate: true });
    form.setValue('logoDarkUrl', '', { shouldValidate: true });
  };

  // Submissão com Pipeline Transacional Media-First
  const onSubmit = form.handleSubmit((data: SponsorFormData) => {
    const hasLogo = Boolean(
      fileToUpload || (data.logoUrl && !data.logoUrl.startsWith('blob:'))
    );

    if (!hasLogo) {
      toast.error('O logotipo oficial da marca é obrigatório.');
      return;
    }

    runTransactionalSave({
      hasPendingMedia: Boolean(fileToUpload),
      uploadMedia: async () => {
        let uploadedUrl: string | undefined;

        if (fileToUpload) {
          const res = await adminSponsorsService.uploadLogo(fileToUpload);
          uploadedUrl = verifyUploadedUrl(res);
        }

        return { uploadedUrl };
      },
      saveToDb: async (uploadResult) => {
        const finalUrl = uploadResult?.uploadedUrl
          ? uploadResult.uploadedUrl
          : stripBlobUrl(data.logoUrl || '', '');

        const payload: CreateSponsorPayload = {
          name: data.name.trim(),
          logoUrl: finalUrl,
          logoDarkUrl: finalUrl,
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

  return {
    form,
    fileInputRef,
    logoPreview,
    effectivePreview: logoPreview,
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
