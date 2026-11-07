'use client';

import React from 'react';
import { LayoutContainer, Title, Text } from '@/shared/ui/components';
import { STADIUM_TEXTS } from '../../constants/stadium.constants';
import { Calendar, Users, Maximize2, MapPin, Zap, Flame } from 'lucide-react';

interface StadiumQuickFactsProps {
  inaugurationDate?: string;
  capacity?: string;
  pitchDimensions?: string;
  address?: string;
}

export const StadiumQuickFacts: React.FC<StadiumQuickFactsProps> = ({
  inaugurationDate,
  capacity,
  pitchDimensions,
  address,
}) => {
  const items = [
    {
      icon: Calendar,
      label: STADIUM_TEXTS.QUICK_FACTS.INAUGURATION_LABEL,
      value: inaugurationDate || STADIUM_TEXTS.QUICK_FACTS.INAUGURATION_DEFAULT,
    },
    {
      icon: Users,
      label: STADIUM_TEXTS.QUICK_FACTS.CAPACITY_LABEL,
      value: capacity || STADIUM_TEXTS.QUICK_FACTS.CAPACITY_DEFAULT,
    },
    {
      icon: Maximize2,
      label: STADIUM_TEXTS.QUICK_FACTS.PITCH_LABEL,
      value: pitchDimensions || STADIUM_TEXTS.QUICK_FACTS.PITCH_DEFAULT,
    },
    {
      icon: Flame,
      label: STADIUM_TEXTS.QUICK_FACTS.NICKNAME_LABEL,
      value: STADIUM_TEXTS.QUICK_FACTS.NICKNAME_DEFAULT,
    },
    {
      icon: Zap,
      label: STADIUM_TEXTS.QUICK_FACTS.LIGHTING_LABEL,
      value: STADIUM_TEXTS.QUICK_FACTS.LIGHTING_DEFAULT,
    },
    {
      icon: MapPin,
      label: STADIUM_TEXTS.QUICK_FACTS.LOCATION_LABEL,
      value: address ? address.split(',')[0] : STADIUM_TEXTS.QUICK_FACTS.LOCATION_DEFAULT,
    },
  ];

  return (
    <LayoutContainer className="w-full bg-surface/50 border-b border-border py-8 sm:py-10">
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LayoutContainer className="mb-6 flex flex-col gap-1">
          <Title level="h2" className="text-xl sm:text-2xl font-bold text-text-primary">
            {STADIUM_TEXTS.QUICK_FACTS.SECTION_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary">
            {STADIUM_TEXTS.QUICK_FACTS.SECTION_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <LayoutContainer
                key={idx}
                className="p-4 rounded-2xl bg-surface border border-border/80 hover:border-primary/40 transition-all flex flex-col gap-2 group shadow-sm hover:shadow-md"
              >
                <LayoutContainer className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                  <Icon className="w-4 h-4" />
                </LayoutContainer>
                <LayoutContainer className="flex flex-col">
                  <Text as="span" className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    {item.label}
                  </Text>
                  <Text as="span" className="text-sm sm:text-base font-extrabold text-text-primary line-clamp-2">
                    {item.value}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
