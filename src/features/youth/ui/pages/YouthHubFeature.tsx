'use client';

import React from 'react';
import { LayoutContainer, MembershipCtaCard } from '@/shared/ui/components';
import { useYouthHub } from '../../hooks/useYouthHub';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { YouthHero } from '../components/YouthHero';
import { YouthNewsSection } from '../components/YouthNewsSection';
import { YouthSquadsCtaCard } from '../components/YouthSquadsCtaCard';
import { YouthMethodologySection } from '../components/YouthMethodologySection';
import { YouthPeneirasSection } from '../components/YouthPeneirasSection';

export const YouthHubFeature: React.FC = () => {
  const { news, isLoadingNews, youthConfig, isLoadingConfig } = useYouthHub();
  const ctaTexts = YOUTH_CONSTANTS.HUB_CTA;

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* 1. Hero Institucional das Crias da Boca */}
      <YouthHero />

      {/* 2. Notícias & Cobertura da Base no Topo */}
      <YouthNewsSection news={news} isLoading={isLoadingNews} viewAllHref="/base/materias" />

      {/* 3. Vitrine dos Elencos da Base com Botão Dedicado */}
      <YouthSquadsCtaCard />

      {/* 4. Metodologia & Pilares de Formação (Dinâmico: 0 a 4 cards) */}
      <YouthMethodologySection
        pillars={youthConfig?.pillars || []}
        isLoading={isLoadingConfig}
      />

      {/* 5. Peneiras, Critérios & Contato da Coordenação (Dinâmico) */}
      <YouthPeneirasSection
        config={youthConfig}
        isLoading={isLoadingConfig}
      />

      {/* 6. Convite para o Quadro Social */}
      <MembershipCtaCard
        title={ctaTexts.TITLE}
        description={ctaTexts.DESC}
        buttonText={ctaTexts.BTN}
        className="mt-14"
      />
    </LayoutContainer>
  );
};
