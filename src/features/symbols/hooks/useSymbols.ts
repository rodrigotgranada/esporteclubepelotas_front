import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClubSymbol } from '../types/symbols.types';
import { symbolsService } from '../services/symbols.service';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export type SymbolsTabType = 'MASCOT' | 'SHIELD' | 'FLAG_COLORS';

export interface LightboxState {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export const useSymbols = () => {
  const [symbols, setSymbols] = useState<ClubSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SymbolsTabType>('MASCOT');
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  const loadSymbols = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await symbolsService.publicGetAll();
      setSymbols(data);
    } catch (err) {
      console.error('Erro ao carregar símbolos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSymbols();
  }, [loadSymbols]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents('symbols', () => {
    loadSymbols();
  });

  // Mascote Oficial e Acervo Histórico
  const officialMascot = useMemo(() => {
    return (
      symbols.find((s) => s.category === 'MASCOT' && s.isOfficial) ||
      symbols.find((s) => s.category === 'MASCOT') ||
      null
    );
  }, [symbols]);

  const historicalMascots = useMemo(() => {
    return symbols.filter((s) => s.category === 'MASCOT' && s.id !== officialMascot?.id);
  }, [symbols, officialMascot]);

  // Escudo Oficial e Evolução
  const officialShield = useMemo(() => {
    return (
      symbols.find((s) => s.category === 'SHIELD' && s.isOfficial) ||
      symbols.find((s) => s.category === 'SHIELD') ||
      null
    );
  }, [symbols]);

  const historicalShields = useMemo(() => {
    return symbols.filter((s) => s.category === 'SHIELD' && s.id !== officialShield?.id);
  }, [symbols, officialShield]);

  // Bandeira e Cores
  const officialFlag = useMemo(() => {
    return symbols.find((s) => s.category === 'FLAG') || null;
  }, [symbols]);

  const colorsSymbol = useMemo(() => {
    return symbols.find((s) => s.category === 'COLORS') || null;
  }, [symbols]);

  const openLightbox = (imageUrl: string, title: string, subtitle?: string) => {
    setLightbox({
      isOpen: true,
      imageUrl,
      title,
      subtitle,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    symbols,
    isLoading,
    activeTab,
    setActiveTab,
    officialMascot,
    historicalMascots,
    officialShield,
    historicalShields,
    officialFlag,
    colorsSymbol,
    lightbox,
    openLightbox,
    closeLightbox,
    reloadSymbols: loadSymbols,
  };
};
