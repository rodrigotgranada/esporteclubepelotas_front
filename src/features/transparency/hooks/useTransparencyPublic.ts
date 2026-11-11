'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { transparencyService } from '../services/transparency.service';
import { TransparencyDocument, TransparencyBoardMember } from '../types/transparency.types';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export function useTransparencyPublic() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [boardMembers, setBoardMembers] = useState<TransparencyBoardMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [docsData, membersData] = await Promise.all([
        transparencyService.getPublicDocuments(),
        transparencyService.getPublicBoardMembers(),
      ]);
      setDocuments(docsData || []);
      setBoardMembers(membersData || []);
    } catch (err) {
      console.error('Erro ao buscar dados de transparência:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Escuta WebSocket em tempo real para sincronização automática
  useRealtimeEvents('transparency', () => {
    fetchData();
  });

  // Lista única de anos disponíveis nos documentos
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(documents.map((d) => d.year))).sort((a, b) => b - a);
    return years;
  }, [documents]);

  // Filtragem dos documentos
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory = activeTab === 'ALL' || doc.category === activeTab;
      const matchYear = selectedYear === 'ALL' || doc.year === Number(selectedYear);
      return matchCategory && matchYear;
    });
  }, [documents, activeTab, selectedYear]);

  // Separação dos membros por diretoria/conselho
  const executiveBoard = useMemo(() => {
    return boardMembers.filter((m) => m.boardType === 'DIRETORIA_EXECUTIVA');
  }, [boardMembers]);

  const deliberativeCouncil = useMemo(() => {
    return boardMembers.filter((m) => m.boardType === 'CONSELHO_DELIBERATIVO');
  }, [boardMembers]);

  const fiscalCouncil = useMemo(() => {
    return boardMembers.filter((m) => m.boardType === 'CONSELHO_FISCAL');
  }, [boardMembers]);

  return {
    activeTab,
    setActiveTab,
    selectedYear,
    setSelectedYear,
    isLoading,
    availableYears,
    filteredDocuments,
    executiveBoard,
    deliberativeCouncil,
    fiscalCouncil,
  };
}

