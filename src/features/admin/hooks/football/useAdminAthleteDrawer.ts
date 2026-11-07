'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useTransactionalSave, stripBlobUrl, verifyUploadedUrl } from '@/shared/hooks';
import { adminFootballService } from '../../services/admin-football.service';
import {
  AthleteData,
  AthleteType,
} from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';
import { athleteSchema, AthleteFormData } from '../../schemas/football/athlete.schema';

export const useAdminAthleteDrawer = (
  onSuccess: () => void,
  defaultAthleteType: AthleteType = 'PROFESSIONAL',
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingAthleteId, setEditingAthleteId] = useState<string | null>(null);

  const { isSaving, savingStage, savingLabel, runTransactionalSave } = useTransactionalSave({
    uploadingMedia: ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.BTN_UPLOADING_PHOTO,
    savingDb: ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.BTN_SAVING_DB,
  });

  const form = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      gender: 'MALE',
      athleteType: defaultAthleteType,
      youthCategory: defaultAthleteType === 'YOUTH' ? 'SUB_20' : '',
      entryYear: defaultAthleteType === 'YOUTH' ? String(new Date().getFullYear()) : '',
      staffRole: 'Treinador',
      name: '',
      nickname: '',
      birthDate: '',
      birthPlace: '',
      height: '',
      weight: '',
      preferredFoot: 'RIGHT',
      primaryPosition: '',
      secondaryPositionsText: '',
      pastClubsText: '',
      biography: '',
      instagram: '',
      isRetired: false,
    },
  });

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  const resetForm = (targetType: AthleteType = defaultAthleteType) => {
    setEditingAthleteId(null);
    setPhotoUrl('');
    setPendingPhotoFile(null);
    form.reset({
      gender: 'MALE',
      athleteType: targetType,
      youthCategory: targetType === 'YOUTH' ? 'SUB_20' : '',
      entryYear: targetType === 'YOUTH' ? String(new Date().getFullYear()) : '',
      staffRole: 'Treinador',
      name: '',
      nickname: '',
      birthDate: '',
      birthPlace: '',
      height: '',
      weight: '',
      preferredFoot: 'RIGHT',
      primaryPosition: '',
      secondaryPositionsText: '',
      pastClubsText: '',
      biography: '',
      instagram: '',
      isRetired: false,
    });
  };

  const openCreate = () => {
    resetForm(defaultAthleteType);
    setIsOpen(true);
  };

  const openEdit = (athlete: AthleteData) => {
    const aType = athlete.athleteType || 'PROFESSIONAL';
    setEditingAthleteId(athlete.id || athlete._id);
    setPhotoUrl(athlete.photoUrl || '');
    setPendingPhotoFile(null);

    form.reset({
      gender: athlete.gender || 'MALE',
      athleteType: aType,
      youthCategory: athlete.youthCategory || (aType === 'YOUTH' ? 'SUB_20' : ''),
      entryYear: athlete.entryYear ? String(athlete.entryYear) : '',
      staffRole: athlete.staffRole || athlete.primaryPosition || 'Treinador',
      name: athlete.name || '',
      nickname: athlete.nickname || '',
      birthDate: athlete.birthDate ? athlete.birthDate.split('T')[0] : '',
      birthPlace: athlete.birthPlace || '',
      height: athlete.height ? String(athlete.height) : '',
      weight: athlete.weight ? String(athlete.weight) : '',
      preferredFoot: athlete.preferredFoot || 'RIGHT',
      primaryPosition: athlete.primaryPosition || '',
      secondaryPositionsText: (athlete.secondaryPositions || []).join(', '),
      pastClubsText: (athlete.pastClubs || []).join(', '),
      biography: athlete.biography || '',
      instagram: athlete.instagram || '',
      isRetired: Boolean(athlete.isRetired),
    });

    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    resetForm(defaultAthleteType);
  };

  const save = form.handleSubmit(async (data) => {
    if (isSaving) return;

    const folderId =
      editingAthleteId ||
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : String(Date.now()));

    await runTransactionalSave({
      hasPendingMedia: Boolean(pendingPhotoFile),
      uploadMedia: async () => {
        if (!pendingPhotoFile) {
          return stripBlobUrl(photoUrl, '');
        }
        const uploadRes = await adminFootballService.uploadAthletePhotoMedia(pendingPhotoFile, folderId);
        const confirmedUrl = verifyUploadedUrl(
          uploadRes?.url || uploadRes?.photoUrl,
          ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.ERROR_PHOTO_UPLOAD,
        );
        setPhotoUrl(confirmedUrl);
        setPendingPhotoFile(null);
        return confirmedUrl;
      },
      saveToDb: async (uploadedPhotoUrl) => {
        const finalPhotoUrl =
          typeof uploadedPhotoUrl === 'string' ? uploadedPhotoUrl : stripBlobUrl(photoUrl, '');

        const secondaryPositions = (data.secondaryPositionsText || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        const pastClubs = (data.pastClubsText || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        const isStaff = data.athleteType === 'STAFF';

        const payload: any = {
          name: data.name.trim(),
          nickname: data.nickname.trim() || undefined,
          gender: data.gender,
          athleteType: data.athleteType,
          youthCategory: data.athleteType === 'YOUTH' && data.youthCategory.trim() ? data.youthCategory.trim() : undefined,
          entryYear: data.athleteType === 'YOUTH' && data.entryYear ? Number(data.entryYear) : undefined,
          staffRole: isStaff ? data.staffRole.trim() : undefined,
          primaryPosition: isStaff ? data.staffRole.trim() : data.primaryPosition.trim(),
          secondaryPositions: isStaff ? [] : secondaryPositions,
          pastClubs: data.athleteType === 'YOUTH' ? [] : pastClubs,
          preferredFoot: isStaff ? undefined : data.preferredFoot,
          birthDate: data.birthDate ? data.birthDate : undefined,
          birthPlace: data.birthPlace.trim() || undefined,
          height: isStaff ? undefined : data.height ? Number(data.height) : undefined,
          weight: isStaff ? undefined : data.weight ? Number(data.weight) : undefined,
          biography: data.biography.trim() || undefined,
          instagram: data.instagram.trim() ? data.instagram.replace('@', '').trim() : undefined,
          isRetired: isStaff ? false : data.isRetired,
          photoUrl: editingAthleteId ? finalPhotoUrl : finalPhotoUrl || undefined,
        };

        const saved = editingAthleteId
          ? await adminFootballService.updateAthlete(editingAthleteId, payload)
          : await adminFootballService.createAthlete(payload);

        if (!saved || (!saved.id && !saved._id)) {
          throw new Error('Falha ao confirmar persistência do profissional no banco de dados.');
        }
        return saved;
      },
      onConfirmed: () => {
        toast.success(
          editingAthleteId
            ? ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.SUCCESS_UPDATE
            : ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.SUCCESS_CREATE,
        );
        close();
        onSuccess();
      },
      onError: (err: any) => {
        console.error('Erro ao salvar profissional:', err);
        toast.error(err?.response?.data?.message || err?.message || 'Erro ao salvar profissional.');
      },
    });
  });

  return {
    form,
    isOpen,
    isEditing: !!editingAthleteId,
    openCreate,
    openEdit,
    close,
    save,
    isSaving,
    savingStage,
    savingLabel,
    photoUrl,
    setPhotoUrl,
    pendingPhotoFile,
    setPendingPhotoFile,
  };
};
