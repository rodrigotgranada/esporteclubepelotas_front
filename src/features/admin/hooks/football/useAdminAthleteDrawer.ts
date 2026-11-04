'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import { AthleteData, PreferredFoot } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const useAdminAthleteDrawer = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingAthleteId, setEditingAthleteId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot>('RIGHT');
  const [primaryPosition, setPrimaryPosition] = useState<string>('');
  const [secondaryPositionsText, setSecondaryPositionsText] = useState<string>('');
  const [pastClubsText, setPastClubsText] = useState<string>('');
  const [biography, setBiography] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');

  // Photo
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEditingAthleteId(null);
    setName('');
    setNickname('');
    setBirthDate('');
    setBirthPlace('');
    setHeight('');
    setWeight('');
    setPreferredFoot('RIGHT');
    setPrimaryPosition('');
    setSecondaryPositionsText('');
    setPastClubsText('');
    setBiography('');
    setInstagram('');
    setPhotoUrl('');
    setPendingPhotoFile(null);
    setErrors({});
  };

  const openCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEdit = (athlete: AthleteData) => {
    resetForm();
    setEditingAthleteId(athlete.id || athlete._id);
    setName(athlete.name || '');
    setNickname(athlete.nickname || '');
    setBirthDate(athlete.birthDate ? athlete.birthDate.split('T')[0] : '');
    setBirthPlace(athlete.birthPlace || '');
    setHeight(athlete.height ? String(athlete.height) : '');
    setWeight(athlete.weight ? String(athlete.weight) : '');
    setPreferredFoot(athlete.preferredFoot || 'RIGHT');
    setPrimaryPosition(athlete.primaryPosition || '');
    setSecondaryPositionsText((athlete.secondaryPositions || []).join(', '));
    setPastClubsText((athlete.pastClubs || []).join(', '));
    setBiography(athlete.biography || '');
    setInstagram(athlete.instagram || '');
    setPhotoUrl(athlete.photoUrl || '');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    resetForm();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'O nome completo é obrigatório.';
    if (!primaryPosition.trim()) newErrors.primaryPosition = 'A posição principal é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    try {
      setIsSaving(true);

      const secondaryPositions = secondaryPositionsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const pastClubs = pastClubsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload: any = {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        primaryPosition: primaryPosition.trim(),
        secondaryPositions,
        pastClubs,
        preferredFoot,
        birthDate: birthDate ? birthDate : undefined,
        birthPlace: birthPlace.trim() || undefined,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        biography: biography.trim() || undefined,
        instagram: instagram.trim() ? instagram.replace('@', '').trim() : undefined,
        photoUrl: photoUrl.trim() || undefined,
      };

      let athleteId = editingAthleteId;
      if (editingAthleteId) {
        await adminFootballService.updateAthlete(editingAthleteId, payload);
        toast.success(ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.SUCCESS_UPDATE);
      } else {
        const created = await adminFootballService.createAthlete(payload);
        athleteId = created.id || created._id;
        toast.success(ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE.SUCCESS_CREATE);
      }

      // Se houver arquivo de foto pendente, faz upload
      if (pendingPhotoFile && athleteId) {
        await adminFootballService.uploadAthletePhoto(athleteId, pendingPhotoFile);
      }

      close();
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao salvar atleta:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar atleta.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isOpen,
    isEditing: !!editingAthleteId,
    openCreate,
    openEdit,
    close,
    save,
    isSaving,
    errors,
    // Fields
    name,
    setName,
    nickname,
    setNickname,
    birthDate,
    setBirthDate,
    birthPlace,
    setBirthPlace,
    height,
    setHeight,
    weight,
    setWeight,
    preferredFoot,
    setPreferredFoot,
    primaryPosition,
    setPrimaryPosition,
    secondaryPositionsText,
    setSecondaryPositionsText,
    pastClubsText,
    setPastClubsText,
    biography,
    setBiography,
    instagram,
    setInstagram,
    photoUrl,
    setPhotoUrl,
    pendingPhotoFile,
    setPendingPhotoFile,
  };
};
