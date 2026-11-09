import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClubKit, ClubKitCompetitionItem } from '../types/kits.types';
import { kitsService } from '../services/kits.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export interface KitLightboxState {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  title: string;
  subtitle?: string;
}

export const useKits = () => {
  const [currentKits, setCurrentKits] = useState<ClubKit[]>([]);
  const [competitions, setCompetitions] = useState<ClubKitCompetitionItem[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [historicalKits, setHistoricalKits] = useState<ClubKit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoricalLoading, setIsHistoricalLoading] = useState(false);

  const [lightbox, setLightbox] = useState<KitLightboxState>({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: '',
  });

  // Carregar dados iniciais: mantos atuais e competições históricas
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [currentData, competitionsData, allHistoricalData] = await Promise.all([
        kitsService.publicGetCurrent(),
        kitsService.publicGetCompetitions(),
        kitsService.publicGetHistorical(),
      ]);

      setCurrentKits(currentData);
      setCompetitions(competitionsData);

      // Se houver competições históricas, seleciona a primeira por padrão
      if (competitionsData.length > 0) {
        const initialComp = competitionsData[0].competition;
        setSelectedCompetition(initialComp);
        const filtered = allHistoricalData.filter(
          (kit) => kit.competition.toLowerCase() === initialComp.toLowerCase(),
        );
        setHistoricalKits(filtered.length > 0 ? filtered : allHistoricalData);
      } else {
        setSelectedCompetition(null);
        setHistoricalKits(allHistoricalData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados de uniformes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents('kits', () => {
    loadInitialData();
  });

  // Mudar campeonato selecionado
  const handleSelectCompetition = useCallback(async (competition: string) => {
    try {
      setIsHistoricalLoading(true);
      setSelectedCompetition(competition);
      const data = await kitsService.publicGetHistorical(competition);
      setHistoricalKits(data);
    } catch (err) {
      console.error('Erro ao buscar uniformes da competição:', err);
    } finally {
      setIsHistoricalLoading(false);
    }
  }, []);

  // Lightbox handlers com galeria completa (foto principal + fotos de detalhes)
  const openLightbox = useCallback(
    (kit: ClubKit, clickedImageIndex = 0) => {
      const allImages = [kit.imageUrl, ...(kit.galleryUrls || [])].filter(Boolean);
      setLightbox({
        isOpen: true,
        images: allImages.length > 0 ? allImages : [kit.imageUrl],
        initialIndex: clickedImageIndex,
        title: kit.name,
        subtitle: `${kit.competition} (${kit.seasonYear}) • ${kit.manufacturer || 'Esporte Clube Pelotas'}`,
      });
    },
    [],
  );

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Total de mantos históricos disponíveis (para saber se exibe a seção)
  const hasHistoricalKits = useMemo(() => {
    return competitions.length > 0 || historicalKits.length > 0;
  }, [competitions, historicalKits]);

  return {
    currentKits,
    competitions,
    selectedCompetition,
    historicalKits,
    isLoading,
    isHistoricalLoading,
    hasHistoricalKits,
    lightbox,
    handleSelectCompetition,
    openLightbox,
    closeLightbox,
    reloadKits: loadInitialData,
  };
};

