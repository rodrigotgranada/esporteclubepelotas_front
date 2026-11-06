'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import { YouthPillarItem } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const MAX_YOUTH_PILLARS = 4;
export const MAX_PILLAR_TITLE_CHARS = 60;
export const MAX_PILLAR_DESC_CHARS = 220;
export const MAX_CRITERION_CHARS = 300;
export const MAX_CONTACT_TITLE_CHARS = 100;
export const MAX_CONTACT_DESC_CHARS = 350;

export const useAdminYouthPortalTab = () => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.YOUTH_PORTAL_TAB;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [pillars, setPillars] = useState<YouthPillarItem[]>([]);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState<string>('');

  const [contactTitle, setContactTitle] = useState<string>('Departamento de Futebol de Base');
  const [contactDescription, setContactDescription] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminFootballService.getYouthPortalConfig();
      setPillars((data.pillars || []).slice(0, MAX_YOUTH_PILLARS));
      setCriteria(data.peneirasCriteria || []);
      setContactTitle(data.contactTitle || 'Departamento de Futebol de Base');
      setContactDescription(data.contactDescription || '');
      setContactEmail(data.contactEmail || '');
      setContactPhone(data.contactPhone || '');
    } catch (err) {
      console.error('Erro ao carregar configurações da base:', err);
      toast.error(texts.ERROR_LOAD);
    } finally {
      setIsLoading(false);
    }
  }, [texts.ERROR_LOAD]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // --- Pilares (0 a 4) ---
  const addPillar = () => {
    if (pillars.length >= MAX_YOUTH_PILLARS) return;
    setPillars([...pillars, { title: '', description: '' }]);
  };

  const updatePillar = (index: number, field: keyof YouthPillarItem, value: string) => {
    const maxLen =
      field === 'title' ? MAX_PILLAR_TITLE_CHARS : MAX_PILLAR_DESC_CHARS;
    const bounded = value.slice(0, maxLen);
    setPillars(
      pillars.map((item, idx) =>
        idx === index ? { ...item, [field]: bounded } : item,
      ),
    );
  };

  const removePillar = (index: number) => {
    setPillars(pillars.filter((_, idx) => idx !== index));
  };

  const movePillar = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pillars.length) return;
    const next = [...pillars];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    setPillars(next);
  };

  // --- Critérios de Peneiras ---
  const addCriterion = () => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    setCriteria([...criteria, trimmed.slice(0, MAX_CRITERION_CHARS)]);
    setNewCriterion('');
  };

  const updateCriterion = (index: number, value: string) => {
    setCriteria(
      criteria.map((item, idx) =>
        idx === index ? value.slice(0, MAX_CRITERION_CHARS) : item,
      ),
    );
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, idx) => idx !== index));
  };

  const moveCriterion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= criteria.length) return;
    const next = [...criteria];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    setCriteria(next);
  };

  const save = async () => {
    for (const p of pillars) {
      if (!p.title.trim() || !p.description.trim()) {
        toast.error(texts.ERROR_EMPTY_PILLAR);
        return;
      }
    }

    try {
      setIsSaving(true);
      const cleanedCriteria = criteria
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const saved = await adminFootballService.updateYouthPortalConfig({
        pillars: pillars.map((p) => ({
          title: p.title.trim(),
          description: p.description.trim(),
        })),
        peneirasCriteria: cleanedCriteria,
        contactTitle: contactTitle.trim() || 'Departamento de Futebol de Base',
        contactDescription: contactDescription.trim() || null,
        contactEmail: contactEmail.trim() || null,
        contactPhone: contactPhone.trim() || null,
      });

      setPillars(saved.pillars || []);
      setCriteria(saved.peneirasCriteria || []);
      toast.success(texts.SUCCESS_SAVE);
    } catch (err: any) {
      console.error('Erro ao salvar configurações da base:', err);
      toast.error(err?.response?.data?.message || texts.ERROR_SAVE);
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
    contactTitle,
    setContactTitle: (v: string) => setContactTitle(v.slice(0, MAX_CONTACT_TITLE_CHARS)),
    contactDescription,
    setContactDescription: (v: string) =>
      setContactDescription(v.slice(0, MAX_CONTACT_DESC_CHARS)),
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    save,
  };
};

