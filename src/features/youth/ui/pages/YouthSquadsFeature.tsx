'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Trophy } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  MembershipCtaCard,
} from '@/shared/ui/components';
import { useYouthHub } from '../../hooks/useYouthHub';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { YouthCategoryTabs } from '../components/YouthCategoryTabs';
import { YouthSquadSection } from '../components/YouthSquadSection';

export const YouthSquadsFeature: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    squad,
    isLoadingSquad,
    organizedSectors,
  } = useYouthHub();

  const texts = YOUTH_CONSTANTS.PAGE_ELENCOS;

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botão Voltar para o Hub da Base */}
      <LayoutContainer className="mb-6">
        <Link href="/base" className="inline-block">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-xs font-bold text-text-secondary hover:text-primary transition-colors"
          >
            {texts.BACK}
          </Button>
        </Link>
      </LayoutContainer>

      {/* Header da Página */}
      <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-surface-secondary border border-border p-6 sm:p-10 mb-8 shadow-sm">
        <LayoutContainer className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <LayoutContainer className="flex flex-col gap-2 max-w-2xl">
            <LayoutContainer className="inline-flex items-center gap-2">
              <Badge variant="primary" className="px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Users className="w-3.5 h-3.5" />
                <Text as="span">Plantéis de Formação</Text>
              </Badge>
            </LayoutContainer>

            <Title level="h1" className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
              {texts.TITLE}
            </Title>
            <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {texts.SUBTITLE}
            </Text>
          </LayoutContainer>

          {/* Abas de Categoria Sub-20, Sub-17, Sub-15 */}
          <YouthCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </LayoutContainer>
      </LayoutContainer>

      {/* Seção Completa do Plantel da Categoria Ativa */}
      <YouthSquadSection
        squad={squad}
        isLoading={isLoadingSquad}
        organizedSectors={organizedSectors}
      />

      {/* Convite para o Quadro Social */}
      <MembershipCtaCard
        title="Ajude a Manter as Categorias de Base do Pelotas Fortes"
        description="Seja sócio do Lobo e contribua com a estrutura de treinos, viagens, alimentação e formação das Crias da Boca do Lobo."
        buttonText="Seja Sócio Áureo-Cerúleo"
        className="mt-14"
      />
    </LayoutContainer>
  );
};

