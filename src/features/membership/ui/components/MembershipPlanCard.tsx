'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components';
import { MembershipPlan } from '../../types/membership.types';
import { MEMBERSHIP_TEXTS } from '../../constants/membership.constants';
import { Check, Star, ArrowRight } from 'lucide-react';

export interface MembershipPlanCardProps {
  plan: MembershipPlan;
  onSelect: (plan: MembershipPlan) => void;
}

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({
  plan,
  onSelect,
}) => {
  const isHighlighted = plan.highlighted;

  const formattedPrice = plan.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const periodLabel =
    plan.billingPeriod === 'ANUAL'
      ? MEMBERSHIP_TEXTS.PERIOD_LABEL_YEAR
      : plan.billingPeriod === 'SEMESTRAL'
      ? MEMBERSHIP_TEXTS.PERIOD_LABEL_SEMESTER
      : plan.billingPeriod === 'TRIMESTRAL'
      ? MEMBERSHIP_TEXTS.PERIOD_LABEL_TRIMESTER
      : MEMBERSHIP_TEXTS.PERIOD_LABEL_MONTH;

  const visibleAdvantages = plan.advantages.slice(0, 4);
  const remainingCount = plan.advantages.length - 4;

  return (
    <LayoutContainer
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
        isHighlighted
          ? 'bg-surface border-2 border-primary shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 md:-translate-y-2'
          : 'bg-surface/70 border border-border hover:border-primary/50 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Badge Superior */}
      {plan.badgeText && (
        <LayoutContainer className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge
            variant={isHighlighted ? 'primary' : 'default'}
            size="sm"
            className="font-black uppercase tracking-wider px-3.5 py-1 shadow-md inline-flex items-center gap-1.5"
          >
            {isHighlighted && <Star className="w-3.5 h-3.5 fill-current" />}
            <span>{plan.badgeText}</span>
          </Badge>
        </LayoutContainer>
      )}

      {/* Cabeçalho do Card */}
      <LayoutContainer className="flex flex-col gap-3 pt-2">
        <Title level="h3" className="text-xl sm:text-2xl font-black text-text-primary">
          {plan.name}
        </Title>

        {plan.description && (
          <Text as="p" className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2">
            {plan.description}
          </Text>
        )}

        {/* Preço e Recorrência */}
        <LayoutContainer className="flex items-baseline gap-1 pt-3 pb-4 border-b border-border/60">
          <Text as="span" className="text-3xl sm:text-4xl font-black text-primary">
            {formattedPrice}
          </Text>
          <Text as="span" className="text-xs sm:text-sm text-text-secondary font-medium">
            {periodLabel}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Lista de Vantagens Resumida */}
      <LayoutContainer className="flex flex-col gap-2.5 my-6">
        {visibleAdvantages.map((adv, idx) => (
          <LayoutContainer key={idx} className="flex items-start gap-2.5 text-left">
            <LayoutContainer className="mt-0.5 rounded-full p-0.5 bg-primary/20 text-primary shrink-0">
              <Check className="w-3.5 h-3.5" />
            </LayoutContainer>
            <Text as="span" className="text-xs sm:text-sm text-text-primary leading-snug">
              {adv}
            </Text>
          </LayoutContainer>
        ))}

        {remainingCount > 0 && (
          <Text as="span" className="text-xs font-bold text-primary mt-1 text-left">
            +{remainingCount} vantagens inclusas no plano
          </Text>
        )}
      </LayoutContainer>

      {/* Botão de Ação */}
      <Button
        variant={isHighlighted ? 'primary' : 'outline'}
        size="md"
        onClick={() => onSelect(plan)}
        className="w-full font-bold uppercase tracking-wider text-xs py-3 inline-flex items-center justify-center gap-2"
      >
        <span>{MEMBERSHIP_TEXTS.BUTTON_VIEW_DETAILS}</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </LayoutContainer>
  );
};
