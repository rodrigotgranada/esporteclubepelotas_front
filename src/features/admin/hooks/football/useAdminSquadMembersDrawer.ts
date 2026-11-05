'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { adminFootballService } from '../../services/admin-football.service';
import {
  AthleteData,
  SquadData,
  SquadMemberData,
  SquadMemberRole,
  SquadSector,
} from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../constants/admin-football.constants';

export const useAdminSquadMembersDrawer = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [members, setMembers] = useState<SquadMemberData[]>([]);
  const [availableAthletes, setAvailableAthletes] = useState<AthleteData[]>([]);
  const [isLoadingAthletes, setIsLoadingAthletes] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [includeYouthAthletes, setIncludeYouthAthletes] = useState<boolean>(false);

  // New Member Temp State
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [jerseyNumber, setJerseyNumber] = useState<string>('');
  const [sector, setSector] = useState<SquadSector>('FORWARD');
  const [role, setRole] = useState<SquadMemberRole>('STARTER');

  const loadAthletesBank = useCallback(async () => {
    try {
      setIsLoadingAthletes(true);
      const res = await adminFootballService.getAthletes({ limit: 200, isActive: true });
      setAvailableAthletes(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar atletas do banco:', err);
    } finally {
      setIsLoadingAthletes(false);
    }
  }, []);

  const open = async (targetSquad: SquadData) => {
    setSquad(targetSquad);
    setMembers(targetSquad.members || []);
    setSelectedAthleteId('');
    setJerseyNumber('');
    setSector('FORWARD');
    setRole('STARTER');
    setIncludeYouthAthletes(false);
    setIsOpen(true);
    await loadAthletesBank();
  };

  const close = () => {
    setIsOpen(false);
    setSquad(null);
    setMembers([]);
    setIncludeYouthAthletes(false);
  };

  const filteredAvailableAthletes = useMemo(() => {
    if (!squad) return availableAthletes;

    if (squad.category === 'FEMININE') {
      // Atletas femininas ou comissão técnica feminina
      return availableAthletes.filter((a) => a.gender === 'FEMALE');
    }

    if (squad.category === 'PROFESSIONAL') {
      // Atletas masculinos profissionais ou comissão técnica (STAFF)
      return availableAthletes.filter((a) => {
        const isMale = a.gender !== 'FEMALE';
        if (!isMale) return false;
        if (includeYouthAthletes) return true;
        return a.athleteType !== 'YOUTH';
      });
    }

    // Se for categoria de base (SUB_20, SUB_17, SUB_15):
    // Bloqueia atletas profissionais em campo, mas permite comissão técnica (STAFF)
    return availableAthletes.filter((a) => {
      const isMale = a.gender !== 'FEMALE';
      const isYouthOrStaff = a.athleteType === 'YOUTH' || a.athleteType === 'STAFF';
      return isMale && isYouthOrStaff;
    });
  }, [availableAthletes, squad, includeYouthAthletes]);

  const handleAddMember = () => {
    if (!selectedAthleteId) {
      toast.error('Selecione um profissional do banco.');
      return;
    }

    const athleteObj = availableAthletes.find((a) => (a.id || a._id) === selectedAthleteId);
    const isStaff = sector === 'STAFF' || athleteObj?.athleteType === 'STAFF';

    let num: number | null = null;
    if (jerseyNumber) {
      num = Number(jerseyNumber);
    }

    if (!isStaff && (!num || num < 1)) {
      toast.error('Informe um número de camisa válido para o atleta.');
      return;
    }

    // Check if athlete already in squad
    const existingIndex = members.findIndex(
      (m) => (m.athleteId || m.athlete?._id || m.athlete?.id) === selectedAthleteId,
    );

    const targetSector: SquadSector = isStaff ? 'STAFF' : sector;

    const newMember: SquadMemberData = {
      athleteId: selectedAthleteId,
      athlete: athleteObj,
      jerseyNumber: isStaff ? num : num!,
      sector: targetSector,
      role,
      order: members.length + 1,
    };

    if (existingIndex >= 0) {
      const updated = [...members];
      updated[existingIndex] = newMember;
      setMembers(updated);
      toast.success('Registro já estava no elenco; dados atualizados!');
    } else {
      setMembers([...members, newMember]);
    }

    // Reset input fields
    setSelectedAthleteId('');
    setJerseyNumber('');
  };

  const handleRemoveMember = (athleteId: string) => {
    setMembers(
      members.filter((m) => (m.athleteId || m.athlete?._id || m.athlete?.id) !== athleteId),
    );
  };

  const save = async () => {
    if (!squad) return;

    try {
      setIsSaving(true);
      const squadId = squad.id || squad._id;

      const membersPayload = members.map((m, idx) => ({
        athleteId: (m.athleteId || m.athlete?.id || m.athlete?._id || "") as string,
        jerseyNumber: m.jerseyNumber || null,
        sector: m.sector,
        role: m.role || 'STARTER',
        order: idx + 1,
      }));

      await adminFootballService.setSquadMembers(squadId, membersPayload);
      toast.success(ADMIN_FOOTBALL_CONSTANTS.DRAWER_MEMBERS.SUCCESS_UPDATE);
      close();
      onSuccess();
    } catch (err: any) {
      console.error('Erro ao salvar membros do elenco:', err);
      toast.error(err?.response?.data?.message || 'Erro ao salvar membros do elenco.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isOpen,
    squad,
    members,
    availableAthletes: filteredAvailableAthletes,
    isLoadingAthletes,
    isSaving,
    includeYouthAthletes,
    setIncludeYouthAthletes,
    open,
    close,
    save,
    selectedAthleteId,
    setSelectedAthleteId,
    jerseyNumber,
    setJerseyNumber,
    sector,
    setSector,
    role,
    setRole,
    handleAddMember,
    handleRemoveMember,
  };
};
