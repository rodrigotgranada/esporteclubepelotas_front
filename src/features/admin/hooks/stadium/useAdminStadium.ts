'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useTransactionalSave, stripBlobUrl } from '@/shared/hooks/useTransactionalSave';
import { stadiumService } from '@/features/stadium/services/stadium.service';
import {
  updateStadiumSchema,
  UpdateStadiumFormData,
} from '@/features/stadium/schemas/stadium.schema';
import { StadiumFact, StadiumGalleryImage } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../constants/admin-stadium.constants';
import { FALLBACK_STADIUM_DATA } from '@/features/stadium/constants/stadium.constants';

export type AdminStadiumTab = 'STORY' | 'GENERAL' | 'GALLERY' | 'FACTS';

export const useAdminStadium = () => {
  const [activeTab, setActiveTab] = useState<AdminStadiumTab>('STORY');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mídias pendentes de upload no pipeline Media-First
  const pendingCoverFileRef = useRef<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');

  const { isSaving, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: 'Enviando imagem de capa...',
    savingDb: ADMIN_STADIUM_TEXTS.FORM.SAVING_BUTTON,
  });

  const form = useForm<UpdateStadiumFormData>({
    resolver: zodResolver(updateStadiumSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      coverImageUrl: '',
      inaugurationDate: '',
      capacity: '',
      pitchDimensions: '',
      address: '',
      mapsDirectUrl: '',
      mapsEmbedUrl: '',
      contentHtml: '',
      gallery: [],
      facts: [],
      isActive: true,
    },
  });

  const loadStadium = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await stadiumService.getStadiumForAdmin();
      form.reset({
        title: data.title || '',
        subtitle: data.subtitle || '',
        coverImageUrl: data.coverImageUrl || '',
        inaugurationDate: data.inaugurationDate || '',
        capacity: data.capacity || '',
        pitchDimensions: data.pitchDimensions || '',
        address: data.address || '',
        mapsDirectUrl: data.mapsDirectUrl || '',
        mapsEmbedUrl: data.mapsEmbedUrl || '',
        contentHtml: data.contentHtml || '',
        gallery: data.gallery || [],
        facts: data.facts || [],
        isActive: data.isActive !== undefined ? data.isActive : true,
      });
      setCoverPreviewUrl(data.coverImageUrl || '');
    } catch (err) {
      console.warn(
        '[useAdminStadium] Usando dados padrão para edição da Boca do Lobo enquanto servidor sincroniza:',
        err
      );
      form.reset({
        title: FALLBACK_STADIUM_DATA.title,
        subtitle: FALLBACK_STADIUM_DATA.subtitle,
        coverImageUrl: FALLBACK_STADIUM_DATA.coverImageUrl,
        inaugurationDate: FALLBACK_STADIUM_DATA.inaugurationDate,
        capacity: FALLBACK_STADIUM_DATA.capacity,
        pitchDimensions: FALLBACK_STADIUM_DATA.pitchDimensions,
        address: FALLBACK_STADIUM_DATA.address,
        mapsDirectUrl: FALLBACK_STADIUM_DATA.mapsDirectUrl || '',
        mapsEmbedUrl: FALLBACK_STADIUM_DATA.mapsEmbedUrl || '',
        contentHtml: FALLBACK_STADIUM_DATA.contentHtml,
        gallery: FALLBACK_STADIUM_DATA.gallery || [],
        facts: FALLBACK_STADIUM_DATA.facts || [],
        isActive: true,
      });
      setCoverPreviewUrl(FALLBACK_STADIUM_DATA.coverImageUrl || '');
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadStadium();
  }, [loadStadium]);

  const handleSelectCoverFile = (file: File) => {
    pendingCoverFileRef.current = file;
    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
  };

  const handleAddGalleryImage = async (file: File | Blob, caption: string) => {
    try {
      const uploadRes = await stadiumService.uploadGalleryImage(file);
      const currentGallery = form.getValues('gallery') || [];
      const newPhoto: StadiumGalleryImage = {
        url: uploadRes.url,
        caption: caption.trim(),
        order: currentGallery.length + 1,
      };
      form.setValue('gallery', [...currentGallery, newPhoto], { shouldDirty: true });
      toast.success(ADMIN_STADIUM_TEXTS.GALLERY.SUCCESS_UPLOAD);
    } catch (err) {
      console.error('Erro ao subir foto da galeria:', err);
      toast.error(ADMIN_STADIUM_TEXTS.FEEDBACK.UPLOAD_GALLERY_ERROR);
    }
  };

  const handleUpdateGalleryImage = (index: number, updated: Partial<StadiumGalleryImage>) => {
    const currentGallery = form.getValues('gallery') || [];
    const updatedGallery = currentGallery.map((item, idx) => {
      if (idx === index) {
        return { ...item, ...updated };
      }
      return item;
    });
    form.setValue('gallery', updatedGallery, { shouldDirty: true });
    toast.success(ADMIN_STADIUM_TEXTS.GALLERY.SUCCESS_UPDATE);
  };

  const handleRemoveGalleryImage = (index: number) => {
    const currentGallery = form.getValues('gallery') || [];
    const updated = currentGallery.filter((_, idx) => idx !== index);
    form.setValue('gallery', updated, { shouldDirty: true });
    toast.success(ADMIN_STADIUM_TEXTS.GALLERY.SUCCESS_DELETE);
  };

  const handleAddFact = (fact: StadiumFact) => {
    const currentFacts = form.getValues('facts') || [];
    form.setValue('facts', [...currentFacts, fact], { shouldDirty: true });
    toast.success(ADMIN_STADIUM_TEXTS.FACTS.SUCCESS_ADD);
  };

  const handleUpdateFact = (index: number, updatedFact: StadiumFact) => {
    const currentFacts = form.getValues('facts') || [];
    const updatedFacts = currentFacts.map((item, idx) => (idx === index ? updatedFact : item));
    form.setValue('facts', updatedFacts, { shouldDirty: true });
    toast.success(ADMIN_STADIUM_TEXTS.FACTS.SUCCESS_UPDATE);
  };

  const handleRemoveFact = (index: number) => {
    const currentFacts = form.getValues('facts') || [];
    const updated = currentFacts.filter((_, idx) => idx !== index);
    form.setValue('facts', updated, { shouldDirty: true });
    toast.success(ADMIN_STADIUM_TEXTS.FACTS.SUCCESS_DELETE);
  };

  const onSubmit = form.handleSubmit(async (data: UpdateStadiumFormData) => {
    await runTransactionalSave({
      hasPendingMedia: Boolean(pendingCoverFileRef.current),
      uploadMedia: async () => {
        if (pendingCoverFileRef.current) {
          const uploadRes = await stadiumService.uploadCover(pendingCoverFileRef.current);
          pendingCoverFileRef.current = null;
          return uploadRes.url;
        }
        return '';
      },
      saveToDb: async (uploadedCoverUrl: string) => {
        const finalCoverUrl = uploadedCoverUrl || stripBlobUrl(data.coverImageUrl, '');
        const payload: UpdateStadiumFormData = {
          ...data,
          coverImageUrl: finalCoverUrl,
        };
        return await stadiumService.updateStadiumInfo(payload);
      },
      onConfirmed: async (updated) => {
        form.reset({
          title: updated.title,
          subtitle: updated.subtitle || '',
          coverImageUrl: updated.coverImageUrl || '',
          inaugurationDate: updated.inaugurationDate || '',
          capacity: updated.capacity || '',
          pitchDimensions: updated.pitchDimensions || '',
          address: updated.address || '',
          mapsDirectUrl: updated.mapsDirectUrl || '',
          mapsEmbedUrl: updated.mapsEmbedUrl || '',
          contentHtml: updated.contentHtml,
          gallery: updated.gallery || [],
          facts: updated.facts || [],
          isActive: updated.isActive !== undefined ? updated.isActive : true,
        });
        setCoverPreviewUrl(updated.coverImageUrl || '');
        toast.success(ADMIN_STADIUM_TEXTS.FEEDBACK.SAVE_SUCCESS);
      },
    });
  });

  return {
    form,
    activeTab,
    setActiveTab,
    isLoading,
    isSaving,
    savingLabel,
    coverPreviewUrl,
    handleSelectCoverFile,
    handleAddGalleryImage,
    handleUpdateGalleryImage,
    handleRemoveGalleryImage,
    handleAddFact,
    handleUpdateFact,
    handleRemoveFact,
    onSubmit,
  };
};
