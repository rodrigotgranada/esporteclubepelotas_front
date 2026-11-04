'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import { SquadCategory, SquadData, SquadStaffData } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const useAdminSquadDrawer = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);

  // Form Fields
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [category, setCategory] = useState<SquadCategory>('PROFESSIONAL');
  const [seasonName, setSeasonName] = useState<string>('');
  const [coachName, setCoachName] = useState<string>('');
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const [staff, setStaff] = useState<SquadStaffData[]>([]);

  // Staff adding temp state
  const [newStaffRole, setNewStaffRole] = useState<string>('');
  const [newStaffName, setNewStaffName] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEditingSquadId(null);
    setYear(new Date().getFullYear());
    setCategory('PROFESSIONAL');
    setSeasonName('');
    setCoachName('');
    setIsCurrent(false);
    setStaff([]);
    setNewStaffRole('');
    setNewStaffName('');
    setErrors({});
  };

  const openCreate = () => {
    resetForm();
    setSeasonName(`Temporada ${new Date().getFullYear()}`);
    setIsOpen(true);
  };

  const openEdit = (squad: SquadData) => {
    resetForm();
    setEditingSquadId(squad.id || squad._id);
    setYear(squad.year);
    setCategory(squad.category);
    setSeasonName(squad.seasonName);
    setCoachName(squad.coachName || '');
    setIsCurrent(!!squad.isCurrent);
    setStaff(squad.staff || []);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleAddStaff = () => {
    if (!newStaffRole.trim() || !newStaffName.trim()) return;
    setStaff([...staff, { role: newStaffRole.trim(), name: newStaffName.trim() }]);
    setNewStaffRole('');
    setNewStaffName('');
  };

  const handleRemoveStaff = (index: number) => {
    setStaff(staff.filter((_, idx) => idx !== index));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!year || year < 1908) newErrors.year = 'Ano inválido.';
    if (!seasonName.trim()) newErrors.seasonName = 'O nome da temporada é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    try {
      setIsSaving(true);
      const payload: any = {
        year: Number(year),
        category,
        seasonName: seasonName.trim(),
        coachName: coachName.trim() || undefined,
        isCurrent,
        staff,
      };

      if (editingSquadId) {
        await adminFootballService.updateSquad(editingSquadId, payload);
        toast.success(ADMIN_FOOTBALL_CONSTANTS.DRAWER_SQUAD.SUCCESS_UPDATE);
      } else {
        await adminFootballService.createSquad(payload);
        toast.success(ADMIN_FOOTBALL_CONSTANTS.DRAWER_SQUAD.SUCCESS_CREATE);
      }

      close();
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao salvar elenco:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar elenco.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isOpen,
    isEditing: !!editingSquadId,
    openCreate,
    openEdit,
    close,
    save,
    isSaving,
    errors,
    year,
    setYear,
    category,
    setCategory,
    seasonName,
    setSeasonName,
    coachName,
    setCoachName,
    isCurrent,
    setIsCurrent,
    staff,
    newStaffRole,
    setNewStaffRole,
    newStaffName,
    setNewStaffName,
    handleAddStaff,
    handleRemoveStaff,
  };
};

