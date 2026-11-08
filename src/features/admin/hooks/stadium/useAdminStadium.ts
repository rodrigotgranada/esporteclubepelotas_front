'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useTransactionalSave, stripBlobUrl, verifyUploadedUrl } from '@/shared/hooks/useTransactionalSave';
import { stadiumService } from '@/features/stadium/services/stadium.service';
import {
  updateStadiumSchema,
  UpdateStadiumFormData,
} from '@/features/stadium/schemas/stadium.schema';
import { StadiumFact, StadiumGalleryImage, StadiumQuickFact } from '@/features/stadium/types/stadium.types';
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
      storyTitle: 'A História Viva da Boca do Lobo',
      storySubtitle: 'Uma viagem pelas memórias, pelo pioneirismo e pela paixão do caldeirão áureo-cerúleo',
      contentHtml: '',
      gallery: [],
      facts: [],
      quickFacts: [],
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
        storyTitle: data.storyTitle || 'A História Viva da Boca do Lobo',
        storySubtitle: data.storySubtitle || 'Uma viagem pelas memórias, pelo pioneirismo e pela paixão do caldeirão áureo-cerúleo',
        contentHtml: data.contentHtml || '',
        gallery: data.gallery || [],
        facts: data.facts || [],
        quickFacts: data.quickFacts || [],
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
        storyTitle: FALLBACK_STADIUM_DATA.storyTitle || 'A História Viva da Boca do Lobo',
        storySubtitle:
          FALLBACK_STADIUM_DATA.storySubtitle ||
          'Uma viagem pelas memórias, pelo pioneirismo e pela paixão do caldeirão áureo-cerúleo',
        contentHtml: FALLBACK_STADIUM_DATA.contentHtml,
        gallery: FALLBACK_STADIUM_DATA.gallery || [],
        facts: FALLBACK_STADIUM_DATA.facts || [],
        quickFacts: FALLBACK_STADIUM_DATA.quickFacts || [],
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

  const persistStadiumMutation = async (
    overrideData: Partial<UpdateStadiumFormData>,
    successMessage: string,
  ) => {
    const currentValues = form.getValues();
    const payload: UpdateStadiumFormData = {
      ...currentValues,
      ...overrideData,
      coverImageUrl: stripBlobUrl(overrideData.coverImageUrl ?? currentValues.coverImageUrl, ''),
    };

    return await runTransactionalSave({
      saveToDb: async () => {
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
          storyTitle: updated.storyTitle || 'A História Viva da Boca do Lobo',
          storySubtitle:
            updated.storySubtitle ||
            'Uma viagem pelas memórias, pelo pioneirismo e pela paixão do caldeirão áureo-cerúleo',
          contentHtml: updated.contentHtml,
          gallery: updated.gallery || [],
          facts: updated.facts || [],
          quickFacts: updated.quickFacts || [],
          isActive: updated.isActive !== undefined ? updated.isActive : true,
        });
        setCoverPreviewUrl(updated.coverImageUrl || '');
        toast.success(successMessage);
      },
      onError: (err) => {
        console.error('Falha ao persistir dados do estádio no banco:', err);
        toast.error(ADMIN_STADIUM_TEXTS.FEEDBACK.SAVE_ERROR);
      },
    });
  };

  const handleAddGalleryImage = async (file: File | Blob, caption: string) => {
    await runTransactionalSave({
      hasPendingMedia: true,
      uploadMedia: async () => {
        const uploadRes = await stadiumService.uploadGalleryImage(file);
        return verifyUploadedUrl(uploadRes.url, ADMIN_STADIUM_TEXTS.FEEDBACK.UPLOAD_GALLERY_ERROR);
      },
      saveToDb: async (uploadedUrl: string) => {
        const currentGallery = form.getValues('gallery') || [];
        const newPhoto: StadiumGalleryImage = {
          url: uploadedUrl,
          caption: caption.trim(),
          order: currentGallery.length + 1,
        };
        const updatedGallery = [...currentGallery, newPhoto];
        const currentValues = form.getValues();
        return await stadiumService.updateStadiumInfo({
          ...currentValues,
          gallery: updatedGallery,
          coverImageUrl: stripBlobUrl(currentValues.coverImageUrl, ''),
        });
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
          storyTitle: updated.storyTitle || 'A História Viva da Boca do Lobo',
          storySubtitle:
            updated.storySubtitle ||
            'Uma viagem pelas memórias, pelo pioneirismo e pela paixão do caldeirão áureo-cerúleo',
          contentHtml: updated.contentHtml,
          gallery: updated.gallery || [],
          facts: updated.facts || [],
          quickFacts: updated.quickFacts || [],
          isActive: updated.isActive !== undefined ? updated.isActive : true,
        });
        setCoverPreviewUrl(updated.coverImageUrl || '');
        toast.success(ADMIN_STADIUM_TEXTS.GALLERY.SUCCESS_UPLOAD);
      },
      onError: (err) => {
        console.error('Erro ao adicionar foto à galeria:', err);
        toast.error(ADMIN_STADIUM_TEXTS.FEEDBACK.UPLOAD_GALLERY_ERROR);
      },
    });
  };

  const handleUpdateGalleryImage = async (index: number, updated: Partial<StadiumGalleryImage>) => {
    const currentGallery = form.getValues('gallery') || [];
    const updatedGallery = currentGallery.map((item, idx) => {
      if (idx === index) {
        return { ...item, ...updated };
      }
      return item;
    });

    await persistStadiumMutation({ gallery: updatedGallery }, ADMIN_STADIUM_TEXTS.GALLERY.SUCCESS_UPDATE);
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const currentGallery = form.getValues('gallery') || [];
    const updated = currentGallery.filter((_, idx) => idx !== index);
    await persistStadiumMutation({ gallery: updated }, ADMIN_STADIUM_TEXTS.GALLERY.SUCCESS_DELETE);
  };

  const handleAddFact = async (fact: StadiumFact) => {
    const currentFacts = form.getValues('facts') || [];
    const updatedFacts = [...currentFacts, fact];
    await persistStadiumMutation({ facts: updatedFacts }, ADMIN_STADIUM_TEXTS.FACTS.SUCCESS_ADD);
  };

  const handleUpdateFact = async (index: number, updatedFact: StadiumFact) => {
    const currentFacts = form.getValues('facts') || [];
    const updatedFacts = currentFacts.map((item, idx) => (idx === index ? updatedFact : item));
    await persistStadiumMutation({ facts: updatedFacts }, ADMIN_STADIUM_TEXTS.FACTS.SUCCESS_UPDATE);
  };

  const handleRemoveFact = async (index: number) => {
    const currentFacts = form.getValues('facts') || [];
    const updated = currentFacts.filter((_, idx) => idx !== index);
    await persistStadiumMutation({ facts: updated }, ADMIN_STADIUM_TEXTS.FACTS.SUCCESS_DELETE);
  };

  const handleAddQuickFact = async (card: Omit<StadiumQuickFact, 'id'>) => {
    const currentQuickFacts = form.getValues('quickFacts') || [];
    const newCard: StadiumQuickFact = {
      ...card,
      id: `fact-${Date.now()}`,
      order: currentQuickFacts.length + 1,
    };
    const updated = [...currentQuickFacts, newCard];
    await persistStadiumMutation({ quickFacts: updated }, ADMIN_STADIUM_TEXTS.QUICK_FACTS.SUCCESS_ADD);
  };

  const handleUpdateQuickFact = async (index: number, updatedCard: StadiumQuickFact) => {
    const currentQuickFacts = form.getValues('quickFacts') || [];
    const updated = currentQuickFacts.map((item, idx) => (idx === index ? updatedCard : item));
    await persistStadiumMutation({ quickFacts: updated }, ADMIN_STADIUM_TEXTS.QUICK_FACTS.SUCCESS_UPDATE);
  };

  const handleRemoveQuickFact = async (index: number) => {
    const currentQuickFacts = form.getValues('quickFacts') || [];
    const updated = currentQuickFacts.filter((_, idx) => idx !== index);
    await persistStadiumMutation({ quickFacts: updated }, ADMIN_STADIUM_TEXTS.QUICK_FACTS.SUCCESS_DELETE);
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
          storyTitle: updated.storyTitle || 'A História Viva da Boca do Lobo',
          storySubtitle:
            updated.storySubtitle ||
            'Uma viagem pelas memórias, pelo pioneirismo e pela paixão do caldeirão áureo-cerúleo',
          contentHtml: updated.contentHtml,
          gallery: updated.gallery || [],
          facts: updated.facts || [],
          quickFacts: updated.quickFacts || [],
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
    handleAddQuickFact,
    handleUpdateQuickFact,
    handleRemoveQuickFact,
    onSubmit,
  };
};
