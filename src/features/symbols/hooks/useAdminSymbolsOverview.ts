import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  ClubSymbolOverview,
  ClubSymbolOverviewFormData,
  SymbolOverviewCategory,
} from '../types/symbols.types';
import { symbolsService } from '../services/symbols.service';
import { SYMBOLS_TEXTS } from '../constants/symbols.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAdminSymbolsOverview = () => {
  const [overviews, setOverviews] = useState<ClubSymbolOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SymbolOverviewCategory>('MASCOT');
  const [isSaving, setIsSaving] = useState(false);

  const loadOverviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await symbolsService.publicGetOverviews();
      setOverviews(data);
    } catch (err) {
      console.error('Erro ao carregar narrativas gerais de símbolos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverviews();
  }, [loadOverviews]);

  useRealtimeEvents('symbols_overview', () => {
    loadOverviews();
  });

  const getOverviewForCategory = useCallback(
    (cat: SymbolOverviewCategory): ClubSymbolOverview => {
      const found = overviews.find((o) => o.category === cat);
      if (found) return found;

      switch (cat) {
        case 'MASCOT':
          return {
            category: 'MASCOT',
            title: 'A Mística do Lobo da Boca do Lobo',
            description:
              'O Lobo é o símbolo máximo da alma, da garra e da lealdade áureo-cerúlea. A alcunha nasceu intimamente entrelaçada com a mística do Estádio Boca do Lobo — o palco de futebol mais antigo em atividade ininterrupta no Rio Grande do Sul e um dos monumentos do futebol brasileiro. Quando o Pelotas entra em campo, o Lobo sintetiza a força da matilha: uma torcida destemida e apaixonada que canta e defende o pavilhão azul e amarelo com honra.',
          };
        case 'SHIELD':
          return {
            category: 'SHIELD',
            title: 'O Brasão Centenário & Tradição de 1908',
            description:
              'O distintivo do Esporte Clube Pelotas é composto pelas elegantes iniciais entrelaçadas "E.C.P." no interior de um escudo de formato suíço. As cores azul cerúleo e amarelo ouro refletem a grandeza do ideal e a tradição que atravessa os séculos desde 1908, coroada pela histórica conquista do Campeonato Gaúcho de 1930.',
          };
        case 'FLAG_COLORS':
          return {
            category: 'FLAG_COLORS',
            title: 'O Pavilhão Sagrado & As Cores Áureo-Cerúleas',
            description:
              'O pavilhão oficial do Esporte Clube Pelotas tremula solenemente na Boca do Lobo em suas duas faixas horizontais de proporções iguais: a superior em amarelo ouro e a inferior em azul cerúleo, trazendo ao centro o brasão centenário. As cores áureo-cerúleas unem o amarelo ouro — evocando a nobreza, a energia solar e a glória imortal — e o azul celeste — remetendo à infinitude do céu de Pelotas e à lealdade inabalável da torcida.',
          };
      }
    },
    [overviews]
  );

  const handleOpenDrawer = (category?: SymbolOverviewCategory) => {
    if (category) {
      setActiveCategory(category);
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSaveOverview = async (
    category: SymbolOverviewCategory,
    formData: ClubSymbolOverviewFormData
  ) => {
    try {
      setIsSaving(true);
      await symbolsService.adminUpdateOverview(category, formData);
      toast.success(SYMBOLS_TEXTS.OVERVIEW_SAVE_SUCCESS);
      await loadOverviews();
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Erro ao salvar texto geral:', err);
      toast.error(SYMBOLS_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    overviews,
    isLoading,
    isDrawerOpen,
    activeCategory,
    setActiveCategory,
    isSaving,
    getOverviewForCategory,
    handleOpenDrawer,
    handleCloseDrawer,
    handleSaveOverview,
    reloadOverviews: loadOverviews,
  };
};
