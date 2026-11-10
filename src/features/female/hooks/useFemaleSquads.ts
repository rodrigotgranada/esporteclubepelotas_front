'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  footballService,
  SquadData,
  SquadMemberData,
} from '@/features/football/services/football.service';

export interface FemaleChampionshipGroup {
  key: string;
  label: string;
  year: number;
  isCurrent: boolean;
  squad: SquadData;
}

export const useFemaleSquads = () => {
  const [allSquads, setAllSquads] = useState<SquadData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const loadSquads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await footballService.getSquads({ limit: 50, category: 'FEMININE' });
      const squads = (res?.data || []).filter((s) => s.isActive !== false && s.category === 'FEMININE');
      setAllSquads(squads);
    } catch (err) {
      console.error('[useFemaleSquads] Erro ao carregar elencos femininos:', err);
      setAllSquads([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSquads();
  }, [loadSquads]);

  const championships = useMemo<FemaleChampionshipGroup[]>(() => {
    const list: FemaleChampionshipGroup[] = allSquads.map((sq) => {
      const rawName = (sq.seasonName || `Temporada ${sq.year}`).trim();
      return {
        key: sq.id || sq._id,
        label: rawName,
        year: sq.year,
        isCurrent: !!sq.isCurrent,
        squad: sq,
      };
    });

    list.sort((a, b) => {
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      if (b.year !== a.year) return b.year - a.year;
      return a.label.localeCompare(b.label, 'pt-BR');
    });

    return list;
  }, [allSquads]);

  useEffect(() => {
    if (championships.length === 0) {
      setSelectedKey('');
      return;
    }
    const exists = championships.some((c) => c.key === selectedKey);
    if (!exists) {
      const current = championships.find((c) => c.isCurrent) || championships[0];
      setSelectedKey(current.key);
    }
  }, [championships, selectedKey]);

  const activeGroup = useMemo(() => {
    return championships.find((c) => c.key === selectedKey) || null;
  }, [championships, selectedKey]);

  const activeSquad = activeGroup?.squad || null;

  const filterMembers = useCallback(
    (members: SquadMemberData[] | undefined) => {
      if (!members || members.length === 0) return [];
      const term = search.trim().toLowerCase();
      if (!term) return members;

      return members.filter((m) => {
        const name = (m.athlete?.name || '').toLowerCase();
        const nick = (m.athlete?.nickname || '').toLowerCase();
        const pos = (m.athlete?.primaryPosition || '').toLowerCase();
        const num = m.jerseyNumber ? String(m.jerseyNumber) : '';
        return name.includes(term) || nick.includes(term) || pos.includes(term) || num.includes(term);
      });
    },
    [search],
  );

  const allMembers = useMemo(() => activeSquad?.members || [], [activeSquad?.members]);

  const goalkeepers = useMemo(
    () => activeSquad?.sectors?.goalkeepers || allMembers.filter((m) => m.sector === 'GOALKEEPER'),
    [activeSquad?.sectors?.goalkeepers, allMembers],
  );
  const defenders = useMemo(
    () => activeSquad?.sectors?.defenders || allMembers.filter((m) => m.sector === 'DEFENDER'),
    [activeSquad?.sectors?.defenders, allMembers],
  );
  const midfielders = useMemo(
    () => activeSquad?.sectors?.midfielders || allMembers.filter((m) => m.sector === 'MIDFIELDER'),
    [activeSquad?.sectors?.midfielders, allMembers],
  );
  const forwards = useMemo(
    () => activeSquad?.sectors?.forwards || allMembers.filter((m) => m.sector === 'FORWARD'),
    [activeSquad?.sectors?.forwards, allMembers],
  );

  const filteredGoalkeepers = useMemo(
    () => filterMembers(goalkeepers),
    [goalkeepers, filterMembers],
  );
  const filteredDefenders = useMemo(
    () => filterMembers(defenders),
    [defenders, filterMembers],
  );
  const filteredMidfielders = useMemo(
    () => filterMembers(midfielders),
    [midfielders, filterMembers],
  );
  const filteredForwards = useMemo(
    () => filterMembers(forwards),
    [forwards, filterMembers],
  );

  const totalFilteredAthletes =
    filteredGoalkeepers.length +
    filteredDefenders.length +
    filteredMidfielders.length +
    filteredForwards.length;

  return {
    championships,
    selectedKey,
    setSelectedKey,
    activeGroup,
    activeSquad,
    isLoading,
    search,
    setSearch,
    filteredGoalkeepers,
    filteredDefenders,
    filteredMidfielders,
    filteredForwards,
    totalFilteredAthletes,
    staff: activeSquad?.staff || [],
  };
};
