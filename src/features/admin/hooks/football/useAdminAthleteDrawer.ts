'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import { AthleteData, PreferredFoot, AthleteGender, AthleteType } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const useAdminAthleteDrawer = (onSuccess: () => void, defaultAthleteType: AthleteType = 'PROFESSIONAL') => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingAthleteId, setEditingAthleteId] = useState<string | null>(null);

  // Form Fields
  const [gender, setGender] = useState<AthleteGender>('MALE');
  const [athleteType, setAthleteType] = useState<AthleteType>(defaultAthleteType);
  const [youthCategory, setYouthCategory] = useState<string>('');
  const [entryYear, setEntryYear] = useState<string>('');
  const [staffRole, setStaffRole] = useState<string>('Treinador');
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
  const [isRetired, setIsRetired] = useState<boolean>(false);

  // Photo
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEditingAthleteId(null);
    setGender('MALE');
    setAthleteType(defaultAthleteType);
    setYouthCategory(defaultAthleteType === 'YOUTH' ? 'SUB_20' : '');
    setEntryYear(defaultAthleteType === 'YOUTH' ? String(new Date().getFullYear()) : '');


    setStaffRole('Treinador');
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
    setIsRetired(false);
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
    setGender(athlete.gender || 'MALE');
    setAthleteType(athlete.athleteType || 'PROFESSIONAL');
    setYouthCategory(athlete.youthCategory || '');
    setEntryYear(athlete.entryYear ? String(athlete.entryYear) : '');
    setStaffRole(athlete.staffRole || athlete.primaryPosition || 'Treinador');
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
    setIsRetired(Boolean(athlete.isRetired));
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
    if (athleteType === 'STAFF') {
      if (!staffRole.trim()) newErrors.staffRole = 'O cargo na comissão técnica é obrigatório.';
    } else {
      if (!primaryPosition.trim()) newErrors.primaryPosition = 'A posição principal é obrigatória.';
    }
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

      const isStaff = athleteType === 'STAFF';

      const payload: any = {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        gender,
        athleteType,
        youthCategory: athleteType === 'YOUTH' && youthCategory.trim() ? youthCategory.trim() : undefined,
        entryYear: athleteType === 'YOUTH' && entryYear ? Number(entryYear) : undefined,
        staffRole: isStaff ? staffRole.trim() : undefined,
        primaryPosition: isStaff ? staffRole.trim() : primaryPosition.trim(),
        secondaryPositions: isStaff ? [] : secondaryPositions,
        pastClubs: athleteType === 'YOUTH' ? [] : pastClubs,
        preferredFoot: isStaff ? undefined : preferredFoot,
        birthDate: birthDate ? birthDate : undefined,
        birthPlace: birthPlace.trim() || undefined,
        height: isStaff ? undefined : (height ? Number(height) : undefined),
        weight: isStaff ? undefined : (weight ? Number(weight) : undefined),
        biography: biography.trim() || undefined,
        instagram: instagram.trim() ? instagram.replace('@', '').trim() : undefined,
        isRetired: isStaff ? false : isRetired,
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
      console.error('Erro ao salvar profissional:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar profissional.');
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
    gender,
    setGender,
    athleteType,
    setAthleteType,
    youthCategory,
    setYouthCategory,
    entryYear,
    setEntryYear,
    staffRole,
    setStaffRole,
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
    isRetired,
    setIsRetired,
    photoUrl,
    setPhotoUrl,
    pendingPhotoFile,
    setPendingPhotoFile,
  };
};
