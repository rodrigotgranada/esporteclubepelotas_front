'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  footballService,
  SquadData,
  SquadCategory,
  SquadSector,
  SquadMemberData,
} from '@/features/football/services/football.service';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';

export type YouthCategoryType = 'SUB_20' | 'SUB_17' | 'SUB_15';

export const useYouthHub = () => {
  const [selectedCategory, setSelectedCategory] = useState<YouthCategoryType>('SUB_20');
  const [squad, setSquad] = useState<SquadData | null>(null);
  const [isLoadingSquad, setIsLoadingSquad] = useState<boolean>(true);

  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);

  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Carrega o elenco ativo da categoria selecionada
  const loadSquad = useCallback(async (cat: YouthCategoryType) => {
    try {
      setIsLoadingSquad(true);
      const data = await footballService.getCurrentSquad(cat);
      setSquad(data || null);
    } catch (err) {
      console.warn(`[useYouthHub] Nenhum elenco atual ativo para ${cat}:`, err);
      setSquad(null);
    } finally {
      setIsLoadingSquad(false);
    }
  }, []);

  // Carrega notícias vinculadas à base (categoria "Categorias de Base" ou tag "Base")
  const loadYouthNews = useCallback(async () => {
    try {
      setIsLoadingNews(true);
      // Busca notícias recentes com filtro de busca ou categoria
      const res = await newsService.getNews({ limit: 12, isYouth: true });
      const articles = res.data || [];

      // Filtra matérias que pertençam à categoria da base ou que contenham a tag #base
      const filtered = articles.filter((art) => {
        const catName =
          typeof art.category === 'object' && art.category
            ? art.category.name?.toLowerCase() || ''
            : '';
        const hasBaseCategory = catName.includes('base') || catName.includes('formação');
        const hasBaseTag = (art.tags || []).some((t) => t.toLowerCase().includes('base'));
        return art.isYouth || hasBaseCategory || hasBaseTag;
      });

      // Se não houver matérias marcadas especificamente como base, pega as 3 mais recentes como demonstração
      setNews(filtered.length > 0 ? filtered.slice(0, 4) : articles.slice(0, 4));
    } catch (err) {
      console.error('[useYouthHub] Erro ao carregar notícias da base:', err);
      setNews([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    loadSquad(selectedCategory);
  }, [selectedCategory, loadSquad]);

  useEffect(() => {
    loadYouthNews();
  }, [loadYouthNews]);

  // Membros filtrados por setor tático se houver filtro ativo
  const filteredMembers = useMemo(() => {
    if (!squad || !squad.members) return [];
    if (selectedSector === 'ALL') return squad.members;
    return squad.members.filter((m) => m.sector === selectedSector);
  }, [squad, selectedSector]);

  // Setores organizados para a visualização
  const organizedSectors = useMemo(() => {
    if (!squad || !squad.members) {
      return {
        goalkeepers: [],
        defenders: [],
        midfielders: [],
        forwards: [],
      };
    }
    return {
      goalkeepers: squad.members.filter((m) => m.sector === 'GOALKEEPER'),
      defenders: squad.members.filter((m) => m.sector === 'DEFENDER'),
      midfielders: squad.members.filter((m) => m.sector === 'MIDFIELDER'),
      forwards: squad.members.filter((m) => m.sector === 'FORWARD'),
    };
  }, [squad]);

  return {
    selectedCategory,
    setSelectedCategory,
    squad,
    isLoadingSquad,
    news,
    isLoadingNews,
    selectedSector,
    setSelectedSector,
    filteredMembers,
    organizedSectors,
  };
};

