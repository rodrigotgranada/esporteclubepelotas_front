'use client';

import React, { useRef } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Spinner,
} from '@/shared/ui/components';
import { MEMBERSHIP_TEXTS } from '../../constants/membership.constants';
import { useMembershipPlans } from '../../hooks/useMembershipPlans';
import { useMembershipLeadModal } from '../../hooks/useMembershipLeadModal';
import { MembershipHero } from '../components/MembershipHero';
import { MembershipPlanCard } from '../components/MembershipPlanCard';
import { MembershipPlanModal } from '../components/MembershipPlanModal';
import { QuickLeadModal } from '../components/QuickLeadModal';
import { MembershipFaqSection } from '../components/MembershipFaqSection';
import { Sparkles, AlertCircle } from 'lucide-react';

export const MembershipFeature: React.FC = () => {
  const { plans, isLoading, error } = useMembershipPlans();
  const plansSectionRef = useRef<HTMLDivElement>(null);

  const {
    selectedPlan,
    isDetailsOpen,
    isQuickLeadOpen,
    isSubmitting,
    handleOpenDetails,
    handleCloseDetails,
    handleCloseQuickLead,
    handleStartSubscription,
    handleSubmitQuickLead,
  } = useMembershipLeadModal();

  const handleScrollToPlans = () => {
    plansSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LayoutContainer as="main" className="w-full min-h-screen bg-background">
      {/* 1. Hero Monumental do Quadro Social */}
      <MembershipHero onScrollToPlans={handleScrollToPlans} />

      {/* 2. Seção de Planos de Sócios */}
      <LayoutContainer
        ref={plansSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <LayoutContainer className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <Badge
            variant="primary"
            size="sm"
            className="font-extrabold uppercase tracking-widest px-3.5 py-1 mb-3 inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{MEMBERSHIP_TEXTS.PLANS_SECTION_BADGE}</span>
          </Badge>

          <Title
            level="h2"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-4"
          >
            {MEMBERSHIP_TEXTS.PLANS_SECTION_TITLE}
          </Title>

          <Text
            as="p"
            className="text-text-secondary text-sm sm:text-base max-w-2xl font-normal leading-relaxed"
          >
            {MEMBERSHIP_TEXTS.PLANS_SECTION_SUBTITLE}
          </Text>
        </LayoutContainer>

        {/* Loading State Obrigatório */}
        {isLoading && (
          <LayoutContainer className="flex flex-col items-center justify-center py-20">
            <Spinner className="w-10 h-10 text-primary mb-4" />
            <Text as="p" className="text-text-secondary text-sm font-semibold">
              {MEMBERSHIP_TEXTS.LOADING_PLANS}
            </Text>
          </LayoutContainer>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <LayoutContainer className="flex flex-col items-center justify-center py-12 p-6 rounded-3xl bg-[#ea580c]/10 border border-[#ea580c]/30 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-[#ea580c] mb-3" />
            <Text as="p" className="text-sm font-bold text-[#ea580c]">
              {error}
            </Text>
          </LayoutContainer>
        )}

        {/* Grid de Cards dos Planos */}
        {!isLoading && !error && plans.length > 0 && (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {plans.map((plan) => (
              <MembershipPlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleOpenDetails}
              />
            ))}
          </LayoutContainer>
        )}

        {/* Empty State */}
        {!isLoading && !error && plans.length === 0 && (
          <LayoutContainer className="flex flex-col items-center justify-center py-16 text-center">
            <Text as="p" className="text-text-secondary text-sm font-semibold">
              {MEMBERSHIP_TEXTS.NO_PLANS_AVAILABLE}
            </Text>
          </LayoutContainer>
        )}
      </LayoutContainer>

      {/* 3. Seção de Perguntas Frequentes (FAQ) */}
      <MembershipFaqSection />

      {/* 4. Modal de Detalhes do Plano */}
      <MembershipPlanModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        plan={selectedPlan}
        onSubscribe={handleStartSubscription}
        isSubmitting={isSubmitting}
      />

      {/* 5. Modal de Cadastro Rápido de Lead (para não autenticados) */}
      <QuickLeadModal
        isOpen={isQuickLeadOpen}
        onClose={handleCloseQuickLead}
        plan={selectedPlan}
        onSubmit={handleSubmitQuickLead}
        isSubmitting={isSubmitting}
      />
    </LayoutContainer>
  );
};
