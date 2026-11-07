'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useTransactionalSave } from '@/shared/hooks';
import { adminFootballService } from '../../services/admin-football.service';
import { SquadCategory, SquadData, SquadStaffData } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';
import { squadSchema, SquadFormData } from '../../schemas/football/squad.schema';

export const useAdminSquadDrawer = (
  onSuccess: () => void,
  defaultCategory: SquadCategory = 'PROFESSIONAL',
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);

  const { isSaving, runTransactionalSave } = useTransactionalSave();

  const form = useForm<SquadFormData>({
    resolver: zodResolver(squadSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      category: defaultCategory,
      seasonName: `Temporada ${new Date().getFullYear()}`,
      coachName: '',
      isCurrent: false,
      staff: [],
    },
  });

  const [newStaffRole, setNewStaffRole] = useState<string>('');
  const [newStaffName, setNewStaffName] = useState<string>('');

  const resetForm = (targetCat: SquadCategory = defaultCategory) => {
    setEditingSquadId(null);
    setNewStaffRole('');
    setNewStaffName('');
    form.reset({
      year: new Date().getFullYear(),
      category: targetCat,
      seasonName: `Temporada ${new Date().getFullYear()}`,
      coachName: '',
      isCurrent: false,
      staff: [],
    });
  };

  const openCreate = () => {
    resetForm(defaultCategory);
    setIsOpen(true);
  };

  const openEdit = (squad: SquadData) => {
    setEditingSquadId(squad.id || squad._id);
    setNewStaffRole('');
    setNewStaffName('');
    form.reset({
      year: squad.year,
      category: squad.category,
      seasonName: squad.seasonName,
      coachName: squad.coachName || '',
      isCurrent: !!squad.isCurrent,
      staff: squad.staff || [],
    });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    resetForm(defaultCategory);
  };

  const handleAddStaff = () => {
    if (!newStaffRole.trim() || !newStaffName.trim()) return;
    const currentStaff = form.getValues('staff') || [];
    form.setValue('staff', [
      ...currentStaff,
      { role: newStaffRole.trim(), name: newStaffName.trim() },
    ]);
    setNewStaffRole('');
    setNewStaffName('');
  };

  const handleRemoveStaff = (index: number) => {
    const currentStaff = form.getValues('staff') || [];
    form.setValue(
      'staff',
      currentStaff.filter((_, idx) => idx !== index),
    );
  };

  const save = form.handleSubmit(async (data) => {
    if (isSaving) return;

    await runTransactionalSave({
      hasPendingMedia: false,
      saveToDb: async () => {
        const payload: any = {
          year: Number(data.year),
          category: data.category,
          seasonName: data.seasonName.trim(),
          coachName: data.coachName.trim() || undefined,
          isCurrent: data.isCurrent,
          staff: data.staff,
        };

        const saved = editingSquadId
          ? await adminFootballService.updateSquad(editingSquadId, payload)
          : await adminFootballService.createSquad(payload);

        if (!saved || (!saved.id && !saved._id)) {
          throw new Error('Falha ao confirmar gravação da temporada/elenco.');
        }
        return saved;
      },
      onConfirmed: () => {
        toast.success(
          editingSquadId
            ? ADMIN_FOOTBALL_CONSTANTS.DRAWER_SQUAD.SUCCESS_UPDATE
            : ADMIN_FOOTBALL_CONSTANTS.DRAWER_SQUAD.SUCCESS_CREATE,
        );
        close();
        onSuccess();
      },
      onError: (err: any) => {
        console.error('Erro ao salvar elenco:', err);
        toast.error(err?.response?.data?.message || err?.message || 'Erro ao salvar elenco.');
      },
    });
  });

  return {
    form,
    isOpen,
    isEditing: !!editingSquadId,
    openCreate,
    openEdit,
    close,
    save,
    isSaving,
    newStaffRole,
    setNewStaffRole,
    newStaffName,
    setNewStaffName,
    handleAddStaff,
    handleRemoveStaff,
  };
};
