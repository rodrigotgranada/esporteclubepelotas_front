'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer, Text, Title, Badge, Button } from '@/shared/ui/components';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { STORE_TEXTS } from '../../constants/store.constants';

interface StoreMemberDiscountCardProps {
  hasMemberDiscount: boolean;
  memberDiscountText: string;
}

export const StoreMemberDiscountCard: React.FC<StoreMemberDiscountCardProps> = ({
  hasMemberDiscount,
  memberDiscountText,
}) => {
  // Conditionally render ONLY if hasMemberDiscount is true!
  if (!hasMemberDiscount) {
    return null;
  }

  return (
    <LayoutContainer className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/20 to-surface-elevated border-2 border-primary/40 p-6 sm:p-8 shadow-lg">
      <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <LayoutContainer className="flex items-start gap-4">
          <LayoutContainer className="w-12 h-12 rounded-xl bg-primary text-text-on-primary flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <LayoutContainer className="inline-flex items-center gap-2">
              <Badge variant="primary" className="text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
                {STORE_TEXTS.MEMBER_CARD_BADGE}
              </Badge>
            </LayoutContainer>

            <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
              {STORE_TEXTS.MEMBER_CARD_TITLE}
            </Title>

            <Text as="p" className="text-sm text-text-secondary max-w-2xl leading-relaxed">
              {memberDiscountText || STORE_TEXTS.FALLBACK_MEMBER_DISCOUNT}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="shrink-0 w-full sm:w-auto">
          <Link href={STORE_TEXTS.MEMBER_CARD_URL} className="w-full sm:w-auto inline-block">
            <Button
              variant="primary"
              className="w-full sm:w-auto font-bold justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {STORE_TEXTS.MEMBER_CARD_CTA}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

