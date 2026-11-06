'use client';

import React, { useEffect, useRef } from 'react';
import { LayoutContainer, Title, Text, Spinner, Button } from '@/shared/ui/components';
import { useTimeline } from '../../hooks/useTimeline';
import { TimelineHero } from '../components/TimelineHero';
import { TimelineCard } from '../components/TimelineCard';
import { TimelineYearScroller } from '../components/TimelineYearScroller';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const TimelineFeature: React.FC = () => {
  const {
    events,
    availableYears,
    activeYear,
    setActiveYear,
    scrollToYear,
    scrollToTop,
    isLoading,
  } = useTimeline();

  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Scroll Spy: Detect which year milestone is currently near the center of the viewport
  useEffect(() => {
    if (availableYears.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const yearAttr = entry.target.getAttribute('data-year');
          if (yearAttr) {
            const y = Number(yearAttr);
            if (!isNaN(y)) {
              setActiveYear(y);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2,
    });

    const milestoneEls = document.querySelectorAll('.timeline-milestone-item');
    milestoneEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [availableYears, events, setActiveYear]);

  const handleScrollToTimeline = () => {
    if (availableYears.length > 0) {
      scrollToYear(availableYears[0]);
    } else if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <LayoutContainer className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Spinner text={TIMELINE_CONSTANTS.LOADING_TEXT} />
      </LayoutContainer>
    );
  }

  // Set to track the first event of each year for assigning unique anchor IDs
  const seenYears = new Set<number>();

  return (
    <LayoutContainer className="min-h-screen pb-24">
      {/* Hero Header */}
      <TimelineHero
        totalMilestones={events.length}
        onScrollToTimeline={handleScrollToTimeline}
      />

      {/* Sticky Apple-style Horizontal Scroller */}
      {availableYears.length > 0 && (
        <TimelineYearScroller
          years={availableYears}
          activeYear={activeYear}
          onSelectYear={scrollToYear}
          onScrollToTop={scrollToTop}
        />
      )}

      {/* Main Timeline Section */}
      <LayoutContainer
        ref={timelineContainerRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 relative"
      >
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

            {/* List of Milestones (Always Continuous / No Filtering Cutoffs) */}
            <LayoutContainer className="flex flex-col gap-10 sm:gap-14">
              {events.map((event, index) => {
                const isEven = index % 2 === 0;
                const isFirstOfYear = !seenYears.has(event.year);
                if (isFirstOfYear) {
                  seenYears.add(event.year);
                }

                return (
                  <LayoutContainer
                    key={event.id || event._id || index}
                    id={isFirstOfYear ? `timeline-year-${event.year}` : undefined}
                    data-year={event.year}
                    className="timeline-milestone-item relative flex items-center w-full scroll-mt-32 sm:scroll-mt-36"
                  >
                    {/* Node / Marker on the Line */}
                    {/* Mobile: positioned at left-6 */}
                    {/* Desktop (lg): positioned at left-1/2 */}
                    <button
                      type="button"
                      onClick={() => scrollToYear(event.year)}
                      title={`Ir para o ano ${event.year}`}
                      className={`absolute z-20 flex items-center justify-center rounded-full font-black text-xs sm:text-sm tracking-wider shadow-lg transition-transform hover:scale-110 cursor-pointer left-6 lg:left-1/2 -translate-x-1/2 ${
                        event.isHighlighted
                          ? 'w-12 h-12 sm:w-14 sm:h-14 bg-primary text-blue-950 ring-4 ring-primary/30 font-black'
                          : activeYear === event.year
                          ? 'w-11 h-11 sm:w-13 sm:h-13 bg-primary text-blue-950 ring-4 ring-primary/40 font-black'
                          : 'w-10 h-10 sm:w-12 sm:h-12 bg-surface border-2 border-primary text-primary ring-2 ring-primary/20'
                      }`}
                    >
                      <span>{event.year}</span>
                    </button>

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
