'use client';

import React from 'react';
import { LayoutContainer, MembershipCtaCard } from '@/shared/ui/components';
import { FemaleHero } from '../components/FemaleHero';
import { FemaleSquadSection } from '../components/FemaleSquadSection';
import { FemaleNewsSection } from '../components/FemaleNewsSection';
import { useFemaleHub } from '../../hooks/useFemaleHub';
import { FEMALE_CONSTANTS } from '../../constants/female.constants';
import { HomeSponsorsSection } from '@/features/sponsors/ui/components/HomeSponsorsSection';

export const FemaleHubFeature: React.FC = () => {
  const { news, isLoadingNews, currentSquad, isLoadingSquad } = useFemaleHub();
  const ctaTexts = FEMALE_CONSTANTS.HUB_CTA;

  return (
    <LayoutContainer className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Oficial das Lobas */}
      <FemaleHero />

      {/* Seção Elenco em Destaque */}
      <FemaleSquadSection currentSquad={currentSquad} isLoading={isLoadingSquad} />

      {/* Últimas Notícias do Futebol Feminino */}
      <FemaleNewsSection news={news} isLoading={isLoadingNews} />

      {/* CTA Quadro Social */}
      <LayoutContainer className="my-10">
        <MembershipCtaCard
          title={ctaTexts.TITLE}
          description={ctaTexts.DESC}
          buttonText={ctaTexts.BTN}
          buttonLink="/planos"
        />
      </LayoutContainer>

      {/* Patrocinadores Oficiais */}
      <LayoutContainer className="my-10">
        <HomeSponsorsSection />
      </LayoutContainer>
    </LayoutContainer>
  );
};
