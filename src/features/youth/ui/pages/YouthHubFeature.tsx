'use client';

import React from 'react';
import { LayoutContainer, MembershipCtaCard } from '@/shared/ui/components';
import { useYouthHub } from '../../hooks/useYouthHub';
import { YouthHero } from '../components/YouthHero';
import { YouthNewsSection } from '../components/YouthNewsSection';
import { YouthSquadsCtaCard } from '../components/YouthSquadsCtaCard';
import { YouthMethodologySection } from '../components/YouthMethodologySection';
import { YouthPeneirasSection } from '../components/YouthPeneirasSection';

export const YouthHubFeature: React.FC = () => {
  const { news, isLoadingNews } = useYouthHub();

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* 1. Hero Institucional das Crias da Boca */}
      <YouthHero />

      {/* 2. Notícias & Cobertura da Base no Topo */}
      <YouthNewsSection news={news} isLoading={isLoadingNews} viewAllHref="/base/materias" />

      {/* 3. Vitrine dos Elencos da Base com Botão Dedicado */}
      <YouthSquadsCtaCard />

      {/* 4. Metodologia & Pilares de Formação */}
      <YouthMethodologySection />

      {/* 5. Peneiras & Avaliações Oficiais */}
      <YouthPeneirasSection />

      {/* 6. Convite para o Quadro Social */}
      <MembershipCtaCard
        title="Apoie a Formação dos Novos Talentos do Lobo"
        description="Ao se associar ao Esporte Clube Pelotas, você apoia diretamente a estrutura das categorias de base e ajuda a revelar novos ídolos na Boca do Lobo."
        buttonText="Seja Sócio e Fortaleça a Base"
        className="mt-14"
      />
    </LayoutContainer>
  );
};
