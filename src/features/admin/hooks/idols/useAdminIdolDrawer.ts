'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  useTransactionalSave,
  stripBlobUrl,
  sanitizeMediaUrlList,
  verifyUploadedUrl,
  isBlobUrl,
} from '@/shared/hooks';
import { adminIdolsService } from '../../services/admin-idols.service';
import {
  IdolCategory,
  IdolGalleryItem,
  IdolPeriod,
} from '../../../idols/services/idols.service';
import { ADMIN_IDOLS_TEXTS } from '../../constants/admin-idols.constants';
import { idolSchema, IdolFormData } from '../../schemas/idols/idol.schema';

const defaultFormValues: IdolFormData = {
  name: '',
  nickname: '',
  slug: '',
  category: 'PLAYER',
  photoUrl: null,
  startYear: '',
  endYear: '',
  periods: [],
  galleryItems: [],
  isActiveInClub: false,
  birthDate: '',
  deathDate: '',
  birthPlace: '',
  quote: '',
  biography: '',
  isFeatured: false,
  order: 0,
  position: '',
  preferredFoot: 'Destro',
  historicJerseyNumber: '',
  matchesCount: '',
  goalsCount: '',
  titlesText: '',
  memorableMatch: '',
  coachMatches: '',
  coachWins: '',
  coachDraws: '',
  coachLosses: '',
  coachTitlesText: '',
  tacticalStyle: '',
  roleName: '',
  yearsOfDedication: '',
  backstageStory: '',
  stadiumSector: '',
  trademark: '',
};

