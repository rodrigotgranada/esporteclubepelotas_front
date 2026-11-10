'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useTransactionalSave } from '@/shared/hooks';
import { adminFootballService } from '../../services/admin-football.service';
import {
  SquadCategory,
  SquadData,
  AthleteData,
  footballService,
} from '@/features/football/services/football.service';
import { matchesService } from '@/features/matches/services';
import { Championship } from '@/features/matches/types/matches.types';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';
import { squadSchema, SquadFormData } from '../../schemas/football/squad.schema';

export const useAdminSquadDrawer = (
  onSuccess: () => void,
  defaultCategory: SquadCategory = 'PROFESSIONAL',
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingSquadId, setEditingSquadId] = useState<string | null>(null);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [coaches, setCoaches] = useState<AthleteData[]>([]);

  const { isSaving, runTransactionalSave } = useTransactionalSave();

  useEffect(() => {
    matchesService.publicGetChampionships()
      .then((data) => setChampionships(data || []))
      .catch((err) => console.error('Erro ao carregar campeonatos:', err));

    footballService.getAthletes({ athleteType: 'STAFF', limit: 50 })
      .then((res) => setCoaches(res.data || []))
      .catch((err) => console.error('Erro ao carregar comissão técnica:', err));
  }, []);

  const form = useForm<SquadFormData>({
    resolver: zodResolver(squadSchema),
    defaultValues: {
      championshipId: null,
      coachId: null,
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
      championshipId: null,
      coachId: null,
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
      championshipId: squad.championshipId || null,
      coachId: squad.coachId || null,
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

  const handleChampionshipChange = (champId: string) => {
    form.setValue('championshipId', champId || null);
    if (champId) {
      const selected = championships.find((c) => c.id === champId);
      if (selected) {
        form.setValue('seasonName', selected.name);
        form.setValue('year', selected.seasonYear);
      }
    }
  };

  const handleCoachChange = (coachId: string) => {
    form.setValue('coachId', coachId || null);
    if (coachId) {
      const selected = coaches.find((c) => c.id === coachId || c._id === coachId);
      if (selected) {
        form.setValue('coachName', selected.name);
      }
    }
  };

  const save = form.handleSubmit(async (data) => {
    if (isSaving) return;

    await runTransactionalSave({
      hasPendingMedia: false,
      saveToDb: async () => {
        const payload: any = {
          championshipId: data.championshipId || undefined,
          coachId: data.coachId || undefined,
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
    championships,
    coaches,
    handleChampionshipChange,
    handleCoachChange,
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
