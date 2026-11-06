'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  footballService,
  YouthPortalConfig,
} from '@/features/football/services/football.service';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';

const FALLBACK_YOUTH_CONFIG: YouthPortalConfig = {
  pillars: [
    {
      title: 'DNA Competitivo Áureo-Cerúleo',
      description:
        'Ensinamos o respeito à história centenária do Pelotas, a dedicação intransigente em campo e o orgulho de defender as cores azul e amarela na Boca do Lobo.',
    },
    {
      title: 'Metodologia Tática & Intensidade',
      description:
        'Treinamentos modernos focados em rápida leitura de jogo, tomada de decisão sob pressão, transições velozes e alto rigor físico.',
    },
    {
      title: 'Acompanhamento Cidadão & Escolar',
      description:
        'O atleta do Pelotas deve manter bom rendimento escolar comprovado. Oferecemos suporte pedagógico e orientação para a vida fora das quatro linhas.',
    },
    {
      title: 'Integração com o Profissional',
      description:
        'Comunicação direta entre as comissões técnicas da base e a equipe principal, possibilitando treinos integrados e promoção gradual dos jovens talentos.',
    },
  ],
  peneirasCriteria: [
    'Atestado médico cardiológico de aptidão física original (emitido nos últimos 6 meses).',
    'Documento de identidade oficial com foto (RG) e CPF do atleta e do responsável.',
    'Declaração de matrícula e frequência escolar ativa no ano letivo corrente.',
    'Material de treino próprio: chuteiras, caneleiras, meiões e calção (azul, amarelo, branco ou preto; proibido uniforme de rivais).',
    'Termo de autorização de participação preenchido e assinado pelos pais ou responsáveis legais.',
  ],
  contactTitle: 'Departamento de Futebol de Base',
  contactDescription:
    'As datas oficiais de avaliações abertas e peneiras são divulgadas periodicamente nos canais oficiais do clube. Fique atento às redes sociais do Pelotas!',
  contactEmail: 'base@esporteclubepelotas.com.br',
  contactPhone: null,
};

export const useYouthHub = () => {
  const [news, setNews] = useState<NewsArticleData[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);

  const [youthConfig, setYouthConfig] = useState<YouthPortalConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);

  const loadYouthNews = useCallback(async () => {
    try {
      setIsLoadingNews(true);
      const res = await newsService.getNews({ limit: 12, isYouth: true });
      const articles = res.data || [];

      const filtered = articles.filter((art) => {
        const catName =
          typeof art.category === 'object' && art.category
            ? art.category.name?.toLowerCase() || ''
            : '';
        const hasBaseCategory = catName.includes('base') || catName.includes('formação');
        const hasBaseTag = (art.tags || []).some((t) => t.toLowerCase().includes('base'));
        return art.isYouth || hasBaseCategory || hasBaseTag;
      });

      setNews(filtered.length > 0 ? filtered.slice(0, 4) : articles.slice(0, 4));
    } catch (err) {
      console.warn('[useYouthHub] Falha temporária ao carregar notícias da base:', err);
      setNews([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  const loadYouthConfig = useCallback(async () => {
    try {
      setIsLoadingConfig(true);
      const data = await footballService.getYouthPortalConfig();
      setYouthConfig(data);
    } catch (err) {
      console.warn(
        '[useYouthHub] Usando configuração padrão da base enquanto o servidor sincroniza:',
        err,
      );
      setYouthConfig(FALLBACK_YOUTH_CONFIG);
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    loadYouthNews();
    loadYouthConfig();
  }, [loadYouthNews, loadYouthConfig]);

  return {
    news,
    isLoadingNews,
    youthConfig,
    isLoadingConfig,
  };
};
