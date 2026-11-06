'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Spinner, Button } from '@/shared/ui/components';
import { useTimeline } from '../../hooks/useTimeline';
import { TimelineHero } from '../components/TimelineHero';
import { TimelineCard } from '../components/TimelineCard';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const TimelineFeature: React.FC = () => {
  const {
    events,
    availableYears,
    selectedYear,
    setSelectedYear,
    isLoading,
  } = useTimeline();

  if (isLoading) {
    return (
      <LayoutContainer className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Spinner text={TIMELINE_CONSTANTS.LOADING_TEXT} />
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="min-h-screen pb-24">
      {/* Hero Header with Year Selector */}
      <TimelineHero
        availableYears={availableYears}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />

      {/* Main Timeline Section */}
      <LayoutContainer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 relative">
        {events.length === 0 ? (
          <LayoutContainer className="text-center py-20 p-8 rounded-3xl bg-surface border border-border">
            <Shield className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <Title level="h3" className="text-xl font-bold text-text-primary mb-2">
              {TIMELINE_CONSTANTS.EMPTY_TITLE}
            </Title>
            <Text className="text-text-secondary max-w-md mx-auto">
              {TIMELINE_CONSTANTS.EMPTY_DESC}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="relative">
            {/* The Vertical Spine Line */}
            {/* Mobile: line is pinned to the left at left-6 (24px) */}
            {/* Desktop (lg): line is in the exact center at left-1/2 */}
            <LayoutContainer
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/10 rounded-full left-6 lg:left-1/2 -translate-x-1/2 pointer-events-none"
            />

            {/* List of Milestones */}
            <LayoutContainer className="flex flex-col gap-10 sm:gap-14">
              {events.map((event, index) => {
                const isEven = index % 2 === 0;

                return (
                  <LayoutContainer
                    key={event.id || event._id || index}
                    className="relative flex items-center w-full"
                  >
                    {/* Node / Marker on the Line */}
                    {/* Mobile: positioned at left-6 */}
                    {/* Desktop (lg): positioned at left-1/2 */}
                    <LayoutContainer
                      className={`absolute z-20 flex items-center justify-center rounded-full font-black text-xs sm:text-sm tracking-wider shadow-lg transition-transform hover:scale-110 left-6 lg:left-1/2 -translate-x-1/2 ${
                        event.isHighlighted
                          ? 'w-12 h-12 sm:w-14 sm:h-14 bg-primary text-blue-950 ring-4 ring-primary/30 font-black'
                          : 'w-10 h-10 sm:w-12 sm:h-12 bg-surface border-2 border-primary text-primary ring-2 ring-primary/20'
                      }`}
                    >
                      <span>{event.year}</span>
                    </LayoutContainer>

                    {/* Content Card Container */}
                    {/* Mobile: indented to the right (pl-14 sm:pl-16) taking full width */}
                    {/* Desktop (lg): takes half-width (w-[calc(50%-2.5rem)]) alternating left or right */}
                    <LayoutContainer
                      className={`w-full pl-14 sm:pl-16 lg:pl-0 lg:w-[calc(50%-2.5rem)] ${
                        isEven ? 'lg:mr-auto' : 'lg:ml-auto'
                      }`}
                    >
                      <TimelineCard event={event} isEven={isEven} />
                    </LayoutContainer>
                  </LayoutContainer>
                );
              })}
            </LayoutContainer>

            {/* Timeline End Marker */}
            <LayoutContainer className="relative flex items-center justify-center mt-14 sm:mt-18">
              <LayoutContainer className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-surface shadow-md z-10" />
            </LayoutContainer>
          </LayoutContainer>
        )}

        {/* Footer CTA */}
        <LayoutContainer className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-surface to-primary/10 border border-primary/30 text-center max-w-4xl mx-auto shadow-md">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <Title level="h3" className="text-2xl sm:text-3xl font-black text-text-primary mb-3">
            O Esporte Clube Pelotas é Tradição Centenária
          </Title>
          <Text className="text-text-secondary max-w-xl mx-auto mb-6 text-sm sm:text-base">
            Seja sócio do Lobo e ajude a escrever as próximas páginas douradas da nossa história na Boca do Lobo.
          </Text>
          <Link href="/socio">
            <Button variant="primary" size="lg" className="font-bold shadow-lg shadow-primary/20">
              {TIMELINE_CONSTANTS.BTN_JOIN_CLUB}
            </Button>
          </Link>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

