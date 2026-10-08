'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LayoutContainer, Text } from '../atoms';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <LayoutContainer className="border border-border rounded-xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-background hover:bg-surface transition-colors"
      >
        <Text className="font-bold text-text-primary">{title}</Text>
        {isOpen ? <ChevronUp size={18} className="text-text-secondary" /> : <ChevronDown size={18} className="text-text-secondary" />}
      </button>
      {isOpen && (
        <LayoutContainer className="p-4 bg-surface/50 border-t border-border animate-in slide-in-from-top-2 duration-200">
          {children}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
