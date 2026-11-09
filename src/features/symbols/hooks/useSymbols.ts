import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClubSymbol, ClubSymbolOverview } from '../types/symbols.types';
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
  const [overviews, setOverviews] = useState<ClubSymbolOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SymbolsTabType>('MASCOT');
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [symbolsData, overviewsData] = await Promise.all([
        symbolsService.publicGetAll(),
        symbolsService.publicGetOverviews(),
      ]);
      setSymbols(symbolsData);
      setOverviews(overviewsData);
    } catch (err) {
      console.error('Erro ao carregar dados de símbolos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents('symbols', () => {
    loadData();
  });

  useRealtimeEvents('symbols_overview', () => {
    loadData();
  });

  // Narrativas Gerais de cada Seção com fallbacks amigáveis
  const mascotOverview: ClubSymbolOverview = useMemo(() => {
    const found = overviews.find((o) => o.category === 'MASCOT');
    return (
      found || {
        category: 'MASCOT',
        title: 'A Mística do Lobo da Boca do Lobo',
        description:
          'O Lobo é o símbolo máximo da alma, da garra e da lealdade áureo-cerúlea. A alcunha nasceu intimamente entrelaçada com a mística do Estádio Boca do Lobo — o palco de futebol mais antigo em atividade ininterrupta no Rio Grande do Sul e um dos monumentos do futebol brasileiro. Quando o Pelotas entra em campo, o Lobo sintetiza a força da matilha: uma torcida destemida e apaixonada que canta e defende o pavilhão azul e amarelo com honra.',
      }
    );
  }, [overviews]);

  const shieldOverview: ClubSymbolOverview = useMemo(() => {
    const found = overviews.find((o) => o.category === 'SHIELD');
    return (
      found || {
        category: 'SHIELD',
        title: 'O Brasão Centenário & Tradição de 1908',
        description:
          'O distintivo do Esporte Clube Pelotas é composto pelas elegantes iniciais entrelaçadas "E.C.P." no interior de um escudo de formato suíço. As cores azul cerúleo e amarelo ouro refletem a grandeza do ideal e a tradição que atravessa os séculos desde 1908, coroada pela histórica conquista do Campeonato Gaúcho de 1930.',
      }
    );
  }, [overviews]);

  const flagColorsOverview: ClubSymbolOverview = useMemo(() => {
    const found = overviews.find((o) => o.category === 'FLAG_COLORS');
    return (
      found || {
        category: 'FLAG_COLORS',
        title: 'O Pavilhão Sagrado & As Cores Áureo-Cerúleas',
        description:
          'O pavilhão oficial do Esporte Clube Pelotas tremula solenemente na Boca do Lobo em suas duas faixas horizontais de proporções iguais: a superior em amarelo ouro e a inferior em azul cerúleo, trazendo ao centro o brasão centenário. As cores áureo-cerúleas unem o amarelo ouro — evocando a nobreza, a energia solar e a glória imortal — e o azul celeste — remetendo à infinitude do céu de Pelotas e à lealdade inabalável da torcida.',
      }
    );
  }, [overviews]);

  // Mascote Oficial e Mascotes Antigos Ordenados por Período
  const officialMascot = useMemo(() => {
    return (
      symbols.find((s) => s.category === 'MASCOT' && s.isOfficial) ||
      symbols.find((s) => s.category === 'MASCOT') ||
      null
    );
  }, [symbols]);

  const historicalMascots = useMemo(() => {
    return symbols
      .filter((s) => s.category === 'MASCOT' && s.id !== officialMascot?.id)
      .sort((a, b) => (a.yearStart || 0) - (b.yearStart || 0));
  }, [symbols, officialMascot]);

  // Escudo Oficial e Evolução por Ordem de Período
  const officialShield = useMemo(() => {
    return (
      symbols.find((s) => s.category === 'SHIELD' && s.isOfficial) ||
      symbols.find((s) => s.category === 'SHIELD') ||
      null
    );
  }, [symbols]);

  const historicalShields = useMemo(() => {
    return symbols
      .filter((s) => s.category === 'SHIELD' && s.id !== officialShield?.id)
      .sort((a, b) => (a.yearStart || 0) - (b.yearStart || 0));
  }, [symbols, officialShield]);

  // Pavilhão Oficial e Cores
  const officialFlag = useMemo(() => {
    return (
      symbols.find((s) => s.category === 'FLAG' && s.isOfficial) ||
      symbols.find((s) => s.category === 'FLAG') ||
      null
    );
  }, [symbols]);

  const historicalFlags = useMemo(() => {
    return symbols
      .filter((s) => s.category === 'FLAG' && s.id !== officialFlag?.id)
      .sort((a, b) => (a.yearStart || 0) - (b.yearStart || 0));
  }, [symbols, officialFlag]);

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
    overviews,
    isLoading,
    activeTab,
    setActiveTab,
    mascotOverview,
    shieldOverview,
    flagColorsOverview,
    officialMascot,
    historicalMascots,
    officialShield,
    historicalShields,
    officialFlag,
    historicalFlags,
    colorsSymbol,
    lightbox,
    openLightbox,
    closeLightbox,
    reloadSymbols: loadData,
  };
};
