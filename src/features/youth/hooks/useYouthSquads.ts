'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  footballService,
  SquadCategory,
  SquadData,
  SquadMemberData,
} from '@/features/football/services/football.service';

export type YouthCategoryType = 'SUB_20' | 'SUB_17' | 'SUB_15';

const YOUTH_CATEGORY_ORDER: YouthCategoryType[] = ['SUB_20', 'SUB_17', 'SUB_15'];

const isYouthCategory = (cat: string): cat is YouthCategoryType => {
  return YOUTH_CATEGORY_ORDER.includes(cat as YouthCategoryType) || cat.startsWith('SUB_');
};

export interface YouthChampionshipGroup {
  key: string;
  label: string;
  year: number;
  isCurrent: boolean;
  categories: YouthCategoryType[];
  squadByCategory: Partial<Record<YouthCategoryType, SquadData>>;
}

export const useYouthSquads = () => {
  const [allYouthSquads, setAllYouthSquads] = useState<SquadData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedChampionshipKey, setSelectedChampionshipKey] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<YouthCategoryType>('SUB_20');
  const [search, setSearch] = useState<string>('');

  const loadYouthSquads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await footballService.getSquads({ limit: 100 });
      const squads = (res?.data || []).filter(
        (s) => s.isActive !== false && isYouthCategory(s.category),
      );
      setAllYouthSquads(squads);
    } catch (err) {
      console.error('[useYouthSquads] Erro ao carregar campeonatos da base:', err);
      setAllYouthSquads([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadYouthSquads();
  }, [loadYouthSquads]);

  // Agrupa os elencos da base por Campeonato (seasonName)
  const championships = useMemo<YouthChampionshipGroup[]>(() => {
    const map = new Map<string, YouthChampionshipGroup>();

    for (const sq of allYouthSquads) {
      const rawName = (sq.seasonName || `Temporada ${sq.year}`).trim();
      const key = rawName.toLowerCase();
      const cat = sq.category as YouthCategoryType;

      let group = map.get(key);
      if (!group) {
        group = {
          key,
          label: rawName,
          year: sq.year,
          isCurrent: !!sq.isCurrent,
          categories: [],
          squadByCategory: {},
        };
        map.set(key, group);
      } else {
        if (sq.year > group.year) group.year = sq.year;
        if (sq.isCurrent) group.isCurrent = true;
      }

      const existingForCat = group.squadByCategory[cat];
      if (!existingForCat || (!existingForCat.isCurrent && sq.isCurrent)) {
        group.squadByCategory[cat] = sq;
      }
    }

    const list = Array.from(map.values());
    for (const grp of list) {
      grp.categories = YOUTH_CATEGORY_ORDER.filter((c) => !!grp.squadByCategory[c]);
    }

    list.sort((a, b) => {
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      if (b.year !== a.year) return b.year - a.year;
      return a.label.localeCompare(b.label, 'pt-BR');
    });

    return list.filter((g) => g.categories.length > 0);
  }, [allYouthSquads]);

  // Sincroniza seleção inicial ou quando campeonatos mudam
  useEffect(() => {
    if (championships.length === 0) return;

    const currentGroup =
      championships.find((c) => c.key === selectedChampionshipKey) || championships[0];

    if (currentGroup.key !== selectedChampionshipKey) {
      setSelectedChampionshipKey(currentGroup.key);
    }

    if (!currentGroup.categories.includes(selectedCategory)) {
      setSelectedCategory(currentGroup.categories[0]);
    }
  }, [championships, selectedChampionshipKey, selectedCategory]);

  const selectedChampionship = useMemo<YouthChampionshipGroup | null>(() => {
    if (championships.length === 0) return null;
    return championships.find((c) => c.key === selectedChampionshipKey) || championships[0];
  }, [championships, selectedChampionshipKey]);

  const availableCategories = useMemo<YouthCategoryType[]>(() => {
    return selectedChampionship?.categories || [];
  }, [selectedChampionship]);

  const handleSelectChampionship = useCallback(
    (key: string) => {
      setSelectedChampionshipKey(key);
      const target = championships.find((c) => c.key === key);
      if (target && target.categories.length > 0) {
        if (!target.categories.includes(selectedCategory)) {
          setSelectedCategory(target.categories[0]);
        }
      }
    },
    [championships, selectedCategory],
  );

  const handleSelectCategory = useCallback((cat: YouthCategoryType) => {
    setSelectedCategory(cat);
  }, []);

  const activeSquad = useMemo<SquadData | null>(() => {
    if (!selectedChampionship) return null;
    return selectedChampionship.squadByCategory[selectedCategory] || null;
  }, [selectedChampionship, selectedCategory]);

  const filteredMembers = useMemo<SquadMemberData[]>(() => {
    if (!activeSquad?.members) return [];
    if (!search.trim()) return activeSquad.members;

    const term = search.toLowerCase().trim();
    return activeSquad.members.filter((m) => {
      const name = m.athlete?.name?.toLowerCase() || '';
      const nickname = m.athlete?.nickname?.toLowerCase() || '';
      const pos = m.athlete?.primaryPosition?.toLowerCase() || '';
      const staffRole = m.athlete?.staffRole?.toLowerCase() || '';
      return (
        name.includes(term) ||
        nickname.includes(term) ||
        pos.includes(term) ||
        staffRole.includes(term)
      );
    });
  }, [activeSquad?.members, search]);

  const organizedSectors = useMemo(() => {
    return {
      goalkeepers: filteredMembers.filter((m) => m.sector === 'GOALKEEPER'),
      defenders: filteredMembers.filter((m) => m.sector === 'DEFENDER'),
      midfielders: filteredMembers.filter((m) => m.sector === 'MIDFIELDER'),
      forwards: filteredMembers.filter((m) => m.sector === 'FORWARD'),
      staff: filteredMembers.filter((m) => m.sector === 'STAFF'),
    };
  }, [filteredMembers]);

  return {
    championships,
    selectedChampionship,
    selectedChampionshipKey,
    handleSelectChampionship,
    availableCategories,
    selectedCategory,
    handleSelectCategory,
    squad: activeSquad,
    organizedSectors,
    isLoading,
    search,
    setSearch,
    hasActiveSearch: search.trim().length > 0,
  };
};
