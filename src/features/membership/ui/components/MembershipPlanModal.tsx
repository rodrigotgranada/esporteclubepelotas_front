'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components';
import { MembershipPlan } from '../../types/membership.types';
import { MEMBERSHIP_TEXTS } from '../../constants/membership.constants';
import { Check, MessageCircle, Star } from 'lucide-react';

export interface MembershipPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  onSubscribe: (plan: MembershipPlan) => void;
  isSubmitting?: boolean;
}

export const MembershipPlanModal: React.FC<MembershipPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSubscribe,
  isSubmitting = false,
}) => {
  if (!plan) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" className="bg-surface border-border">
      <LayoutContainer className="flex flex-col gap-6 p-2">
        {/* Cabeçalho */}
        <LayoutContainer className="flex flex-col gap-2">
          <LayoutContainer className="flex items-center gap-2">
            {plan.badgeText && (
              <Badge variant="primary" size="sm" className="font-extrabold uppercase inline-flex items-center gap-1">
                {plan.highlighted && <Star className="w-3 h-3 fill-current" />}
                <span>{plan.badgeText}</span>
              </Badge>
            )}
            <Text as="span" className="text-xs text-text-secondary uppercase tracking-widest font-bold">
              {MEMBERSHIP_TEXTS.MODAL_DETAILS_TITLE}
            </Text>
          </LayoutContainer>

          <Title level="h2" className="text-2xl sm:text-3xl font-black text-text-primary">
            {plan.name}
          </Title>

          {plan.description && (
            <Text as="p" className="text-sm text-text-secondary leading-relaxed">
              {plan.description}
            </Text>
          )}

          {/* Preço de destaque */}
          <LayoutContainer className="flex items-baseline gap-1.5 py-3 px-4 mt-2 rounded-2xl bg-surface/80 border border-border/80">
            <Text as="span" className="text-3xl sm:text-4xl font-black text-primary">
              {formattedPrice}
            </Text>
            <Text as="span" className="text-sm text-text-secondary font-semibold">
              {periodLabel}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Lista Completa de Vantagens */}
        <LayoutContainer className="flex flex-col gap-3">
          <Text as="span" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            {MEMBERSHIP_TEXTS.MODAL_ADVANTAGES_TITLE}
          </Text>

          <LayoutContainer className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
            {plan.advantages.map((adv, idx) => (
              <LayoutContainer
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-background/50 border border-border/40 text-left"
              >
                <LayoutContainer className="mt-0.5 rounded-full p-1 bg-primary/20 text-primary shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </LayoutContainer>
                <Text as="span" className="text-sm text-text-primary leading-snug">
                  {adv}
                </Text>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>

        {/* Aviso de atendimento WhatsApp */}
        <LayoutContainer className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2.5 text-xs text-text-secondary">
          <MessageCircle className="w-4 h-4 text-primary shrink-0" />
          <Text as="span">{MEMBERSHIP_TEXTS.MODAL_WHATSAPP_HINT}</Text>
        </LayoutContainer>

        {/* Botão de Contratação */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => onSubscribe(plan)}
          disabled={isSubmitting}
          className="w-full font-black uppercase tracking-wider py-4 shadow-md inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>{MEMBERSHIP_TEXTS.MODAL_BUTTON_SUBSCRIBE}</span>
        </Button>
      </LayoutContainer>
    </Modal>
  );
};
