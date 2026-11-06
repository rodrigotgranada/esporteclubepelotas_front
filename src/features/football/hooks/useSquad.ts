'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  footballService,
  SquadCategory,
  SquadData,
} from '../services/football.service';

const SENIOR_CATEGORIES: SquadCategory[] = ['PROFESSIONAL', 'FEMININE'];

export const useSquad = (initialCategory: SquadCategory = 'PROFESSIONAL') => {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get('category') as SquadCategory | null;
  const initial =
    queryCategory && SENIOR_CATEGORIES.includes(queryCategory)
      ? queryCategory
      : SENIOR_CATEGORIES.includes(initialCategory)
        ? initialCategory
        : 'PROFESSIONAL';

  const [selectedCategory, setSelectedCategory] = useState<SquadCategory>(initial);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [categoriesByYear, setCategoriesByYear] = useState<Record<number, SquadCategory[]>>({});
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModuleActive, setIsModuleActive] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // 1. Carrega as temporadas e mapeamento apenas das categorias profissionais (Masculino / Feminino)
  useEffect(() => {
    let isMounted = true;

    async function loadSeasons() {
      try {
        const res = await footballService.getSeasons();
        if (!isMounted) return;

        setIsModuleActive(res.isModuleActive !== false);
        const rawYears = res.years || [];

        const byYearMap: Record<number, SquadCategory[]> = {};
        if (res.categoriesByYear && Object.keys(res.categoriesByYear).length > 0) {
          Object.entries(res.categoriesByYear).forEach(([yearStr, cats]) => {
            const seniorCats = (cats as SquadCategory[]).filter((cat) =>
              SENIOR_CATEGORIES.includes(cat),
            );
            if (seniorCats.length > 0) {
              byYearMap[Number(yearStr)] = seniorCats;
            }
          });
        } else if (res.categories && res.categories.length > 0) {
          const seniorCats = (res.categories as SquadCategory[]).filter((cat) =>
            SENIOR_CATEGORIES.includes(cat),
          );
          if (seniorCats.length > 0) {
            rawYears.forEach((y) => {
              byYearMap[y] = seniorCats;
            });
          }
        }

        const filteredYears = rawYears.filter(
          (y) => byYearMap[y] && byYearMap[y].length > 0,
        );

        setAvailableYears(filteredYears);
        setCategoriesByYear(byYearMap);

        if (filteredYears.length > 0 && selectedYear === null) {
          const firstYear = filteredYears[0];
          setSelectedYear(firstYear);

          const catsInYear = byYearMap[firstYear] || [];
          if (catsInYear.length > 0 && !catsInYear.includes(selectedCategory)) {
            setSelectedCategory(
              catsInYear.includes('PROFESSIONAL') ? 'PROFESSIONAL' : catsInYear[0],
            );
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar temporadas:', err);
      }
    }

    loadSeasons();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedYear]);

  // 2. Categorias disponíveis para o ano atualmente selecionado (apenas Masculino / Feminino)
  const availableCategories = useMemo<SquadCategory[]>(() => {
    if (!selectedYear || !categoriesByYear[selectedYear]) {
      return ['PROFESSIONAL'];
    }
    return categoriesByYear[selectedYear];
  }, [selectedYear, categoriesByYear]);

  // 3. Troca de ano com validação da categoria ativa
  const handleSelectYear = useCallback(
    (newYear: number) => {
      setSelectedYear(newYear);

      const catsInNewYear = categoriesByYear[newYear] || [];
      if (catsInNewYear.length > 0 && !catsInNewYear.includes(selectedCategory)) {
        if (catsInNewYear.includes('PROFESSIONAL')) {
          setSelectedCategory('PROFESSIONAL');
        } else {
          setSelectedCategory(catsInNewYear[0]);
        }
      }
    },
    [categoriesByYear, selectedCategory],
  );

  // 4. Troca de categoria
  const handleSelectCategory = useCallback((cat: SquadCategory) => {
    if (SENIOR_CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, []);

  // 5. Carrega o elenco da temporada/categoria selecionada
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

  // 6. Filtro de busca de atletas dentro do elenco
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

  // 7. Setores filtrados
  const sectors = useMemo(() => {
    const goalkeepers = filteredMembers.filter((m) => m.sector === 'GOALKEEPER');
    const defenders = filteredMembers.filter((m) => m.sector === 'DEFENDER');
    const midfielders = filteredMembers.filter((m) => m.sector === 'MIDFIELDER');
    const forwards = filteredMembers.filter((m) => m.sector === 'FORWARD');
    const staff = filteredMembers.filter((m) => m.sector === 'STAFF');

    return {
      goalkeepers,
      defenders,
      midfielders,
      forwards,
      staff: staff.length > 0 ? staff : (squad?.sectors?.staff || []),
    };
  }, [filteredMembers, squad?.sectors?.staff]);

  return {
    selectedCategory,
    handleSelectCategory,
    selectedYear,
    handleSelectYear,
    availableYears,
    availableCategories,
    categoriesByYear,
    squad,
    sectors,
    isLoading,
    isModuleActive,
    search,
    setSearch,
    reload: loadSquad,
  };
};
