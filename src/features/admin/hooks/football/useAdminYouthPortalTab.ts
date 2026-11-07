'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useRealtimeEvents, useTransactionalSave } from '@/shared/hooks';
import { adminFootballService } from '../../services/admin-football.service';
import { YouthPillarItem } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';
import { youthPortalSchema, YouthPortalFormData } from '../../schemas/football/youth-portal.schema';

export const MAX_YOUTH_PILLARS = 4;
export const MAX_PILLAR_TITLE_CHARS = 60;
export const MAX_PILLAR_DESC_CHARS = 220;
export const MAX_CRITERION_CHARS = 300;
export const MAX_CONTACT_TITLE_CHARS = 100;
export const MAX_CONTACT_DESC_CHARS = 350;

export const useAdminYouthPortalTab = () => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.YOUTH_PORTAL_TAB;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSaving, runTransactionalSave } = useTransactionalSave();

  const form = useForm<YouthPortalFormData>({
    resolver: zodResolver(youthPortalSchema),
    defaultValues: {
      contactTitle: 'Departamento de Futebol de Base',
      contactDescription: '',
      contactEmail: '',
      contactPhone: '',
      pillars: [],
      peneirasCriteria: [],
    },
  });

  const [pillars, setPillars] = useState<YouthPillarItem[]>([]);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState<string>('');

  const loadConfig = useCallback(
    async (opts?: { silent?: boolean }) => {
      try {
        if (!opts?.silent) setIsLoading(true);
        const data = await adminFootballService.getYouthPortalConfig();
        const loadedPillars = (data.pillars || []).slice(0, MAX_YOUTH_PILLARS);
        const loadedCriteria = data.peneirasCriteria || [];
        setPillars(loadedPillars);
        setCriteria(loadedCriteria);

        form.reset({
          contactTitle: data.contactTitle || 'Departamento de Futebol de Base',
          contactDescription: data.contactDescription || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          pillars: loadedPillars,
          peneirasCriteria: loadedCriteria,
        });
      } catch (err) {
        console.error('Erro ao carregar configurações da base:', err);
        if (!opts?.silent) toast.error(texts.ERROR_LOAD);
      } finally {
        if (!opts?.silent) setIsLoading(false);
      }
    },
    [texts.ERROR_LOAD, form],
  );

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useRealtimeEvents('youth-config', () => {
    if (!isSaving) {
      loadConfig({ silent: true });
    }
  });

  const addPillar = () => {
    if (pillars.length >= MAX_YOUTH_PILLARS) return;
    const next = [...pillars, { title: '', description: '' }];
    setPillars(next);
    form.setValue('pillars', next);
  };

  const updatePillar = (index: number, field: keyof YouthPillarItem, value: string) => {
    const maxLen = field === 'title' ? MAX_PILLAR_TITLE_CHARS : MAX_PILLAR_DESC_CHARS;
    const bounded = value.slice(0, maxLen);
    const next = pillars.map((item, idx) => (idx === index ? { ...item, [field]: bounded } : item));
    setPillars(next);
    form.setValue('pillars', next);
  };

  const removePillar = (index: number) => {
    const next = pillars.filter((_, idx) => idx !== index);
    setPillars(next);
    form.setValue('pillars', next);
  };

  const movePillar = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pillars.length) return;
    const next = [...pillars];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    setPillars(next);
    form.setValue('pillars', next);
  };

  const addCriterion = () => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    const next = [...criteria, trimmed.slice(0, MAX_CRITERION_CHARS)];
    setCriteria(next);
    form.setValue('peneirasCriteria', next);
    setNewCriterion('');
  };

  const updateCriterion = (index: number, value: string) => {
    const next = criteria.map((item, idx) =>
      idx === index ? value.slice(0, MAX_CRITERION_CHARS) : item,
    );
    setCriteria(next);
    form.setValue('peneirasCriteria', next);
  };

  const removeCriterion = (index: number) => {
    const next = criteria.filter((_, idx) => idx !== index);
    setCriteria(next);
    form.setValue('peneirasCriteria', next);
  };

  const moveCriterion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= criteria.length) return;
    const next = [...criteria];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    setCriteria(next);
    form.setValue('peneirasCriteria', next);
  };

  const save = form.handleSubmit(async (data) => {
    if (isSaving) return;

    for (const p of data.pillars) {
      if (!p.title.trim() || !p.description.trim()) {
        toast.error(texts.ERROR_EMPTY_PILLAR);
        return;
      }
    }

    await runTransactionalSave({
      hasPendingMedia: false,
      saveToDb: async () => {
        const cleanedCriteria = data.peneirasCriteria.map((c) => c.trim()).filter((c) => c.length > 0);
        return adminFootballService.updateYouthPortalConfig({
          pillars: data.pillars.map((p) => ({
            title: p.title.trim(),
            description: p.description.trim(),
          })),
          peneirasCriteria: cleanedCriteria,
          contactTitle: data.contactTitle.trim() || 'Departamento de Futebol de Base',
          contactDescription: data.contactDescription.trim() || null,
          contactEmail: data.contactEmail?.trim() || null,
          contactPhone: data.contactPhone?.trim() || null,
        });
      },
      onConfirmed: (saved) => {
        const savedPillars = saved.pillars || [];
        const savedCriteria = saved.peneirasCriteria || [];
        setPillars(savedPillars);
        setCriteria(savedCriteria);
        form.setValue('pillars', savedPillars);
        form.setValue('peneirasCriteria', savedCriteria);
        toast.success(texts.SUCCESS_SAVE);
      },
      onError: (err: any) => {
        console.error('Erro ao salvar configurações da base:', err);
        toast.error(err?.response?.data?.message || texts.ERROR_SAVE);
      },
    });
  });

  return {
    form,
    isLoading,
    isSaving,
    pillars,
    addPillar,
    updatePillar,
    removePillar,
    movePillar,
    criteria,
    newCriterion,
    setNewCriterion,
    addCriterion,
    updateCriterion,
    removeCriterion,
    moveCriterion,
    save,
  };
};
