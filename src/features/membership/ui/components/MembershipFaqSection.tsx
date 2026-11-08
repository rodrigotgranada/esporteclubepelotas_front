'use client';

import React, { useState } from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
} from '@/shared/ui/components';
import { MEMBERSHIP_FAQS } from '../../constants/membership.constants';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const MembershipFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <LayoutContainer className="w-full py-16 sm:py-20 border-t border-border/60 bg-surface/20">
      <LayoutContainer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Badge e Título */}
        <Badge
          variant="default"
          size="sm"
          className="font-extrabold uppercase tracking-widest px-3.5 py-1 mb-4 inline-flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span>Tire suas Dúvidas</span>
        </Badge>

        <Title
          level="h2"
          className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary text-center mb-10"
        >
          Perguntas Frequentes sobre o Quadro Social
        </Title>

        {/* Lista Sanfonada (Accordion) */}
        <LayoutContainer className="flex flex-col gap-3 w-full">
          {MEMBERSHIP_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <LayoutContainer
                key={idx}
                className="rounded-2xl border border-border/70 bg-surface/60 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none hover:bg-surface transition-colors"
                  aria-expanded={isOpen}
                >
                  <Text as="span" className="font-bold text-sm sm:text-base text-text-primary">
                    {faq.question}
                  </Text>
                  <ChevronDown
                    className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <LayoutContainer className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-border/30 animate-in fade-in duration-200">
                    <Text as="p" className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {faq.answer}
                    </Text>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
