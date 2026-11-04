'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  footballService,
  SquadCategory,
  SquadData,
  SquadMemberData,
} from '../services/football.service';

export const useSquad = (initialCategory: SquadCategory = 'PROFESSIONAL') => {
  const [selectedCategory, setSelectedCategory] = useState<SquadCategory>(initialCategory);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModuleActive, setIsModuleActive] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // 1. Carrega as temporadas e anos disponíveis
  useEffect(() => {
    let isMounted = true;

    async function loadSeasons() {
      try {
        const res = await footballService.getSeasons();
        if (!isMounted) return;

        setIsModuleActive(res.isModuleActive !== false);
        setAvailableYears(res.years || []);

        if (res.years && res.years.length > 0 && selectedYear === null) {
          setSelectedYear(res.years[0]);
        }
      } catch (err) {
        console.error('Erro ao carregar temporadas:', err);
      }
    }

    loadSeasons();

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // 2. Carrega o elenco da temporada/categoria selecionada
  const loadSquad = useCallback(async () => {
    try {
      setIsLoading(true);

      let squadData: SquadData | null = null;
      if (selectedYear) {
        squadData = await footballService.getByYearAndCategory(
          selectedYear,
          selectedCategory,
        );
      } else {
        squadData = await footballService.getCurrentSquad(selectedCategory);
      }

      setSquad(squadData);
      if (squadData && !selectedYear) {
        setSelectedYear(squadData.year);
      }
    } catch (err) {
      console.warn('Elenco não encontrado para a combinação selecionada', err);
      setSquad(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedYear]);

  useEffect(() => {
    loadSquad();
  }, [loadSquad]);

  // 3. Filtro de busca de atletas dentro do elenco
  const filteredMembers = useMemo(() => {
    if (!squad?.members) return [];
    if (!search.trim()) return squad.members;

    const term = search.toLowerCase().trim();
    return squad.members.filter((m) => {
      const name = m.athlete?.name?.toLowerCase() || '';
      const nickname = m.athlete?.nickname?.toLowerCase() || '';
      const pos = m.athlete?.primaryPosition?.toLowerCase() || '';
      return name.includes(term) || nickname.includes(term) || pos.includes(term);
    });
  }, [squad?.members, search]);

  // 4. Setores filtrados
  const sectors = useMemo(() => {
    const goalkeepers = filteredMembers.filter((m) => m.sector === 'GOALKEEPER');
    const defenders = filteredMembers.filter((m) => m.sector === 'DEFENDER');
    const midfielders = filteredMembers.filter((m) => m.sector === 'MIDFIELDER');
    const forwards = filteredMembers.filter((m) => m.sector === 'FORWARD');

    return {
      goalkeepers,
      defenders,
      midfielders,
      forwards,
      staff: squad?.staff || [],
    };
  }, [filteredMembers, squad?.staff]);

  const handleSelectCategory = (cat: SquadCategory) => {
    setSelectedCategory(cat);
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
  };

  return {
    selectedCategory,
    handleSelectCategory,
    selectedYear,
    handleSelectYear,
    availableYears,
    squad,
    sectors,
    isLoading,
    isModuleActive,
    search,
    setSearch,
    reload: loadSquad,
  };
};

