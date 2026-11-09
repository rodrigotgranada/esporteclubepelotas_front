'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useMembershipLink } from '@/features/membership/hooks/useMembershipLink';
import { MEMBERSHIP_CTA_CONSTANTS } from './MembershipCtaCard.constants';

export interface MembershipCtaCardProps {
  title?: string;
  description?: string;
  badgeText?: string;
  buttonText?: string;
  buttonLink?: string;
  showBenefits?: boolean;
  hideIfSocio?: boolean;
  className?: string;
}

/**
 * MembershipCtaCard
 * Card monumental de conversão para o Quadro Social (Seja Sócio).
 * Oculta automaticamente se o usuário atual já for Sócio (role SOCIO).
 */
export const MembershipCtaCard: React.FC<MembershipCtaCardProps> = ({
  title = MEMBERSHIP_CTA_CONSTANTS.DEFAULT_TITLE,
  description = MEMBERSHIP_CTA_CONSTANTS.DEFAULT_DESCRIPTION,
  badgeText = MEMBERSHIP_CTA_CONSTANTS.DEFAULT_BADGE,
  buttonText = MEMBERSHIP_CTA_CONSTANTS.DEFAULT_BUTTON_TEXT,
  buttonLink,
  showBenefits = true,
  hideIfSocio = true,
  className = '',
}) => {
  const { user } = useAuthStore();
  const membershipLink = useMembershipLink();

  // Verifica se o usuário autenticado já é sócio do clube
  const roleName = user?.role?.name || '';
  const isSocio = Boolean(user?.isSocio) || roleName.toUpperCase() === 'SOCIO';

  // Se o usuário já for sócio, não exibe o convite para associação
  if (hideIfSocio && isSocio) {
    return null;
  }

  const finalLink = buttonLink || membershipLink.url;
  const linkTarget = buttonLink ? undefined : membershipLink.target;
  const linkRel = buttonLink ? undefined : membershipLink.rel;

  const benefitsList = [
    MEMBERSHIP_CTA_CONSTANTS.BENEFIT_1,
    MEMBERSHIP_CTA_CONSTANTS.BENEFIT_2,
    MEMBERSHIP_CTA_CONSTANTS.BENEFIT_3,
  ];

  return (
    <LayoutContainer
      className={`relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface via-surface/95 to-primary/10 p-8 sm:p-12 text-center shadow-2xl shadow-primary/5 transition-all duration-300 hover:border-primary/50 group ${className}`}
    >
      {/* Brilho Radial Dourado no Topo */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Marca d'água monumental do distintivo no fundo do card */}
      <LayoutContainer
        aria-hidden="true"
        className="absolute -right-8 -bottom-10 pointer-events-none select-none opacity-[0.06] dark:opacity-[0.08] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
      >
        <Image
          src="/images/pelotas-logo.png"
          alt="Distintivo Oficial do Pelotas"
          width={280}
          height={320}
          unoptimized
          className="object-contain"
        />
      </LayoutContainer>

      {/* Conteúdo Central */}
      <LayoutContainer className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        
        {/* Badge Superior */}
        <LayoutContainer className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-black tracking-wider uppercase mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <Text as="span">{badgeText}</Text>
        </LayoutContainer>

        {/* Título Principal */}
        <Title
          level="h3"
          className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary mb-3.5 tracking-tight leading-snug"
        >
          {title}
        </Title>

        {/* Descrição Convidativa */}
        <Text
          as="p"
          className="text-text-secondary max-w-xl mx-auto mb-7 text-sm sm:text-base leading-relaxed"
        >
          {description}
        </Text>

        {/* Pílulas de Benefícios Rápidos */}
        {showBenefits && (
          <LayoutContainer className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-8">
            {benefitsList.map((benefit, idx) => (
              <LayoutContainer
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/80 text-xs font-semibold text-text-primary flex items-center gap-2 shadow-xs transition-colors hover:border-primary/40"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <Text as="span">{benefit}</Text>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        )}

        {/* Botão de Chamada para Ação */}
        <Link
          href={finalLink}
          target={linkTarget}
          rel={linkRel}
          className="inline-block"
          aria-label={MEMBERSHIP_CTA_CONSTANTS.ARIA_CTA_LABEL}
        >
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-black text-blue-950 px-8 py-3.5 shadow-lg shadow-primary/25 hover:scale-105 transition-all cursor-pointer"
          >
            {buttonText}
          </Button>
        </Link>
      </LayoutContainer>
    </LayoutContainer>
  );
};