export const useAdminIdolDrawer = (
  idolId: string | null,
  isOpen: boolean,
  onSaveSuccess: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);

  const { isSaving, savingStage, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: ADMIN_IDOLS_TEXTS.DRAWER.BUTTON_UPLOADING_MEDIA,
    savingDb: ADMIN_IDOLS_TEXTS.DRAWER.BUTTON_SAVING_DB,
  });

  const form = useForm<IdolFormData>({
    resolver: zodResolver(idolSchema),
    defaultValues: defaultFormValues,
  });

  const resetForm = useCallback(() => {
    form.reset(defaultFormValues);
    setPhotoBlob(null);
    setPendingGalleryFiles([]);
  }, [form]);

  const loadIdol = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        const data = await adminIdolsService.getIdolById(id);

        form.reset({
          name: data.name || '',
          nickname: data.nickname || '',
          slug: data.slug || '',
          category: (data.category as IdolCategory) || 'PLAYER',
          photoUrl: data.photoUrl || null,
          startYear: data.startYear || '',
          endYear: data.endYear || '',
          periods:
            data.periods && data.periods.length > 0
              ? data.periods
              : data.startYear
                ? [{ startYear: data.startYear, endYear: data.endYear || null, label: '' }]
                : [],
          galleryItems:
            data.galleryItems && data.galleryItems.length > 0
              ? data.galleryItems
              : (data.gallery || []).map((url) => ({ url, caption: '' })),
          isActiveInClub: Boolean(data.isActiveInClub),
          birthDate: data.birthDate ? data.birthDate.substring(0, 10) : '',
          deathDate: data.deathDate ? data.deathDate.substring(0, 10) : '',
          birthPlace: data.birthPlace || '',
          quote: data.quote || '',
          biography: data.biography || '',
          isFeatured: Boolean(data.isFeatured),
          order: data.order ?? 0,
          position: data.playerStats?.position || '',
          preferredFoot: data.playerStats?.preferredFoot || 'Destro',
          historicJerseyNumber: data.playerStats?.historicJerseyNumber ?? '',
          matchesCount: data.playerStats?.matchesCount ?? '',
          goalsCount: data.playerStats?.goalsCount ?? '',
          titlesText: data.playerStats?.titles ? data.playerStats.titles.join('\n') : '',
          memorableMatch: data.playerStats?.memorableMatch || '',
          coachMatches: data.coachStats?.matchesCount ?? '',
          coachWins: data.coachStats?.winsCount ?? '',
          coachDraws: data.coachStats?.drawsCount ?? '',
          coachLosses: data.coachStats?.lossesCount ?? '',
          coachTitlesText: data.coachStats?.titles ? data.coachStats.titles.join('\n') : '',
          tacticalStyle: data.coachStats?.tacticalStyle || '',
          roleName: data.staffStats?.roleName || '',
          yearsOfDedication: data.staffStats?.yearsOfDedication || '',
          backstageStory: data.staffStats?.backstageStory || '',
          stadiumSector: data.fanStats?.stadiumSector || '',
          trademark: data.fanStats?.trademark || '',
        });

        setPhotoBlob(null);
        setPendingGalleryFiles([]);
      } catch (err) {
        console.error('Erro ao carregar dados do ídolo:', err);
        toast.error('Erro ao carregar dados do ídolo.');
      } finally {
        setIsLoading(false);
      }
    },
    [form],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (idolId) {
      loadIdol(idolId);
    } else {
      resetForm();
    }
  }, [isOpen, idolId, loadIdol, resetForm]);

  const handleCropSave = (croppedBlob: Blob) => {
    setPhotoBlob(croppedBlob);
    form.setValue('photoUrl', URL.createObjectURL(croppedBlob));
  };

  const handlePhotoRemove = () => {
    setPhotoBlob(null);
    form.setValue('photoUrl', null);
  };

  const handleUpdateGalleryCaption = (index: number, caption: string) => {
    const current = form.getValues('galleryItems') || [];
    const copy = [...current];
    if (copy[index]) copy[index] = { ...copy[index], caption };
    form.setValue('galleryItems', copy);
  };

  const handleAddGalleryItems = (newItems: IdolGalleryItem[], newFiles?: File[]) => {
    const current = form.getValues('galleryItems') || [];
    form.setValue('galleryItems', [...current, ...newItems]);
    if (newFiles && newFiles.length > 0) {
      setPendingGalleryFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    const current = form.getValues('galleryItems') || [];
    const itemToRemove = current[index];
    if (itemToRemove && isBlobUrl(itemToRemove.url)) {
      const blobIndex =
        current.slice(0, index + 1).filter((i) => isBlobUrl(i.url)).length - 1;
      setPendingGalleryFiles((prev) => prev.filter((_, i) => i !== blobIndex));
      URL.revokeObjectURL(itemToRemove.url);
    }
    form.setValue(
      'galleryItems',
      current.filter((_, i) => i !== index),
    );
  };

  const handleAddPeriod = () => {
    const current = form.getValues('periods') || [];
    form.setValue('periods', [
      ...current,
      { startYear: new Date().getFullYear(), endYear: null, label: '' },
    ]);
  };

  const handleUpdatePeriod = (
    index: number,
    field: 'startYear' | 'endYear' | 'label',
    value: any,
  ) => {
    const current = form.getValues('periods') || [];
    const copy = [...current];
    if (copy[index]) copy[index] = { ...copy[index], [field]: value };
    form.setValue('periods', copy);
  };

  const handleRemovePeriod = (index: number) => {
    const current = form.getValues('periods') || [];
    form.setValue(
      'periods',
      current.filter((_, i) => i !== index),
    );
  };

  const handleSave = form.handleSubmit(async (data: IdolFormData) => {
    if (isSaving) return;

    const finalPeriods = (data.periods || []).filter((p) => Number(p.startYear) > 0);
    const computedStartYear =
      finalPeriods.length > 0 ? Number(finalPeriods[0].startYear) : Number(data.startYear);
    const computedEndYear =
      finalPeriods.length > 0
        ? finalPeriods[finalPeriods.length - 1].endYear
          ? Number(finalPeriods[finalPeriods.length - 1].endYear)
          : undefined
        : data.endYear
          ? Number(data.endYear)
          : undefined;

    const folderId =
      idolId ||
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : String(Date.now()));

    await runTransactionalSave({
      hasPendingMedia: Boolean(photoBlob) || pendingGalleryFiles.length > 0,
      uploadMedia: async () => {
        let finalPhotoUrl = stripBlobUrl(data.photoUrl, '');
        if (photoBlob) {
          const photoFile = new File([photoBlob], `idol-photo-${Date.now()}.webp`, {
            type: photoBlob.type || 'image/webp',
          });
          const photoRes = await adminIdolsService.uploadPhotoMedia(photoFile, folderId);
          finalPhotoUrl = verifyUploadedUrl(
            photoRes?.url || photoRes?.photoUrl,
            ADMIN_IDOLS_TEXTS.TOAST.ERROR_PHOTO_UPLOAD,
          );
          form.setValue('photoUrl', finalPhotoUrl);
          setPhotoBlob(null);
        }

        const currentGallery = data.galleryItems || [];
        let resolvedGalleryItems: IdolGalleryItem[] = currentGallery.filter(
          (item) => Boolean(item.url) && !isBlobUrl(item.url),
        );

        if (pendingGalleryFiles.length > 0) {
          const galleryRes = await adminIdolsService.uploadGalleryMedia(pendingGalleryFiles, folderId);
          const uploadedUrls = sanitizeMediaUrlList(galleryRes?.urls || galleryRes?.gallery);
          if (uploadedUrls.length !== pendingGalleryFiles.length) {
            throw new Error(ADMIN_IDOLS_TEXTS.TOAST.ERROR_GALLERY_UPLOAD);
          }

          let uploadCursor = 0;
          resolvedGalleryItems = currentGallery
            .map((item) => {
              if (isBlobUrl(item.url)) {
                URL.revokeObjectURL(item.url);
                const nextUrl = uploadedUrls[uploadCursor++] || '';
                return { url: nextUrl, caption: item.caption || '' };
              }
              return { url: stripBlobUrl(item.url, ''), caption: item.caption || '' };
            })
            .filter((item) => item.url.length > 0);

          form.setValue('galleryItems', resolvedGalleryItems);
          setPendingGalleryFiles([]);
        }

        return { finalPhotoUrl, resolvedGalleryItems };
      },
      saveToDb: async (uploaded) => {
        const currentGallery = data.galleryItems || [];
        const finalPhotoUrl = uploaded ? uploaded.finalPhotoUrl : stripBlobUrl(data.photoUrl, '');
        const finalGalleryItems: IdolGalleryItem[] = uploaded
          ? uploaded.resolvedGalleryItems
          : currentGallery
            .filter((item) => Boolean(item.url) && !isBlobUrl(item.url))
            .map((item) => ({ url: item.url.trim(), caption: item.caption || '' }));

        const payload: any = {
          name: data.name.trim(),
          nickname: data.nickname?.trim() || undefined,
          category: data.category,
          photoUrl: idolId ? finalPhotoUrl : finalPhotoUrl || undefined,
          startYear: computedStartYear,
          endYear: computedEndYear,
          periods: finalPeriods,
          gallery: finalGalleryItems.map((item) => item.url),
          galleryItems: finalGalleryItems,
          isActiveInClub: data.isActiveInClub,
          birthDate: data.birthDate || undefined,
          deathDate: data.deathDate || undefined,
          birthPlace: data.birthPlace?.trim() || undefined,
          quote: data.quote?.trim() || undefined,
          biography: data.biography.trim(),
          isFeatured: data.isFeatured,
          order: Number(data.order) || 0,
        };

        if (data.slug?.trim()) payload.slug = data.slug.trim();

        if (data.category === 'PLAYER') {
          const titles = (data.titlesText || '').split('\n').map((t) => t.trim()).filter(Boolean);
          payload.playerStats = {
            position: data.position?.trim() || undefined,
            preferredFoot: data.preferredFoot?.trim() || undefined,
            historicJerseyNumber: data.historicJerseyNumber ? Number(data.historicJerseyNumber) : undefined,
            matchesCount: data.matchesCount ? Number(data.matchesCount) : 0,
            goalsCount: data.goalsCount ? Number(data.goalsCount) : 0,
            titles,
            memorableMatch: data.memorableMatch?.trim() || undefined,
          };
        } else if (data.category === 'COACH') {
          const titles = (data.coachTitlesText || '').split('\n').map((t) => t.trim()).filter(Boolean);
          payload.coachStats = {
            matchesCount: data.coachMatches ? Number(data.coachMatches) : 0,
            winsCount: data.coachWins ? Number(data.coachWins) : 0,
            drawsCount: data.coachDraws ? Number(data.coachDraws) : 0,
            lossesCount: data.coachLosses ? Number(data.coachLosses) : 0,
            titles,
            tacticalStyle: data.tacticalStyle?.trim() || undefined,
          };
        } else if (data.category === 'STAFF') {
          payload.staffStats = {
            roleName: data.roleName?.trim() || undefined,
            yearsOfDedication: data.yearsOfDedication?.trim() || undefined,
            backstageStory: data.backstageStory?.trim() || undefined,
          };
        } else if (data.category === 'FAN') {
          payload.fanStats = {
            stadiumSector: data.stadiumSector?.trim() || undefined,
            trademark: data.trademark?.trim() || undefined,
          };
        }

        const saved = idolId
          ? await adminIdolsService.updateIdol(idolId, payload)
          : await adminIdolsService.createIdol(payload);

        if (!saved || (!saved._id && !saved.id)) {
          throw new Error(ADMIN_IDOLS_TEXTS.TOAST.ERROR_SAVE);
        }
        return saved;
      },
      onConfirmed: () => {
        toast.success(
          idolId ? ADMIN_IDOLS_TEXTS.TOAST.SUCCESS_UPDATE : ADMIN_IDOLS_TEXTS.TOAST.SUCCESS_CREATE,
        );
        onSaveSuccess();
      },
      onError: (err: any) => {
        console.error('Erro ao salvar ídolo:', err);
        toast.error(err?.response?.data?.message || err?.message || ADMIN_IDOLS_TEXTS.TOAST.ERROR_SAVE);
      },
    });
  });

  return {
    form,
    isLoading,
    isSaving,
    savingStage,
    savingLabel,
    handleCropSave,
    handlePhotoRemove,
    handleAddPeriod,
    handleUpdatePeriod,
    handleRemovePeriod,
    handleAddGalleryItems,
    handleUpdateGalleryCaption,
    handleRemoveGalleryItem,
    handleSave,
  };
};
