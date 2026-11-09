import { useState, useEffect, useCallback } from 'react';
import { ClubAnthem } from '../types/anthem.types';
import { anthemService } from '../services/anthem.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAnthem = () => {
  const [officialAnthem, setOfficialAnthem] = useState<ClubAnthem | null>(null);
  const [selectedAnthem, setSelectedAnthem] = useState<ClubAnthem | null>(null);
  const [allVersions, setAllVersions] = useState<ClubAnthem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false);

  const loadAnthemData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [official, versions] = await Promise.all([
        anthemService.getOfficialAnthem(),
        anthemService.getPublicVersions(),
      ]);

      setOfficialAnthem(official);
      setSelectedAnthem(official || versions[0] || null);
      setAllVersions(versions);
    } catch (err) {
      console.error('Erro ao carregar dados do hino:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnthemData();
  }, [loadAnthemData]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents('anthem', () => {
    loadAnthemData();
  });

  const handleSelectVersion = (version: ClubAnthem) => {
    setSelectedAnthem(version);
    setIsVersionsModalOpen(false);
  };

  const handleOpenVersionsModal = () => {
    setIsVersionsModalOpen(true);
  };

  const handleCloseVersionsModal = () => {
    setIsVersionsModalOpen(false);
  };

  return {
    officialAnthem,
    currentAnthem: selectedAnthem || officialAnthem,
    allVersions,
    isLoading,
    isVersionsModalOpen,
    handleSelectVersion,
    handleOpenVersionsModal,
    handleCloseVersionsModal,
    reloadAnthem: loadAnthemData,
  };
};

